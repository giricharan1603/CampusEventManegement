import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { registrationService, eventService } from '../services/api';
import {
  BookmarkCheck,
  Calendar,
  Compass,
  Clock,
  MapPin,
  CheckCircle2,
  ArrowRight,
  User,
  GraduationCap,
} from 'lucide-react';

export const StudentDashboard = () => {
  const { user } = useAuth();
  const [registrations, setRegistrations] = useState([]);
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [regRes, eventRes] = await Promise.all([
          registrationService.getMyRegistrations(),
          eventService.getEvents({ upcoming: 'true' }),
        ]);

        if (regRes.data.success) {
          setRegistrations(regRes.data.registrations);
        }
        if (eventRes.data.success) {
          setUpcomingEvents(eventRes.data.events.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  const activeRegistrations = registrations.filter((r) => r.status === 'registered');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Student Welcome Banner */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-lg shadow-blue-900/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center space-x-2 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-1">
            <GraduationCap className="w-4 h-4" />
            <span>Student Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {user?.name}!
          </h1>
          <p className="text-xs sm:text-sm text-blue-100 mt-1">
            Student ID: <strong>{user?.studentId || 'N/A'}</strong> • {user?.department} • Year {user?.year}
          </p>
        </div>

        <Link
          to="/events"
          className="px-4 py-2.5 bg-white text-blue-700 rounded-xl text-xs font-bold shadow-sm hover:bg-blue-50 transition flex items-center space-x-2 shrink-0"
        >
          <Compass className="w-4 h-4" />
          <span>Discover New Events</span>
        </Link>
      </div>

      {/* KPI Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <BookmarkCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{activeRegistrations.length}</span>
            <p className="text-xs text-slate-500 font-medium">Active Event Registrations</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">{registrations.length}</span>
            <p className="text-xs text-slate-500 font-medium">Total Lifetime Registrations</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4 sm:col-span-2 lg:col-span-1">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-2xl font-extrabold text-slate-900">Good</span>
            <p className="text-xs text-slate-500 font-medium">Academic Eligibility Standing</p>
          </div>
        </div>
      </div>

      {/* Main Grid: My Active Registrations & Recommended Events */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Active Registrations */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">My Active Registrations</h2>
              <p className="text-xs text-slate-500">Upcoming events where you have a confirmed seat</p>
            </div>
            <Link
              to="/student/registrations"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
            >
              <span>View History</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="py-8 text-center text-xs text-slate-400">Loading registrations...</div>
          ) : activeRegistrations.length > 0 ? (
            <div className="space-y-3">
              {activeRegistrations.map((reg) => {
                const event = reg.event;
                if (!event) return null;
                const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                });

                return (
                  <div
                    key={reg._id}
                    className="p-4 rounded-xl border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition flex flex-col sm:flex-row justify-between sm:items-center gap-3"
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                          {event.category}
                        </span>
                        <h3 className="font-bold text-sm text-slate-900">{event.title}</h3>
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3.5 h-3.5 text-blue-600" />
                          <span>{formattedDate}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>{event.startTime}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3.5 h-3.5 text-blue-600" />
                          <span className="truncate max-w-[150px]">{event.venue}</span>
                        </div>
                      </div>
                    </div>

                    <Link
                      to={`/events/${event._id}`}
                      className="px-3 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-blue-600 rounded-lg text-xs font-semibold shadow-sm text-center shrink-0"
                    >
                      View Details
                    </Link>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-10">
              <BookmarkCheck className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-xs font-semibold text-slate-700">No active registrations yet</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">Discover exciting events across campus and reserve your spot.</p>
              <Link
                to="/events"
                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold inline-block"
              >
                Browse Events Catalog
              </Link>
            </div>
          )}
        </div>

        {/* Right: Recommended Upcoming */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="border-b border-slate-100 pb-4">
            <h2 className="text-base font-bold text-slate-900">Recommended For You</h2>
            <p className="text-xs text-slate-500">Upcoming events open for registration</p>
          </div>

          <div className="space-y-3">
            {upcomingEvents.map((evt) => (
              <Link
                key={evt._id}
                to={`/events/${evt._id}`}
                className="block p-3 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/30 transition group"
              >
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                  {evt.category}
                </span>
                <h4 className="font-bold text-xs text-slate-900 group-hover:text-blue-600 transition line-clamp-1 mt-0.5">
                  {evt.title}
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 flex items-center space-x-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(evt.date).toLocaleDateString()}</span>
                  <span>•</span>
                  <span>{evt.capacity - evt.registeredCount} spots left</span>
                </p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
