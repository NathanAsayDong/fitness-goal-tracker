# API Setup Guide

## Environment Configuration

Create a `.env.local` file in the root directory with the following content:

```bash
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000
```

For production, update the URL to your deployed API server.

## API Endpoints

Your Python API should be running on the configured URL with the following endpoints:

### Users
- `POST /api/v1/users/` - Create user
- `GET /api/v1/users/` - Get all users
- `GET /api/v1/users/{user_id}` - Get specific user
- `PUT /api/v1/users/{user_id}` - Update user
- `DELETE /api/v1/users/{user_id}` - Delete user

### Goals
- `POST /api/v1/goals/` - Create goal
- `GET /api/v1/goals/` - Get all goals
- `GET /api/v1/goals/{goal_id}` - Get specific goal
- `GET /api/v1/goals/user/{user_id}` - Get user's goals
- `PUT /api/v1/goals/{goal_id}` - Update goal
- `DELETE /api/v1/goals/{goal_id}` - Delete goal

### Events
- `POST /api/v1/events/` - Create event
- `GET /api/v1/events/` - Get all events
- `GET /api/v1/events/{event_id}` - Get specific event
- `GET /api/v1/events/user/{user_id}` - Get user's events
- `GET /api/v1/events/goal/{goal_id}` - Get goal's events
- `PUT /api/v1/events/{event_id}` - Update event
- `DELETE /api/v1/events/{event_id}` - Delete event

## Data Models

### User
```typescript
{
  id: string
  firstName: string
  lastName: string
  email: string
  gamerTag?: string
  createdAt: string
}
```

### Goal
```typescript
{
  id: string
  userId: string
  goalName: string
  goalDescription: string
  goalType: string  // "weight_loss", "muscle_gain", "endurance", "strength", etc.
  isCompleted: boolean
  createdAt: string
}
```

### Event
```typescript
{
  id: string
  userId: string
  goalId: string
  dateTime: string
  note: string
  createdAt: string
}
```

## Features Implemented

1. **User Management**: Create, update, and delete users
2. **Goal Tracking**: Add goals, mark as complete, track progress
3. **Activity Events**: Log activities related to specific goals
4. **Real-time Data**: All data synced with your Python API
5. **Error Handling**: Proper error display and loading states
6. **Progress Tracking**: Visual progress indicators based on completed goals

## Getting Started

1. Ensure your Python API is running
2. Create `.env.local` with your API URL
3. Start the Next.js development server:
   ```bash
   npm run dev
   ```
4. Open http://localhost:3000 in your browser

The app will now connect to your real API and use the proper data structures! 