// deployment/cdk/lib/cdk-stack.ts
import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as cloudwatch from "aws-cdk-lib/aws-cloudwatch";

export class CdkStack extends cdk.Stack {
  api: apigateway.LambdaRestApi | undefined;
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // DynamoDB table for usage logs
    const usageTable = new dynamodb.Table(this, "GenAiUsageTable", {
      partitionKey: { name: "id", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY, // dev only
    });

    // Lambda function (handler code in backend/lambdas)
    const genAiLambda = new lambda.Function(this, "GenAiHelloLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "getAiResponse.handler",
      code: lambda.Code.fromAsset("../../backend/lambdas"),
      timeout: cdk.Duration.seconds(15),
      environment: {
        DEFAULT_PROVIDER: "fallback",
        DEFAULT_MODEL: "default-model",
        USAGE_TABLE_NAME: usageTable.tableName
      }
    });

    // Lambda for admin usage endpoint
    const adminLambda = new lambda.Function(this, "AdminUsageLambda", {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "adminUsage.handler",
      code: lambda.Code.fromAsset("../../backend/lambdas"),
      environment: {
        USAGE_TABLE_NAME: usageTable.tableName
      }
    });

    // grant permissions
    usageTable.grantWriteData(genAiLambda);
    usageTable.grantReadData(adminLambda);

    // basic CloudWatch log permissions (optional)
    genAiLambda.addToRolePolicy(new iam.PolicyStatement({
      actions: ["logs:CreateLogGroup","logs:CreateLogStream","logs:PutLogEvents"],
      resources: ["*"],
    }));

    // ------------------- API GATEWAY (NON PROXY) -----------------------
    const api = new apigateway.RestApi(this, "GenAiApi", {
      restApiName: "GenAiPlatformApi",
      description: "GenAI Platform Starter API",
      deployOptions: {
        stageName: "prod"
      }
    });

    // /v1
    const v1 = api.root.addResource("v1");

    // /v1/hello → main model generation Lambda
    const hello = v1.addResource("hello");
    hello.addMethod("POST", new apigateway.LambdaIntegration(genAiLambda));
    hello.addMethod("GET", new apigateway.LambdaIntegration(genAiLambda));

    // /v1/admin/usage → admin usage Lambda
    const admin = v1.addResource("admin");
    const usage = admin.addResource("usage");
    usage.addMethod("GET", new apigateway.LambdaIntegration(adminLambda));

    new cdk.CfnOutput(this, "GenAiApiEndpoint", {
      value: api.url ?? "no-url",
      description: "Base URL for the GenAI Platform API",
    });


    // --------- CloudWatch Dashboard (visual) -------------
    const dashboard = new cloudwatch.Dashboard(this, "GenAiDashboard", {
      dashboardName: "GenAiPlatformDashboard"
    });

    // Metrics from Lambda
    const lambdaInvocations = genAiLambda.metricInvocations();
    const lambdaErrors = genAiLambda.metricErrors();
    const lambdaDuration = genAiLambda.metricDuration();

    // API Gateway metrics (by default use 'Api' namespace)
    const apiLatency = new cloudwatch.Metric({
      namespace: "AWS/ApiGateway",
      metricName: "Latency",
      dimensionsMap: { ApiName: api.restApiName }
    });
    const api4xx = new cloudwatch.Metric({
      namespace: "AWS/ApiGateway",
      metricName: "4XXError",
      dimensionsMap: { ApiName: api.restApiName }
    });
    const api5xx = new cloudwatch.Metric({
      namespace: "AWS/ApiGateway",
      metricName: "5XXError",
      dimensionsMap: { ApiName: api.restApiName }
    });

    dashboard.addWidgets(
      new cloudwatch.GraphWidget({ title: "Lambda Invocations / Errors", left: [lambdaInvocations, lambdaErrors] }),
      new cloudwatch.GraphWidget({ title: "Lambda Duration (ms)", left: [lambdaDuration] }),
      new cloudwatch.GraphWidget({ title: "API Latency (ms)", left: [apiLatency] }),
      new cloudwatch.GraphWidget({ title: "API 4XX / 5XX", left: [api4xx, api5xx] })
    );
  }
}
