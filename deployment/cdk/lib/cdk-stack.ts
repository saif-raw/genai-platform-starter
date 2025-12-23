// deployment/cdk/lib/cdk-stack.ts
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    /* ---------------- DynamoDB ---------------- */

    const usageTable = new dynamodb.Table(this, "GenAiUsageTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    const sessionsTable = new dynamodb.Table(this, "GenAiSessionsTable", {
      partitionKey: { name: "sessionId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });

    /* ---------------- Main GenAI Lambda ---------------- */

    const genAiLambda = new lambda.Function(this, "GenAiHelloLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "getAiResponse.handler",
      code: lambda.Code.fromAsset("../../backend/lambdas"),
      timeout: cdk.Duration.seconds(30),
      environment: {
        DEFAULT_PROVIDER: "groq",
        DEFAULT_MODEL: "openai/gpt-oss-20b",
        USAGE_TABLE_NAME: usageTable.tableName,
        SESSIONS_TABLE_NAME: sessionsTable.tableName
      }
    });

    usageTable.grantWriteData(genAiLambda);
    sessionsTable.grantWriteData(genAiLambda);

    /* ---------------- Admin Usage Lambda ---------------- */

    const adminLambda = new lambda.Function(this, "AdminUsageLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "adminUsage.handler",
      code: lambda.Code.fromAsset("../../backend/lambdas"),
      timeout: cdk.Duration.seconds(15),
      environment: {
        SESSIONS_TABLE_NAME: sessionsTable.tableName
      }
    });
    
    sessionsTable.grantReadData(adminLambda);

    /* ---------------- API Gateway ---------------- */

    const api = new apigateway.RestApi(this, "GenAiApi", {
      restApiName: "GenAiPlatformApi",
      deployOptions: { stageName: "prod" },
      defaultCorsPreflightOptions: {
        allowOrigins: apigateway.Cors.ALL_ORIGINS,
        allowMethods: apigateway.Cors.ALL_METHODS,
        allowHeaders: ["Content-Type", "X-Api-Key", "Authorization"]
      }
    });

    const v1 = api.root.addResource("v1");

    const hello = v1.addResource("hello");
    hello.addMethod("GET", new apigateway.LambdaIntegration(genAiLambda));
    hello.addMethod("POST", new apigateway.LambdaIntegration(genAiLambda));

    const admin = v1.addResource("admin");
    const usage = admin.addResource("usage");
    usage.addMethod("GET", new apigateway.LambdaIntegration(adminLambda));

    /* ---------------- CloudWatch ---------------- */

    const dashboard = new cloudwatch.Dashboard(this, "GenAiDashboard", {
      dashboardName: "GenAiPlatformDashboard"
    });

    dashboard.addWidgets(
      new cloudwatch.GraphWidget({
        title: "GenAI Invocations",
        left: [genAiLambda.metricInvocations()]
      }),
      new cloudwatch.GraphWidget({
        title: "GenAI Errors",
        left: [genAiLambda.metricErrors()]
      }),
      new cloudwatch.GraphWidget({
        title: "GenAI Duration",
        left: [genAiLambda.metricDuration()]
      })
    );
  }
}
