import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { eventService, registrationService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ShieldCheck,
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  Building,
  FileText,
} from 'lucide-react';

export const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated, isStudent } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState(false);
  const [cancelling, setCancelling] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registrationId, setRegistrationId] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const fetchEventData = async () => {
      setLoading(true);
      try {
        const res = await eventService.getEventById(id);
        if (res.data.success) {
          setEvent(res.data.event);
        }

        // If authenticated student, check registration status
        if (isAuthenticated && isStudent) {
          const regRes = await registrationService.getMyRegistrations();
          if (regRes.data.success) {
            const activeReg = regRes.data.registrations.find(
              (r) => r.event?._id === id && r.status === 'registered'
            );
            if (activeReg) {
              setIsRegistered(true);
              setRegistrationId(activeReg._id);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching event details:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEventData();
  }, [id, isAuthenticated, isStudent]);

  const handleRegister = async () => {
    if (!isAuthenticated) {
      return navigate('/login', { state: { from: { pathname: `/events/${id}` } } });
    }

    setRegistering(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await registrationService.register(id);
      if (res.data.success) {
        setIsRegistered(true);
        setRegistrationId(res.data.registration._id);
        setMessage({ type: 'success', text: res.data.message });
        // Update local registered count
        setEvent((prev) => ({
          ...prev,
          registeredCount: prev.registeredCount + 1,
        }));
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to complete registration.',
      });
    } finally {
      setRegistering(false);
    }
  };

  const handleCancelRegistration = async () => {
    if (!window.confirm('Are you sure you want to cancel your seat registration for this event?')) {
      return;
    }

    setCancelling(true);
    setMessage({ type: '', text: '' });

    try {
      const res = await registrationService.cancelRegistration(registrationId);
      if (res.data.success) {
        setIsRegistered(false);
        setRegistrationId(null);
        setMessage({ type: 'success', text: res.data.message });
        setEvent((prev) => ({
          ...prev,
          registeredCount: Math.max(0, prev.registeredCount - 1),
        }));
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to cancel registration.',
      });
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-xs text-slate-500 font-medium">Loading event details...</p>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Event Not Found</h2>
        <p className="text-xs text-slate-500 mt-2 mb-6">The requested campus event may have been removed or does not exist.</p>
        <Link to="/events" className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
          Return to Events
        </Link>
      </div>
    );
  }

  const isDeadlinePassed = new Date() > new Date(event.registrationDeadline);
  const isFull = event.registeredCount >= event.capacity;
  const availableSeats = Math.max(0, event.capacity - event.registeredCount);

  const formattedEventDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const formattedDeadline = new Date(event.registrationDeadline).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Events</span>
      </button>

      {/* Main Event Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="relative h-64 md:h-80 w-full bg-slate-900">
          <img
            src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'}
            alt={event.title}
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

          <div className="absolute bottom-6 left-6 right-6">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              <span className="text-xs px-3 py-1 rounded-full font-bold uppercase tracking-wider bg-blue-600 text-white shadow-sm">
                {event.category}
              </span>
              <span className="text-xs px-3 py-1 rounded-full font-medium uppercase tracking-wider bg-white/20 backdrop-blur-md text-white border border-white/30">
                Status: {event.status}
              </span>
            </div>
            <h1 className="text-2xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Action and Alert Banner */}
        {message.text && (
          <div className={`p-4 mx-6 mt-6 rounded-2xl flex items-start space-x-3 text-xs ${
            message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
          }`}>
            {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" /> : <XCircle className="w-4 h-4 mt-0.5 shrink-0" />}
            <span>{message.text}</span>
          </div>
        )}

        {/* Content Grid */}
        <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Rules */}
          <div className="lg:col-span-2 space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">About the Event</h2>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {event.description}
              </p>
            </div>

            {event.rules && (
              <div>
                <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Rules & Guidelines</span>
                </h2>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-600 leading-relaxed whitespace-pre-line">
                  {event.rules}
                </div>
              </div>
            )}

            <div>
              <h2 className="text-base font-bold text-slate-900 mb-2">Eligibility</h2>
              <p className="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                {event.eligibility || 'Open to all registered campus students across all academic streams.'}
              </p>
            </div>

            {/* Coordinator Contact Card */}
            {event.coordinator && (
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                  Faculty Event Coordinator
                </h3>
                <div className="bg-blue-50/50 p-4 rounded-2xl border border-blue-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">{event.coordinator.name}</h4>
                    <p className="text-xs text-slate-500 flex items-center space-x-1 mt-0.5">
                      <Building className="w-3.5 h-3.5 text-blue-600" />
                      <span>{event.coordinator.department}</span>
                    </p>
                  </div>
                  <div className="text-right text-xs text-slate-600 space-y-1">
                    <div className="flex items-center space-x-1">
                      <Mail className="w-3.5 h-3.5 text-blue-600" />
                      <span>{event.coordinator.email}</span>
                    </div>
                    {event.coordinatorContact && (
                      <div className="flex items-center space-x-1">
                        <Phone className="w-3.5 h-3.5 text-blue-600" />
                        <span>{event.coordinatorContact}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Schedule Card & Registration Action */}
          <div className="space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="font-bold text-sm text-slate-900 border-b border-slate-200 pb-2">
                Event Logistics
              </h3>

              <div className="space-y-3 text-xs text-slate-700">
                <div className="flex items-start space-x-3">
                  <Calendar className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block text-slate-800">Date</span>
                    <span>{formattedEventDate}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Clock className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block text-slate-800">Timing</span>
                    <span>{event.startTime} - {event.endTime}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-blue-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block text-slate-800">Venue</span>
                    <span>{event.venue}</span>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <div>
                    <span className="font-semibold block text-slate-800">Registration Deadline</span>
                    <span>{formattedDeadline}</span>
                  </div>
                </div>
              </div>

              {/* Live Capacity Meter */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
                  <span className="text-slate-600">Reserved Seats</span>
                  <span className="text-slate-900 font-bold">{event.registeredCount} / {event.capacity}</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-blue-600 h-full rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (event.registeredCount / event.capacity) * 100)}%` }}
                  ></div>
                </div>
                <p className="text-[11px] text-slate-500 mt-1.5 text-right font-medium">
                  {availableSeats} seats remaining
                </p>
              </div>

              {/* Dynamic Registration Trigger Box */}
              <div className="pt-2">
                {!isAuthenticated ? (
                  <button
                    onClick={() => navigate('/login', { state: { from: { pathname: `/events/${id}` } } })}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20"
                  >
                    Sign In to Register
                  </button>
                ) : !isStudent ? (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 text-center font-medium">
                    Logged in as {user.role}. Only student accounts can register for event seats.
                  </div>
                ) : isRegistered ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 font-semibold flex items-center justify-center space-x-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span>You are registered for this event!</span>
                    </div>
                    <button
                      onClick={handleCancelRegistration}
                      disabled={cancelling || isDeadlinePassed}
                      className="w-full py-2.5 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold transition disabled:opacity-50"
                    >
                      {cancelling ? 'Cancelling...' : 'Cancel Registration'}
                    </button>
                    {isDeadlinePassed && (
                      <p className="text-[10px] text-slate-400 text-center">
                        Cancellation locked: deadline has passed.
                      </p>
                    )}
                  </div>
                ) : isDeadlinePassed ? (
                  <div className="p-3 bg-slate-200 text-slate-600 rounded-xl text-xs text-center font-semibold">
                    Registration Closed (Deadline Passed)
                  </div>
                ) : isFull ? (
                  <div className="p-3 bg-amber-100 text-amber-800 rounded-xl text-xs text-center font-semibold">
                    Event is at Maximum Capacity
                  </div>
                ) : (
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-md shadow-blue-500/20 disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    <span>{registering ? 'Reserving Seat...' : 'Register for Event'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
