import { Event, EventClass, Goal, GoalClass, User, UserClass } from './classes.def';

// Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/v1';

// Helper function for API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${API_PREFIX}${endpoint}`;
  
  const defaultHeaders = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers: defaultHeaders,
  });

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`API Error ${response.status}: ${errorData}`);
  }

  // Handle empty responses
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

// User API Service
export const userAPI = {
  // Create user
  createUser: async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
    return apiRequest<User>('/users/', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Get all users
  getAllUsers: async (): Promise<User[]> => {
    return apiRequest<User[]>('/users/');
  },

  // Get specific user
  getUser: async (userId: string): Promise<User> => {
    return apiRequest<User>(`/users/${userId}`);
  },

  // Update user
  updateUser: async (userId: string, userData: Partial<User>): Promise<User> => {
    return apiRequest<User>(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    });
  },

  // Delete user
  deleteUser: async (userId: string): Promise<void> => {
    return apiRequest<void>(`/users/${userId}`, {
      method: 'DELETE',
    });
  },
};

// Goal API Service
export const goalAPI = {
  // Create goal
  createGoal: async (goalData: Omit<Goal, 'id' | 'createdAt'>): Promise<Goal> => {
    return apiRequest<Goal>('/goals/', {
      method: 'POST',
      body: JSON.stringify(goalData),
    });
  },

  // Get all goals
  getAllGoals: async (): Promise<Goal[]> => {
    return apiRequest<Goal[]>('/goals/');
  },

  // Get specific goal
  getGoal: async (goalId: string): Promise<Goal> => {
    return apiRequest<Goal>(`/goals/${goalId}`);
  },

  // Get user's goals
  getUserGoals: async (userId: string): Promise<Goal[]> => {
    return apiRequest<Goal[]>(`/goals/user/${userId}`);
  },

  // Update goal
  updateGoal: async (goalId: string, goalData: Partial<Goal>): Promise<Goal> => {
    return apiRequest<Goal>(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify(goalData),
    });
  },

  // Delete goal
  deleteGoal: async (goalId: string): Promise<void> => {
    return apiRequest<void>(`/goals/${goalId}`, {
      method: 'DELETE',
    });
  },

  // Mark goal as completed
  completeGoal: async (goalId: string): Promise<Goal> => {
    return apiRequest<Goal>(`/goals/${goalId}`, {
      method: 'PUT',
      body: JSON.stringify({ isCompleted: true }),
    });
  },
};

// Event API Service
export const eventAPI = {
  // Create event
  createEvent: async (eventData: Omit<Event, 'id' | 'createdAt'>): Promise<Event> => {
    return apiRequest<Event>('/events/', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });
  },

  // Get all events
  getAllEvents: async (): Promise<Event[]> => {
    return apiRequest<Event[]>('/events/');
  },

  // Get specific event
  getEvent: async (eventId: string): Promise<Event> => {
    return apiRequest<Event>(`/events/${eventId}`);
  },

  // Get user's events
  getUserEvents: async (userId: string): Promise<Event[]> => {
    return apiRequest<Event[]>(`/events/user/${userId}`);
  },

  // Get goal's events
  getGoalEvents: async (goalId: string): Promise<Event[]> => {
    return apiRequest<Event[]>(`/events/goal/${goalId}`);
  },

  // Update event
  updateEvent: async (eventId: string, eventData: Partial<Event>): Promise<Event> => {
    return apiRequest<Event>(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    });
  },

  // Delete event
  deleteEvent: async (eventId: string): Promise<void> => {
    return apiRequest<void>(`/events/${eventId}`, {
      method: 'DELETE',
    });
  },
};

// Combined API service
export const apiService = {
  users: userAPI,
  goals: goalAPI,
  events: eventAPI,
};

// Error handling utilities
export class APIError extends Error {
  constructor(
    message: string,
    public status?: number,
    public endpoint?: string
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Utility functions for creating instances
export const createUser = (
  firstName: string,
  lastName: string,
  email: string,
  gamerTag?: string
): UserClass => {
  return new UserClass(firstName, lastName, email, gamerTag);
};

export const createGoal = (
  userId: string,
  goalName: string,
  goalDescription: string,
  goalType: string
): GoalClass => {
  return new GoalClass(userId, goalName, goalDescription, goalType);
};

export const createEvent = (
  userId: string,
  goalId: string,
  note: string,
  dateTime?: string
): EventClass => {
  return new EventClass(userId, goalId, note, dateTime);
};

export default apiService;