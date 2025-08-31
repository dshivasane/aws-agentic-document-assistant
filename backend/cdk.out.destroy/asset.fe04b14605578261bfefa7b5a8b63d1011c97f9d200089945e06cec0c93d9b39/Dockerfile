# Use single stage build for simplicity
FROM --platform=linux/x86_64 public.ecr.aws/lambda/python:3.9

# Copy requirements.txt
COPY requirements.txt /tmp/

# Install the specified packages
RUN pip install --no-cache-dir -r /tmp/requirements.txt

# Copy function code
COPY agent-executor-lambda/ ${LAMBDA_TASK_ROOT}/

# Set the CMD to your handler
CMD [ "handler.lambda_handler" ]
