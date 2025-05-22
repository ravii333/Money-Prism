import React from 'react';
import PriceGraph from '../components/PriceGraph';

const dummyPredictionData = [
  { date: '2024-01', price: 4900 },
  { date: '2024-02', price: 5000 },
  { date: '2024-03', price: 5200 },
];

const PartPrediction = () => {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Price Prediction</h2>
      <PriceGraph data={dummyPredictionData} />
    </div>
  );
};

export default PartPrediction;
