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

  const fillDemo = (demoEmail) => {
    setIsLogin(true);
    setEmail(demoEmail);
    setPassword('Password@123');
    setError('');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {/* Toggle Login vs Register */}
        <div className="flex bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => { setIsLogin(true); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setIsLogin(false); setError(''); }}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition ${
              !isLogin ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Demo Fill Quick Buttons 
        <div className="p-3 bg-blue-50/60 rounded-2xl border border-blue-100 text-xs">
          <span className="font-bold text-blue-900 block mb-1.5 text-[11px]">
            ⚡ 1-Click Demo Fill (Password: Password@123)
          </span>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemo('student@campus.edu')}
              className="py-1 bg-white hover:bg-blue-100 text-blue-700 rounded-lg border border-blue-200 font-semibold text-[11px]"
            >
              Student
            </button>
            <button
              type="button"
              onClick={() => fillDemo('faculty@campus.edu')}
              className="py-1 bg-white hover:bg-amber-100 text-amber-800 rounded-lg border border-amber-200 font-semibold text-[11px]"
            >
              Faculty
            </button>
            <button
              type="button"
              onClick={() => fillDemo('admin@campus.edu')}
              className="py-1 bg-white hover:bg-rose-100 text-rose-800 rounded-lg border border-rose-200 font-semibold text-[11px]"
            >
              Admin
            </button>
          </div>
        </div>
        */}

        {/* Alerts */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
            ⚠ {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {!isLogin && (
            <>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="giri charan"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="student">Student</option>
                  <option value="faculty">Faculty Coordinator</option>
                </select>
              </div>

              {role === 'student' && (
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Student Roll Number</label>
                  <input
                    type="text"
                    required
                    value={studentId}
                    onChange={(e) => setStudentId(e.target.value)}
                    placeholder="24691a05XX"
                    className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              )}

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Department</label>
                <input
                  type="text"
                  required
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  placeholder="Computer Science"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tudent@mits.com"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-sm disabled:opacity-50 mt-2"
          >
            {loading ? 'Processing...' : isLogin ? 'Sign In' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
};
