export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gamerTag?: string;
  createdAt: string;
  imageUrl?: string;
  bannerImageUrl?: string;
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
    createdAt: string;
}

export interface UserBonus {
  userId: string;
  bonusId: string;
  amount: number;
}

export interface Bonus {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  max: number;
}

// Class implementations for creating new instances
export class UserClass implements User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  gamerTag?: string;
  createdAt: string;
  imageUrl?: string;
  bannerImageUrl?: string;

  constructor(
    firstName: string,
    lastName: string,
    email: string,
    gamerTag?: string,
    id?: string,
    createdAt?: string,
    imageUrl?: string,
    bannerImageUrl?: string
  ) {
    this.id = id || `user_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.gamerTag = gamerTag;
    this.createdAt = createdAt || new Date().toISOString();
    this.imageUrl = imageUrl;
    this.bannerImageUrl = bannerImageUrl;
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

export class UserBonusClass implements UserBonus {
  userId: string;
  bonusId: string;
  amount: number;

  constructor(userId: string, bonusId: string, amount: number) {
    this.userId = userId;
    this.bonusId = bonusId;
    this.amount = amount;

  }
}

export class BonusClass implements Bonus {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  max: number;

  constructor(name: string, description: string, isActive: boolean, max: number) {
    this.id = `bonus_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
    this.name = name;
    this.description = description;
    this.isActive = isActive;
    this.max = max;
  }
}




    
