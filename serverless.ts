import getClimateData from "@functions/getClimateData";
import type { AWS } from "@serverless/typescript";

const serverlessConfiguration: AWS = {
  service: "getClimateData",
  frameworkVersion: "2",
  plugins: ["serverless-esbuild"],
  useDotenv: true,
  provider: {
    name: "aws",
    region: "eu-west-2",
    runtime: "nodejs14.x",
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: "1",
      NODE_OPTIONS: "--enable-source-maps --stack-trace-limit=1000",
      S3_BUCKET_NAME: process.env.S3_BUCKET_NAME,
    },
    lambdaHashingVersion: "20201221",
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "s3:PutObject",
        Resource: "arn:aws:s3:::${env:S3_BUCKET_NAME}/*",
      },
    ],
  },
  // import the function via paths
  functions: { getClimateData },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ["aws-sdk"],
      target: "node14",
      define: { "require.resolve": undefined },
      platform: "node",
      concurrency: 10,
    },
  },
};

module.exports = serverlessConfiguration;
