'use client';

import { User } from '../types/user';
import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';

interface UserTableProps {
  users: User[];
  onUserClick: (user: User) => void;
}

export default function UserTable({ users, onUserClick }: UserTableProps) {
  return (
    <div className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-50 via-purple-50 to-pink-50 border-b-2 border-indigo-200">
              <th className="text-left py-4 px-6">
                <span className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
                  User
                </span>
              </th>
              <th className="text-left py-4 px-6">
                <span className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
                  Email
                </span>
              </th>
              <th className="text-left py-4 px-6">
                <span className="text-sm font-bold text-indigo-900 uppercase tracking-wider">
                  Status
                </span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {users.map((user, index) => (
              <motion.tr
                key={user.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                className="border-b border-slate-100 hover:bg-gradient-to-r hover:from-indigo-50/50 hover:via-purple-50/30 hover:to-transparent transition-all duration-200 cursor-pointer group"
                onClick={() => onUserClick(user)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && onUserClick(user)}
              >
                {/* Avatar and Name */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="w-11 h-11 rounded-full object-cover border-2 border-indigo-200 group-hover:border-indigo-400 transition-colors shadow-sm"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = `
                            <div class="w-11 h-11 rounded-full bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white font-bold shadow-lg">
                              ${user.name.charAt(0)}
                            </div>
                          `;
                        }}
                      />
                      <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-sm ${
                        user.status.toLowerCase() === 'active' 
                          ? 'bg-emerald-500' 
                          : 'bg-slate-400'
                      }`} />
                    </div>
                    <span className="font-semibold text-slate-800 group-hover:text-indigo-700 transition-colors">
                      {user.name}
                    </span>
                  </div>
                </td>

                {/* Email */}
                <td className="py-4 px-6">
                  <div className="flex items-center space-x-2 text-slate-600 group-hover:text-slate-800 transition-colors">
                    <Mail className="h-4 w-4 flex-shrink-0 text-indigo-400" />
                    <span className="text-sm truncate max-w-[200px]">
                      {user.email}
                    </span>
                  </div>
                </td>

                {/* Status */}
                <td className="py-4 px-6">
                  <div className={`inline-flex items-center px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-sm ${
                    user.status.toLowerCase() === 'active'
                      ? 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200'
                      : 'bg-gradient-to-r from-slate-100 to-gray-100 text-slate-700 border border-slate-200'
                  }`}>
                    <div className={`w-2 h-2 rounded-full mr-2 ${
                      user.status.toLowerCase() === 'active' 
                        ? 'bg-emerald-500 animate-pulse' 
                        : 'bg-slate-400'
                    }`} />
                    {user.status}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Empty State */}
      {users.length === 0 && (
        <div className="py-16 text-center">
          <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <div className="text-4xl">👤</div>
          </div>
          <h3 className="text-lg font-bold text-slate-800 mb-2">
            No users found
          </h3>
          <p className="text-slate-600">
            Try adjusting your filters to find users
          </p>
        </div>
      )}
    </div>
  );
}