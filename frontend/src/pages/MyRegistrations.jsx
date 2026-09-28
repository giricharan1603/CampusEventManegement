import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { registrationService } from '../services/api';
import {
  BookmarkCheck,
  Calendar,
  Clock,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';

export const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all', 'registered', 'cancelled'
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [cancellingId, setCancellingId] = useState(null);

  const fetchRegistrations = async () => {
    setLoading(true);
    try {
      const res = await registrationService.getMyRegistrations();
      if (res.data.success) {
        setRegistrations(res.data.registrations);
      }
    } catch (err) {
      console.error('Failed to load registrations:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRegistrations();
  }, []);

  const handleCancel = async (regId, eventTitle) => {
    if (!window.confirm(`Are you sure you want to cancel your seat for "${eventTitle}"?`)) {
      return;
    }

    setCancellingId(regId);
    setActionMessage({ type: '', text: '' });

    try {
      const res = await registrationService.cancelRegistration(regId);
      if (res.data.success) {
        setActionMessage({ type: 'success', text: res.data.message });
        // Refresh registrations
        await fetchRegistrations();
      }
    } catch (err) {
      setActionMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to cancel registration.',
      });
    } finally {
      setCancellingId(null);
    }
  };

  const filteredRegistrations = registrations.filter((r) => {
    if (filter === 'all') return true;
    return r.status === filter;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Registered Events</h1>
        <p className="text-slate-500 text-sm mt-1">
          Track confirmed seats, past attendance, and manage event participation.
        </p>
      </div>

      {actionMessage.text && (
        <div className={`p-4 rounded-2xl flex items-center space-x-3 text-xs ${
          actionMessage.type === 'success'
            ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
            : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {actionMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{actionMessage.text}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex space-x-2 border-b border-slate-200 pb-3">
        <button
          onClick={() => setFilter('all')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            filter === 'all'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          All ({registrations.length})
        </button>
        <button
          onClick={() => setFilter('registered')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            filter === 'registered'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Active Registrations ({registrations.filter((r) => r.status === 'registered').length})
        </button>
        <button
          onClick={() => setFilter('cancelled')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
            filter === 'cancelled'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-100'
          }`}
        >
          Cancelled ({registrations.filter((r) => r.status === 'cancelled').length})
        </button>
      </div>

      {/* Registrations List */}
      {loading ? (
        <div className="py-12 text-center text-xs text-slate-400">Loading your registrations...</div>
      ) : filteredRegistrations.length > 0 ? (
        <div className="space-y-4">
          {filteredRegistrations.map((reg) => {
            const event = reg.event;
            if (!event) return null;

            const isCancelled = reg.status === 'cancelled';
            const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
              weekday: 'short',
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });
            const regDate = new Date(reg.registeredAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <div
                key={reg._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-slate-300 transition"
              >
                <div className="space-y-2">
                  <div className="flex items-center space-x-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {event.category}
                    </span>
                    <span className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full ${
                      isCancelled ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}>
                      {reg.status}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-slate-900">{event.title}</h3>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                    <div className="flex items-center space-x-1.5">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                      <span>{formattedDate}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Clock className="w-3.5 h-3.5 text-blue-600" />
                      <span>{event.startTime} - {event.endTime}</span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <MapPin className="w-3.5 h-3.5 text-blue-600" />
                      <span>{event.venue}</span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Registered on {regDate}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 shrink-0 w-full md:w-auto">
                  <Link
                    to={`/events/${event._id}`}
                    className="flex-1 md:flex-initial px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold text-center transition"
                  >
                    View Event
                  </Link>

                  {!isCancelled && (
                    <button
                      onClick={() => handleCancel(reg._id, event.title)}
                      disabled={cancellingId === reg._id}
                      className="flex-1 md:flex-initial px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-xl text-xs font-semibold text-center transition disabled:opacity-50"
                    >
                      {cancellingId === reg._id ? 'Cancelling...' : 'Cancel Seat'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <BookmarkCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No records found</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            You don't have any event registrations matching this filter.
          </p>
          <Link
            to="/events"
            className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold inline-block"
          >
            Browse Available Events
          </Link>
        </div>
      )}
    </div>
  );
};
