// src/pages/EventsPage.tsx
import React from 'react';

interface EventsPageProps {
  showSidebar: boolean;
}

const EventsPage: React.FC<EventsPageProps> = ({ showSidebar }) => {
  return (
    <div>
      <h2>Events Page</h2>
      <p>This is a minimal version with no dependencies.</p>
      <p>ShowSidebar prop: {showSidebar ? 'true' : 'false'}</p>
    </div>
  );
};

export default EventsPage;