import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const FacultyAdmin = ({ user }) => {
  const [events, setEvents] = useState([]);
  const [selectedEventRoster, setSelectedEventRoster] = useState(null);
  const [rosterAttendees, setRosterAttendees] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Event Form State
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'technical',
    date: '',
    time: '10:00 AM - 04:00 PM',
    venue: '',
    registrationDeadline: '',
    capacity: 50,
  });

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/events');
      const data = await res.json();
      setEvents(data);

      if (user?.role === 'admin') {
        const uRes = await fetch('/api/auth/users');
        const uData = await uRes.json();
        setUsers(uData);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, coordinatorId: user._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create event.');

      setMessage(data.message);
      setForm({
        title: '',
        description: '',
        category: 'technical',
        date: '',
        time: '10:00 AM - 04:00 PM',
        venue: '',
        registrationDeadline: '',
        capacity: 50,
      });
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Delete event "${title}"?`)) return;
    try {
      const res = await fetch(`/api/events/${id}`, { method: 'DELETE' });
      const data = await res.json();
      setMessage(data.message);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleViewRoster = async (event) => {
    setSelectedEventRoster(event);
    try {
      const res = await fetch(`/api/registrations/event/${event._id}`);
      const data = await res.json();
      setRosterAttendees(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRoleChange = async (userId, role) => {
    try {
      await fetch(`/api/auth/users/${userId}/role`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
      });
      await loadData();
    } catch (err) {
      console.error(err);
    }
  };

  if (!user || (user.role !== 'faculty' && user.role !== 'admin')) {
    return (
      <div className="py-24 text-center glass-panel rounded-3xl max-w-md mx-auto my-12 p-8">
        <p className="text-slate-300 text-xs">
          Access restricted to faculty coordinators and system administrators.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-[32px] flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30">
            {user.role} Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            {user.name}'s Management Portal
          </h1>
          <p className="text-xs text-slate-400 mt-1">{user.department}</p>
        </div>
      </div>

      {message && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs rounded-2xl font-semibold backdrop-blur-md">
          ✓ {message}
        </div>
      )}
      {error && (
        <div className="p-3.5 bg-red-500/20 border border-red-500/40 text-red-300 text-xs rounded-2xl font-semibold backdrop-blur-md">
          ⚠ {error}
        </div>
      )}

      {/* Grid: Create Event Form & Master Events Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Event Form */}
        <div className="glass-panel p-6 sm:p-7 rounded-[32px] space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Publish New Event
          </h2>

          <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-300 mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Robotics Symposium"
                className="glass-input w-full px-3.5 py-2.5 rounded-2xl outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="glass-input w-full px-3.5 py-2.5 rounded-2xl outline-none"
                >
                  <option value="technical">Technical</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="academic">Academic</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">Capacity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="glass-input w-full px-3.5 py-2.5 rounded-2xl outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-300 mb-1">Description *</label>
              <textarea
                rows="2"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief event details and rules..."
                className="glass-input w-full px-3.5 py-2.5 rounded-2xl outline-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Event Date *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="glass-input w-full px-3.5 py-2.5 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Time *</label>
                <input
                  type="text"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="10:00 AM"
                  className="glass-input w-full px-3.5 py-2.5 rounded-2xl outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Venue *</label>
                <input
                  type="text"
                  required
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  placeholder="Auditorium"
                  className="glass-input w-full px-3.5 py-2.5 rounded-2xl outline-none"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-300 mb-1">Deadline *</label>
                <input
                  type="date"
                  required
                  value={form.registrationDeadline}
                  onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })}
                  className="glass-input w-full px-3.5 py-2.5 rounded-2xl outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold transition shadow-lg shadow-blue-500/30 border border-blue-400/30 hover:scale-[1.01] mt-2"
            >
              Publish Event
            </button>
          </form>
        </div>

        {/* Master Events Table */}
        <div className="lg:col-span-2 glass-panel rounded-[32px] p-6 sm:p-7 space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Managed Campus Events ({events.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3">Title</th>
                  <th className="py-3">Date</th>
                  <th className="py-3">Signups</th>
                  <th className="py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-white/5 transition">
                    <td className="py-3 font-bold text-white">
                      {evt.title}
                      <span className="block text-[10px] text-cyan-300 font-normal uppercase">{evt.category}</span>
                    </td>
                    <td className="py-3 text-slate-400">
                      {new Date(evt.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-semibold text-slate-200">
                      {evt.registeredCount} / {evt.capacity}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleViewRoster(evt)}
                        className="px-3 py-1 bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 border border-blue-400/30 rounded-xl font-semibold transition"
                      >
                        Roster
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt._id, evt.title)}
                        className="px-3 py-1 bg-red-500/20 text-red-300 hover:bg-red-500/30 border border-red-500/30 rounded-xl font-semibold transition"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Attendee Roster Modal / Section */}
      {selectedEventRoster && (
        <div className="glass-panel p-6 sm:p-8 rounded-[32px] border border-cyan-400/30 shadow-2xl space-y-4">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <div>
              <h3 className="font-bold text-base text-white">
                Participant Roster: {selectedEventRoster.title}
              </h3>
              <p className="text-xs text-slate-400">
                Total Registered: <strong className="text-cyan-300">{rosterAttendees.length}</strong> students
              </p>
            </div>
            <button
              onClick={() => setSelectedEventRoster(null)}
              className="text-xs text-slate-400 hover:text-white font-bold px-3 py-1 rounded-xl bg-white/5"
            >
              ✕ Close Roster
            </button>
          </div>

          {rosterAttendees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/10 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2.5">Student Name</th>
                    <th className="py-2.5">Roll Number</th>
                    <th className="py-2.5">Department</th>
                    <th className="py-2.5">Email</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {rosterAttendees.map((a) => (
                    <tr key={a._id} className="hover:bg-white/5 transition">
                      <td className="py-2.5 font-bold text-white">{a.student?.name}</td>
                      <td className="py-2.5 font-mono text-cyan-300">{a.student?.studentId || '—'}</td>
                      <td className="py-2.5 text-slate-300">{a.student?.department}</td>
                      <td className="py-2.5 text-slate-400">{a.student?.email}</td>
                      <td className="py-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-6 text-center">No students registered yet for this event.</p>
          )}
        </div>
      )}

      {/* Admin User Management Section */}
      {user.role === 'admin' && (
        <div className="glass-panel p-6 sm:p-8 rounded-[32px] space-y-4">
          <h2 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Admin: User Directory & Role Assignment ({users.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/10 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5">Name</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Department</th>
                  <th className="py-2.5">Current Role</th>
                  <th className="py-2.5 text-right">Switch Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/5 transition">
                    <td className="py-2.5 font-bold text-white">{u.name}</td>
                    <td className="py-2.5 text-slate-400">{u.email}</td>
                    <td className="py-2.5 text-slate-300">{u.department}</td>
                    <td className="py-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/10 text-slate-200 border border-white/10">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="glass-input px-3 py-1 rounded-xl text-xs outline-none"
                      >
                        <option value="student">student</option>
                        <option value="faculty">faculty</option>
                        <option value="admin">admin</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
