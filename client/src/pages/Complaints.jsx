import { useState, useEffect } from 'react';
import axios from 'axios';
import { Camera, Send, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Complaints() {
  const [complaint, setComplaint] = useState({ title: '', description: '', photo: null });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [history, setHistory] = useState([]);
  const { user } = useAuth();
  
  const fetchComplaints = async () => {
    try {
      const response = await axios.get('/api/complaints/mine', {
        headers: { Authorization: `Bearer ${user?.token}` }
      });
      setHistory(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (user) fetchComplaints();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fd = new FormData();
      fd.append('title', complaint.title);
      fd.append('description', complaint.description);
      if (complaint.photo) {
        fd.append('photo', complaint.photo);
      }

      await axios.post('/api/complaints', fd, { 
        headers: { 
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'multipart/form-data'
        } 
      });
      
      setIsSubmitted(true);
      setComplaint({ title: '', description: '', photo: null });
      fetchComplaints(); // Refresh live table
      
      setTimeout(() => setIsSubmitted(false), 3000);
    } catch (err) {
      console.error(err);
      alert('Failed to submit complaint: ' + (err.response?.data?.message || err.message));
    }
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'Completed': return <span className="badge badge-safe" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><CheckCircle size={14}/> Completed</span>;
      case 'In Progress': return <span className="badge badge-progress" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14}/> In Progress</span>;
      default: return <span className="badge badge-pending" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={14}/> Pending</span>;
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--bg-slate-900)' }}>Report an Issue</h1>
        <p>File a complaint with descriptions and photos. The association will review and update the status.</p>
      </div>

      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Form Column */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Submit New Complaint</h3>
          
          {isSubmitted && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px', marginBottom: '1rem' }}>
              Complaint submitted successfully to the association.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Issue Title</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="Brief summary of the issue"
                value={complaint.title}
                onChange={(e) => setComplaint({...complaint, title: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea 
                className="form-input" 
                required 
                rows="4"
                placeholder="Detailed explanation of what you observed..."
                value={complaint.description}
                onChange={(e) => setComplaint({...complaint, description: e.target.value})}
              ></textarea>
            </div>

            <div className="form-group">
              <label className="form-label">Attach Photo (Optional)</label>
              <label htmlFor="photo-upload" style={{ 
                border: '2px dashed var(--border)', 
                padding: '2rem', 
                textAlign: 'center', 
                borderRadius: '8px',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                display: 'block',
                transition: 'background-color 0.3s ease'
              }} onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)'} onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                <Camera size={32} style={{ margin: '0 auto 0.5rem auto', color: complaint.photo ? 'var(--primary-blue)' : 'var(--text-secondary)' }} />
                <span style={{ color: complaint.photo ? 'var(--primary-blue)' : 'inherit', fontWeight: complaint.photo ? 600 : 400 }}>
                  {complaint.photo ? complaint.photo.name : 'Click to upload image'}
                </span>
                <input 
                  id="photo-upload" 
                  type="file" 
                  accept="image/*"
                  style={{ display: 'none' }} 
                  onChange={(e) => {
                    if (e.target.files && e.target.files.length > 0) {
                      setComplaint({...complaint, photo: e.target.files[0]});
                    }
                  }}
                />
              </label>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
              <Send size={16} style={{ marginRight: '0.5rem' }} /> Submit Report
            </button>
          </form>
        </div>


      </div>
    </div>
  );
}
