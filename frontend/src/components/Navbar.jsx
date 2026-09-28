import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export const Navbar = ({ user, onLogout }) => {
  const navigate = useNavigate();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-black text-lg shadow-sm">
            C
          </div>
          <div>
            <span className="font-extrabold text-slate-900 tracking-tight block text-base leading-none">
              Campus Events
            </span>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wider uppercase">
              Student Portal
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-4 text-xs font-semibold">
          <Link to="/" className="text-slate-600 hover:text-blue-600 transition">
            All Events
          </Link>

          {user && user.role === 'student' && (
            <Link to="/my-events" className="text-slate-600 hover:text-blue-600 transition">
              My Registrations
            </Link>
          )}

          {user && (user.role === 'faculty' || user.role === 'admin') && (
            <Link to="/manage" className="text-slate-600 hover:text-blue-600 transition">
              Faculty / Admin Portal
            </Link>
          )}

          {user ? (
            <div className="flex items-center space-x-3 pl-2 border-l border-slate-200">
              <div className="text-right">
                <span className="block font-bold text-slate-800">{user.name}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-100 text-blue-800 font-mono uppercase">
                  {user.role}
                </span>
              </div>
              <button
                onClick={() => {
                  onLogout();
                  navigate('/auth');
                }}
                className="px-3 py-1.5 border border-slate-200 hover:bg-red-50 hover:text-red-600 rounded-lg transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};
