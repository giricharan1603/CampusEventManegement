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

      // If student is logged in, check if they already registered
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
    return <div className="py-20 text-center text-xs text-slate-400">Loading event details...</div>;
  }

  if (!event) {
    return (
      <div className="py-20 text-center">
        <h2 className="text-base font-bold text-slate-800">Event Not Found</h2>
        <Link to="/" className="text-xs text-blue-600 mt-2 block">← Return to Events</Link>
      </div>
    );
  }

  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const isFull = event.registeredCount >= event.capacity;
  const seatsLeft = Math.max(0, event.capacity - event.registeredCount);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      <Link to="/" className="text-xs font-semibold text-slate-500 hover:text-slate-800">
        ← Back to all events
      </Link>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Banner */}
        <div className="h-64 bg-slate-900 relative">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-85" />
          <div className="absolute bottom-5 left-6 right-6">
            <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 bg-blue-600 text-white rounded-full">
              {event.category}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white mt-2 leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Alerts */}
        {message && (
          <div className="mx-6 mt-6 p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
            ✓ {message}
          </div>
        )}
        {error && (
          <div className="mx-6 mt-6 p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-semibold">
            ⚠ {error}
          </div>
        )}

        {/* Content */}
        <div className="p-6 sm:p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">About This Event</h2>
            <p className="text-xs text-slate-600 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>

            {event.coordinator && (
              <div className="pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span className="font-bold text-slate-700 block">Faculty Coordinator:</span>
                <span>{event.coordinator.name} ({event.coordinator.department})</span>
              </div>
            )}
          </div>

          {/* Right Logistics Box */}
          <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="font-bold text-slate-900 border-b border-slate-200 pb-2">Logistics</h3>

            <div className="space-y-2 text-slate-600">
              <div>📅 <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</div>
              <div>⏰ <strong>Time:</strong> {event.time}</div>
              <div>📍 <strong>Venue:</strong> {event.venue}</div>
              <div>⏳ <strong>Deadline:</strong> {new Date(event.registrationDeadline).toLocaleDateString()}</div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <div className="flex justify-between font-bold text-slate-700 mb-1">
                <span>Seats Left:</span>
                <span>{seatsLeft} / {event.capacity}</span>
              </div>
            </div>

            {/* Action Trigger */}
            <div className="pt-2">
              {!user ? (
                <button
                  onClick={() => navigate('/auth')}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-sm"
                >
                  Sign In to Register
                </button>
              ) : isRegistered ? (
                <div className="space-y-2">
                  <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl text-center font-bold text-[11px]">
                    ✓ You are registered!
                  </div>
                  <button
                    onClick={handleCancel}
                    className="w-full py-2 border border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-semibold transition"
                  >
                    Cancel Registration
                  </button>
                </div>
              ) : isDeadlinePassed ? (
                <div className="p-2.5 bg-slate-200 text-slate-600 rounded-xl text-center font-bold">
                  Registration Closed
                </div>
              ) : isFull ? (
                <div className="p-2.5 bg-amber-100 text-amber-800 rounded-xl text-center font-bold">
                  Event is Full
                </div>
              ) : (
                <button
                  onClick={handleRegister}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-sm"
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
