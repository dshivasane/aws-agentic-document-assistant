# AWS Infrastructure Cost Optimization

This document outlines the cost optimizations applied to the Agentic Documents Assistant infrastructure to minimize AWS costs while maintaining functionality.

## Key Cost Optimizations Applied

### 1. Database Optimization
**Before:** Aurora PostgreSQL Serverless v2 Cluster
**After:** RDS PostgreSQL Single Instance (t3.micro)

- **Cost Savings:** ~80-90% reduction in database costs
- **Changes:**
  - Switched from Aurora cluster to single RDS instance
  - Using t3.micro instance (Free Tier eligible for new accounts)
  - Reduced storage to minimum 20GB with GP2 (cheaper than GP3)
  - Minimum backup retention (1 day)
  - Still supports pgvector extension for semantic search

### 2. VPC and Networking Optimization
**Before:** Multi-AZ VPC with NAT Gateways and Interface Endpoints
**After:** Single-AZ VPC with Gateway Endpoints only

- **Cost Savings:** ~$45-90/month reduction
- **Changes:**
  - Reduced from 2 AZs to 1 AZ
  - Removed NAT Gateways ($45/month each)
  - Removed expensive Interface VPC Endpoints ($7.20/month each)
  - Kept only free Gateway Endpoints (S3, DynamoDB)
  - Lambda moved to public subnet

### 3. Lambda Function Optimization
**Before:** 2048MB memory, 5-minute timeout
**After:** 512MB memory, 3-minute timeout

- **Cost Savings:** ~75% reduction in Lambda compute costs
- **Changes:**
  - Reduced memory allocation from 2GB to 512MB
  - Reduced timeout from 5 to 3 minutes
  - More restrictive Bedrock permissions (only InvokeModel actions)

### 4. DynamoDB Optimization
**Before:** Standard table class
**After:** Standard Infrequent Access table class

- **Cost Savings:** ~50% reduction in storage costs for infrequent access patterns
- **Changes:**
  - Switched to Standard-IA table class
  - Maintains Pay-Per-Request billing

### 5. Frontend Hosting Optimization
**Before:** AWS Amplify Web Compute platform
**After:** AWS Amplify static hosting

- **Cost Savings:** ~60-80% reduction in hosting costs
- **Changes:**
  - Switched from Web Compute to static hosting
  - Removed custom Docker image requirements
  - Still supports Next.js static export

## Estimated Monthly Cost Comparison

### Original Infrastructure (Approximate)
- Aurora PostgreSQL Serverless v2: $50-150/month
- NAT Gateways (2 AZs): $90/month
- Interface VPC Endpoints (2): $14.40/month
- Lambda (2GB, high usage): $20-40/month
- Amplify Web Compute: $15-30/month
- **Total: ~$189-324/month**

### Optimized Infrastructure (Approximate)
- RDS PostgreSQL t3.micro: $12-15/month (Free for first 12 months)
- No NAT Gateways: $0/month
- Gateway Endpoints only: $0/month
- Lambda (512MB): $5-10/month
- Amplify Static: $3-8/month
- **Total: ~$20-33/month (or $8-18/month with Free Tier)**

## Potential Trade-offs

### Performance Considerations
1. **Single AZ:** Reduced availability (no multi-AZ failover)
2. **Smaller Lambda:** May need optimization for memory-intensive operations
3. **Public Lambda:** Slightly higher latency for VPC resources
4. **Single DB Instance:** No automatic failover capability

### Scalability Considerations
1. **t3.micro Database:** Limited to burst performance
2. **Static Hosting:** No server-side rendering capabilities
3. **Reduced Memory:** May impact concurrent request handling

## Recommendations for Production

### If Budget Allows
1. **Database:** Upgrade to t3.small or t3.medium for better performance
2. **Multi-AZ:** Enable Multi-AZ deployment for high availability
3. **Lambda Memory:** Increase to 1024MB if performance issues occur

### Monitoring and Optimization
1. **CloudWatch:** Monitor Lambda duration and memory usage
2. **RDS Performance Insights:** Track database performance
3. **Cost Explorer:** Regular cost monitoring and optimization

### Free Tier Benefits
- RDS t3.micro: 750 hours/month free for 12 months
- Lambda: 1M requests and 400,000 GB-seconds free monthly
- DynamoDB: 25GB storage and 25 RCU/WCU free monthly
- API Gateway: 1M API calls free monthly

## Implementation Notes

1. **Database Migration:** Existing Aurora data will need to be migrated to RDS
2. **Lambda Testing:** Test with reduced memory allocation
3. **Frontend Build:** Ensure Next.js app can export as static files
4. **Network Security:** Review security groups for public subnet Lambda

## Cost Monitoring

Set up AWS Budgets and CloudWatch billing alarms to monitor costs:
- Set budget alert at $25/month
- Monitor individual service costs
- Track Free Tier usage limits

This optimization reduces infrastructure costs by approximately 85-90% while maintaining core functionality.