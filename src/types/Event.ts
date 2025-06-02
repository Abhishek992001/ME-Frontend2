// src/types/Event.ts
export enum EventStatus {
  UPCOMING = "UPCOMING",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED"
}

export interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxVolunteers: number;
  status: EventStatus;
  imageUrl?: string;
  skills?: string[];
  registeredVolunteers?: string[];
  createdBy?: string;
  createdAt?: string;
  updatedAt?: string;
}