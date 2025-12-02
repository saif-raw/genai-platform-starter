import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';

export class CdkStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // Lambda
    const genAiLambda = new lambda.Function(this, 'GenAiHelloLambda', {
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: 'getAiResponse.handler',
      code: lambda.Code.fromAsset('../../backend/lambdas'),
    });

    // API Gateway
    const api = new apigateway.LambdaRestApi(this, 'GenAiApi', {
      handler: genAiLambda,
      proxy: false
    });

    // /v1
    const v1 = api.root.addResource('v1');

    // /v1/hello
    v1.addResource('hello').addMethod('GET');
  }
}
