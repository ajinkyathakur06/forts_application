import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [username, setUsername] = useState(localStorage.getItem('username') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const api = async (path, method = 'GET', body = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`http://localhost:5000${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : null
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || 'Request failed');
    }
    return data;
  };

  const register = async (user, pass) => {
    setLoading(true);
    setError('');
    try {
      const data = await api('/auth/register', 'POST', { username: user, password: pass });
      setToken(data.token);
      setUsername(data.user.username);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const login = async (user, pass) => {
    setLoading(true);
    setError('');
    try {
      const data = await api('/auth/login', 'POST', { username: user, password: pass });
      setToken(data.token);
      setUsername(data.user.username);
      localStorage.setItem('token', data.token);
      localStorage.setItem('username', data.user.username);
      return true;
    } catch (err) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUsername('');
    setError('');
    localStorage.removeItem('token');
    localStorage.removeItem('username');
  };

  return (
    <AuthContext.Provider value={{ token, username, loading, error, register, login, logout, api, setError }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
