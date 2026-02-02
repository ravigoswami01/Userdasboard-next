'use client';

import { Filter, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface StatusFilterProps {
  onFilter: (statuses: ('Active' | 'Inactive')[]) => void;
}

export default function StatusFilter({ onFilter }: StatusFilterProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedStatuses, setSelectedStatuses] = useState<('Active' | 'Inactive')[]>([]);

  const handleStatusToggle = (status: 'Active' | 'Inactive') => {
    let newStatuses;
    if (selectedStatuses.includes(status)) {
      newStatuses = selectedStatuses.filter(s => s !== status);
    } else {
      newStatuses = [...selectedStatuses, status];
    }
    setSelectedStatuses(newStatuses);
    onFilter(newStatuses);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <Filter className="h-5 w-5" />
        <span className="text-gray-700">Status</span>
        {selectedStatuses.length > 0 && (
          <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
            {selectedStatuses.length}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
          >
            <div className="p-2 space-y-1">
              <button
                onClick={() => handleStatusToggle('Active')}
                className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-gray-700">Active</span>
                </div>
                {selectedStatuses.includes('Active') && (
                  <Check className="h-4 w-4 text-blue-500" />
                )}
              </button>
              
              <button
                onClick={() => handleStatusToggle('Inactive')}
                className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 rounded-full bg-gray-400" />
                  <span className="text-gray-700">Inactive</span>
                </div>
                {selectedStatuses.includes('Inactive') && (
                  <Check className="h-4 w-4 text-blue-500" />
                )}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}