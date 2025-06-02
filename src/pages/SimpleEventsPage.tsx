// src/pages/SimpleEventsPage.tsx
import React from 'react';

interface SimpleEventsPageProps {
  showSidebar: boolean;
}

const SimpleEventsPage: React.FC<SimpleEventsPageProps> = ({ showSidebar }) => {
  return (
    <div className="events-page">
      <h2>Simple Events Page</h2>
      <p>This is a test without any external dependencies.</p>
      <p>ShowSidebar prop: {showSidebar ? 'true' : 'false'}</p>
    </div>
  );
};

export default SimpleEventsPage;