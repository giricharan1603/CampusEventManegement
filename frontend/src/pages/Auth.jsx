import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const Auth = ({ onLoginSuccess }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('student');
  const [department, setDepartment] = useState('Computer Science');
  const [studentId, setStudentId] = useState('');

  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login Request
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Login failed.');

        onLoginSuccess(data.user);
        navigate(data.user.role === 'student' ? '/my-events' : '/manage');
      } else {
        // Register Request
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password, role, department, studentId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Registration failed.');

        onLoginSuccess(data.user);
        navigate(data.user.role === 'student' ? '/my-events' : '/manage');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="glass-panel p-8 sm:p-10 rounded-[32px] space-y-6 shadow-2xl relative">
        {/* Decorative Top Accent Tag */}
        <div className="flex justify-between items-center mb-2">
          <div className="text-left">
            <h2 className="text-2xl font-black text-white tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isLogin ? 'Enter your credentials to access your portal' : 'Join the campus event management network'}
            </p>
          </div>
          <span className="glass-pill px-3 py-1 text-[10px] font-mono text-cyan-300 uppercase tracking-widest">
            SECURE
          </span>
        </div>

        {/* Toggle Login vs Register */}
        <div className="flex bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              isLogin 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              !isLogin 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3.5 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-2xl font-medium backdrop-blur-md">
            ⚠ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLogin && (
            <>
              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="glass-input w-full px-4 py-2.5 rounded-2xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="glass-input w-full px-4 py-2.5 rounded-2xl outline-none"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty Coordinator</option>
                </select>
              </div>

              {role === 'student' && (
                <div>
                  <label className="block font-semibold text-slate-300 mb-1.5">Student Roll Number</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="24691A05XX"
                    className="glass-input w-full px-4 py-2.5 rounded-2xl outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-300 mb-1.5">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Computer Science"
                  className="glass-input w-full px-4 py-2.5 rounded-2xl outline-none"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@campus.edu"
              className="glass-input w-full px-4 py-2.5 rounded-2xl outline-none"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="glass-input w-full px-4 py-2.5 rounded-2xl outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 hover:opacity-95 text-white font-bold rounded-2xl transition shadow-xl shadow-blue-500/25 border border-white/20 disabled:opacity-50 mt-4 hover:scale-[1.01]"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
