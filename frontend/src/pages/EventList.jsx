import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  Users, 
  Activity, 
  Search, 
  Sparkles, 
  ArrowUpRight, 
  Flame, 
  Heart, 
  Moon, 
  Zap,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';

export const EventList = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEvents();
  }, [category]);

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const url = category === 'all' ? '/api/events' : `/api/events?category=${category}`;
      const res = await fetch(url);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Failed to load events:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEvents = events.filter((e) => {
    if (!search) return true;
    return (
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.venue.toLowerCase().includes(search.toLowerCase())
    );
  });

  const totalSeats = events.reduce((acc, curr) => acc + (curr.capacity || 0), 0);
  const totalBooked = events.reduce((acc, curr) => acc + (curr.registeredCount || 0), 0);

  const isFaculty = user && (user.role === 'faculty' || user.role === 'admin');
  const [selectedEventId, setSelectedEventId] = useState('all');

  const selectedEvent = events.find((e) => e._id === selectedEventId);

  // Compute metrics based on whether an event is selected or all
  const displaySeats = isFaculty && selectedEvent 
    ? (selectedEvent.capacity || 0) 
    : totalSeats;
  const displayBooked = isFaculty && selectedEvent 
    ? (selectedEvent.registeredCount || 0) 
    : totalBooked;

  return (
    <div className="space-y-6">
      {/* ============================================================ */}
      {/* FILTER & CATALOG SECTION                                     */}
      {/* ============================================================ */}
      <div id="events-catalog" className="pt-2 space-y-6">
        
        {/* Search & Categories Toolbar */}
        <div className="flutter-glass p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-white/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events, venues, tags..."
              className="w-full pl-10 pr-4 py-2.5 flutter-glass-input text-xs font-semibold placeholder-white/60"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            {['all', 'technical', 'cultural', 'sports', 'academic'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 text-xs capitalize transition-all ${
                  category === cat
                    ? 'flutter-white-pill scale-105'
                    : 'flutter-glass-pill'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Events Grid */}
        {loading ? (
          <div className="py-20 text-center text-sm text-white font-bold font-mono">
            Loading campus events...
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((evt) => {
              const seatsLeft = Math.max(0, evt.capacity - evt.registeredCount);
              const isFull = seatsLeft === 0;

              return (
                <div
                  key={evt._id}
                  className="flutter-glass overflow-hidden flex flex-col justify-between group hover:scale-[1.02] transition-transform duration-300"
                >
                  <div>
                    {/* Event Banner */}
                    <div className="h-44 w-full relative overflow-hidden bg-indigo-950">
                      <img
                        src={evt.image}
                        alt={evt.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-indigo-950/90 via-transparent to-transparent pointer-events-none" />
                      <span className="absolute top-3 left-3 text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full flutter-white-pill shadow-md">
                        {evt.category}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <h3 className="font-extrabold text-base text-white group-hover:text-amber-200 transition-colors line-clamp-1">
                        {evt.title}
                      </h3>
                      <p className="text-xs text-white/80 font-medium line-clamp-2 leading-relaxed">
                        {evt.description}
                      </p>

                      {/* Event Details Sub-Capsule */}
                      <div className="flutter-glass-sub p-3 text-xs text-white/90 space-y-1.5 font-semibold">
                        <div className="flex items-center gap-1.5">
                          <span>📅</span>
                          <span>{new Date(evt.date).toLocaleDateString()} • {evt.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span>📍</span>
                          <span>{evt.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Seat Meter */}
                  <div className="p-5 pt-0">
                    <div className="flex justify-between items-center text-xs text-white/90 mb-3 font-bold">
                      <span>{seatsLeft} spots open</span>
                      <span className="font-mono text-amber-300 text-sm font-black">
                        {evt.registeredCount}/{evt.capacity}
                      </span>
                    </div>

                    <Link
                      to={`/event/${evt._id}`}
                      className={`w-full py-2.5 rounded-full text-xs font-bold text-center block transition-all shadow-md ${
                        isFull
                          ? 'flutter-glass-pill opacity-60 pointer-events-none'
                          : 'flutter-white-pill hover:bg-slate-100'
                      }`}
                    >
                      {isFull ? 'Event Full' : 'View & Register'}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 flutter-glass rounded-3xl p-8">
            <p className="text-base font-bold text-white">No campus events match your criteria</p>
            <p className="text-xs text-white/70 mt-1">Try selecting "All" or clearing the search bar.</p>
          </div>
        )}
      </div>
    </div>
  );
};
