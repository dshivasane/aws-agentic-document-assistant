import * as amplify from '@aws-cdk/aws-amplify-alpha';
import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as codecommit from 'aws-cdk-lib/aws-codecommit';
import * as ssm from 'aws-cdk-lib/aws-ssm';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as apigateway from "aws-cdk-lib/aws-apigateway";
import * as cognito from 'aws-cdk-lib/aws-cognito';
import * as iam from 'aws-cdk-lib/aws-iam';
import path = require('path');

export class AmplifyChatuiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // -------------------------------------------------------------------------
    // Load SSM parameter that stores the Lambda function name

    const cognito_user_pool_id_parameter = ssm.StringParameter.valueForStringParameter(
      this, "/AgenticLLMAssistant/cognito_user_pool_id"
    );

    const cognito_user_pool_client_id_parameter = ssm.StringParameter.valueForStringParameter(
      this, "/AgenticLLMAssistant/cognito_user_pool_client_id"
    );

    // SSM parameter holding Rest API URL
    const agent_api_parameter = ssm.StringParameter.valueForStringParameter(
      this, "/AgenticLLMAssistant/agent_api"
    );

    // -------------------------------------------------------------------------

    // create a new repository and initialize it with the chatui nextjs app source code.
    // https://docs.aws.amazon.com/cdk/api/v2/docs/aws-cdk-lib.aws_codecommit-readme.html
    const amplifyChatUICodeCommitRepo = new codecommit.Repository(this, 'NextJsGitRepository', {
      repositoryName: 'nextjs-amplify-chatui',
      description: 'A chatui with nextjs hosted on AWS Amplify.',
      code: codecommit.Code.fromDirectory(path.join(__dirname, '../chat-app'), 'main')
    });

    // Use static hosting instead of Web Compute for cost optimization
    const amplifyChatUI = new amplify.App(this, 'AmplifyChatUI', {
      autoBranchDeletion: true,
      sourceCodeProvider: new amplify.CodeCommitSourceCodeProvider(
        {repository: amplifyChatUICodeCommitRepo}),
      // Use static hosting (cheaper than Web Compute)
      platform: amplify.Platform.WEB,
      environmentVariables: {
        'AMPLIFY_USERPOOL_ID': cognito_user_pool_id_parameter,
        'COGNITO_USERPOOL_CLIENT_ID': cognito_user_pool_client_id_parameter,
        'API_ENDPOINT': agent_api_parameter
      }
    });

    amplifyChatUI.addBranch('main', {stage: "PRODUCTION"});

    // -----------------------------------------------------------------------
    // stack outputs

    new cdk.CfnOutput(this, "AmplifyAppURL", {
      value: amplifyChatUI.defaultDomain,
    });

  }
}
