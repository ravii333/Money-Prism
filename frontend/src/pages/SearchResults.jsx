import React from 'react';
import PartCard from '../components/PartCard';

const results = [
  { name: 'Samsung Galaxy Battery', price: 1500, source: 'Snapdeal' },
  { name: 'Hyundai Car AC Compressor', price: 8500, source: 'AutoZone' },
];

const SearchResults = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Search Results</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {results.map((part, idx) => (
          <PartCard key={idx} part={part} />
        ))}
      </div>
    </div>
  );
};

export default SearchResults;
