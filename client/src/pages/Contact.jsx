import { useState } from 'react';
import axios from 'axios';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contact() {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [isSent, setIsSent] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSent(false);
    setErrorMsg('');
    
    try {
      // Using FormSubmit.co which requires zero backend setup and bypasses Google App Password restrictions.
      const response = await fetch("https://formsubmit.co/ajax/ragaamrutha3@gmail.com", {
        method: "POST",
        headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: formData.name,
            email: formData.email,
            message: formData.message,
            _subject: `New Support Message from ${formData.name} (AB Community Portal)`
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setIsSent(true);
        setFormData({ name: '', email: '', message: '' });
      } else {
        throw new Error("FormSubmit rejected the request.");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg('Failed to send email. Please check your internet connection and try again.');
    }
    
    setTimeout(() => { setIsSent(false); setErrorMsg(''); }, 8000);
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--bg-slate-900)' }}>Contact Support</h1>
        <p>Get in touch with the administration or technical support team.</p>
      </div>

      <div className="grid-cols-2">
        {/* Contact Information */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--primary-blue)', borderRadius: '12px' }}>
              <MapPin size={24} />
            </div>
            <div>
              <h4 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>Our Office</h4>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>123 Community Center Dr.<br/>Block A, AB City, 10029</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '12px' }}>
              <Phone size={24} />
            </div>
            <div>
              <h4 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>Phone Number</h4>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>+1 (555) 123-4567<br/>Mon-Fri from 8am to 5pm</p>
            </div>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '12px' }}>
              <Mail size={24} />
            </div>
            <div>
              <h4 style={{ marginBottom: '0.25rem', fontSize: '1rem' }}>Email Address</h4>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>support@abcommunity.com<br/>admin@abcommunity.com</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Send us a Message</h3>
          
          {isSent && (
            <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '8px', marginBottom: '1rem' }}>
              Message sent successfully! We'll get back to you soon.
            </div>
          )}
          {errorMsg && (
            <div style={{ padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger)', borderRadius: '8px', marginBottom: '1rem' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Your Name</label>
              <input 
                type="text" 
                className="form-input" 
                required 
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input 
                type="email" 
                className="form-input" 
                required 
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message</label>
              <textarea 
                className="form-input" 
                required 
                rows="5"
                placeholder="How can we help you?"
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
              <Send size={16} style={{ marginRight: '0.5rem' }} /> Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
