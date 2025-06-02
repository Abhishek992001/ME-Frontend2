// src/AppRoutes.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EventsPage from './pages/EventsPage';
import LoginPage from './pages/LoginPage';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<EventsPage showSidebar={true} />} />
      <Route path="/login" element={<LoginPage />} />
    </Routes>
  );
};

export default AppRoutes;