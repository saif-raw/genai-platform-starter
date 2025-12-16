#!/usr/bin/env node
// deployment/cdk/bin/cdk.ts
import * as cdk from "aws-cdk-lib";
import { CdkStack } from "../lib/cdk-stack";

const app = new cdk.App();

// Deploy stack explicitly into us-east-1 for Bedrock Nova availability.
// If you want a different region, change region below.
// Make sure your AWS credentials have permissions in that account/region.
new CdkStack(app, "CdkStack", {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: "us-east-1"
  }
});
