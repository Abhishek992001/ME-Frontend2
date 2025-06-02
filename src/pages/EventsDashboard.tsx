// src/pages/EventsDashboard.tsx
import React from 'react';

interface EventsDashboardProps {
  showSidebar: boolean;
}

const EventsDashboard: React.FC<EventsDashboardProps> = ({ showSidebar }) => {
  return (
    <div>
      <h2>Events Dashboard</h2>
      <p>This is a completely new component with a different name.</p>
      <p>ShowSidebar prop: {showSidebar ? 'true' : 'false'}</p>
    </div>
  );
};

export default EventsDashboard;