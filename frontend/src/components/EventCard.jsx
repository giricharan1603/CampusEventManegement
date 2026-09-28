import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, ArrowRight } from 'lucide-react';

export const EventCard = ({ event }) => {
  const categoryStyles = {
    technical: 'bg-blue-50 text-blue-700 border-blue-200',
    cultural: 'bg-purple-50 text-purple-700 border-purple-200',
    sports: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    academic: 'bg-amber-50 text-amber-700 border-amber-200',
  }[event.category?.toLowerCase()] || 'bg-slate-50 text-slate-700 border-slate-200';

  const statusStyles = {
    open: 'bg-emerald-500 text-white',
    upcoming: 'bg-blue-500 text-white',
    full: 'bg-amber-500 text-white',
    closed: 'bg-slate-500 text-white',
    cancelled: 'bg-red-500 text-white',
  }[event.status] || 'bg-slate-500 text-white';

  const availableSeats = Math.max(0, event.capacity - event.registeredCount);
  const fillPercentage = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  const formattedDate = new Date(event.date).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Event Image Banner */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <img
          src={event.image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=60'}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>

        {/* Category & Status Tags */}
        <div className="absolute top-3 left-3 flex items-center space-x-2">
          <span className={`text-xs px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider border shadow-sm ${categoryStyles}`}>
            {event.category}
          </span>
        </div>
        <div className="absolute top-3 right-3">
          <span className={`text-[11px] px-2 py-0.5 rounded-full font-medium shadow-sm uppercase tracking-wider ${statusStyles}`}>
            {event.status}
          </span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-lg text-slate-900 line-clamp-1 group-hover:text-blue-600 transition">
            {event.title}
          </h3>
          <p className="text-slate-600 text-xs mt-1.5 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Key Info Details */}
          <div className="mt-4 space-y-2 text-xs text-slate-600">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate">{event.venue}</span>
            </div>
          </div>
        </div>

        {/* Footer info: capacity bar & CTA */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center space-x-1 text-slate-600">
              <Users className="w-3.5 h-3.5" />
              <span>{availableSeats} seats remaining</span>
            </div>
            <span className="font-medium text-slate-500">{event.registeredCount}/{event.capacity}</span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                fillPercentage >= 90
                  ? 'bg-rose-500'
                  : fillPercentage >= 65
                  ? 'bg-amber-500'
                  : 'bg-blue-600'
              }`}
              style={{ width: `${fillPercentage}%` }}
            ></div>
          </div>

          <Link
            to={`/events/${event._id}`}
            className="w-full py-2.5 px-4 bg-slate-900 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold flex items-center justify-center space-x-2 transition-colors duration-200"
          >
            <span>View Details & Register</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
