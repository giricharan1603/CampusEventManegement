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
      <div className="py-20 text-center text-xs text-white/80 flutter-glass p-8 max-w-md mx-auto">
        Please <Link to="/auth" className="text-white font-bold underline">sign in</Link> to view your registrations.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flutter-glass p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">My Event Passes</h1>
        <p className="text-white/80 text-xs mt-1.5 font-medium">
          Student: <strong className="text-white font-bold">{user.name}</strong> • Roll ID: <strong className="text-white font-bold">{user.studentId || 'N/A'}</strong>
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/30 border border-emerald-300 text-white text-xs rounded-2xl font-bold backdrop-blur-md">
          ✓ {message}
        </div>
      )}

      {loading ? (
        <div className="py-20 text-center text-xs text-white font-bold font-mono">Loading your registrations...</div>
      ) : registrations.length > 0 ? (
        <div className="space-y-4">
          {registrations.map((reg) => {
            const evt = reg.event;
            if (!evt) return null;
            const isCancelled = reg.status === 'cancelled';

            return (
              <div
                key={reg._id}
                className="flutter-glass-sub p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flutter-white-pill">
                      {evt.category}
                    </span>
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full border ${
                        isCancelled 
                          ? 'bg-rose-500/40 text-white border-rose-300' 
                          : 'bg-emerald-500/40 text-white border-emerald-300'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>

                  <h3 className="font-extrabold text-base text-white mt-2">{evt.title}</h3>
                  <div className="text-xs text-white/90 mt-1 flex flex-wrap gap-4 font-semibold">
                    <span>📅 {new Date(evt.date).toLocaleDateString()} ({evt.time})</span>
                    <span>📍 {evt.venue}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Link
                    to={`/event/${evt._id}`}
                    className="flex-1 sm:flex-initial px-4 py-2 flutter-white-pill text-xs font-bold text-center"
                  >
                    View
                  </Link>
                  {!isCancelled && (
                    <button
                      onClick={() => handleCancel(reg._id)}
                      className="flex-1 sm:flex-initial px-4 py-2 flutter-glass-pill hover:bg-rose-500/30 hover:border-rose-300 text-xs font-bold text-center transition"
                    >
                      Cancel Pass
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 flutter-glass rounded-3xl p-8">
          <p className="text-base font-bold text-white">No event passes found</p>
          <Link to="/" className="mt-4 inline-block px-6 py-2.5 flutter-white-pill text-xs font-bold shadow-lg">
            Browse Campus Events
          </Link>
        </div>
      )}
    </div>
  );
};
