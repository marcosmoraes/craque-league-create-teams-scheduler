# Project Overview

## Name
League Create Teams Scheduler

## Description
Service responsible for scheduling and triggering the creation of teams in leagues of the Craque system. The service processes league data and triggers the team creation process through AWS EventBridge.

## Main Features
- Schedule team creation events
- Process league data
- Trigger team creation process
- Event logging and monitoring

## Technology Stack
- Node.js 18.x
- AWS Lambda
- AWS EventBridge
- Serverless Framework
- MongoDB (for data storage)
- Serverless Offline (for local development)

## Repository Structure
```
.
├── config/          # Configuration files
├── infrastructure/  # Infrastructure configurations
├── model/          # Data models
├── repositories/   # Data access layer
├── services/       # Business logic services
├── use-cases/      # Application use cases
├── utils/          # Utilities and helpers
├── handler.js      # Lambda functions entry point
├── serverless.yml  # Serverless Framework configuration
└── package.json    # Project dependencies
```

## Environment Variables
- `MONGODB_URI`: MongoDB connection URI
- `NODE_ENV`: Execution environment (development/production)
- `LOG_LEVEL`: System log level
- `EVENT_BUS_NAME`: AWS EventBridge bus name 