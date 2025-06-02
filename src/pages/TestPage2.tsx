// src/pages/TestPage2.tsx
import React from 'react';
import { Event } from '../types/Event';
import { isAdmin } from '../services/authService';

interface TestPage2Props {
  showSidebar: boolean;
}

const TestPage2: React.FC<TestPage2Props> = ({ showSidebar }) => {
  const userIsAdmin = isAdmin();
  
  return (
    <div>
      <h2>Test Page 2</h2>
      <p>This page imports the Event type and authService.</p>
      <p>ShowSidebar prop: {showSidebar ? 'true' : 'false'}</p>
      <p>User is admin: {userIsAdmin ? 'Yes' : 'No'}</p>
    </div>
  );
};

export default TestPage2;