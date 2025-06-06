import React from 'react';
import { FaSearch } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Navigate to search results page on form submission
    navigate('/search');
  };

  return (
    <form onSubmit={handleSearch} className="relative w-full max-w-lg">
      <input
        type="text"
        placeholder="Search parts (e.g., Phone screen, car battery)..."
        className="w-full py-3 pl-4 pr-12 text-gray-700 bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button type="submit" className="absolute inset-y-0 right-0 flex items-center pr-4">
        <FaSearch className="w-5 h-5 text-gray-500" />
      </button>
    </form>
  );
};

export default SearchBar;