import React from 'react';
import { FaStar } from 'react-icons/fa';

const SectionHeading = ({ children }) => {
  return (
    <div className="flex items-center justify-center gap-4 mb-12">
      <FaStar className="text-yellow-400 text-lg" />
      <h2 className="text-3xl font-bold text-center text-gray-800">
        {children}
      </h2>
      <FaStar className="text-yellow-400 text-lg" />
    </div>
  );
};

export default SectionHeading;