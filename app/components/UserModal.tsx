'use client';

import { User } from '../types/user';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Calendar, Clock, Loader2, AlertCircle, User as UserIcon, ExternalLink } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface UserModalProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  loading: boolean;
  error: string | null;
}

export default function UserModal({ user, isOpen, onClose, loading, error }: UserModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const lastFocusedElement = useRef<HTMLElement | null>(null);
  const [imgError, setImgError] = useState(false);

  // Focus trap
  useEffect(() => {
    if (isOpen) {
      lastFocusedElement.current = document.activeElement as HTMLElement;
      modalRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
      lastFocusedElement.current?.focus();
    };
  }, [isOpen, onClose]);

  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) {
      return 'Today';
    } else if (diffInDays === 1) {
      return 'Yesterday';
    } else if (diffInDays < 7) {
      return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
      const weeks = Math.floor(diffInDays / 7);
      return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
      const months = Math.floor(diffInDays / 30);
      return `${months} month${months > 1 ? 's' : ''} ago`;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-gradient-to-br from-indigo-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur-md z-50"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4">
              <motion.div
                ref={modalRef}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ 
                  type: 'spring', 
                  damping: 25, 
                  stiffness: 300,
                  mass: 0.8 
                }}
                className="relative bg-white rounded-3xl shadow-2xl shadow-indigo-500/20 w-full max-w-lg overflow-hidden border border-slate-200"
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                tabIndex={-1}
              >
                {/* Header */}
                <div className="relative p-8 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 border-b border-indigo-700">
                  <button
                    onClick={onClose}
                    className="absolute right-4 top-4 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-white/50 group"
                    aria-label="Close modal"
                  >
                    <X className="h-5 w-5 text-white group-hover:rotate-90 transition-transform duration-200" />
                  </button>
                  
                  <div className="flex flex-col items-center text-center pt-4">
                    <div className="relative mb-4">
                      {user.avatar && !imgError ? (
                        <img
                          src={user.avatar}
                          alt={user.name}
                          className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-2xl"
                          onError={() => setImgError(true)}
                        />
                      ) : (
                        <div className="w-28 h-28 rounded-2xl bg-gradient-to-br from-white/20 to-white/10 backdrop-blur-sm flex items-center justify-center text-white font-bold text-4xl shadow-2xl border-4 border-white/30">
                          {user.name.charAt(0)}
                        </div>
                      )}
                      <div className={`absolute -bottom-2 -right-2 w-9 h-9 rounded-full border-4 border-white shadow-lg ${
                        user.status.toLowerCase() === 'active' 
                          ? 'bg-emerald-500' 
                          : 'bg-slate-400'
                      } flex items-center justify-center`}>
                        <UserIcon className="h-4 w-4 text-white" />
                      </div>
                    </div>
                    
                    <h2 id="modal-title" className="text-3xl font-bold text-white mb-2 drop-shadow-lg">
                      {user.name}
                    </h2>
                    
                    <div className="flex items-center justify-center space-x-2 mb-4 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-xl">
                      <Mail className="h-4 w-4 text-white/90" />
                      <p className="text-white/90 font-medium">
                        {user.email}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-8 bg-gradient-to-br from-slate-50 to-indigo-50/30">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <div className="relative">
                          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                          <Loader2 className="h-8 w-8 text-indigo-600 absolute inset-0 m-auto" />
                        </div>
                      </motion.div>
                      <p className="mt-6 text-slate-700 font-semibold">Loading user details...</p>
                    </div>
                  ) : error ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-4">
                      <div className="bg-gradient-to-br from-red-100 to-rose-100 p-4 rounded-2xl">
                        <AlertCircle className="h-12 w-12 text-red-600" />
                      </div>
                      <p className="text-slate-700 font-medium">{error}</p>
                      <button 
                        onClick={() => window.location.reload()}
                        className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transition-all duration-200 transform hover:scale-105"
                      >
                        Retry
                      </button>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 }}
                      className="space-y-6"
                    >
                      {/* Bio Section */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center">
                          <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">Bio</span>
                          <div className="ml-2 w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-pulse"></div>
                        </h3>
                        <p className="text-slate-600 leading-relaxed bg-gradient-to-br from-indigo-50 to-purple-50 rounded-xl p-4 border border-indigo-100">
                          {user.bio}
                        </p>
                      </div>

                      {/* Timeline Section */}
                      <div className="bg-white rounded-2xl p-6 shadow-lg shadow-slate-200/50 border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-900 mb-4 bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                          Timeline
                        </h3>
                        
                        <div className="space-y-5">
                          {/* Joined Date */}
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg shadow-emerald-500/30 flex items-center justify-center">
                                <Calendar className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900">
                                Joined the platform
                              </p>
                              <p className="text-sm text-slate-600 font-medium mt-1">
                                {formatDate(user.joinedAt)}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 bg-slate-100 rounded-lg px-2 py-1 inline-block">
                                {getTimeAgo(user.joinedAt)}
                              </p>
                            </div>
                          </div>

                          {/* Last Seen */}
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0 mt-1">
                              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-500 shadow-lg shadow-indigo-500/30 flex items-center justify-center">
                                <Clock className="h-6 w-6 text-white" />
                              </div>
                            </div>
                            <div className="flex-1">
                              <p className="text-sm font-bold text-slate-900">
                                Last active
                              </p>
                              <p className="text-sm text-slate-600 font-medium mt-1">
                                {formatDate(user.lastSeen)}
                              </p>
                              <p className="text-xs text-slate-500 mt-1 bg-slate-100 rounded-lg px-2 py-1 inline-block">
                                {getTimeAgo(user.lastSeen)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Footer */}
                <div className="border-t border-slate-200 p-6 bg-white">
                  <div className="flex justify-between items-center">
                    <button
                      onClick={onClose}
                      className="px-6 py-3 border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 hover:border-slate-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}