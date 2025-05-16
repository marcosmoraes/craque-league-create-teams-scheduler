# API Documentation

## Endpoints

### POST /schedule-team-creation
Schedules a team creation event for a league.

#### Request
```json
{
  "leagueId": "string"
}
```

#### Response (200)
```json
{
  "eventId": "string",
  "status": "SCHEDULED",
  "scheduledTime": "string"
}
```

#### Response (400)
```json
{
  "message": "leagueId is required"
}
```

#### Response (500)
```json
{
  "message": "Internal Server Error"
}
```

### POST /process-team-creation
Processes a scheduled team creation event.

#### Request
```json
{
  "eventId": "string"
}
```

#### Response (200)
```json
{
  "eventId": "string",
  "status": "PROCESSING",
  "startedAt": "string"
}
```

#### Response (400)
```json
{
  "message": "eventId is required"
}
```

#### Response (500)
```json
{
  "message": "Internal Server Error"
}
```

## Event Models

### TeamCreationEvent
```typescript
interface TeamCreationEvent {
  eventId: string;
  leagueId: string;
  status: EventStatus;
  scheduledTime: Date;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
}

enum EventStatus {
  SCHEDULED = 'SCHEDULED',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}
```

## Error Codes
- 400: Bad Request - Invalid or missing parameters
- 500: Internal Server Error - Server internal error

## Limitations
- Event scheduling frequency (defined by EventBridge)
- Event processing timeout (defined by Lambda)
- Payload size limit (defined by API Gateway)
- Rate limiting (defined by API Gateway) 