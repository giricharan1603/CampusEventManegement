import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BackgroundOrbs } from './components/BackgroundOrbs';
import { EventList } from './pages/EventList';
import { EventDetail } from './pages/EventDetail';
import { Auth } from './pages/Auth';
import { MyEvents } from './pages/MyEvents';
import { FacultyAdmin } from './pages/FacultyAdmin';

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cems_user');
      if (!saved || saved === 'undefined') return null;
      const parsed = JSON.parse(saved);
      if (parsed?._id && typeof parsed._id === 'string' && parsed._id.length > 15) {
        localStorage.removeItem('cems_user');
        return null;
      }
      return parsed;
    } catch {
      return null;
    }
  });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    localStorage.setItem('cems_user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('cems_user');
  };

  return (
    <Router>
      <div className="min-h-screen bg-[#07070a] text-slate-100 flex flex-col font-sans relative selection:bg-blue-500 selection:text-white">
        {/* 3D Orb Background layer */}
        <BackgroundOrbs />

        {/* Top Glass Navigation */}
        <div className="relative z-50">
          <Navbar user={user} onLogout={handleLogout} />
        </div>

        {/* Page Content View */}
        <main className="flex-1 relative z-10">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/event/:id" element={<EventDetail user={user} />} />
            <Route path="/auth" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/my-events" element={<MyEvents user={user} />} />
            <Route path="/manage" element={<FacultyAdmin user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Dark Glass Footer */}
        <footer className="relative z-10 border-t border-white/10 bg-black/40 backdrop-blur-md py-6 text-center text-xs text-slate-500">
          Campus Event Management System • Modern Glassmorphism Edition
        </footer>
      </div>
    </Router>
  );
}
