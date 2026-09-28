import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { registrationService } from '../services/api';
import {
  Users,
  Download,
  ArrowLeft,
  Calendar,
  MapPin,
  Building,
  GraduationCap,
  Mail,
  Phone,
  CheckCircle2,
} from 'lucide-react';

export const EventRoster = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAttendees = async () => {
      setLoading(true);
      try {
        const res = await registrationService.getEventAttendees(eventId);
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch attendee roster.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttendees();
  }, [eventId]);

  const handleExportCSV = () => {
    if (!data || !data.attendees.length) return;

    const headers = ['#', 'Student Name', 'Student ID', 'Department', 'Year', 'Email', 'Phone', 'Registration Date', 'Status'];
    const rows = data.attendees.map((a, idx) => [
      idx + 1,
      `"${a.student?.name || 'N/A'}"`,
      `"${a.student?.studentId || 'N/A'}"`,
      `"${a.student?.department || 'N/A'}"`,
      a.student?.year || 'N/A',
      `"${a.student?.email || 'N/A'}"`,
      `"${a.student?.phone || 'N/A'}"`,
      `"${new Date(a.registeredAt).toLocaleString()}"`,
      `"${a.status}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Roster_${data.eventTitle.replace(/[^a-zA-Z0-9]/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-3 text-xs text-slate-500 font-medium">Fetching event participant roster...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center">
        <p className="text-sm font-bold text-red-600 mb-4">{error || 'Event data not accessible.'}</p>
        <button
          onClick={() => navigate('/faculty/dashboard')}
          className="px-4 py-2 bg-slate-800 text-white rounded-xl text-xs font-semibold"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <button
            onClick={() => navigate('/faculty/dashboard')}
            className="inline-flex items-center space-x-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Faculty Dashboard</span>
          </button>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Participant Roster: {data.eventTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
            <span className="px-2 py-0.5 rounded-full uppercase tracking-wider text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-100">
              {data.eventCategory}
            </span>
            <div className="flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-blue-600" />
              <span>{new Date(data.eventDate).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-1">
              <MapPin className="w-3.5 h-3.5 text-blue-600" />
              <span>{data.venue}</span>
            </div>
          </div>
        </div>

        <button
          onClick={handleExportCSV}
          disabled={data.attendees.length === 0}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center justify-center space-x-2 transition disabled:opacity-50 shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Export Roster (CSV)</span>
        </button>
      </div>

      {/* Roster Statistics Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900">{data.registeredCount}</span>
            <p className="text-xs text-slate-500 font-medium">Confirmed Attendees</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900">{data.capacity}</span>
            <p className="text-xs text-slate-500 font-medium">Total Venue Capacity</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center space-x-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xl font-extrabold text-slate-900">
              {Math.round((data.registeredCount / data.capacity) * 100)}%
            </span>
            <p className="text-xs text-slate-500 font-medium">Attendance Fill Rate</p>
          </div>
        </div>
      </div>

      {/* Roster Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-sm font-bold text-slate-900">Student Signups List</h2>
          <span className="text-xs text-slate-500">{data.attendees.length} Students</span>
        </div>

        {data.attendees.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">#</th>
                  <th className="py-3 px-4 font-semibold">Student Name</th>
                  <th className="py-3 px-4 font-semibold">Roll Number</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">Year</th>
                  <th className="py-3 px-4 font-semibold">Email</th>
                  <th className="py-3 px-4 font-semibold">Phone</th>
                  <th className="py-3 px-4 font-semibold">Registered At</th>
                  <th className="py-3 px-4 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.attendees.map((attendee, idx) => (
                  <tr key={attendee._id} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-semibold text-slate-400">{idx + 1}</td>
                    <td className="py-3.5 px-4 font-bold text-slate-900">
                      {attendee.student?.name || 'Unknown Student'}
                    </td>
                    <td className="py-3.5 px-4 font-mono font-medium text-slate-700">
                      {attendee.student?.studentId || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {attendee.student?.department || 'N/A'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      Year {attendee.student?.year || 1}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {attendee.student?.email}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {attendee.student?.phone || '—'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500">
                      {new Date(attendee.registeredAt).toLocaleDateString()}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {attendee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-16 p-6">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-2" />
            <h3 className="text-sm font-bold text-slate-800">No students registered yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Registered participants will appear in this audit roster in real time.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
