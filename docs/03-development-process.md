# Development Process

## Development Environment
### Prerequisites
- Node.js 18.x
- MongoDB
- Serverless Framework CLI
- AWS Account (for deployment)
- AWS EventBridge access

### Local Setup
1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables:
   ```bash
   cp .env.example .env
   # Edit the .env file with your credentials
   ```
4. Start local environment:
   ```bash
   serverless offline
   ```

## Development Workflow
1. Create a branch for your feature
2. Implement changes
3. Test locally using serverless offline
4. Commit changes
5. Create a Pull Request
6. After approval, merge to main

## Testing
### Local Testing
- Use local endpoint: `http://localhost:3003`
- Test event scheduling and processing
- Check event logs

### Test Examples
```bash
# Test event scheduling
curl -X POST http://localhost:3003/schedule-team-creation \
  -H "Content-Type: application/json" \
  -d '{"leagueId": "123"}'

# Test event processing
curl -X POST http://localhost:3003/process-team-creation \
  -H "Content-Type: application/json" \
  -d '{"eventId": "456"}'
```

## Monitoring
- Event logs in `utils/event-logger.js`
- CloudWatch for production logs
- Performance metrics:
  - Event processing time
  - Error rate
  - Memory usage

## Maintenance
### Routines
- Monitor event logs
- Check event processing performance
- Update dependencies periodically
- Review event scheduling

### Troubleshooting
1. Check event logs
2. Validate MongoDB connection
3. Confirm event data
4. Check event processing status 