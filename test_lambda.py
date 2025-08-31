#!/usr/bin/env python3
"""
Simple test script to verify the Lambda function is working.
"""
import boto3
import json

def test_lambda_function():
    """Test the Lambda function directly."""
    
    # Create Lambda client
    lambda_client = boto3.client('lambda', region_name='us-east-1')
    
    # Test payload
    test_event = {
        "user_input": "Hello, can you help me?",
        "session_id": "test-session-123",
        "chatbot_type": "basic",
        "clean_history": True
    }
    
    try:
        # Invoke the Lambda function
        response = lambda_client.invoke(
            FunctionName='AssistantBackendStack-LambdaAgentContainer328438B0-YourFunctionName',  # Replace with actual function name
            InvocationType='RequestResponse',
            Payload=json.dumps(test_event)
        )
        
        # Parse response
        response_payload = json.loads(response['Payload'].read())
        print("Lambda function response:")
        print(json.dumps(response_payload, indent=2))
        
        if response['StatusCode'] == 200:
            print("✅ Lambda function executed successfully!")
            return True
        else:
            print(f"❌ Lambda function failed with status code: {response['StatusCode']}")
            return False
            
    except Exception as e:
        print(f"❌ Error invoking Lambda function: {str(e)}")
        return False

if __name__ == "__main__":
    print("Testing Lambda function...")
    test_lambda_function()