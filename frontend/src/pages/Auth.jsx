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
    <div className="max-w-md mx-auto py-10">
      <div className="flutter-glass p-6 sm:p-8 space-y-6">
        {/* Toggle Login vs Register */}
        <div className="flex flutter-glass-sub p-1.5 rounded-full border border-white/30">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition ${
              isLogin ? 'flutter-white-pill shadow-md' : 'text-white/80 hover:text-white font-semibold'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-full transition ${
              !isLogin ? 'flutter-white-pill shadow-md' : 'text-white/80 hover:text-white font-semibold'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-rose-500/30 border border-rose-300 text-white text-xs rounded-2xl font-bold backdrop-blur-md">
            ⚠ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isLogin && (
            <>
              <div>
                <label className="block font-bold text-white mb-1.5">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. John Doe"
                  className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
                />
              </div>

              <div>
                <label className="block font-bold text-white mb-1.5">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold [&>option]:bg-indigo-950 [&>option]:text-white"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty Coordinator</option>
                </select>
              </div>

              {role === 'student' && (
                <div>
                  <label className="block font-bold text-white mb-1.5">Student Roll Number</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="e.g. 24691A0501"
                    className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
                  />
                </div>
              )}

              <div>
                <label className="block font-bold text-white mb-1.5">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Computer Science"
                  className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-bold text-white mb-1.5">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@campus.edu"
              className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
            />
          </div>

          <div>
            <label className="block font-bold text-white mb-1.5">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 flutter-white-pill font-bold transition shadow-lg disabled:opacity-50 mt-4 text-xs"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
