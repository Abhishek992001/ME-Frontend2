// src/pages/EventsBoard.tsx
import React, { useState, useEffect } from 'react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  venue: string;
  seatsAvailable: number;
  imageUrl: string;
}

interface EventsBoardProps {
  showSidebar: boolean;
}

const EventsBoard: React.FC<EventsBoardProps> = ({ showSidebar }) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Use mock data instead of API calls for now
    const mockEvents = [
      {
        _id: '1',
        title: 'Blood Donation Camp',
        description: 'A small act of kindness can save lives. Participate in our blood donation camp and be a hero! This event is open to all eligible donors and aims to replenish the community\'s blood supply.',
        date: 'January 20, 2024',
        time: '9:00 AM - 3:00 PM',
        venue: 'Red Cross Hall, H.G. Road',
        seatsAvailable: 100,
        imageUrl: 'https://via.placeholder.com/400x200?text=Blood+Donation'
      },
      {
        _id: '2',
        title: 'Marathon for a Cause',
        description: 'Get ready to lace up your running shoes and join us for a spirited run for a cleaner and greener city! This event welcomes everyone to contribute to a meaningful cause while having fun.',
        date: 'February 25, 2024',
        time: '6:00 AM',
        venue: 'Gandhi Square, Thrissur',
        seatsAvailable: 1000,
        imageUrl: 'https://via.placeholder.com/400x200?text=Marathon'
      },
      {
        _id: '3',
        title: 'Tree Plantation Drive',
        description: 'Planting trees is a powerful way to combat climate change, preserve biodiversity, and enhance the beauty of our environment. Join us for our tree plantation drive and be part of a green movement.',
        date: 'February 18, 2024',
        time: '8:00 AM',
        venue: 'City Park, Kottayam',
        seatsAvailable: 30,
        imageUrl: 'https://via.placeholder.com/400x200?text=Tree+Plantation'
      }
    ];

    // Simulate API call
    setTimeout(() => {
      setEvents(mockEvents);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ margin: 0 }}>Events</h1>
        <div>
          <button style={{
            backgroundColor: '#D4AF37',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            marginRight: '10px',
            cursor: 'pointer'
          }}>
            Filter
          </button>
          <button style={{
            backgroundColor: '#D4AF37',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}>
            Sort
          </button>
        </div>
      </div>

      {loading ? (
        <p>Loading events...</p>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {events.map(event => (
            <div key={event._id} style={{ 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              overflow: 'hidden',
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
            }}>
              <img
                src={event.imageUrl}
                alt={event.title}
                style={{ width: '100%', height: '200px', objectFit: 'cover' }}
              />
              <div style={{ padding: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0' }}>{event.title}</h3>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#555', 
                  marginBottom: '15px' 
                }}>
                  {event.description}
                </p>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  <strong>Date:</strong> {event.date}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  <strong>Time:</strong> {event.time}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '5px' }}>
                  <strong>Venue:</strong> {event.venue}
                </div>
                <div style={{ fontSize: '14px', marginBottom: '15px' }}>
                  <strong>Seats Available:</strong> {event.seatsAvailable}
                </div>
                <button style={{
                  backgroundColor: '#D4AF37',
                  color: 'white',
                  border: 'none',
                  padding: '8px 15px',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  width: '100%'
                }}>
                  Join now
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventsBoard;