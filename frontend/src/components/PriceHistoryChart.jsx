import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const PriceHistoryChart = ({ data }) => {
  if (!data || data.length === 0) {
    return <div className="text-center text-gray-500">No price history available.</div>;
  }
  
  return (
    <div style={{ width: '100%', height: 250 }}>
      <ResponsiveContainer>
        <LineChart
          data={data} 
          margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis 
            tickFormatter={(value) => `₹${value.toLocaleString()}`} 
            domain={['dataMin - 500', 'dataMax + 500']}
            width={80}
          />
          <Tooltip formatter={(value) => [`₹${value.toLocaleString()}`, "Price"]}/>
          <Line type="monotone" dataKey="price" stroke="#0D47A1" strokeWidth={2} activeDot={{ r: 8 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PriceHistoryChart;