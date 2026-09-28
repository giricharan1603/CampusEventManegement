import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { eventService } from '../services/api';
import { EventCard } from '../components/EventCard';
import { Search, Filter, CalendarX2 } from 'lucide-react';

export const Events = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const categoryParam = searchParams.get('category') || 'all';
  const searchParam = searchParams.get('search') || '';
  const statusParam = searchParams.get('status') || 'all';

  const [searchTerm, setSearchTerm] = useState(searchParam);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const params = {};
        if (categoryParam !== 'all') params.category = categoryParam;
        if (searchParam) params.search = searchParam;
        if (statusParam !== 'all') params.status = statusParam;

        const res = await eventService.getEvents(params);
        if (res.data.success) {
          setEvents(res.data.events);
        }
      } catch (err) {
        console.error('Error fetching events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [categoryParam, searchParam, statusParam]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (searchTerm.trim()) {
      newParams.set('search', searchTerm.trim());
    } else {
      newParams.delete('search');
    }
    setSearchParams(newParams);
  };

  const setCategoryFilter = (cat) => {
    const newParams = new URLSearchParams(searchParams);
    if (cat === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', cat);
    }
    setSearchParams(newParams);
  };

  const setStatusFilter = (stat) => {
    const newParams = new URLSearchParams(searchParams);
    if (stat === 'all') {
      newParams.delete('status');
    } else {
      newParams.set('status', stat);
    }
    setSearchParams(newParams);
  };

  const categories = [
    { label: 'All Categories', value: 'all' },
    { label: 'Technical', value: 'technical' },
    { label: 'Cultural', value: 'cultural' },
    { label: 'Sports', value: 'sports' },
    { label: 'Academic', value: 'academic' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Campus Events Catalog</h1>
        <p className="text-slate-500 text-sm mt-1">
          Explore all approved technical fests, symposiums, cultural nights, and sporting events.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <form onSubmit={handleSearchSubmit} className="w-full md:w-80 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by event title, venue..."
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5 pointer-events-none" />
        </form>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map((c) => (
            <button
              key={c.value}
              onClick={() => setCategoryFilter(c.value)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition ${
                categoryParam === c.value
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="w-full md:w-44 flex items-center space-x-2">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={statusParam}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full py-1.5 px-2.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="open">Open for Registration</option>
            <option value="upcoming">Upcoming</option>
            <option value="full">Capacity Full</option>
          </select>
        </div>
      </div>

      {/* Events Results Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-80 animate-pulse border border-slate-200 p-4 flex flex-col justify-between">
              <div className="bg-slate-200 h-40 rounded-xl mb-4"></div>
              <div className="bg-slate-200 h-4 w-3/4 rounded mb-2"></div>
              <div className="bg-slate-200 h-3 w-1/2 rounded"></div>
            </div>
          ))}
        </div>
      ) : events.length > 0 ? (
        <div>
          <div className="text-xs font-medium text-slate-500 mb-4">
            Showing <strong className="text-slate-800">{events.length}</strong> campus events
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          <CalendarX2 className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching events found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing status filters, or selecting "All Categories".
          </p>
          <button
            onClick={() => setSearchParams({})}
            className="mt-4 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-semibold transition"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
