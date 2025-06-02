// src/services/eventService.ts
import { Event, EventStatus } from "../types/Event";
import { API_URL, authHeader } from "./authService";

export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to fetch events");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching events:", error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}`, {
      method: "DELETE",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      }
    });

    if (!response.ok) {
      throw new Error("Failed to delete event");
    }
  } catch (error) {
    console.error("Error deleting event:", error);
    throw error;
  }
};

export const updateEventStatus = async (eventId: string, status: EventStatus): Promise<Event> => {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/status`, {
      method: "PATCH",
      headers: {
        ...authHeader(),
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error("Failed to update event status");
    }

    return await response.json();
  } catch (error) {
    console.error("Error updating event status:", error);
    throw error;
  }
};