import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, User as UserIcon, Sparkles } from 'lucide-react';

export const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <header className="flutter-glass px-6 py-3.5 flex items-center justify-between gap-4">
      {/* Brand & Page Identity */}
      <div className="flex items-center space-x-6">
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-400 via-orange-500 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-md border border-white/40 group-hover:scale-105 transition-transform">
            ⚡
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white tracking-tight text-lg leading-none">
                Campus Portal
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white border border-white/30 backdrop-blur-md">
                Active
              </span>
            </div>
            <span className="text-[11px] text-white/80 font-medium">
              Event Hub & Registrations
            </span>
          </div>
        </Link>

        {/* Navigation Links in Header */}
        <nav className="flex items-center space-x-1 sm:space-x-2">
          <Link
            to="/"
            className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white/90 hover:text-white hover:bg-white/10 transition"
          >
            Events
          </Link>
          {user && user.role === 'student' && (
            <Link
              to="/my-events"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white/90 hover:text-white hover:bg-white/10 transition"
            >
              My Passes
            </Link>
          )}
          {user && (user.role === 'faculty' || user.role === 'admin') && (
            <Link
              to="/manage"
              className="px-3.5 py-1.5 rounded-full text-xs font-bold text-white/90 hover:text-white hover:bg-white/10 transition"
            >
              Manage Events
            </Link>
          )}
        </nav>
      </div>

      {/* Right Controls: Notification & Profile Widget */}
      <div className="flex items-center space-x-3 text-xs">
        {/* Notification Bell */}
        {/* <button 
          className="w-10 h-10 rounded-full flutter-glass-sub flex items-center justify-center text-white hover:text-white transition relative"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="w-2 h-2 rounded-full bg-amber-400 absolute top-2.5 right-2.5 ring-2 ring-indigo-900" />
        </button> */}

        {user ? (
          <div className="flex items-center space-x-3 pl-2 border-l border-white/20">
            {/* User Avatar Circle */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-yellow-300 to-amber-500 flex items-center justify-center text-indigo-950 font-black text-sm shadow-md border border-white/50">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </div>

            <div className="hidden sm:block text-left">
              <span className="block font-bold text-white leading-tight text-xs">{user.name}</span>
              {/* <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/20 text-white/90 border border-white/30 font-mono uppercase font-bold">
                {user.role}
              </span> */}
            </div>

            <button
              onClick={() => {
                onLogout();
                navigate('/auth');
              }}
              className="flutter-glass-pill px-4 py-2 hover:bg-rose-500/30 hover:border-rose-300 font-bold"
            >
              Logout
            </button>
          </div>
        ) : (
          <Link
            to="/auth"
            className="flutter-white-pill px-5 py-2.5 text-xs font-bold shadow-md"
          >
            Sign In
          </Link>
        )}
      </div>
    </header>
  );
};
