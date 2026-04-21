import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './AuthScreen.css';

export const AuthScreen = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const { register, login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(username, password);
    } else {
      await register(username, password);
    }
    setPassword('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🏰 Forts Tracker</h1>
          <p>Track forts you've visited</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading} className="submit-btn">
            {loading ? 'Loading...' : isLogin ? 'Login' : 'Register'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        <button
          type="button"
          className="toggle-btn"
          onClick={() => setIsLogin(!isLogin)}
          disabled={loading}
        >
          {isLogin ? "Don't have an account? Register" : 'Already have an account? Login'}
        </button>
      </div>
    </div>
  );
};
