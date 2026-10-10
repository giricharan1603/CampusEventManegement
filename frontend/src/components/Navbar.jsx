import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-black/35 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 to-cyan-400 flex items-center justify-center text-white font-black text-lg shadow-lg shadow-blue-500/30 group-hover:scale-105 transition">
            C
          </div>
          <div>
            <span className="font-black text-white tracking-tight block text-base leading-none group-hover:text-blue-400 transition">
              Campus Events
            </span>
            <span className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
              Glassmorphism Portal
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4 text-xs font-medium">
          <Link 
            to="/" 
            className="text-slate-300 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-xl transition"
          >
            All Events
          </Link>

          {user && user.role === 'student' && (
            <Link 
              to="/my-events" 
              className="text-slate-300 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-xl transition"
            >
              My Registrations
            </Link>
          )}

          {user && (user.role === 'faculty' || user.role === 'admin') && (
            <Link 
              to="/manage" 
              className="text-slate-300 hover:text-white hover:bg-white/5 px-3 py-1.5 rounded-xl transition"
            >
              Faculty / Admin Portal
            </Link>
          )}

          {user ? (
            <div className="flex items-center space-x-3 pl-3 border-l border-white/10">
              <div className="text-right">
                <span className="block font-bold text-white text-xs">{user.name}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-mono uppercase">
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  navigate('/auth');
                }}
                className="px-3 py-1.5 border border-white/15 bg-white/5 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/40 text-slate-300 rounded-xl transition text-xs font-semibold"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-xl shadow-lg shadow-blue-500/25 border border-blue-400/30 hover:scale-[1.02] transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
