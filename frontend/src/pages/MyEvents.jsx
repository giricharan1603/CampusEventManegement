import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const MyEvents = ({ user }) => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (user?._id) fetchRegistrations();
  }, [user]);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/registrations/student/${user._id}`);
      const data = await res.json();
      setRegistrations(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (regId) => {
    if (!window.confirm('Are you sure you want to cancel this registration?')) return;
    setMessage('');

    try {
      const res = await fetch(`/api/registrations/${regId}/cancel`, { method: 'PATCH' });
      const data = await res.json();
      setMessage(data.message);
      await fetchRegistrations();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user) {
    return (
      <div className="py-24 text-center glass-panel rounded-3xl max-w-md mx-auto my-12 p-8">
        <p className="text-slate-300 text-xs">
          Please <Link to="/auth" className="text-blue-400 font-bold underline">sign in</Link> to view your registrations.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">My Event Registrations</h1>
          <p className="text-slate-400 text-xs mt-1">
            Student: <strong className="text-white">{user.name}</strong> • Roll: <strong className="text-cyan-300 font-mono">{user.studentId || 'N/A'}</strong>
          </p>
        </div>
        <Link 
          to="/" 
          className="px-4 py-2 rounded-2xl glass-pill text-xs font-semibold text-slate-300 hover:text-white transition"
        >
          + Explore More Events
        </Link>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-2xl font-semibold backdrop-blur-md">
          ✓ {message}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-slate-400 glass-panel rounded-3xl">
          <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <div>Loading your registrations...</div>
        </div>
      ) : registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const evt = reg.event;
            if (!evt) return null;
            const isCancelled = reg.status === 'cancelled';

            return (
              <div
                key={reg._id}
                className="glass-panel-interactive p-5 rounded-3xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30">
                      {evt.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                        isCancelled 
                          ? 'bg-red-500/20 text-red-300 border-red-500/30' 
                          : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-white mt-2">{evt.title}</h3>
                  <div className="text-xs text-slate-400 mt-1.5 flex flex-wrap gap-4 font-medium">
                    <span>📅 {new Date(evt.date).toLocaleDateString()} ({evt.time})</span>
                    <span>📍 {evt.venue}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2.5 w-full sm:w-auto">
                  <Link
                    to={`/event/${evt._id}`}
                    className="flex-1 sm:flex-initial px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-semibold text-center transition"
                  >
                    View
                  </Link>
                  {!isCancelled && (
                    <button
                      onClick={() => handleCancel(reg._id)}
                      className="flex-1 sm:flex-initial px-4 py-2 border border-red-500/40 text-red-400 hover:bg-red-500/20 rounded-xl text-xs font-semibold text-center transition"
                    >
                      Cancel Seat
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel rounded-3xl p-8">
          <p className="text-base font-bold text-white">No event registrations found</p>
          <p className="text-xs text-slate-400 mt-1">You haven't reserved a seat for any campus events yet.</p>
          <Link 
            to="/" 
            className="mt-4 inline-block px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl text-xs font-bold shadow-lg shadow-blue-500/30 transition hover:scale-105"
          >
            Browse Campus Events
          </Link>
        </div>
      )}
    </div>
  );
};
