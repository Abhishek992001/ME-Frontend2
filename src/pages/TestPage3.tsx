// src/pages/TestPage3.tsx
import React from 'react';
import { Event } from '../types/Event';
import { isAdmin } from '../services/authService';
import { fetchEvents } from '../services/eventService';

interface TestPage3Props {
  showSidebar: boolean;
}

const TestPage3: React.FC<TestPage3Props> = ({ showSidebar }) => {
  const userIsAdmin = isAdmin();
  const [testMessage, setTestMessage] = React.useState('Testing eventService import');
  
  React.useEffect(() => {
    // Just log the function to verify the import works
    console.log("fetchEvents function imported:", fetchEvents);
  }, []);
  
  return (
    <div>
      <h2>Test Page 3</h2>
      <p>This page imports ALL dependencies: Event type, authService, and eventService.</p>
      <p>ShowSidebar prop: {showSidebar ? 'true' : 'false'}</p>
      <p>User is admin: {userIsAdmin ? 'Yes' : 'No'}</p>
      <p>{testMessage}</p>
    </div>
  );
};

export default TestPage3;