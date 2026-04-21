import React, { useState } from 'react';
import { useAuth } from './AuthContext';
import './AddFortScreen.css';

export const AddFortScreen = ({ onBack, onFortAdded }) => {
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    height: '',
    description: '',
    notes: '',
    photoLinks: ''
  });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { api } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.location.trim()) {
      setMessage('Fort name and location are required');
      return;
    }

    try {
      setLoading(true);
      const photoLinks = formData.photoLinks
        .split('\n')
        .map(link => link.trim())
        .filter(link => link);

      await api('/forts', 'POST', {
        name: formData.name,
        location: formData.location,
        height: formData.height ? parseInt(formData.height) : null,
        description: formData.description,
        notes: formData.notes,
        photoLinks,
        visited: false
      });

      setMessage('Fort added successfully! 🏰');
      setTimeout(() => {
        onFortAdded();
        onBack();
      }, 1500);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-fort-container">
      <div className="add-fort-header">
        <button className="back-btn" onClick={onBack}>← Back</button>
        <h1>Add New Fort</h1>
      </div>

      {message && <div className={`message ${loading ? '' : 'error'}`}>{message}</div>}

      <form onSubmit={handleSubmit} className="add-fort-form">
        <div className="form-group">
          <label>Fort Name *</label>
          <input 
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g., Raigad Fort"
            required
          />
        </div>

        <div className="form-group">
          <label>Location *</label>
          <input 
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g., Raigad, Maharashtra"
            required
          />
        </div>

        <div className="form-group">
          <label>Height (meters)</label>
          <input 
            type="number"
            name="height"
            value={formData.height}
            onChange={handleChange}
            placeholder="e.g., 2700"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea 
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Add details about the fort..."
            rows="4"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Notes</label>
          <textarea 
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            placeholder="Any additional notes..."
            rows="3"
          ></textarea>
        </div>

        <div className="form-group">
          <label>Photo Links (one per line)</label>
          <textarea 
            name="photoLinks"
            value={formData.photoLinks}
            onChange={handleChange}
            placeholder="https://example.com/photo1.jpg&#10;https://example.com/photo2.jpg"
            rows="4"
          ></textarea>
        </div>

        <button type="submit" disabled={loading} className="submit-btn">
          {loading ? 'Adding Fort...' : '+ Add Fort'}
        </button>
      </form>
    </div>
  );
};
