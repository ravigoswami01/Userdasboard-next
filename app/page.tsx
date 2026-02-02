'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, FilterState, SortOption } from './types/user';
import UserTable from './components/UserTable';
import Pagination from './components/Pagination';
import SearchBar from './components/SearchBar';
import StatusFilter from './components/StatusFilter';
import SortControls from './components/SortControls';
import AnalyticsChart from './components/AnalyticsChart';
import UserModal from './components/UserModal';
import { debounce } from './utils/debounce';
import { filterUsers, sortUsers } from './utils/dataUtils';
import { Loader2, AlertCircle, Users } from 'lucide-react';

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    status: [],
    search: '',
  });
  
  const [sortOption, setSortOption] = useState<SortOption>('none');
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalItems: 0,
    totalPages: 1,
  });

  // Fetch users with simulated delay
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const response = await fetch('/users.json');
      if (!response.ok) throw new Error('Failed to fetch users');
      
      const data = await response.json();
      
      // Extract users array from the JSON structure
      const usersArray = data.users || [];
      
      if (!Array.isArray(usersArray)) {
        throw new Error('Invalid data format: expected array');
      }
      
      setUsers(usersArray);
      setFilteredUsers(usersArray);
      setPagination(prev => ({
        ...prev,
        totalItems: usersArray.length,
        totalPages: Math.ceil(usersArray.length / prev.pageSize),
      }));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setUsers([]);
      setFilteredUsers([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Simulate error for error state demonstration
  const simulateError = () => {
    setError('Failed to load user data. Please try again.');
  };

  // Apply filters and sort
  useEffect(() => {
    // Ensure users is always an array
    const usersArray = Array.isArray(users) ? users : [];
    
    let result = [...usersArray];
    
    // Apply search filter
    if (filters.search) {
      result = filterUsers(result, filters.search);
    }
    
    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter(user => filters.status.includes(user.status));
    }
    
    // Apply sort
    if (sortOption !== 'none') {
      result = sortUsers(result, sortOption);
    }
    
    setFilteredUsers(result);
    setPagination(prev => ({
      ...prev,
      currentPage: 1,
      totalItems: result.length,
      totalPages: Math.ceil(result.length / prev.pageSize),
    }));
  }, [users, filters, sortOption]);

  // Debounced search handler
  const handleSearch = useCallback(
    debounce((searchTerm: string) => {
      setFilters(prev => ({ ...prev, search: searchTerm }));
    }, 300),
    []
  );

  const handleStatusFilter = (statuses: ('Active' | 'Inactive')[]) => {
    setFilters(prev => ({ ...prev, status: statuses }));
  };

  const handleSort = (option: SortOption) => {
    setSortOption(option);
  };

  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, currentPage: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPagination(prev => ({
      ...prev,
      pageSize: size,
      currentPage: 1,
      totalPages: Math.ceil((prev.totalItems || 0) / size),
    }));
  };

  const handleUserClick = async (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
    setModalLoading(true);
    setModalError(null);
    
    // Simulate async data loading for modal
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      setModalLoading(false);
    } catch (err) {
      setModalError('Failed to load user details');
      setModalLoading(false);
    }
  };

  const currentPageUsers = useMemo(() => {
    const usersArray = Array.isArray(filteredUsers) ? filteredUsers : [];
    const start = (pagination.currentPage - 1) * pagination.pageSize;
    const end = start + pagination.pageSize;
    return usersArray.slice(start, end);
  }, [filteredUsers, pagination.currentPage, pagination.pageSize]);

   const showingRange = useMemo(() => {
    const total = Array.isArray(filteredUsers) ? filteredUsers.length : 0;
    const start = total > 0 ? (pagination.currentPage - 1) * pagination.pageSize + 1 : 0;
    const end = Math.min(pagination.currentPage * pagination.pageSize, total);
    return { start, end, total };
  }, [filteredUsers, pagination.currentPage, pagination.pageSize]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search and Filters Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white backdrop-blur-sm rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-6 space-y-6"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <SearchBar onSearch={handleSearch} />
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <StatusFilter onFilter={handleStatusFilter} />
              <SortControls onSort={handleSort} currentSort={sortOption} />
            </div>
          </div>
        </motion.div>

        {/* Main Content -  */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {/* Loading State */}
            {loading ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 p-12"
              >
                <div className="flex flex-col items-center justify-center space-y-6">
                  <div className="relative">
                    <div className="w-20 h-20 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="h-8 w-8 text-indigo-600 animate-pulse" />
                    </div>
                  </div>
                  <p className="text-slate-700 font-semibold text-lg">Loading users...</p>
                  <div className="w-full max-w-md space-y-3">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="h-16 bg-gradient-to-r from-slate-100 via-indigo-50 to-slate-100 rounded-xl animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : error ? (
              // Error State
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white rounded-2xl shadow-xl shadow-red-100/50 border border-red-200/60 p-8"
              >
                <div className="flex flex-col items-center justify-center space-y-6 text-center">
                  <div className="bg-gradient-to-br from-red-100 to-rose-100 p-6 rounded-2xl">
                    <AlertCircle className="h-16 w-16 text-red-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      Something went wrong
                    </h3>
                    <p className="text-slate-600">{error}</p>
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={fetchUsers}
                      className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/50 transform hover:scale-105 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    >
                      Try Again
                    </button>
                    <button
                      onClick={simulateError}
                      className="px-6 py-3 bg-slate-100 text-slate-700 rounded-xl font-semibold hover:bg-slate-200 transition-all duration-200"
                    >
                      Simulate Error
                    </button>
                  </div>
                </div>
              </motion.div>
            ) : (
              // Users Table Only
              <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 border border-slate-200/60 overflow-hidden">
                <AnimatePresence mode="wait">
                  {(!Array.isArray(filteredUsers) || filteredUsers.length === 0) ? (
                    // Empty State
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="p-12 text-center"
                    >
                      <div className="max-w-md mx-auto">
                        <div className="bg-gradient-to-br from-indigo-100 to-purple-100 w-24 h-24 rounded-2xl flex items-center justify-center mx-auto mb-6">
                          <div className="text-6xl">👤</div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-900 mb-3">
                          No users found
                        </h3>
                        <p className="text-slate-600">
                          Try adjusting your search or filter to find what you're looking for.
                        </p>
                      </div>
                    </motion.div>
                  ) : (
                    // Table View Only
                    <motion.div
                      key="table"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <UserTable
                        users={Array.isArray(currentPageUsers) ? currentPageUsers : []}
                        onUserClick={handleUserClick}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pagination */}
                {Array.isArray(filteredUsers) && filteredUsers.length > 0 && (
                  <div className="border-t border-slate-100 bg-gradient-to-r from-slate-50 to-indigo-50/30 p-6">
                    <Pagination
                      pagination={pagination}
                      onPageChange={handlePageChange}
                      onPageSizeChange={handlePageSizeChange}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Analytics Sidebar */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-2xl shadow-xl shadow-purple-200/50 border border-slate-200/60 overflow-hidden sticky top-6">
              <div className="bg-gradient-to-r from-purple-600 to-pink-600 p-6">
               </div>
              <div className="p-6">
                <AnalyticsChart users={Array.isArray(filteredUsers) ? filteredUsers : []} />
              </div>
            </div>
          </motion.div>
        </div>

        {/* User Modal */}
        <AnimatePresence>
          {isModalOpen && selectedUser && (
            <UserModal
              user={selectedUser}
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
              loading={modalLoading}
              error={modalError}
            />
          )}
        </AnimatePresence> 
      </div>
    </div>
  );
}