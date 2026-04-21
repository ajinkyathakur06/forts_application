import React, { useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import './FortDetail.css';

export const FortDetailScreen = ({ fortId, onBack, onUpdate }) => {
  const [fort, setFort] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');
  const { api } = useAuth();

  useEffect(() => {
    loadFort();
  }, [fortId]);

  const loadFort = async () => {
    try {
      setLoading(true);
      const data = await api(`/forts/${fortId}`);
      setFort(data);
      setFormData(data);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoLinksChange = (e) => {
    const links = e.target.value.split('\n').filter(l => l.trim());
    setFormData(prev => ({ ...prev, photoLinks: links }));
  };

  const handleSave = async () => {
    try {
      const updated = await api(`/forts/${fortId}`, 'PUT', formData);
      setFort(updated);
      setIsEditing(false);
      setMessage('Fort updated! ✨');
      setTimeout(() => setMessage(''), 2000);
      if (onUpdate) onUpdate();
    } catch (err) {
      setMessage(err.message);
    }
  };

  if (loading) return <div className="detail-loading">Loading fort details...</div>;
  if (!fort) return <div className="detail-error">Fort not found</div>;

  return (
    <div className="detail-container">
      <div className="detail-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>{fort.name}</h1>
        <button 
          className="edit-btn" 
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Cancel' : '✏️'}
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      <div className="detail-content">
        {isEditing ? (
          <div className="edit-form">
            <div className="form-group">
              <label>Fort Name</label>
              <input 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Location</label>
              <input 
                name="location" 
                value={formData.location} 
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Height (meters)</label>
              <input 
                name="height" 
                type="number"
                value={formData.height || ''} 
                onChange={handleInputChange}
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleInputChange}
                placeholder="Add description about the fort..."
              ></textarea>
            </div>

            <div className="form-group">
              <label>Notes</label>
              <textarea 
                name="notes" 
                value={formData.notes} 
                onChange={handleInputChange}
                placeholder="Any additional notes..."
              ></textarea>
            </div>

            <div className="form-group">
              <label>Photo Links (one per line)</label>
              <textarea 
                value={formData.photoLinks ? formData.photoLinks.join('\n') : ''} 
                onChange={handlePhotoLinksChange}
                placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
              ></textarea>
            </div>

            <div className="form-actions">
              <button className="save-btn" onClick={handleSave}>Save Changes</button>
              <button className="cancel-btn" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </div>
        ) : (
          <>
            <div className="detail-info">
              <div className="info-item">
                <label>Location</label>
                <p>📍 {fort.location}</p>
              </div>

              {fort.height && (
                <div className="info-item">
                  <label>Height</label>
                  <p>⛰️ {fort.height} meters</p>
                </div>
              )}

              <div className="info-item">
                <label>Status</label>
                <p className={fort.visited ? 'visited-status' : 'not-visited-status'}>
                  {fort.visited ? '✅ Visited' : '🚩 Not Visited'}
                </p>
                {fort.visitedDate && (
                  <p className="visited-date">
                    Visited on {new Date(fort.visitedDate).toLocaleDateString()}
                  </p>
                )}
              </div>

              {fort.description && (
                <div className="info-item">
                  <label>Description</label>
                  <p>{fort.description}</p>
                </div>
              )}

              {fort.notes && (
                <div className="info-item">
                  <label>Notes</label>
                  <p>{fort.notes}</p>
                </div>
              )}
            </div>

            {fort.photoLinks && fort.photoLinks.length > 0 && (
              <div className="photos-section">
                <h3>Photos ({fort.photoLinks.length})</h3>
                <div className="photos-grid">
                  {fort.photoLinks.map((photo, idx) => (
                    <div key={idx} className="photo-item">
                      <img src={photo} alt={`Fort ${idx + 1}`} />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
