import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const EventList = () => {
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

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Hero Welcome with Glass Accent */}
      <div className="text-center py-6 relative">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 border border-white/15 text-[11px] font-semibold text-cyan-300 tracking-wider uppercase mb-4 backdrop-blur-md shadow-inner">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          Campus Hub
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight drop-shadow-md">
          Discover Campus Activities
        </h1>
        <p className="text-slate-400 text-sm mt-3 max-w-xl mx-auto leading-relaxed">
          Explore upcoming technical hackathons, cultural festivals, sports tournaments, and symposiums.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="glass-panel p-4 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events, locations..."
            className="glass-input w-full px-4 py-2.5 rounded-2xl text-xs placeholder:text-slate-500 outline-none"
          />
          <span className="absolute right-3.5 top-2.5 text-slate-400 text-xs">🔍</span>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          {['all', 'technical', 'cultural', 'sports', 'academic'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-2xl text-xs font-semibold capitalize transition ${
                category === cat
                  ? 'glass-pill-active text-white'
                  : 'glass-pill text-slate-300 hover:text-white hover:bg-white/10'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-24 text-center text-xs text-slate-400 glass-panel rounded-3xl">
          <div className="inline-block w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
          <div>Loading campus events...</div>
        </div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const seatsLeft = Math.max(0, evt.capacity - evt.registeredCount);
            const isFull = seatsLeft === 0;

            const categoryColors = {
              technical: 'bg-blue-500/20 text-blue-300 border-blue-400/40',
              cultural: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
              sports: 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40',
              academic: 'bg-amber-500/20 text-amber-300 border-amber-400/40',
            }[evt.category] || 'bg-slate-500/20 text-slate-300 border-slate-400/40';

            return (
              <div
                key={evt._id}
                className="glass-panel-interactive rounded-3xl overflow-hidden flex flex-col justify-between group"
              >
                <div>
                  <div className="h-48 w-full relative overflow-hidden bg-slate-900/60">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full border backdrop-blur-md shadow-lg ${categoryColors}`}
                    >
                      {evt.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="font-bold text-base text-white group-hover:text-blue-300 transition line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="pt-2 text-xs text-slate-300 space-y-1.5 border-t border-white/5 font-medium">
                      <div className="flex items-center gap-2">
                        <span>📅</span>
                        <span>{new Date(evt.date).toLocaleDateString()} • {evt.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📍</span>
                        <span>{evt.venue}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex justify-between items-center text-xs text-slate-300 mb-3 font-semibold">
                    <span className={seatsLeft < 10 ? 'text-amber-400' : 'text-slate-300'}>
                      {seatsLeft} seats remaining
                    </span>
                    <span className="text-slate-400 font-mono">{evt.registeredCount}/{evt.capacity}</span>
                  </div>

                  <Link
                    to={`/event/${evt._id}`}
                    className={`w-full py-3 rounded-2xl text-xs font-bold text-center block transition shadow-lg ${
                      isFull
                        ? 'bg-amber-500/20 border border-amber-400/30 text-amber-300 pointer-events-none'
                        : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white border border-blue-400/30 hover:scale-[1.01]'
                    }`}
                  >
                    {isFull ? 'Event is Full' : 'View Details & Register'}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-20 glass-panel rounded-3xl p-8">
          <p className="text-base font-bold text-white">No events found</p>
          <p className="text-xs text-slate-400 mt-2">Try selecting another category or resetting the search query.</p>
        </div>
      )}
    </div>
  );
};
