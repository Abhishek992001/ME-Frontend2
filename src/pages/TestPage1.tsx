// src/pages/TestPage1.tsx
import React from 'react';
import { Event } from '../types/Event';

interface TestPage1Props {
  showSidebar: boolean;
}

const TestPage1: React.FC<TestPage1Props> = ({ showSidebar }) => {
  return (
    <div>
      <h2>Test Page 1</h2>
      <p>This page only imports the Event type.</p>
      <p>ShowSidebar prop: {showSidebar ? 'true' : 'false'}</p>
    </div>
  );
};

export default TestPage1;