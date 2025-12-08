#!/usr/bin/env node
// deployment/cdk/bin/cdk.ts
import * as cdk from 'aws-cdk-lib/core';
import { CdkStack } from '../lib/cdk-stack';

const app = new cdk.App();
new CdkStack(app, 'CdkStack', {

});
