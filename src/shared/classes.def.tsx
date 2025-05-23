export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gamerTag?: string;
  createdAt: string;
}

export interface Goal {
  id: string;
  userId: string;
  goalName: string;
  goalDescription: string;
  goalType: string; // e.g., "weight_loss", "muscle_gain", "endurance", "strength"
  isCompleted: boolean;
  createdAt: string;
}

export interface Event {
  id: string;
  userId: string;
  goalId: string;
  dateTime: string;
  note: string;
  createdAt: string;
}

export interface Team {
    id: string;
    userIdOne: string;
    userIdTwo: string;
    teamName: string;
}

// Class implementations for creating new instances
export class UserClass implements User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gamerTag?: string;
  createdAt: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    gamerTag?: string,
    id?: string,
    createdAt?: string
  ) {
    this.id = id || `user_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.gamerTag = gamerTag;
    this.createdAt = createdAt || new Date().toISOString();
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }
}

export class GoalClass implements Goal {
  id: string;
  userId: string;
  goalName: string;
  goalDescription: string;
  goalType: string;
  isCompleted: boolean;
  createdAt: string;

  constructor(
    userId: string,
    goalName: string,
    goalDescription: string,
    goalType: string
  ) {
    this.id = crypto.randomUUID();
    this.userId = userId;
    this.goalName = goalName;
    this.goalDescription = goalDescription;
    this.goalType = goalType;
    this.isCompleted = false;
    this.createdAt = new Date().toISOString();
  }
}

export class EventClass implements Event {
  id: string;
  userId: string;
  goalId: string;
  dateTime: string;
  note: string;
  createdAt: string;

  constructor(
    userId: string,
    goalId: string,
    note: string,
    dateTime?: string,
    id?: string,
    createdAt?: string
  ) {
    this.id = id || `event_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    this.userId = userId;
    this.goalId = goalId;
    this.dateTime = dateTime || new Date().toISOString();
    this.note = note;
    this.createdAt = createdAt || new Date().toISOString();
  }
}

export class TeamClass implements Team {
  id: string;
  userIdOne: string;
  userIdTwo: string;
  teamName: string;
  createdAt: string;

  constructor(
    userIdOne: string,
    userIdTwo: string,
    teamName: string,
    id?: string,
    createdAt?: string
  ) {
    this.id = id || `team_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    this.userIdOne = userIdOne;
    this.userIdTwo = userIdTwo;
    this.teamName = teamName;
    this.createdAt = createdAt || new Date().toISOString();
  }
}
