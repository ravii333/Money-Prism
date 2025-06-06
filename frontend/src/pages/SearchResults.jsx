import React from 'react';
import ProductCard from '../components/ProductCard';
import { searchResults } from '../Data/mockData';
import { FaChevronDown } from 'react-icons/fa';

const SearchResults = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-4">Search Results</h1>
        
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 mb-6 border-b pb-4">
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">Set all</button>
          <span className="text-gray-400">•</span>
          <button className="bg-gray-200 text-gray-700 px-4 py-2 rounded-full text-sm">Sence</button>
          <input type="text" placeholder="Price to go" className="border rounded-full px-4 py-2 text-sm w-36"/>
          
          <div className="ml-auto flex items-center gap-4">
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm">Sort <FaChevronDown /></button>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm">Source <FaChevronDown /></button>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm">Price <FaChevronDown /></button>
            <button className="flex items-center gap-2 border px-4 py-2 rounded-lg text-sm">Sale <FaChevronDown /></button>
          </div>
        </div>
        
        {/* Sort by */}
        <div className="flex items-center gap-4 mb-8">
            <span className="text-gray-600">Sort by</span>
            <button className="text-brand-blue font-semibold border-b-2 border-brand-blue pb-1">Monitor ether</button>
        </div>

        {/* Results Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {searchResults.map(part => (
            <ProductCard key={part.id} product={part} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchResults;