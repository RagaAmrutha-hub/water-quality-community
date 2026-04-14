import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Droplet } from 'lucide-react';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ reg_number: '', name: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const endpoint = isRegister ? '/register' : '/login';
      const payload = isRegister
        ? formData
        : { reg_number: formData.reg_number, password: formData.password };

      const res = await axios.post(`/api/auth${endpoint}`, payload);

      if (res.data.success) {
        // Automatically logs in because the backend now returns user data on register too
        login({
          token: res.data.token,
          name: res.data.name,
          role: res.data.role,
          reg_number: formData.reg_number
        });
        navigate('/dashboard');
      }
    } catch (err) {
      console.error(err);
      if (!err.response) {
        setError('Network Error: Cannot reach the backend server (Port 4000). Ensure the backend is running!');
      } else {
        setError(err.response?.data?.message || err.response?.data?.error || `Server Error: ${err.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '64px', height: '64px', backgroundColor: 'var(--primary-blue)', borderRadius: '16px', marginBottom: '1rem', color: 'white' }}>
            <Droplet size={32} />
          </div>
          <h2>{isRegister ? 'Join Community' : 'Welcome Back'}</h2>
          <p>Water Quality Monitoring System</p>
        </div>

        {error && <div style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '0.75rem', borderRadius: '8px', marginBottom: '1rem', fontSize: '0.875rem' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Register Number</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. CMT001"
              value={formData.reg_number}
              onChange={(e) => setFormData({ ...formData, reg_number: e.target.value })}
            />
          </div>

          {isRegister && (
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-input"
              required
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem', marginTop: '1rem' }} disabled={isLoading}>
            {isLoading ? 'Processing...' : (isRegister ? 'Register & Login' : 'Login')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem' }}>
          <span style={{ color: 'var(--text-secondary)' }}>
            {isRegister ? 'Already have an account?' : 'New to community?'}
          </span>
          <br />
          <button
            type="button"
            onClick={() => { setIsRegister(!isRegister); setError(''); }}
            style={{ background: 'none', border: 'none', color: 'var(--primary-blue)', fontWeight: '600', cursor: 'pointer', marginTop: '0.5rem' }}
          >
            {isRegister ? 'Sign in instead' : 'Create an account'}
          </button>
        </div>
      </div>
    </div>
  );
}
