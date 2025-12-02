# GenAI Platform Starter
A production-ready enterprise AI platform starter designed for:
- Securing and standardizing access to LLMs (Bedrock, OpenAI)
- Applying cost control and usage governance
- Logging and monitoring all AI interactions
- Providing simple, scalable AI microservices for teams and apps

This project is meant to be the foundational building block for AI-driven organizations.  
As companies begin adopting GenAI at scale, they need a central platform that ensures:
- Security
- Rate limiting
- Cost visibility
- Governance
- Audit logs
- API standardization

This project provides that baseline architecture.

---

## 🚀 Architecture Overview

**Components:**
- API Gateway  
- Lambda Functions (request validation + LLM calls + logging)  
- DynamoDB (usage + cost logs)  
- Cognito (authentication)  
- CloudWatch (monitoring)  
- CDK (deployment automation)  
- Optional frontend dashboard (React)

---

## 🧩 Features

### 🔹 AI Routing Layer
Call any model using a unified API:
- Bedrock (Claude, Titan)
- OpenAI (GPT-4, GPT-4.1)
- Anthropic

### 🔹 Security
- Cognito auth
- IAM roles
- API keys (optional)

### 🔹 Governance
- Usage logging
- Cost tracking
- Rate limits
- Quotas

### 🔹 Deployment
- cd deployment/cdk
- npm install
- cdk deploy