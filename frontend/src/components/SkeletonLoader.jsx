import React from 'react';

const SkeletonLoader = () => (
  <div className="bg-white p-6 rounded-lg shadow-lg animate-pulse">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      
      <div className="bg-gray-200 h-80 rounded-lg"></div>
      
      <div>
        <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
        <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
        <div className="bg-gray-200 h-56 rounded-lg mb-8"></div>
        <div className="h-12 bg-gray-200 rounded-lg"></div>
      </div>
    </div>
  </div>
);

export default SkeletonLoader;