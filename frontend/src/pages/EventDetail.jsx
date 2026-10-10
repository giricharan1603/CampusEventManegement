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
    return <div className="py-20 text-center text-sm font-bold text-white/80">Loading event details...</div>;
  }

  if (!event) {
    return (
      <div className="py-20 text-center flutter-glass p-8 max-w-lg mx-auto">
        <h2 className="text-lg font-bold text-white">Event Not Found</h2>
        <Link to="/" className="text-xs text-amber-300 font-bold mt-3 block">← Return to Events</Link>
      </div>
    );
  }

  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const isFull = event.registeredCount >= event.capacity;
  const seatsLeft = Math.max(0, event.capacity - event.registeredCount);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Link to="/" className="text-xs font-bold text-white/80 hover:text-white transition inline-flex items-center gap-1.5 flutter-glass-pill px-4 py-1.5">
        ← Back to all events
      </Link>

      <div className="flutter-glass overflow-hidden">
        {/* Banner */}
        <div className="h-72 bg-indigo-950 relative overflow-hidden">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-indigo-950/40 to-transparent pointer-events-none" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-[10px] font-black uppercase tracking-wider px-3 py-1 flutter-white-pill shadow-md">
              {event.category}
            </span>
            <h1 className="text-2xl sm:text-4xl font-black text-white mt-3 leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <div className="mx-6 mt-6 p-3 bg-emerald-500/30 border border-emerald-300 text-white text-xs rounded-2xl font-bold backdrop-blur-md">
            ✓ {message}
          </div>
        )}
        {error && (
          <div className="mx-6 mt-6 p-3 bg-rose-500/30 border border-rose-300 text-white text-xs rounded-2xl font-bold backdrop-blur-md">
            ⚠ {error}
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-xs font-black text-white/90 uppercase tracking-wider">About This Event</h2>
            <p className="text-sm text-white/90 font-medium leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {event.coordinator && (
              <div className="pt-4 border-t border-white/20 text-xs text-white/85">
                <span className="font-bold text-white block text-sm">Faculty Coordinator:</span>
                <span className="font-medium text-white/90">{event.coordinator.name} ({event.coordinator.department})</span>
              </div>
            )}
          </div>

          {/* Right Logistics Box */}
          <div className="flutter-glass-sub p-6 space-y-4 text-xs">
            <h3 className="font-extrabold text-white text-sm border-b border-white/20 pb-2">Logistics</h3>

            <div className="space-y-3 text-white/90 font-medium">
              <div>📅 <strong className="text-white font-bold">Date:</strong> {new Date(event.date).toLocaleDateString()}</div>
              <div>⏰ <strong className="text-white font-bold">Time:</strong> {event.time}</div>
              <div>📍 <strong className="text-white font-bold">Venue:</strong> {event.venue}</div>
              <div>⏳ <strong className="text-white font-bold">Deadline:</strong> {new Date(event.registrationDeadline).toLocaleDateString()}</div>
            </div>

            <div className="pt-2 border-t border-white/20">
              <div className="flex justify-between font-bold text-white mb-1">
                <span>Seats Left:</span>
                <span className="font-mono text-amber-300 text-sm font-black">{seatsLeft} / {event.capacity}</span>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-2">
              {!user ? (
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full py-2.5 flutter-white-pill text-xs font-bold transition shadow-lg"
                >
                  Sign In to Register
                </button>
              ) : isRegistered ? (
                <div className="space-y-2">
                  <div className="p-2.5 bg-emerald-500/30 border border-emerald-300 text-white rounded-xl text-center font-bold text-xs backdrop-blur-md">
                    ✓ You are registered!
                  </div>
                  <button
                    onClick={handleCancel}
                    className="w-full py-2 flutter-glass-pill hover:bg-rose-500/30 hover:border-rose-300 rounded-xl font-bold transition text-xs"
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : isDeadlinePassed ? (
                <div className="p-2.5 bg-indigo-950/60 border border-white/20 text-white/80 rounded-xl text-center font-bold">
                  Registration Closed
                </div>
              ) : isFull ? (
                <div className="p-2.5 bg-amber-500/30 border border-amber-300 text-white rounded-xl text-center font-bold">
                  Event is Full
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  className="w-full py-2.5 flutter-white-pill text-xs font-bold transition shadow-lg"
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
