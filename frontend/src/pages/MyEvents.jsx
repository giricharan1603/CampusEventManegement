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
      <div className="py-20 text-center text-xs text-slate-500">
        Please <Link to="/auth" className="text-blue-600 font-bold underline">sign in</Link> to view your registrations.
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Event Registrations</h1>
        <p className="text-slate-500 text-xs mt-1">
          Student: <strong>{user.name}</strong> • Roll: <strong>{user.studentId || 'N/A'}</strong>
        </p>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
          ✓ {message}
        </div>
      )}

      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading your registrations...</div>
      ) : registrations.length > 0 ? (
        <div className="space-y-3">
          {registrations.map((reg) => {
            const evt = reg.event;
            if (!evt) return null;
            const isCancelled = reg.status === 'cancelled';

            return (
              <div
                key={reg._id}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                      {evt.category}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                        isCancelled ? 'bg-red-50 text-red-600' : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {reg.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-slate-900 mt-1">{evt.title}</h3>
                  <div className="text-xs text-slate-500 mt-1 flex flex-wrap gap-3">
                    <span>📅 {new Date(evt.date).toLocaleDateString()} ({evt.time})</span>
                    <span>📍 {evt.venue}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto">
                  <Link
                    to={`/event/${evt._id}`}
                    className="flex-1 sm:flex-initial px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold text-center"
                  >
                    View
                  </Link>
                  {!isCancelled && (
                    <button
                      onClick={() => handleCancel(reg._id)}
                      className="flex-1 sm:flex-initial px-3 py-1.5 border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-xs font-semibold text-center"
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
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-bold text-slate-700">No event registrations found</p>
          <Link to="/" className="mt-3 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
            Browse Campus Events
          </Link>
        </div>
      )}
    </div>
  );
};
