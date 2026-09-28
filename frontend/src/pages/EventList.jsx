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
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Welcome */}
      <div className="text-center py-6">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Discover Campus Activities
        </h1>
        <p className="text-slate-500 text-sm mt-2 max-w-xl mx-auto">
          Explore upcoming technical hackathons, cultural festivals, sports tournaments, and symposiums.
        </p>
      </div>

      {/* Search & Category Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3.5 rounded-2xl border border-slate-200 shadow-sm">
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by event title, location..."
          className="w-full sm:w-72 px-3 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
          {['all', 'technical', 'cultural', 'sports', 'academic'].map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition ${
                category === cat
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Events Grid */}
      {loading ? (
        <div className="py-16 text-center text-xs text-slate-400">Loading campus events...</div>
      ) : filteredEvents.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt) => {
            const seatsLeft = Math.max(0, evt.capacity - evt.registeredCount);
            const isFull = seatsLeft === 0;

            const categoryColors = {
              technical: 'bg-blue-50 text-blue-700 border-blue-200',
              cultural: 'bg-purple-50 text-purple-700 border-purple-200',
              sports: 'bg-emerald-50 text-emerald-700 border-emerald-200',
              academic: 'bg-amber-50 text-amber-700 border-amber-200',
            }[evt.category] || 'bg-slate-50 text-slate-700';

            return (
              <div
                key={evt._id}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition overflow-hidden flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 w-full bg-slate-100 relative overflow-hidden">
                    <img
                      src={evt.image}
                      alt={evt.title}
                      className="w-full h-full object-cover"
                    />
                    <span
                      className={`absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shadow-sm ${categoryColors}`}
                    >
                      {evt.category}
                    </span>
                  </div>

                  <div className="p-5 space-y-2">
                    <h3 className="font-bold text-base text-slate-900 line-clamp-1">
                      {evt.title}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {evt.description}
                    </p>

                    <div className="pt-2 text-xs text-slate-600 space-y-1">
                      <div>📅 {new Date(evt.date).toLocaleDateString()} • {evt.time}</div>
                      <div>📍 {evt.venue}</div>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <div className="flex justify-between items-center text-xs text-slate-500 mb-2">
                    <span>{seatsLeft} seats remaining</span>
                    <span>{evt.registeredCount}/{evt.capacity}</span>
                  </div>

                  <Link
                    to={`/event/${evt._id}`}
                    className={`w-full py-2.5 rounded-xl text-xs font-bold text-center block transition ${
                      isFull
                        ? 'bg-amber-100 text-amber-800 pointer-events-none'
                        : 'bg-slate-900 hover:bg-blue-600 text-white'
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
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 p-8">
          <p className="text-sm font-bold text-slate-800">No events found</p>
          <p className="text-xs text-slate-500 mt-1">Try selecting "All" or clearing the search box.</p>
        </div>
      )}
    </div>
  );
};
