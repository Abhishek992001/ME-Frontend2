// src/Components/LoginForm/LoginForm.tsx
import React, { useState } from "react";
import { login, mockLogin } from "../../services/authService";
import styles from "./LoginForm.module.css";

interface LoginFormProps {
  onLoginSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      await login(email, password);
      onLoginSuccess();
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBypassLogin = () => {
    mockLogin();
    onLoginSuccess();
  };

  return (
    <div className={styles.loginForm}>
      <h2>Log In to Volunteer Management System</h2>

      {error && <div className={styles.errorMessage}>{error}</div>}

      <form onSubmit={handleLogin}>
        <div className={styles.formGroup}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button
          type="submit"
          className={styles.loginButton}
          disabled={isLoading}
        >
          {isLoading ? "Logging in..." : "Log In"}
        </button>

        <button
          type="button"
          className={styles.bypassButton}
          onClick={handleBypassLogin}
        >
          Bypass Login (Development Only)
        </button>
      </form>

      <p className={styles.registerInfo}>
        New volunteers need to register and be approved by an admin before logging in.
      </p>
    </div>
  );
};

export default LoginForm;
