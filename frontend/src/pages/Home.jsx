import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { eventService } from '../services/api';
import { EventCard } from '../components/EventCard';
import {
  Sparkles,
  ArrowRight,
  Code2,
  Music,
  Trophy,
  GraduationCap,
  CalendarCheck,
  CheckCircle2,
  Users,
} from 'lucide-react';

export const Home = () => {
  const [featuredEvents, setFeaturedEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const res = await eventService.getEvents({ upcoming: 'true' });
        if (res.data.success) {
          setFeaturedEvents(res.data.events.slice(0, 4));
        }
      } catch (err) {
        console.error('Failed to load events:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  const categories = [
    { name: 'Technical', icon: Code2, color: 'text-blue-600 bg-blue-50 border-blue-100', query: 'technical', count: 'Hackathons, Coding, AI' },
    { name: 'Cultural', icon: Music, color: 'text-purple-600 bg-purple-50 border-purple-100', query: 'cultural', count: 'Music, Drama, Dance' },
    { name: 'Sports', icon: Trophy, color: 'text-emerald-600 bg-emerald-50 border-emerald-100', query: 'sports', count: 'Cricket, Football, Track' },
    { name: 'Academic', icon: GraduationCap, color: 'text-amber-600 bg-amber-50 border-amber-100', query: 'academic', count: 'Symposiums, Seminars' },
  ];

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-blue-50 via-white to-slate-50 py-16 md:py-24 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-100/70 border border-blue-200 text-blue-800 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Campus Event Management Portal 2026</span>
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            Discover, Register & Experience <span className="text-blue-600">College Life</span> In One Place
          </h1>

          <p className="mt-5 text-base md:text-lg text-slate-600 max-w-2xl mx-auto">
            From overnight hackathons to cultural festivals and athletic tournaments — access real-time schedules, reserve seats instantly, and manage attendance digitally.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/events"
              className="w-full sm:w-auto px-6 py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-blue-500/25 flex items-center justify-center space-x-2 transition"
            >
              <span>Explore All Events</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/register"
              className="w-full sm:w-auto px-6 py-3.5 bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm rounded-xl border border-slate-200 shadow-sm transition"
            >
              Create Account
            </Link>
          </div>

          {/* Quick Metrics Bar */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto pt-8 border-t border-slate-200/80">
            <div className="p-3 text-center">
              <span className="block text-2xl font-bold text-slate-900">100%</span>
              <span className="text-xs text-slate-500 font-medium">Digital Workflow</span>
            </div>
            <div className="p-3 text-center">
              <span className="block text-2xl font-bold text-blue-600">4 Core</span>
              <span className="text-xs text-slate-500 font-medium">Event Domains</span>
            </div>
            <div className="p-3 text-center">
              <span className="block text-2xl font-bold text-slate-900">Instant</span>
              <span className="text-xs text-slate-500 font-medium">Seat Reservation</span>
            </div>
            <div className="p-3 text-center">
              <span className="block text-2xl font-bold text-emerald-600">Real-Time</span>
              <span className="text-xs text-slate-500 font-medium">Faculty Roster Audits</span>
            </div>
          </div>
        </div>
      </section>

      {/* Domain Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Explore by Category</h2>
          <p className="text-slate-500 text-sm mt-1">Browse events aligned with your skills, creativity, and passions</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.name}
                to={`/events?category=${cat.query}`}
                className="bg-white p-5 rounded-2xl border border-slate-200 hover:border-blue-300 hover:shadow-md transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center border mb-4 ${cat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-slate-900 group-hover:text-blue-600 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
                </div>
                <div className="mt-4 flex items-center text-xs font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  <span>View Events</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Upcoming Highlights</h2>
            <p className="text-slate-500 text-sm mt-1">Events opening registrations this semester</p>
          </div>
          <Link
            to="/events"
            className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center space-x-1"
          >
            <span>See All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200 p-4 flex flex-col justify-between">
                <div className="bg-slate-200 h-40 rounded-xl mb-4"></div>
                <div className="bg-slate-200 h-4 w-3/4 rounded mb-2"></div>
                <div className="bg-slate-200 h-3 w-1/2 rounded"></div>
              </div>
            ))}
          </div>
        ) : featuredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <CalendarCheck className="w-12 h-12 text-slate-400 mx-auto mb-2" />
            <p className="text-slate-600 font-medium">No active upcoming events at the moment.</p>
          </div>
        )}
      </section>

      {/* System Features Section */}
      <section className="bg-white border-y border-slate-200 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl font-bold text-slate-900">Engineered for Academic Campuses</h2>
            <p className="text-slate-500 text-sm mt-1">
              Built with full-stack role-based architecture for student discovery and faculty logistics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center mb-4">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Guaranteed Spot Allocation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Atomic capacity locking prevents race conditions and overbooking. If an event is full, immediate transparent status feedback is displayed.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-4">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Faculty Roster Audits</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Coordinators gain real-time visibility into registered attendees, complete with student roll numbers, departments, and one-click CSV report exports.
              </p>
            </div>

            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-4">
                <CalendarCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Frictionless Cancellation</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Students can cancel their seats prior to deadlines with automatic seat recovery, instantly opening the spot for other interested peers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
