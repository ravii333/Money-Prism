import React from 'react';
import { Search } from 'lucide-react';

const SearchBar = ({ value, onChange }) => (
  <div className="flex items-center bg-white rounded-lg px-6 py-2 shadow-md w-full max-w-md">
  <input
    type="text"
    placeholder="Search parts (e.g. iPhone screen, car battery)..."
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="flex-grow px-2 py-2 text-sm text-gray-800 placeholder-gray-500 bg-transparent focus:outline-none"
  />
  <Search className="w-5 h-5 text-gray-600 ml-2" />
</div>
);


export default SearchBar;
