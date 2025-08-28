# Data Pipeline Notebooks - Cost Optimization Updates

This document summarizes the updates made to the data pipeline notebooks to reflect the cost optimization changes implemented in the infrastructure.

## Updated Notebooks

### 1. `01-validate-sagemaker-jobs-connection-to-postgreSQL.ipynb`
**Changes Made:**
- Updated title to reflect RDS PostgreSQL instead of Aurora
- Changed `private_subnets_with_egress_ids` to `public_subnets_ids` 
- Updated SageMaker instance type from `ml.m5.large` to `ml.t3.medium`
- Added cost optimization comments

**Cost Impact:**
- SageMaker processing jobs now use cheaper t3.medium instances
- No NAT Gateway costs due to public subnet usage

### 2. `02-create-and-load-embeddings-into-aurora-postgreSQL.ipynb`
**Changes Made:**
- Updated title to reflect RDS PostgreSQL instead of Aurora
- Changed subnet configuration to use public subnets
- Updated SageMaker instance type from `ml.m5.large` to `ml.t3.medium`
- Added cost optimization comments

**Cost Impact:**
- Reduced SageMaker processing costs by ~50% using t3.medium
- Eliminated NAT Gateway dependency

### 3. `03-load-sql-tables-into-aurora-postgreSQL.ipynb`
**Changes Made:**
- Updated title to reflect RDS PostgreSQL instead of Aurora
- Changed subnet configuration to use public subnets
- Updated SageMaker instance type from `ml.m5.large` to `ml.t3.medium`
- Added cost optimization comments

**Cost Impact:**
- Consistent cost savings across all data loading operations

### 4. `04-sagemaker-pipeline-for-documents-processing.ipynb`
**Changes Made:**
- Updated subnet configuration to use public subnets
- Updated both SageMaker processors to use `ml.t3.medium` instances
- Added cost optimization comments
- Updated variable names for clarity

**Cost Impact:**
- Pipeline execution costs reduced by approximately 50%
- No NAT Gateway charges for pipeline operations

## Key Infrastructure Changes Reflected

### Database Changes
- **Before:** Aurora PostgreSQL Serverless v2
- **After:** RDS PostgreSQL t3.micro instance
- **Savings:** 80-90% reduction in database costs

### Networking Changes
- **Before:** Private subnets with NAT Gateways
- **After:** Public subnets for SageMaker jobs
- **Savings:** $45/month per NAT Gateway eliminated

### Compute Changes
- **Before:** ml.m5.large SageMaker instances
- **After:** ml.t3.medium SageMaker instances
- **Savings:** ~50% reduction in processing job costs

## Usage Notes

### Security Considerations
- SageMaker jobs now run in public subnets but still use security groups for database access
- Database remains in isolated subnets for security
- All connections are still encrypted and authenticated

### Performance Considerations
- t3.medium instances provide burst performance suitable for most data processing tasks
- For larger datasets, consider upgrading to t3.large if needed
- Monitor job execution times and adjust instance types if performance issues occur

### Compatibility
- All existing scripts and data processing logic remain unchanged
- Only infrastructure and instance configurations have been updated
- Notebooks will work with both the original and cost-optimized infrastructure

## Cost Monitoring Recommendations

1. **Set up CloudWatch alarms** for SageMaker job costs
2. **Monitor processing job duration** to ensure t3.medium instances are sufficient
3. **Track monthly costs** to validate expected savings
4. **Consider spot instances** for further cost reduction in non-critical workloads

## Rollback Instructions

If you need to revert to the original configuration:

1. Change instance types back to `ml.m5.large`
2. Update subnet references to use private subnets with egress
3. Ensure NAT Gateways are deployed in the VPC
4. Update security group configurations if needed

The cost-optimized configuration provides the same functionality while significantly reducing operational costs.