// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { login, mockLogin } from '../services/authService';

interface LoginPageProps {
  onLoginSuccess?: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(email, password);
      onLoginSuccess?.(); // Notify parent if needed
    } catch (error: any) {
      setError(error.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypassLogin = () => {
    mockLogin();
    onLoginSuccess?.(); // Notify parent
  };

  return (
    <div style={{ maxWidth: '400px', margin: '100px auto', padding: '20px', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
      <h2>Log In to Volunteer Management System</h2>
      {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="email" style={{ display: 'block', marginBottom: '5px' }}>Email</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <div>
          <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          style={{ 
            padding: '10px', 
            backgroundColor: '#3498db', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer',
            marginTop: '10px' 
          }}
        >
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>

        <button
          type="button"
          onClick={handleBypassLogin}
          style={{ 
            padding: '10px', 
            backgroundColor: '#2ecc71', 
            color: 'white', 
            border: 'none', 
            cursor: 'pointer' 
          }}
        >
          Bypass Login (Development)
        </button>
      </form>

      <p style={{ marginTop: '20px', fontSize: '14px', color: '#666' }}>
        New volunteers need to register and be approved by an admin before logging in.
      </p>
    </div>
  );
};

export default LoginPage;