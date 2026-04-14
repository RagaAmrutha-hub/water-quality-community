import React from 'react';
import { Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from './context/AuthContext';
import { Droplet, LayoutDashboard, Activity, BarChart2, MessageSquare, Info, Phone, LogOut } from 'lucide-react';

// Automatically detect if we are on localhost or a deployed build
axios.defaults.baseURL = import.meta.env.VITE_API_URL || '';

import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import WaterInput from './pages/WaterInput';
import Graphs from './pages/Graphs';
import Complaints from './pages/Complaints';
import About from './pages/About';
import Contact from './pages/Contact';

const ProtectedLayout = ({ children }) => {
  const { logout, user } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/water-input', label: 'Water Input', icon: Activity },
    { path: '/graphs', label: 'Graphs', icon: BarChart2 },
    { path: '/complaints', label: 'Complaints', icon: MessageSquare },
    { path: '/about', label: 'About Us', icon: Info },
    { path: '/contact', label: 'Contact', icon: Phone },
  ];

  return (
    <div className="app-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Droplet color="var(--primary-blue)" />
          <span>AB Community</span>
        </div>
        
        <div style={{ padding: '1rem 1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Welcome, <br/>
          <strong style={{ color: 'white' }}>{user?.name}</strong>
        </div>

        <nav className="nav-links">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{ padding: '1rem' }}>
          <button 
            onClick={() => logout()} 
            className="btn btn-outline"
            style={{ width: '100%', color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
          >
            <LogOut size={16} style={{ marginRight: '0.5rem' }} />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="topbar">
          <h2 style={{ fontSize: '1.25rem', marginBottom: 0 }}>
            {navItems.find(item => item.path === location.pathname)?.label || 'Portal'}
          </h2>
          <div>
            <span className="badge badge-safe">System Online</span>
          </div>
        </header>

        <div className="page-content">
          {children}
        </div>
      </main>
    </div>
  );
};

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? <ProtectedLayout>{children}</ProtectedLayout> : <Navigate to="/login" />;
};

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/water-input" element={<PrivateRoute><WaterInput /></PrivateRoute>} />
      <Route path="/graphs" element={<PrivateRoute><Graphs /></PrivateRoute>} />
      <Route path="/complaints" element={<PrivateRoute><Complaints /></PrivateRoute>} />
      <Route path="/about" element={<PrivateRoute><About /></PrivateRoute>} />
      <Route path="/contact" element={<PrivateRoute><Contact /></PrivateRoute>} />
      
      {/* Fallback */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
    </Routes>
  );
}

export default App;
