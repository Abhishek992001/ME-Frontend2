// EventCard.tsx
import React, { useState } from "react";
import {
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaUsers,
  FaEdit,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle
} from "react-icons/fa";
import { Event, EventStatus } from "../../types/Event";
import { deleteEvent, updateEventStatus } from "../../services/eventService";
import styles from "./EventCard.module.css";

interface EventCardProps {
  event: Event;
  isAdmin: boolean;
  onEventUpdated: () => void;
  onEditClick: (event: Event) => void;
}

const EventCard: React.FC<EventCardProps> = ({
  event,
  isAdmin,
  onEventUpdated,
  onEditClick
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handleDeleteEvent = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      setLoading(true);
      await deleteEvent(event._id);
      onEventUpdated();
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("Failed to delete event.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (newStatus: EventStatus) => {
    try {
      setLoading(true);
      await updateEventStatus(event._id, newStatus);
      onEventUpdated();
    } catch (err) {
      console.error("Error updating status:", err);
      setError("Failed to update status.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.eventCard}>
      <div className={styles.cardDetails}>
        <div className={styles.cardDetailItem}>
          <FaMapMarkerAlt size={16} />
          <span>{event.location}</span>
        </div>
        <div className={styles.cardDetailItem}>
          <FaCalendarAlt size={16} />
          <span>{formatDate(event.startDate)}</span>
        </div>
        <div className={styles.cardDetailItem}>
          <FaUsers size={16} />
          <span>
            {event.registeredVolunteers?.length ?? 0} / {event.maxVolunteers}
          </span>
        </div>
      </div>

      {isAdmin && (
        <div className={styles.cardActions}>
          <button
            className={styles.editButton}
            onClick={() => onEditClick(event)}
            disabled={loading}
          >
            <FaEdit size={16} /> Edit
          </button>

          <button
            className={styles.deleteButton}
            onClick={handleDeleteEvent}
            disabled={loading}
          >
            <FaTrash size={16} /> Delete
          </button>

          {event.status !== EventStatus.COMPLETED && (
            <button
              className={styles.completeButton}
              onClick={() => handleUpdateStatus(EventStatus.COMPLETED)}
              disabled={loading}
            >
              <FaCheckCircle size={16} /> Complete
            </button>
          )}

          {event.status !== EventStatus.CANCELLED && (
            <button
              className={styles.cancelButton}
              onClick={() => handleUpdateStatus(EventStatus.CANCELLED)}
              disabled={loading}
            >
              <FaTimesCircle size={16} /> Cancel
            </button>
          )}
        </div>
      )}

      {error && <div className={styles.errorMessage}>{error}</div>}
    </div>
  );
};

export default EventCard;
