import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  Calendar, 
  Ticket, 
  ShieldCheck, 
  User as UserIcon, 
  Sparkles,
  Play
} from 'lucide-react';
import { Navbar } from './components/Navbar';
import { EventList } from './pages/EventList';
import { EventDetail } from './pages/EventDetail';
import { Auth } from './pages/Auth';
import { MyEvents } from './pages/MyEvents';
import { FacultyAdmin } from './pages/FacultyAdmin';

function BackgroundCurves() {
  return (
    <div className="flutter-bg-canvas">
      {/* 3D Tubular Loop ribbons simulating the exact reference image */}
      <svg className="w-full h-full absolute inset-0 opacity-90" preserveAspectRatio="xMidYMid slice" viewBox="0 0 1440 900">
        <defs>
          {/* Warm Yellow / Gold to Orange Ribbon Gradient */}
          <linearGradient id="goldRibbon" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fde047" />
            <stop offset="35%" stopColor="#f59e0b" />
            <stop offset="70%" stopColor="#ea580c" />
            <stop offset="100%" stopColor="#dc2626" />
          </linearGradient>

          {/* Electric Magenta to Cyan Ribbon Gradient */}
          <linearGradient id="magentaRibbon" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="40%" stopColor="#c084fc" />
            <stop offset="80%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#fb923c" />
          </linearGradient>

          {/* Glow filter for tubes */}
          <filter id="tubeShine" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Ambient background glow orbs */}
        <circle cx="200" cy="150" r="280" fill="#4f39f6" opacity="0.4" filter="blur(80px)" />
        <circle cx="1200" cy="300" r="320" fill="#f59e0b" opacity="0.25" filter="blur(100px)" />
        <circle cx="700" cy="650" r="350" fill="#ec4899" opacity="0.25" filter="blur(120px)" />

        {/* Loop 1: Giant Magenta / Violet Tube Loop (Top Left to Center) */}
        <path
          d="M -100,320 C 120,80 340,90 460,250 C 580,410 420,620 220,540 C 60,480 30,340 180,240 C 350,120 700,200 850,380"
          fill="none"
          stroke="url(#magentaRibbon)"
          strokeWidth="38"
          strokeLinecap="round"
          opacity="0.85"
        />

        {/* Loop 2: Vibrant Golden/Orange Torus Ring (Center Right - matches image 2) */}
        <path
          d="M 680,520 C 620,240 900,100 1120,240 C 1300,350 1280,680 1060,740 C 880,790 760,650 820,480 C 880,310 1140,280 1250,450"
          fill="none"
          stroke="url(#goldRibbon)"
          strokeWidth="48"
          strokeLinecap="round"
          filter="url(#tubeShine)"
        />

        {/* Loop 3: Foreground looping curve weaving around cards */}
        <path
          d="M 400,850 C 550,650 680,720 780,560 C 880,400 750,220 900,120"
          fill="none"
          stroke="url(#magentaRibbon)"
          strokeWidth="28"
          strokeLinecap="round"
          opacity="0.75"
        />
      </svg>
    </div>
  );
}

function LayoutShell({ user, onLogout, children }) {
  const location = useLocation();

  const navItems = [
    { to: '/', label: 'Home', icon: Home, active: location.pathname === '/' },
    ...(user && user.role === 'student' ? [
      { to: '/my-events', label: 'Passes', icon: Ticket, active: location.pathname === '/my-events' }
    ] : []),
    ...(user && (user.role === 'faculty' || user.role === 'admin') ? [
      { to: '/manage', label: 'Manage', icon: ShieldCheck, active: location.pathname === '/manage' }
    ] : []),
    { to: '/auth', label: user ? 'Account' : 'Login', icon: UserIcon, active: location.pathname === '/auth' },
  ];

  return (
    <div className="min-h-screen relative flex flex-col items-center justify-start pb-28 pt-4 sm:pt-6 px-3 sm:px-6 font-sans">
      <BackgroundCurves />

      {/* Main Container */}
      <div className="w-full max-w-6xl flex flex-col gap-6">
        {/* Floating Top Navbar */}
        <Navbar user={user} onLogout={onLogout} />

        {/* Page Content */}
        <main className="w-full">
          {children}
        </main>
      </div>
    </div>

  );
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem('cems_user');
      return saved ? JSON.parse(saved) : null;
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
      <LayoutShell user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<EventList user={user} />} />
          <Route path="/event/:id" element={<EventDetail user={user} />} />
          <Route path="/auth" element={<Auth onLoginSuccess={handleLoginSuccess} />} />
          <Route 
            path="/my-events" 
            element={user ? <MyEvents user={user} /> : <Navigate to="/auth" />} 
          />
          <Route 
            path="/manage" 
            element={
              user && (user.role === 'faculty' || user.role === 'admin') 
                ? <FacultyAdmin user={user} /> 
                : <Navigate to="/auth" />
            } 
          />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </LayoutShell>
    </Router>
  );
}
