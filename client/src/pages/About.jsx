import { Users, Target, Award } from 'lucide-react';

export default function About() {
  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ color: 'var(--bg-slate-900)' }}>About Us</h1>
        <p>Learn more about our mission and the team behind the AB Community Portal.</p>
      </div>

      <div className="card" style={{ padding: '3rem', textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '1rem', color: 'var(--primary-blue)' }}>Our Mission</h2>
        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
          We believe that access to clean, safe drinking water is a fundamental human right. Our mission is to empower communities with the digital tools necessary to monitor, analyze, and act upon water quality data in real-time. By fostering transparency and rapid communication, we help build healthier, thriving environments.
        </p>
      </div>

      <div className="grid-cols-3" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ margin: '0 auto 1.5rem', background: 'rgba(2, 132, 199, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-blue)' }}>
            <Users size={32} />
          </div>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '1.15rem' }}>Community First</h4>
          <p style={{ color: 'var(--text-secondary)' }}>Everything we build originates from the needs of the residents. Your safety is our primary focus.</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ margin: '0 auto 1.5rem', background: 'rgba(16, 185, 129, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--success)' }}>
            <Target size={32} />
          </div>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '1.15rem' }}>Precision Data</h4>
          <p style={{ color: 'var(--text-secondary)' }}>We rely on accurate metrics and scientific standards to evaluate water safety objectively.</p>
        </div>

        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{ margin: '0 auto 1.5rem', background: 'rgba(245, 158, 11, 0.1)', width: '64px', height: '64px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
            <Award size={32} />
          </div>
          <h4 style={{ marginBottom: '0.75rem', fontSize: '1.15rem' }}>Award Winning</h4>
          <p style={{ color: 'var(--text-secondary)' }}>Recognized for technological innovation in public health and environmental monitoring.</p>
        </div>
      </div>
    </div>
  );
}
