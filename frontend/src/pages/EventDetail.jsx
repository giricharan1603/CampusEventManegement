import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';

export const EventDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [userRegistrationId, setUserRegistrationId] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEventAndStatus();
  }, [id, user]);

  const fetchEventAndStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/events/${id}`);
      const data = await res.json();
      setEvent(data);

      if (user && user.role === 'student') {
        const regRes = await fetch(`/api/registrations/student/${user._id}`);
        const regData = await regRes.json();
        const active = regData.find((r) => r.event?._id === id && r.status === 'registered');
        if (active) {
          setIsRegistered(true);
          setUserRegistrationId(active._id);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!user) {
      return navigate('/auth');
    }
    if (user.role !== 'student') {
      return setError('Only students can register for event participation.');
    }

    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: user._id, eventId: id }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to register.');
      } else {
        setMessage(data.message);
        setIsRegistered(true);
        setUserRegistrationId(data.registration?._id);
        setEvent((prev) => ({ ...prev, registeredCount: prev.registeredCount + 1 }));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = async () => {
    if (!userRegistrationId) return;
    if (!window.confirm('Cancel your registered seat for this event?')) return;

    setMessage('');
    setError('');

    try {
      const res = await fetch(`/api/registrations/${userRegistrationId}/cancel`, {
        method: 'PATCH',
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to cancel.');
      } else {
        setMessage(data.message);
        setIsRegistered(false);
        setUserRegistrationId(null);
        setEvent((prev) => ({ ...prev, registeredCount: Math.max(0, prev.registeredCount - 1) }));
      }
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-xs text-slate-400 glass-panel rounded-3xl max-w-xl mx-auto my-12">
        <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
        <div>Loading event details...</div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="py-20 text-center glass-panel rounded-3xl max-w-xl mx-auto my-12 p-8">
        <h2 className="text-base font-bold text-white">Event Not Found</h2>
        <Link to="/" className="text-xs text-cyan-400 mt-3 inline-block underline">← Return to Events</Link>
      </div>
    );
  }

  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const isFull = event.registeredCount >= event.capacity;
  const seatsLeft = Math.max(0, event.capacity - event.registeredCount);

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <Link to="/" className="text-xs font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1.5 transition">
        ← Back to all events
      </Link>

      <div className="glass-panel rounded-[32px] overflow-hidden shadow-2xl">
        {/* Banner */}
        <div className="h-72 bg-slate-900 relative">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-75" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 bg-blue-500/30 text-blue-200 border border-blue-400/40 rounded-full backdrop-blur-md">
              {event.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-3 leading-tight drop-shadow-md">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <div className="mx-6 sm:mx-8 mt-6 p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-2xl font-semibold backdrop-blur-md">
            ✓ {message}
          </div>
        )}
        {error && (
          <div className="mx-6 sm:mx-8 mt-6 p-3.5 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-2xl font-semibold backdrop-blur-md">
            ⚠ {error}
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">About This Event</h2>
            <p className="text-xs text-slate-200 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {event.coordinator && (
              <div className="pt-4 border-t border-white/10 text-xs text-slate-400">
                <span className="font-bold text-white block mb-1">Faculty Coordinator:</span>
                <span>{event.coordinator.name} ({event.coordinator.department})</span>
              </div>
            )}
          </div>

          {/* Right Logistics Box */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4 text-xs">
            <h3 className="font-bold text-white border-b border-white/10 pb-2.5">Logistics & Venue</h3>

            <div className="space-y-2.5 text-slate-300">
              <div>📅 <strong className="text-white">Date:</strong> {new Date(event.date).toLocaleDateString()}</div>
              <div>⏰ <strong className="text-white">Time:</strong> {event.time}</div>
              <div>📍 <strong className="text-white">Venue:</strong> {event.venue}</div>
              <div>⏳ <strong className="text-white">Deadline:</strong> {new Date(event.registrationDeadline).toLocaleDateString()}</div>
            </div>

            <div className="pt-3 border-t border-white/10">
              <div className="flex justify-between font-bold text-white mb-1">
                <span>Seats Left:</span>
                <span className="text-cyan-300 font-mono">{seatsLeft} / {event.capacity}</span>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-2">
              {!user ? (
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition shadow-lg shadow-blue-500/30 border border-blue-400/30 hover:scale-[1.02]"
                >
                  Sign In to Register
                </button>
              ) : isRegistered ? (
                <div className="space-y-2">
                  <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 rounded-2xl text-center font-bold text-xs">
                    ✓ You are registered!
                  </div>
                  <button
                    onClick={handleCancel}
                    className="w-full py-2.5 border border-red-500/40 text-red-400 hover:bg-red-500/20 rounded-2xl font-semibold transition text-xs"
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : isDeadlinePassed ? (
                <div className="p-3 bg-white/5 border border-white/10 text-slate-400 rounded-2xl text-center font-bold text-xs">
                  Registration Closed
                </div>
              ) : isFull ? (
                <div className="p-3 bg-amber-500/20 border border-amber-500/40 text-amber-300 rounded-2xl text-center font-bold text-xs">
                  Event is Full
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition shadow-lg shadow-blue-500/30 border border-blue-400/30 hover:scale-[1.02]"
                >
                  Register Now
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
