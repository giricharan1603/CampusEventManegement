import React from 'react';
import { Calendar, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="font-semibold text-slate-800 text-sm">
              Campus Event Management System (CEMS)
            </span>
          </div>

          <div className="flex items-center space-x-6 text-xs text-slate-500">
            <Link to="/events" className="hover:text-blue-600 transition">Events Catalog</Link>
            <Link to="/login" className="hover:text-blue-600 transition">Student Login</Link>
            <Link to="/login" className="hover:text-blue-600 transition">Faculty Portal</Link>
            <span>FSD-II Academic Project</span>
          </div>

          <div className="text-xs text-slate-400">
            © {new Date().getFullYear()} University Campus Portal. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};
