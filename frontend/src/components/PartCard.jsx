import React from 'react';

const PartCard = ({ part }) => (
  <div className="border p-4 rounded shadow hover:shadow-md transition">
    <h2 className="text-lg font-semibold">{part.name}</h2>
    <p className="text-gray-700">Best Price: ₹{part.price}</p>
    <p className="text-sm text-gray-500">Source: {part.source}</p>
  </div>
);

export default PartCard;
