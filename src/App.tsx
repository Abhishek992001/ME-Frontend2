// src/App.tsx
import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import EventsList from './pages/EventsList';
import Sidebar from './Components/Sidebar/Sidebar';
import './App.css';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div className="app">
      {!isLoggedIn ? (
        <LoginPage onLoginSuccess={handleLoginSuccess} />
      ) : (
        <div className="dashboard">
          <Sidebar onLogout={handleLogout} />
          <main className="content">
            <EventsList />
          </main>
        </div>
      )}
    </div>
  );
};

export default App;