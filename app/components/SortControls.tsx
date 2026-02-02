'use client';

import { ArrowUpDown } from 'lucide-react';
import { SortOption } from '../types/user';

interface SortControlsProps {
  onSort: (option: SortOption) => void;
  currentSort: SortOption;
}

export default function SortControls({ onSort, currentSort }: SortControlsProps) {
  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onSort(currentSort === 'name_asc' ? 'name_desc' : 'name_asc')}
        className="flex items-center space-x-2 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <ArrowUpDown className="h-5 w-5" />
        <span className="text-gray-700 dark:text-gray-300">
          Sort: {currentSort === 'name_asc' ? 'A → Z' : currentSort === 'name_desc' ? 'Z → A' : 'None'}
        </span>
      </button>
    </div>
  );
}