// Credit goes to -> https://github.com/aws-samples/aws-genai-llm-chatbot/blob/main/lib/vpc/index.ts
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';

export class Vpc extends Construct {
  public readonly vpc: ec2.Vpc;
  public readonly s3GatewayEndpoint: ec2.IGatewayVpcEndpoint;
  public readonly dynamodbvpcEndpoint: ec2.IGatewayVpcEndpoint;

  constructor(scope: Construct, id: string) {
    super(scope, id);

    const vpc = new ec2.Vpc(this, 'VPC', {
      maxAzs: 1, // Reduced to single AZ for cost optimization
      natGateways: 0, // Remove NAT Gateway to save costs
      subnetConfiguration: [
        {
          name: 'public',
          subnetType: ec2.SubnetType.PUBLIC,
        },
        {
          name: 'isolated',
          subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
        },
      ],
    });

    // Keep only essential gateway endpoints (free)
    this.s3GatewayEndpoint = vpc.addGatewayEndpoint('S3GatewayEndpoint', {
      service: ec2.GatewayVpcEndpointAwsService.S3,
    });

    this.dynamodbvpcEndpoint = vpc.addGatewayEndpoint('DynamoDBEndpoint', {
      service: ec2.GatewayVpcEndpointAwsService.DYNAMODB,
    });

    // Remove expensive interface endpoints - Lambda will use public internet
    // this.secretsManagerVpcEndpoint = vpc.addInterfaceEndpoint('SecretsManagerEndpoint', {
    //   service: ec2.InterfaceVpcEndpointAwsService.SECRETS_MANAGER,
    //   open: true,
    // });

    this.vpc = vpc;
  }
}
