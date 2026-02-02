'use client';

import { Search, Loader2 } from 'lucide-react';
import { useState } from 'react';

interface SearchBarProps {
  onSearch: (term: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      onSearch(value);
      setIsSearching(false);
    }, 300);
  };

  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search by name or email..."
        className="w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
      />
      {isSearching && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          <Loader2 className="h-5 w-5 text-gray-400 animate-spin" />
        </div>
      )}
    </div>
  );
}