import { Activity, ShieldCheck, FileText, Droplets, Target, Send } from 'lucide-react';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ totalReadings: 184, safeReadings: 172, activeComplaints: 3 });

  useEffect(() => {
    // Backend stats fetching disabled per user request
    // Stats are now hardcoded for presentation purposes
  }, [user]);

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--bg-slate-900)' }}>Dashboard Overview</h1>
        <p>Monitor your community's water quality and reported issues.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', borderLeft: '4px solid var(--primary-blue)' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(2, 132, 199, 0.1)', color: 'var(--primary-blue)', borderRadius: '12px' }}>
            <Activity size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Readings</h4>
            <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--bg-slate-900)' }}>{stats.totalReadings}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', borderLeft: '4px solid var(--success)' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', borderRadius: '12px' }}>
            <ShieldCheck size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Safe Readings</h4>
            <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--bg-slate-900)' }}>{stats.safeReadings}</span>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', borderLeft: '4px solid var(--warning)' }}>
          <div style={{ padding: '0.75rem', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', borderRadius: '12px' }}>
            <FileText size={24} />
          </div>
          <div>
            <h4 style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Active Complaints</h4>
            <span style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--bg-slate-900)' }}>{stats.activeComplaints}</span>
          </div>
        </div>
      </div>

      {/* Creative About Our System Banner */}
      <div style={{ 
        background: 'linear-gradient(135deg, var(--primary-blue), #0f172a)', 
        borderRadius: '24px', 
        padding: '3rem', 
        color: 'white', 
        boxShadow: '0 20px 25px -5px rgba(2, 132, 199, 0.4)',
        position: 'relative',
        overflow: 'hidden',
        marginBottom: '2rem'
      }}>
        {/* Subtle background decoration */}
        <div style={{ position: 'absolute', right: '-10%', top: '-25%', opacity: 0.1, transform: 'rotate(15deg)' }}>
          <Droplets size={350} />
        </div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
          <h2 style={{ fontSize: '2.2rem', marginBottom: '1rem', color: 'white', fontWeight: '800', lineHeight: 1.2 }}>
            Empowering Clean Water for Everyone
          </h2>
          <p style={{ fontSize: '1.15rem', lineHeight: '1.8', color: '#e0f2fe', fontWeight: '500' }}>
            The <strong style={{ color: '#ffffff', fontWeight: '800' }}>AB Community Portal</strong> is a modern ecosystem built to ensure the purity of our local supply. By pooling community data, we maintain transparency and guarantee the highest living standards.
          </p>
        </div>
      </div>

      {/* Feature Blocks */}
      <div className="grid-cols-3" style={{ marginBottom: '3rem' }}>
        <div className="card" style={{ textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <div style={{ margin: '0 auto 1.5rem', background: 'rgba(2, 132, 199, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)' }}>
            <Activity size={32} />
          </div>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '1.15rem', fontWeight: 700 }}>Log Parameters</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>Instantly check your water's safety by logging pH, Turbidity, and Temp. Receive immediate alerts.</p>
        </div>

        <div className="card" style={{ textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <div style={{ margin: '0 auto 1.5rem', background: 'rgba(245, 158, 11, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
            <Target size={32} />
          </div>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '1.15rem', fontWeight: 700 }}>Analyze Trends</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>Visually compare inputs against strict global health standard charts to spot irregularities.</p>
        </div>

        <div className="card" style={{ textAlign: 'center', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
          <div style={{ margin: '0 auto 1.5rem', background: 'rgba(16, 185, 129, 0.1)', width: '64px', height: '64px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
            <Send size={32} />
          </div>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '1.15rem', fontWeight: 700 }}>Report Issues</h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>Submit visual complaints with high-res photos and detailed text to accelerate association repairs.</p>
        </div>
      </div>

      {/* Footer */}
      <div style={{ textAlign: 'center', marginTop: '4rem', paddingTop: '2.5rem', borderTop: '1px solid var(--border)', color: 'var(--text-secondary)' }}>
        <p style={{ fontWeight: 600, color: 'var(--bg-slate-900)' }}>© 2026 AB Community Water Management. All rights reserved.</p>
        <p style={{ fontSize: '0.85rem', marginTop: '0.5rem', opacity: 0.8 }}>Designed and engineered with professional modular web structures.</p>
      </div>
    </div>
  );
}
