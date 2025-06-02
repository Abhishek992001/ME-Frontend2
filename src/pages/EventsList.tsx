// src/pages/EventsList.tsx
import React, { useState, useEffect } from 'react';
import styles from './EventsList.module.css';
import { isAdmin } from '../services/authService';

// Define the base API URL
const API_URL = 'https://intership-project3-3.onrender.com/api';

interface Event {
  _id: string;
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  maxVolunteers: number;
  registeredVolunteers?: string[];
  skills?: string[];
  imageUrl?: string;
}

interface EventFormData {
  title: string;
  description: string;
  location: string;
  startDate: string;
  endDate: string;
  maxVolunteers: number;
  skills: string[];
  imageUrl?: string;
  status?: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
}

const EventsList: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [formData, setFormData] = useState<EventFormData>({
    title: '',
    description: '',
    location: '',
    startDate: '',
    endDate: '',
    maxVolunteers: 10,
    skills: [],
    imageUrl: ''
  });
  const [error, setError] = useState<string | null>(null);
  // Add state to track current user ID
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  
  // Sort and filter states
  const [sortOption, setSortOption] = useState<string>('default');
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [filterOption, setFilterOption] = useState<string>('all');
  const [showFilterOptions, setShowFilterOptions] = useState(false);
  
  const userIsAdmin = isAdmin();

  useEffect(() => {
    fetchCurrentUser();
    fetchEvents();
  }, []);

  // Add function to fetch current user ID
  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.log('No token found, user not logged in');
        return;
      }
      
      // Get user info from API or from JWT token
      // This depends on your authentication setup, but here's a common approach
      // If you have a /me or /profile endpoint, you can use that
      const response = await fetch(`${API_URL}/users/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.ok) {
        const userData = await response.json();
        setCurrentUserId(userData._id);
      } else {
        // Alternative: Try to decode the JWT token to get user ID
        // This assumes your token has the user ID in the payload
        try {
          const tokenPayload = JSON.parse(atob(token.split('.')[1]));
          if (tokenPayload.userId) {
            setCurrentUserId(tokenPayload.userId);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    } catch (err) {
      console.error('Error fetching current user:', err);
    }
  };

  const fetchEvents = async () => {
    try {
      setLoading(true);
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }

      const response = await fetch(`${API_URL}/events`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch events');
      }
      
      const data = await response.json();
      console.log("Fetched events:", data);
      setAllEvents(data); // Store all events for filtering
      setEvents(data);    // Current displayed events
      setError(null);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
      
      // Fallback to mock data if API fails
      const mockEvents: Event[] = [
        {
          _id: '1',
          title: 'Blood Donation Camp',
          description: 'A small act of kindness can save lives. Participate in our blood donation camp and be a hero! This event is open to all eligible donors and aims to replenish the community\'s blood supply.',
          location: 'Red Cross Hall, H.G. Road',
          startDate: '2024-01-20T09:00:00Z',
          endDate: '2024-01-20T15:00:00Z',
          status: 'upcoming',
          maxVolunteers: 100,
          registeredVolunteers: [],
          skills: ['Medical', 'Organization'],
          imageUrl: 'https://via.placeholder.com/400x200?text=Blood+Donation'
        },
        {
          _id: '2',
          title: 'Marathon for a Cause',
          description: 'Get ready to lace up your running shoes and join us for a spirited run for a cleaner and greener city! This event welcomes everyone to contribute to a meaningful cause while having fun.',
          location: 'Gandhi Square, Thrissur',
          startDate: '2024-02-25T06:00:00Z',
          endDate: '2024-02-25T10:00:00Z',
          status: 'upcoming',
          maxVolunteers: 1000,
          registeredVolunteers: [],
          skills: ['Sports', 'Organization'],
          imageUrl: 'https://via.placeholder.com/400x200?text=Marathon'
        },
        {
          _id: '3',
          title: 'Tree Plantation Drive',
          description: 'Planting trees is a powerful way to combat climate change, preserve biodiversity, and enhance the beauty of our environment. Join us for our tree plantation drive and be part of a green movement.',
          location: 'City Park, Kottayam',
          startDate: '2024-02-18T08:00:00Z',
          endDate: '2024-02-18T12:00:00Z',
          status: 'upcoming',
          maxVolunteers: 30,
          registeredVolunteers: [],
          skills: ['Environment', 'Gardening'],
          imageUrl: 'https://via.placeholder.com/400x200?text=Tree+Plantation'
        }
      ];
      
      setAllEvents(mockEvents);
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = (option: string) => {
    setFilterOption(option);
    setShowFilterOptions(false);
    
    if (option === 'all') {
      setEvents(allEvents);
      return;
    }
    
    // Filter the events based on their status
    const now = new Date();
    const filteredEvents = allEvents.filter(event => {
      const startDate = new Date(event.startDate);
      const endDate = new Date(event.endDate);
      
      switch (option) {
        case 'upcoming':
          return startDate > now || event.status === 'upcoming';
        case 'ongoing':
          return (startDate <= now && endDate >= now) || event.status === 'ongoing';
        case 'completed':
          return endDate < now || event.status === 'completed';
        case 'cancelled':
          return event.status === 'cancelled';
        default:
          return true;
      }
    });
    
    setEvents(filteredEvents);
    
    // Reapply current sort if any
    if (sortOption !== 'default') {
      handleSort(sortOption, filteredEvents);
    }
  };

  const handleSort = (option: string, eventsToSort = events) => {
    setSortOption(option);
    setShowSortOptions(false);
    
    let sortedEvents = [...eventsToSort];
    
    switch(option) {
      case 'date-asc':
        sortedEvents.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        break;
      case 'date-desc':
        sortedEvents.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
        break;
      case 'title-asc':
        sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        sortedEvents.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'volunteer-asc':
        sortedEvents.sort((a, b) => 
          (a.maxVolunteers - (a.registeredVolunteers?.length || 0)) - 
          (b.maxVolunteers - (b.registeredVolunteers?.length || 0))
        );
        break;
      case 'volunteer-desc':
        sortedEvents.sort((a, b) => 
          (b.maxVolunteers - (b.registeredVolunteers?.length || 0)) - 
          (a.maxVolunteers - (a.registeredVolunteers?.length || 0))
        );
        break;
      default:
        // Default sort - newest first
        sortedEvents.sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
    }
    
    setEvents(sortedEvents);
  };

  const handleCreateEvent = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      startDate: new Date().toISOString().slice(0, 16),
      endDate: new Date(Date.now() + 3600000).toISOString().slice(0, 16),
      maxVolunteers: 10,
      skills: [],
      imageUrl: ''
    });
    setShowCreateModal(true);
  };

  const handleEditEvent = (event: Event) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      description: event.description,
      location: event.location,
      startDate: new Date(event.startDate).toISOString().slice(0, 16),
      endDate: new Date(event.endDate).toISOString().slice(0, 16),
      maxVolunteers: event.maxVolunteers,
      skills: event.skills || [],
      imageUrl: event.imageUrl || '',
      status: event.status
    });
    setShowEditModal(true);
  };

  const handleDeleteEvent = async (eventId: string) => {
    if (!window.confirm('Are you sure you want to delete this event?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      const response = await fetch(`${API_URL}/events/${eventId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete event');
      }
      
      // Update both the filtered and full lists
      const updatedEvents = events.filter(event => event._id !== eventId);
      const updatedAllEvents = allEvents.filter(event => event._id !== eventId);
      
      setEvents(updatedEvents);
      setAllEvents(updatedAllEvents);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event. Please try again.');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSkillsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const skills = e.target.value.split(',').map(skill => skill.trim());
    setFormData({
      ...formData,
      skills
    });
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Automatically determine status based on dates
      const now = new Date();
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      // Fix the type issue by declaring the correct type
      let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' = 'upcoming';
      if (startDate <= now && endDate >= now) {
        status = 'ongoing';
      } else if (endDate < now) {
        status = 'completed';
      }
      
      // Include status in the form data
      const eventDataWithStatus = {
        ...formData,
        status
      };
      
      const response = await fetch(`${API_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventDataWithStatus)
      });
      
      if (!response.ok) {
        throw new Error('Failed to create event');
      }
      
      const newEvent = await response.json();
      console.log("New event created:", newEvent);
      
      // After successfully creating an event, refresh all events
      // This ensures proper formatting and display
      setShowCreateModal(false);
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      setError('Failed to create event. Please try again.');
    }
  };

  const handleSubmitEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentEvent) return;
    
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // Automatically update status based on dates if not explicitly set
      const now = new Date();
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      // Fix the type issue by declaring the correct type
      let status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled' = formData.status || 'upcoming';
      if (!formData.status) {
        if (startDate <= now && endDate >= now) {
          status = 'ongoing';
        } else if (endDate < now) {
          status = 'completed';
        }
      }
      
      const eventDataWithStatus = {
        ...formData,
        status
      };
      
      const response = await fetch(`${API_URL}/events/${currentEvent._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(eventDataWithStatus)
      });
      
      if (!response.ok) {
        throw new Error('Failed to update event');
      }
      
      // After successfully editing an event, refresh all events
      // This ensures proper formatting and display
      setShowEditModal(false);
      fetchEvents();
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event. Please try again.');
    }
  };

  const handleRegisterForEvent = async (eventId: string) => {
    try {
      // Get the token from localStorage
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('You must be logged in to register for events');
      }
      
      // Log the API call for debugging
      console.log(`Attempting to register for event: ${eventId}`);
      console.log(`Using token: ${token}`);
      
      const response = await fetch(`${API_URL}/events/${eventId}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Log the response status
      console.log(`Registration response status: ${response.status}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Registration error details:', errorData);
        throw new Error(errorData.message || 'Failed to register for event');
      }
      
      // Success - update the events locally to reflect registration
      // This avoids having to do a full refetch
      const updatedEvents = allEvents.map(event => {
        if (event._id === eventId && currentUserId) {
          // Create a new array of registered volunteers that includes the current user
          const updatedRegisteredVolunteers = [
            ...(event.registeredVolunteers || []),
            currentUserId
          ];
          
          // Return a new event object with the updated registered volunteers
          return {
            ...event,
            registeredVolunteers: updatedRegisteredVolunteers
          };
        }
        return event;
      });
      
      // Update both state variables
      setAllEvents(updatedEvents);
      setEvents(updatedEvents.filter(event => {
        // Apply current filter
        if (filterOption === 'all') return true;
        return event.status === filterOption;
      }));
      
      alert('Successfully registered for the event!');
    } catch (err: any) {
      console.error('Error registering for event:', err);
      setError(err.message || 'Failed to register for event. Please try again.');
    }
  };

  // Function to check if current user is registered for an event
  const isUserRegistered = (event: Event): boolean => {
    if (!currentUserId || !event.registeredVolunteers) {
      return false;
    }
    return event.registeredVolunteers.includes(currentUserId);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const formatTime = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      hour: '2-digit', 
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleTimeString(undefined, options);
  };

  // Close the dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(`.${styles.filterContainer}`)) {
        setShowFilterOptions(false);
      }
      if (!target.closest(`.${styles.sortContainer}`)) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className={styles.eventsContainer}>
      <div className={styles.header}>
        <h1>Events</h1>
        <div className={styles.actions}>
          <div className={styles.filterContainer}>
            <button 
              className={styles.filterButton} 
              onClick={() => setShowFilterOptions(!showFilterOptions)}
            >
              Filter
            </button>
            
            {showFilterOptions && (
              <div className={styles.filterDropdown}>
                <div 
                  className={`${styles.filterOption} ${filterOption === 'all' ? styles.active : ''}`} 
                  onClick={() => handleFilter('all')}
                >
                  All Events
                </div>
                <div 
                  className={`${styles.filterOption} ${filterOption === 'upcoming' ? styles.active : ''}`} 
                  onClick={() => handleFilter('upcoming')}
                >
                  Upcoming Events
                </div>
                <div 
                  className={`${styles.filterOption} ${filterOption === 'ongoing' ? styles.active : ''}`} 
                  onClick={() => handleFilter('ongoing')}
                >
                  Ongoing Events
                </div>
                <div 
                  className={`${styles.filterOption} ${filterOption === 'completed' ? styles.active : ''}`}
                  onClick={() => handleFilter('completed')}
                >
                  Completed Events
                </div>
                <div 
                  className={`${styles.filterOption} ${filterOption === 'cancelled' ? styles.active : ''}`}
                  onClick={() => handleFilter('cancelled')}
                >
                  Cancelled Events
                </div>
              </div>
            )}
          </div>
          
          <div className={styles.sortContainer}>
            <button 
              className={styles.sortButton} 
              onClick={() => setShowSortOptions(!showSortOptions)}
            >
              Sort
            </button>
            
            {showSortOptions && (
              <div className={styles.sortDropdown}>
                <div 
                  className={`${styles.sortOption} ${sortOption === 'date-asc' ? styles.active : ''}`} 
                  onClick={() => handleSort('date-asc')}
                >
                  Date (Earliest First)
                </div>
                <div 
                  className={`${styles.sortOption} ${sortOption === 'date-desc' ? styles.active : ''}`} 
                  onClick={() => handleSort('date-desc')}
                >
                  Date (Latest First)
                </div>
                <div 
                  className={`${styles.sortOption} ${sortOption === 'title-asc' ? styles.active : ''}`} 
                  onClick={() => handleSort('title-asc')}
                >
                  Title (A-Z)
                </div>
                <div 
                  className={`${styles.sortOption} ${sortOption === 'title-desc' ? styles.active : ''}`}
                  onClick={() => handleSort('title-desc')}
                >
                  Title (Z-A)
                </div>
                <div 
                  className={`${styles.sortOption} ${sortOption === 'volunteer-asc' ? styles.active : ''}`}
                  onClick={() => handleSort('volunteer-asc')}
                >
                  Available Spots (Least First)
                </div>
                <div 
                  className={`${styles.sortOption} ${sortOption === 'volunteer-desc' ? styles.active : ''}`}
                  onClick={() => handleSort('volunteer-desc')}
                >
                  Available Spots (Most First)
                </div>
              </div>
            )}
          </div>
          
          {userIsAdmin && (
            <button className={styles.createButton} onClick={handleCreateEvent}>
              Create Event
            </button>
          )}
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}
      
      {loading ? (
        <p className={styles.loading}>Loading events...</p>
      ) : events.length === 0 ? (
        <div className={styles.noEvents}>
          <p>No events found matching the current filter.</p>
        </div>
      ) : (
        <div className={styles.eventsGrid}>
          {events.map(event => (
            <div key={event._id} className={styles.eventCard}>
              <img
                src={event.imageUrl || 'https://via.placeholder.com/400x200?text=Event'}
                alt={event.title}
                className={styles.eventImage}
              />
              <div className={styles.eventContent}>
                <div className={styles.statusBadge} data-status={event.status}>
                  {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                </div>
                <h3 className={styles.eventTitle}>{event.title}</h3>
                <p className={styles.eventDescription}>{event.description}</p>
                <div className={styles.eventDetail}>
                  <strong>Date:</strong> {formatDate(event.startDate)}
                </div>
                <div className={styles.eventDetail}>
                  <strong>Time:</strong> {formatTime(event.startDate)} - {formatTime(event.endDate)}
                </div>
                <div className={styles.eventDetail}>
                  <strong>Venue:</strong> {event.location}
                </div>
                <div className={styles.eventDetail}>
                  <strong>Seats Available:</strong> {event.maxVolunteers - (event.registeredVolunteers?.length || 0)}
                </div>
                
                <div className={styles.cardActions}>
                  {event.status === 'upcoming' || event.status === 'ongoing' ? (
                    isUserRegistered(event) ? (
                      <button 
                        className={`${styles.joinButton} ${styles.joined}`}
                        disabled
                      >
                        Joined
                      </button>
                    ) : (
                      <button 
                        className={styles.joinButton}
                        onClick={() => handleRegisterForEvent(event._id)}
                      >
                        Join now
                      </button>
                    )
                  ) : (
                    <button 
                      className={`${styles.joinButton} ${styles.disabled}`}
                      disabled
                    >
                      {event.status === 'completed' ? 'Event Completed' : 'Event Cancelled'}
                    </button>
                  )}
                  
                  {userIsAdmin && (
                    <div className={styles.adminActions}>
                      <button 
                        className={styles.editButton}
                        onClick={() => handleEditEvent(event)}
                      >
                        Edit
                      </button>
                      <button 
                        className={styles.deleteButton}
                        onClick={() => handleDeleteEvent(event._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Event Modal */}
      {showCreateModal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Create New Event</h2>
            <form onSubmit={handleSubmitCreate}>
              <div className={styles.formGroup}>
                <label htmlFor="title">Event Title</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="description">Description</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="location">Location</label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="startDate">Start Date/Time</label>
                  <input
                    type="datetime-local"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="endDate">End Date/Time</label>
                  <input
                    type="datetime-local"
                    id="endDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="maxVolunteers">Maximum Volunteers</label>
                <input
                  type="number"
                  id="maxVolunteers"
                  name="maxVolunteers"
                  value={formData.maxVolunteers}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="skills">Skills Required (comma-separated)</label>
                <input
                  type="text"
                  id="skills"
                  name="skills"
                  value={formData.skills.join(', ')}
                  onChange={handleSkillsChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="imageUrl">Image URL</label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>Create Event</button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Event Modal */}
      {showEditModal && currentEvent && (
        <div className={styles.modalOverlay}>
          <div className={styles.modal}>
            <h2>Edit Event</h2>
            <form onSubmit={handleSubmitEdit}>
              <div className={styles.formGroup}>
                <label htmlFor="editTitle">Event Title</label>
                <input
                  type="text"
                  id="editTitle"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="editDescription">Description</label>
                <textarea
                  id="editDescription"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="editLocation">Location</label>
                <input
                  type="text"
                  id="editLocation"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="editStartDate">Start Date/Time</label>
                  <input
                    type="datetime-local"
                    id="editStartDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className={styles.formGroup}>
                  <label htmlFor="editEndDate">End Date/Time</label>
                  <input
                    type="datetime-local"
                    id="editEndDate"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="editStatus">Status</label>
                <select
                  id="editStatus"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                >
                  <option value="upcoming">Upcoming</option>
                  <option value="ongoing">Ongoing</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="editMaxVolunteers">Maximum Volunteers</label>
                <input
                  type="number"
                  id="editMaxVolunteers"
                  name="maxVolunteers"
                  value={formData.maxVolunteers}
                  onChange={handleInputChange}
                  min="1"
                  required
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="editSkills">Skills Required (comma-separated)</label>
                <input
                  type="text"
                  id="editSkills"
                  name="skills"
                  value={formData.skills.join(', ')}
                  onChange={handleSkillsChange}
                />
              </div>
              
              <div className={styles.formGroup}>
                <label htmlFor="editImageUrl">Image URL</label>
                <input
                  type="url"
                  id="editImageUrl"
                  name="imageUrl"
                  value={formData.imageUrl || ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className={styles.modalButtons}>
                <button type="submit" className={styles.submitButton}>Update Event</button>
                <button 
                  type="button" 
                  className={styles.cancelButton}
                  onClick={() => setShowEditModal(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EventsList;