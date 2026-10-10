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
      <div className="py-20 text-center text-xs text-white/80 flutter-glass p-8 max-w-md mx-auto">
        Access restricted to faculty coordinators and system administrators.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flutter-glass p-6 sm:p-8 flex flex-col sm:flex-row justify-between sm:items-center gap-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flutter-white-pill">
            {user.role} Dashboard
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2">
            {user.name}'s Management Portal
          </h1>
          <p className="text-xs text-white/80 mt-0.5">{user.department}</p>
        </div>
      </div>

      {message && (
        <div className="p-3 bg-emerald-500/30 border border-emerald-300 text-white text-xs rounded-2xl font-bold backdrop-blur-md">
          ✓ {message}
        </div>
      )}
      {error && (
        <div className="p-3 bg-rose-500/30 border border-rose-300 text-white text-xs rounded-2xl font-bold backdrop-blur-md">
          ⚠ {error}
        </div>
      )}

      {/* Grid: Create Event Form & Master Events Table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Create Event Form */}
        <div className="flutter-glass p-6 space-y-4">
          <h2 className="text-xs font-black text-white uppercase tracking-wider">
            Publish New Event
          </h2>

          <form onSubmit={handleCreateEvent} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-bold text-white mb-1">Event Title *</label>
              <input
                type="text"
                required
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Robotics Symposium"
                className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-white mb-1">Category *</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold [&>option]:bg-indigo-950 [&>option]:text-white"
                >
                  <option value="technical">Technical</option>
                  <option value="cultural">Cultural</option>
                  <option value="sports">Sports</option>
                  <option value="academic">Academic</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-white mb-1">Capacity *</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={form.capacity}
                  onChange={(e) => setForm({ ...form, capacity: e.target.value })}
                  className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-white mb-1">Description *</label>
              <textarea
                rows="2"
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Brief event details and rules..."
                className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
              ></textarea>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-white mb-1">Event Date *</label>
                <input
                  type="date"
                  required
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-white mb-1">Time *</label>
                <input
                  type="text"
                  required
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  placeholder="10:00 AM"
                  className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-bold text-white mb-1">Venue *</label>
                <input
                  type="text"
                  required
                  value={form.venue}
                  onChange={(e) => setForm({ ...form, venue: e.target.value })}
                  placeholder="Auditorium"
                  className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
                />
              </div>
              <div>
                <label className="block font-bold text-white mb-1">Deadline *</label>
                <input
                  type="date"
                  required
                  value={form.registrationDeadline}
                  onChange={(e) => setForm({ ...form, registrationDeadline: e.target.value })}
                  className="w-full px-4 py-2.5 flutter-glass-input text-white font-semibold"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 flutter-white-pill font-bold transition shadow-lg mt-2 text-xs"
            >
              Publish Event
            </button>
          </form>
        </div>

        {/* Master Events Table */}
        <div className="lg:col-span-2 flutter-glass p-6 space-y-4">
          <h2 className="text-xs font-black text-white uppercase tracking-wider">
            Managed Campus Events ({events.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/20 text-white/80 font-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5">Title</th>
                  <th className="py-2.5">Date</th>
                  <th className="py-2.5">Signups</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {events.map((evt) => (
                  <tr key={evt._id} className="hover:bg-white/10 transition">
                    <td className="py-3 font-extrabold text-white text-sm">
                      {evt.title}
                      <span className="block text-[10px] text-amber-200 font-bold uppercase mt-0.5">{evt.category}</span>
                    </td>
                    <td className="py-3 text-white/90 font-semibold">
                      {new Date(evt.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 font-black font-mono text-amber-300 text-sm">
                      {evt.registeredCount} / {evt.capacity}
                    </td>
                    <td className="py-3 text-right space-x-2">
                      <button
                        onClick={() => handleViewRoster(evt)}
                        className="px-3 py-1.5 flutter-white-pill text-xs font-bold"
                      >
                        Roster
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(evt._id, evt.title)}
                        className="px-3 py-1.5 flutter-glass-pill hover:bg-rose-500/30 hover:border-rose-300 text-xs font-bold transition"
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
        <div className="flutter-glass p-6 space-y-4">
          <div className="flex justify-between items-center border-b border-white/20 pb-3">
            <div>
              <h3 className="font-extrabold text-base text-white">
                Participant Roster: {selectedEventRoster.title}
              </h3>
              <p className="text-xs text-white/80 mt-0.5">
                Total Registered: <strong className="text-amber-300 font-bold text-sm">{rosterAttendees.length}</strong> students
              </p>
            </div>
            <button
              onClick={() => setSelectedEventRoster(null)}
              className="text-xs flutter-glass-pill px-4 py-1.5 font-bold"
            >
              ✕ Close
            </button>
          </div>

          {rosterAttendees.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-white/20 text-white/80 font-black uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5">Student Name</th>
                    <th className="py-2.5">Roll Number</th>
                    <th className="py-2.5">Department</th>
                    <th className="py-2.5">Email</th>
                    <th className="py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {rosterAttendees.map((a) => (
                    <tr key={a._id} className="hover:bg-white/10 transition">
                      <td className="py-2.5 font-bold text-white text-sm">{a.student?.name}</td>
                      <td className="py-2.5 font-mono text-amber-300 font-black">{a.student?.studentId || '—'}</td>
                      <td className="py-2.5 text-white/90 font-medium">{a.student?.department}</td>
                      <td className="py-2.5 text-white/80 font-medium">{a.student?.email}</td>
                      <td className="py-2.5">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/40 text-white border border-emerald-300">
                          {a.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-xs text-white/80 py-4 text-center font-medium">No students registered yet for this event.</p>
          )}
        </div>
      )}

      {/* Admin User Management Section */}
      {user.role === 'admin' && (
        <div className="flutter-glass p-6 space-y-4">
          <h2 className="text-xs font-black text-white uppercase tracking-wider">
            Admin: User Directory & Role Assignment ({users.length})
          </h2>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-white/20 text-white/80 font-black uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5">Name</th>
                  <th className="py-2.5">Email</th>
                  <th className="py-2.5">Department</th>
                  <th className="py-2.5">Current Role</th>
                  <th className="py-2.5 text-right">Switch Role</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {users.map((u) => (
                  <tr key={u._id} className="hover:bg-white/10 transition">
                    <td className="py-2.5 font-bold text-white text-sm">{u.name}</td>
                    <td className="py-2.5 text-white/80 font-medium">{u.email}</td>
                    <td className="py-2.5 text-white/90 font-medium">{u.department}</td>
                    <td className="py-2.5">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase bg-white/20 text-white border border-white/30 font-bold">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 text-right">
                      <select
                        value={u.role}
                        onChange={(e) => handleRoleChange(u._id, e.target.value)}
                        className="px-2.5 py-1 flutter-glass-input text-xs font-semibold text-white [&>option]:bg-indigo-950 [&>option]:text-white"
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
