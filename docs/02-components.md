# System Components

## Data Models
### League
```typescript
interface League {
  id: string;
  name: string;
  status: string;
  teams: Team[];
  createdAt: Date;
  updatedAt: Date;
}
```

### Team
```typescript
interface Team {
  id: string;
  name: string;
  leagueId: string;
  players: Player[];
  createdAt: Date;
  updatedAt: Date;
}
```

## Services
### LeagueService (services/league-service.js)
- `processLeague(leagueId)`: Processes league data and triggers team creation
- `validateLeague(league)`: Validates league data before processing
- `scheduleTeamCreation(league)`: Schedules team creation events

### EventService (services/event-service.js)
- `publishEvent(event)`: Publishes events to EventBridge
- `handleEvent(event)`: Processes incoming events
- `logEvent(event)`: Logs event processing status

## Data Access
### MongoDB
- Connection configured in `infrastructure/`
- Optimized queries for league data
- Indexes for better performance

## Event Flow
1. **Schedule Team Creation**
   - Receives league data
   - Validates league information
   - Schedules team creation event
   - Logs scheduling status

2. **Process Team Creation**
   - Receives scheduled event
   - Validates event data
   - Processes team creation
   - Updates league status
   - Logs processing status

3. **Handle Errors**
   - Captures processing errors
   - Implements retry logic
   - Logs error details
   - Updates error status

## Processing States
1. **Scheduled**
   - Event is scheduled
   - Waiting for execution
   - Status: PENDING

2. **Processing**
   - Event is being processed
   - Team creation in progress
   - Status: PROCESSING

3. **Completed**
   - Team creation completed
   - League updated
   - Status: COMPLETED

4. **Error**
   - Processing failed
   - Error logged
   - Status: ERROR 