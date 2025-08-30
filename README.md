# Agentic Documents Assistant

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The *Agentic Documents Assistant* is an LLM assistant that allows users to answer complex questions from their business documents through natural conversations.
It supports answering factual questions by retrieving information directly from documents using semantic search with the popular RAG design pattern.
Additionally, it answers analytical questions such as *which contracts will expire in the next 3 months?* by translating user questions into SQL queries and running them against a database of entities extracted from the documents using a batch process.
It is also able to answer complex multi-step questions by combining retrieval, analytical, and other tools and data sources using an LLM agent design pattern.

To learn more about the design and architecture of this solution, check the accompanying AWS ML blog post:
[Boosting RAG-based intelligent document assistants using entity extraction, SQL querying, and agents with Amazon Bedrock](https://aws.amazon.com/blogs/machine-learning/boosting-rag-based-intelligent-document-assistants-using-entity-extraction-sql-querying-and-agents-with-amazon-bedrock/).

## Key Features

- Semantic search to augment response generation with relevant documents
- Structured metadata & entities extraction and SQL queries for analytical reasoning
- An agent built with the Reason and Act (ReAct) instruction format that determines whether to use search or SQL to answer a given question.

## Architecture Overview

The following architecture diagrams depicts the design of the solution.

![Architecture of the agentic AI documents assistant on AWS ](assets/agentic-documents-assistant-on-aws.png)

## Content

Below an outline of the main folders included in this asset.

| Folder | Description |
| ----------- | ----------- |
| `backend` | Includes a Typescript CDK project implementing IaaC to setup the backend infrastructure. |
| `frontend` | A Typescript CDK project to setup infrastructure for deploying and hosting the frontend app with AWS Amplify. |
| `frontend/chat-app` | A Next.js app with AWS Cognito Authentication and secured backend connectivity. |
| `data-pipelines` | Notebooks implementing SageMaker Jobs and Pipeline to process the data in batch. |
| `experiments` | Notebooks and code showcasing different modules of the solution as standalone experiments for research and development. |

## Getting Started

Follow the insturctions below to setup the solution on your account.

### Prerequisites

- An AWS account with programmatic access configured (AWS CLI or IAM user with access keys)
- [Configure model access](https://docs.aws.amazon.com/bedrock/latest/userguide/model-access.html#add-model-access) to Anthroptic Claude and Amazon Titan models in one of [the supported regions of Amazon Bedrock](https://docs.aws.amazon.com/bedrock/latest/userguide/bedrock-regions.html)
- **Docker Desktop** installed and running (required for CDK Lambda container builds)
- Node.js (version 18 or later) and npm installed
- [AWS Cloud Development Kit (CDK)](https://aws.amazon.com/cdk/) CLI installed globally: `npm install -g aws-cdk`
- For deployment environment:
    - We recommend using an [AWS Cloud9 environment](https://docs.aws.amazon.com/cloud9/latest/user-guide/tutorial-create-environment.html) if you intend to make changes
    - [CloudShell](https://aws.amazon.com/cloudshell/) for simple installation
    - Local environment after setting up CDK following [documentation instructions](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html#getting_started_prerequisites)

### Installation

To install the solution in your AWS account:

1. **Clone this repository**
   ```bash
   git clone <repository-url>
   cd aws-agentic-document-assistant
   ```

2. **Install the backend CDK app**:
   1. Navigate to the backend folder: `cd backend`
   2. Install dependencies: `npm install`
   3. **Ensure Docker Desktop is running** (required for Lambda container builds)
   4. If you have never used CDK in the current account and region, run [bootstrapping](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html):
      ```bash
      cdk bootstrap
      ```
   5. Deploy the stack:
      ```bash
      cdk deploy --all
      ```
      **Note**: Use global `cdk` command rather than `npx cdk` to avoid version compatibility issues
   6. Take note of the SageMaker IAM Policy ARN found in the CDK stack output

3. **Deploy the Next.js frontend on AWS Amplify**:
   1. Navigate to the frontend folder: `cd ../frontend`
   2. Install dependencies: `npm install`
   3. Deploy the Amplify stack: `cdk deploy`
   4. Go to the AWS Amplify console and connect your repository manually:
      - Click on the created Amplify app
      - Connect a repository (GitHub recommended) or deploy manually
      - Point to the `frontend/chat-app` folder as the build root
   5. Trigger a build and use the hosting link to access the app

4. **Load the data**:
   Run the SageMaker Pipeline in `data-pipelines/04-sagemaker-pipeline-for-documents-processing.ipynb` to load:
   - Pre-created CSV file for SQL tables
   - JSON file with preprocessed Amazon financial documents for semantic search

### Troubleshooting

**Common Issues:**
- **Docker not running**: Ensure Docker Desktop is running before CDK deployment
- **CDK version conflicts**: Use global `cdk` command instead of `npx cdk`
- **RDS deployment fails**: The solution requires at least 2 Availability Zones for RDS subnet groups
- **PostgreSQL version not available**: If you encounter PostgreSQL version errors, the code uses version 15.8 which should be widely supported
- **CodeCommit not available**: CodeCommit is deprecated for new AWS accounts. The frontend creates an Amplify app that requires manual repository connection
- **Lambda deployment issues**: Verify your AWS credentials have sufficient permissions for Lambda, VPC, and RDS operations

After running the above steps successfully, you can start interacting with the assistant and ask questions.
If you want to update the underlying documents and extract new entities, explore the notebooks 1 to 5 under the `experiments` folder.

### Clean up

To remove the resources of the solution:

1. Remove the stack inside the `backend` folder by running `npx cdk destroy`.
2. Remove the stack inside the `frontend` folder by running `npx cdk destroy`.

## Authors

The authors of this asset are:

* [Mohamed Ali Jamaoui](https://www.linkedin.com/in/mohamedalijamaoui/): Solution designer/Core maintainer.
* Giuseppe Hannen: Extensive contribution to the data extraction modules.
* Laurens ten Cate: Contributed to extending the agent with SQL tool and early streamlit UI deployments.

## Security

See [CONTRIBUTING](CONTRIBUTING.md#security-issue-notifications) for more information.

## References

* [Best practices for working with AWS Lambda functions](https://docs.aws.amazon.com/lambda/latest/dg/best-practices.html).
* [Langchain custom LLM agents](https://python.langchain.com/docs/modules/agents/how_to/custom_llm_agent)
* [LLM Powered Autonomous Agents](https://lilianweng.github.io/posts/2023-06-23-agent/)

## Future improvements

- [ ] Improve the overall-inference speed.

## License

This library is licensed under the MIT-0 License. See the LICENSE file.
