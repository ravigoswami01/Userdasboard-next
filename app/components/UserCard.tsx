'use client';

import { User } from '../types/user';
import { motion } from 'framer-motion';
import { Mail, MoreVertical, CheckCircle, XCircle } from 'lucide-react';
import { useState } from 'react';

interface UserCardProps {
  user: User;
  onClick: () => void;
}

export default function UserCard({ user, onClick }: UserCardProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  return (
    <motion.div
      whileHover={{ 
        y: -6,
        scale: 1.02,
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 25 }}
      className="bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer group relative"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' && onClick()}
    >
      {/* Status  */}
      <div className={`absolute top-0 left-0 w-full h-1 ${
        user.status.toLowerCase() === 'active' 
          ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
          : 'bg-gradient-to-r from-gray-400 to-gray-500'
      }`} />
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              {user.avatar && !imgError ? (
                <div className="relative">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-20 h-20 rounded-2xl object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                    onError={() => setImgError(true)}
                    loading="lazy"
                  />
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center ${
                    user.status.toLowerCase() === 'active' 
                      ? 'bg-green-500' 
                      : 'bg-gray-400'
                  }`}>
                    {user.status.toLowerCase() === 'active' ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <XCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                  {user.name.charAt(0)}
                  <div className={`absolute -bottom-2 -right-2 w-8 h-8 rounded-full border-4 border-white dark:border-gray-800 flex items-center justify-center ${
                    user.status.toLowerCase() === 'active' 
                      ? 'bg-green-500' 
                      : 'bg-gray-400'
                  }`}>
                    {user.status.toLowerCase() === 'active' ? (
                      <CheckCircle className="h-4 w-4 text-white" />
                    ) : (
                      <XCircle className="h-4 w-4 text-white" />
                    )}
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                {user.name}
              </h3>
              <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 mb-4">
                <Mail className="h-4 w-4" />
                <p className="text-sm truncate max-w-[200px]">{user.email}</p>
              </div>
              
              <div className="flex items-center">
                <div className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium ${
                  user.status.toLowerCase() === 'active'
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800'
                    : 'bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700'
                }`}>
                  <div className={`w-2 h-2 rounded-full mr-2 ${
                    user.status.toLowerCase() === 'active' 
                      ? 'bg-green-500 animate-pulse' 
                      : 'bg-gray-400'
                  }`} />
                  {user.status}
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors group"
              aria-label="More options"
            >
              <MoreVertical className="h-5 w-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition-colors" />
            </button> 
          </div>
        </div>
      </div>

      {/* Hover effect   */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none rounded-xl" />
    </motion.div>
  );
}