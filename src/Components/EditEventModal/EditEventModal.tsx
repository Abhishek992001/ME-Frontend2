import React, { useState, useEffect } from 'react';
import { Event, EventStatus } from '../../types/Event';
import './EditEventModal.css';

interface EditEventModalProps {
  event: Event;
  onClose: () => void;
  onEventUpdated: (updatedEvent: Event) => void;
}

const EditEventModal: React.FC<EditEventModalProps> = ({
  event,
  onClose,
  onEventUpdated
}) => {
  const [formData, setFormData] = useState({
    title: event.title,
    description: event.description,
    location: event.location,
    startDate: event.startDate,
    endDate: event.endDate,
    maxVolunteers: event.maxVolunteers,
    status: event.status as EventStatus,
    imageUrl: event.imageUrl || '',
    skills: event.skills || [],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://intership-project3-3.onrender.com/api/events/${event._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const updatedEvent = await response.json();
      onEventUpdated(updatedEvent);
    } catch (error) {
      console.error('Error updating event:', error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Edit Event</h2>
        <form onSubmit={handleSubmit}>
          <label>Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />

          <label>Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />

          <label>Location</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <label>Start Date</label>
          <input
            type="datetime-local"
            name="startDate"
            value={formData.startDate}
            onChange={handleChange}
            required
          />

          <label>End Date</label>
          <input
            type="datetime-local"
            name="endDate"
            value={formData.endDate}
            onChange={handleChange}
            required
          />

          <label>Max Volunteers</label>
          <input
            type="number"
            name="maxVolunteers"
            value={formData.maxVolunteers}
            onChange={handleChange}
            required
          />

          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            {Object.values(EventStatus).map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>

          <label>Image URL</label>
          <input
            type="text"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
          />

          <div className="modal-buttons">
            <button type="submit">Update</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditEventModal;
