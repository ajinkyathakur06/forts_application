import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './FortsScreen.css';

const FortCard = ({ fort, onSelect, onToggleVisited, onDelete }) => {
  return (
    <div className={`fort-card ${fort.visited ? 'visited' : ''}`}>
      <div className="fort-card-header">
        <div className="fort-info">
          <h3 className="fort-name">{fort.name}</h3>
          <p className="fort-location">📍 {fort.location}</p>
          {fort.height && <p className="fort-height">⛰️ {fort.height}m</p>}
        </div>
        <label className="checkbox-wrapper">
          <input
            type="checkbox"
            checked={fort.visited}
            onChange={() => onToggleVisited(fort._id, !fort.visited)}
          />
          <span className="checkmark"></span>
        </label>
      </div>

      {fort.photoLinks.length > 0 && (
        <div className="fort-photos">
          <img src={fort.photoLinks[0]} alt={fort.name} className="fort-thumbnail" />
          <span className="photo-count">{fort.photoLinks.length}</span>
        </div>
      )}

      <div className="fort-card-actions">
        <button className="view-btn" onClick={() => onSelect(fort)}>
          View Details
        </button>
        <button className="delete-btn" onClick={() => onDelete(fort._id)}>
          🗑️
        </button>
      </div>
    </div>
  );
};

export const FortsListScreen = ({ onSelectFort, onBack }) => {
  const [forts, setForts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [filter, setFilter] = useState('all');
  const { username, logout, api, setError } = useAuth();

  useEffect(() => {
    loadForts();
  }, []);

  const loadForts = async () => {
    try {
      setLoading(true);
      const data = await api('/forts');
      setForts(data);
    } catch (err) {
      if (err.message.toLowerCase().includes('unauthorized')) {
        logout();
      }
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleVisited = async (id, visited) => {
    try {
      await api(`/forts/${id}`, 'PUT', { visited });
      setMessage(visited ? '✅ Marked as visited!' : '🚩 Marked as not visited');
      setTimeout(() => setMessage(''), 2000);
      loadForts();
    } catch (err) {
      setMessage(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this fort?')) {
      try {
        await api(`/forts/${id}`, 'DELETE');
        setMessage('Fort deleted');
        setTimeout(() => setMessage(''), 2000);
        loadForts();
      } catch (err) {
        setMessage(err.message);
      }
    }
  };

  const filteredForts = filter === 'visited' ? forts.filter(f => f.visited) : 
                       filter === 'not-visited' ? forts.filter(f => !f.visited) : forts;
  
  const visitedCount = forts.filter(f => f.visited).length;

  return (
    <div className="forts-container">
      <div className="forts-header-bar">
        <div className="header-content">
          <h1>🏰 Forts</h1>
          <p className="user-info">{username}</p>
        </div>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="stats-bar">
        <div className="stat">
          <span className="stat-label">Total</span>
          <span className="stat-value">{forts.length}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Visited</span>
          <span className="stat-value">{visitedCount}</span>
        </div>
        <div className="stat">
          <span className="stat-label">Remaining</span>
          <span className="stat-value">{forts.length - visitedCount}</span>
        </div>
      </div>

      <div className="filter-bar">
        <button 
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All ({forts.length})
        </button>
        <button 
          className={`filter-btn ${filter === 'visited' ? 'active' : ''}`}
          onClick={() => setFilter('visited')}
        >
          Visited ✅
        </button>
        <button 
          className={`filter-btn ${filter === 'not-visited' ? 'active' : ''}`}
          onClick={() => setFilter('not-visited')}
        >
          To Visit 🚩
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="forts-list">
        {loading ? (
          <p className="loading">Loading forts...</p>
        ) : filteredForts.length === 0 ? (
          <div className="empty-state">
            <p>🏰 No forts yet</p>
            <span>Add your first fort to get started!</span>
          </div>
        ) : (
          filteredForts.map((fort) => (
            <FortCard
              key={fort._id}
              fort={fort}
              onSelect={onSelectFort}
              onToggleVisited={handleToggleVisited}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
};
