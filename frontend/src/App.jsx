import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
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
      // If legacy MongoDB 24-char ObjectId is found, clear it so user starts clean with PostgreSQL
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
      <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
        <Navbar user={user} onLogout={handleLogout} />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<EventList />} />
            <Route path="/event/:id" element={<EventDetail user={user} />} />
            <Route path="/auth" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/my-events" element={<MyEvents user={user} />} />
            <Route path="/manage" element={<FacultyAdmin user={user} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-400">
          Campus Event Management System 
        </footer>
      </div>
    </Router>
  );
}
