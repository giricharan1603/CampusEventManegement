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
      <div className="py-20 text-center text-xs text-slate-500">
        Access restricted to faculty coordinators and system administrators.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row justify-between sm:items-center gap-2">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800">
            {user.role} Dashboard
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            {user.name}'s Management Portal
          </h1>
          <p className="text-xs text-slate-500">{user.department}</p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl font-semibold">
          ✓ {message}
        </div>
      )}
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-800 text-xs rounded-xl font-semibold">
          ⚠ {error}
        </div>
      )}

      {/* Grid: Create Event Form & Master Events Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Create Event Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Publish New Event
          </h2>

          <form onSubmit={handleCreateEvent} className="space-y-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Robotics Symposium"
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="technical">Technical</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="academic">Academic</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Capacity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Description *</label>
              <textarea
                rows="2"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief event details and rules..."
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Event Date *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Time *</label>
                <input
                  type="text"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="10:00 AM"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Venue *</label>
                <input
                  type="text"
                  required
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  placeholder="Auditorium"
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deadline *</label>
                <input
                  type="date"
                  required
                  value={form.registrationDeadline}
                  onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition shadow-sm"
            >
              Publish Event
            </button>
          </form>
        </div>

        {/* Master Events Table */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Managed Campus Events ({events.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5">Title</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Signups</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-slate-50 transition">
                    <td className="py-3 font-bold text-slate-800">
                      {evt.title}
                      <span className="block text-[10px] text-slate-400 font-normal uppercase">{evt.category}</span>
                    </td>
                    <td className="py-3 text-slate-500">
                      {new Date(evt.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-semibold text-slate-700">
                      {evt.registeredCount} / {evt.capacity}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleViewRoster(evt)}
                        className="px-2.5 py-1 bg-blue-50 text-blue-700 hover:bg-blue-100 rounded-lg font-semibold"
                      >
                        Roster
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt._id, evt.title)}
                        className="px-2.5 py-1 text-red-600 hover:bg-red-50 rounded-lg font-semibold"
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
        <div className="bg-white p-6 rounded-3xl border border-blue-200 shadow-sm space-y-4">
          <div className="flex justify-between items-center border-b border-slate-100 pb-3">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Participant Roster: {selectedEventRoster.title}
              </h3>
              <p className="text-xs text-slate-500">
                Total Registered: <strong>{rosterAttendees.length}</strong> students
              </p>
            </div>
            <button
              onClick={() => setSelectedEventRoster(null)}
              className="text-xs text-slate-400 hover:text-slate-800 font-bold"
            >
              ✕ Close Roster
            </button>
          </div>

          {rosterAttendees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-200 text-slate-400 uppercase text-[10px]">
                  <tr>
                    <th className="py-2">Student Name</th>
                    <th className="py-2">Roll Number</th>
                    <th className="py-2">Department</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {rosterAttendees.map((a) => (
                    <tr key={a._id}>
                      <td className="py-2.5 font-bold text-slate-800">{a.student?.name}</td>
                      <td className="py-2.5 font-mono text-slate-600">{a.student?.studentId || '—'}</td>
                      <td className="py-2.5 text-slate-600">{a.student?.department}</td>
                      <td className="py-2.5 text-slate-500">{a.student?.email}</td>
                      <td className="py-2.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-slate-400 py-4 text-center">No students registered yet for this event.</p>
          )}
        </div>
      )}

      {/* Admin User Management Section */}
      {user.role === 'admin' && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Admin: User Directory & Role Assignment ({users.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-200 text-slate-400 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-2.5">Name</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Department</th>
                  <th className="py-2.5">Current Role</th>
                  <th className="py-2.5 text-right">Switch Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => (
                  <tr key={u._id}>
                    <td className="py-2.5 font-bold text-slate-800">{u.name}</td>
                    <td className="py-2.5 text-slate-500">{u.email}</td>
                    <td className="py-2.5 text-slate-600">{u.department}</td>
                    <td className="py-2.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-mono uppercase bg-slate-100 text-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-2 py-1 border border-slate-200 rounded-lg text-xs outline-none bg-white"
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
