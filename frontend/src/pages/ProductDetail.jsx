import React from 'react';
import PriceHistoryChart from '../components/PriceHistoryChart';
import iphone12Detail from '../assets/iphone12.png';

const ProductDetail = () => {
  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white p-8 rounded-lg shadow-lg">
        <div className="flex justify-between items-start mb-6">
            <h1 className="text-4xl font-bold text-gray-800">iPhone 12 Screen</h1>
            <button className="bg-blue-100 text-blue-800 font-semibold py-2 px-5 rounded-lg hover:bg-blue-200 transition">
                Add New Alert
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Left Column: Image & Prices */}
            <div>
                <img src={iphone12Detail} alt="iPhone 12 Screen" className="w-full max-w-sm mx-auto rounded-lg mb-8" />
                
                <h2 className="text-xl font-semibold mb-4">Marketplace Prices</h2>
                <div className="space-y-3 text-lg">
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Flipkart</span>
                        <span className="font-bold text-gray-800">₹ 4,999</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Amazon</span>
                        <span className="font-bold text-gray-800">₹ 5,199</span>
                    </div>
                </div>

                <div className="mt-8">
                    <p className="text-lg">Recommended: <span className="text-green-600 font-bold">Wait</span></p>
                    <button className="mt-4 w-full bg-brand-blue text-white font-bold py-3 rounded-lg hover:bg-brand-blue-light transition">
                        Set Alert
                    </button>
                </div>
            </div>

            {/* Right Column: Price History */}
            <div>
                <h2 className="text-xl font-semibold mb-4">Price History & Prediction</h2>
                <PriceHistoryChart />
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;