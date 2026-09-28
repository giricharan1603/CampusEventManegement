import React, { useState, useEffect } from 'react';
import { adminService } from '../services/api';
import {
  ShieldCheck,
  Users,
  Calendar,
  BookmarkCheck,
  GraduationCap,
  Briefcase,
  Search,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Filter,
} from 'lucide-react';

export const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsRes, usersRes] = await Promise.all([
        adminService.getStats(),
        adminService.getUsers({ role: roleFilter !== 'all' ? roleFilter : undefined, search: searchQuery || undefined }),
      ]);

      if (statsRes.data.success) {
        setStats(statsRes.data.stats);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.users);
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, [roleFilter]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchAdminData();
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminService.updateUserRole(userId, newRole);
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        await fetchAdminData();
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to update user role.',
      });
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user account "${userName}"? This cannot be undone.`)) {
      return;
    }

    try {
      const res = await adminService.deleteUser(userId);
      if (res.data.success) {
        setMessage({ type: 'success', text: res.data.message });
        await fetchAdminData();
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Failed to delete user.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Header */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700 bg-rose-50 px-2.5 py-0.5 rounded-full border border-rose-200">
            System Administration
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Central Administrative Portal
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Campus-wide user directory, role permissions, and platform analytics
          </p>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 rounded-2xl flex items-center space-x-3 text-xs ${
          message.type === 'success' ? 'bg-emerald-50 border border-emerald-200 text-emerald-800' : 'bg-rose-50 border border-rose-200 text-rose-800'
        }`}>
          {message.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{message.text}</span>
        </div>
      )}

      {/* KPI Metrics */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block">Total Users</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{stats.totalUsers}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block">Active Students</span>
            <span className="text-2xl font-extrabold text-blue-600 mt-1 block">{stats.totalStudents}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block">Faculty Coordinators</span>
            <span className="text-2xl font-extrabold text-amber-600 mt-1 block">{stats.totalFaculty}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <span className="text-xs text-slate-500 font-semibold block">Total Events</span>
            <span className="text-2xl font-extrabold text-slate-900 mt-1 block">{stats.totalEvents}</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm col-span-2 md:col-span-1">
            <span className="text-xs text-slate-500 font-semibold block">Registrations Placed</span>
            <span className="text-2xl font-extrabold text-emerald-600 mt-1 block">{stats.totalRegistrations}</span>
          </div>
        </div>
      )}

      {/* Users Management Section */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">User Directory & Role Controls</h2>
            <p className="text-xs text-slate-500">Manage user roles, departments, and account access</p>
          </div>

          {/* Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center gap-2 w-full md:w-auto">
            <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-60">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search user, email, roll..."
                className="w-full pl-8 pr-3 py-1.5 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            </form>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full sm:w-auto px-3 py-1.5 border border-slate-200 rounded-xl text-xs bg-white text-slate-700 outline-none"
            >
              <option value="all">All Roles</option>
              <option value="student">Students</option>
              <option value="faculty">Faculty</option>
              <option value="admin">Admins</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        {loading ? (
          <div className="py-12 text-center text-xs text-slate-400">Loading user records...</div>
        ) : users.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider text-[10px] border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4 font-semibold">User</th>
                  <th className="py-3 px-4 font-semibold">Role</th>
                  <th className="py-3 px-4 font-semibold">Department</th>
                  <th className="py-3 px-4 font-semibold">ID / Roll</th>
                  <th className="py-3 px-4 font-semibold">Joined On</th>
                  <th className="py-3 px-4 font-semibold">Modify Role</th>
                  <th className="py-3 px-4 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {users.map((u) => {
                  const roleColors = {
                    admin: 'bg-rose-50 text-rose-700 border-rose-200',
                    faculty: 'bg-amber-50 text-amber-700 border-amber-200',
                    student: 'bg-blue-50 text-blue-700 border-blue-200',
                  }[u.role] || 'bg-slate-50 text-slate-700';

                  return (
                    <tr key={u._id} className="hover:bg-slate-50/80 transition">
                      <td className="py-3.5 px-4">
                        <div>
                          <span className="font-bold text-slate-900 block">{u.name}</span>
                          <span className="text-[11px] text-slate-400">{u.email}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${roleColors}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600">
                        {u.department} {u.year ? `(Yr ${u.year})` : ''}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-700">
                        {u.studentId || '—'}
                      </td>
                      <td className="py-3.5 px-4 text-slate-500">
                        {new Date(u.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3.5 px-4">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u._id, e.target.value)}
                          className="px-2 py-1 border border-slate-200 rounded-lg text-xs bg-white text-slate-700 outline-none"
                        >
                          <option value="student">student</option>
                          <option value="faculty">faculty</option>
                          <option value="admin">admin</option>
                        </select>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button
                          onClick={() => handleDeleteUser(u._id, u.name)}
                          className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                          title="Delete User Account"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-500 text-xs">
            No user accounts found matching your query.
          </div>
        )}
      </div>
    </div>
  );
};
