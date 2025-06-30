import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import PriceHistoryChart from '../components/PriceHistoryChart';
import SkeletonLoader from '../components/SkeletonLoader';
import { FaArrowLeft, FaBell, FaCheckCircle } from 'react-icons/fa';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for the alert functionality
  const [targetPrice, setTargetPrice] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: '', text: '' });

  // useEffect to fetch product data when the component mounts or the ID changes
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await axios.get(`/api/products/${id}`);

        if (response.data && response.data.success) {
          const fetchedProduct = response.data.data;
          setProduct(fetchedProduct);
          
          // UX Improvement: Suggest a target price 10% below the current price
          if (fetchedProduct.currentLowestPrice) {
            setTargetPrice(Math.floor(fetchedProduct.currentLowestPrice * 0.9).toString());
          }
        } else {
          setError(response.data.message || 'Product not found.');
        }
      } catch (err) {
        const errorMessage = err.response?.data?.message || 'Failed to load product details.';
        setError(errorMessage);
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);

  // Handler function to set a price alert via API call
  const handleSetAlert = async (e) => {
    e.preventDefault();
    if (!targetPrice || !product) return;

    setIsSubmitting(true);
    setAlertMessage({ type: '', text: '' });

    try {
      const response = await axios.post('/api/alerts', {
        productId: product._id,
        targetPrice: Number(targetPrice),
      });

      if (response.data && response.data.success) {
        setAlertMessage({ type: 'success', text: response.data.message });
      } else {
        setAlertMessage({ type: 'error', text: response.data.message || 'Failed to set alert.' });
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'An error occurred while setting the alert.';
      setAlertMessage({ type: 'error', text: errorMessage });
    } finally {
      setIsSubmitting(false);
      // Clear the feedback message after 4 seconds
      setTimeout(() => setAlertMessage({ type: '', text: '' }), 4000);
    }
  };

  // --- Conditional Rendering Guards ---
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <SkeletonLoader />
        </div>
      </div>
    );
  }
  
  if (error) {
    return <div className="text-center py-20 text-red-500">{error}</div>;
  }
  
  // This guard ensures `product` is not null before we try to access its properties
  if (!product) {
    return <div className="text-center py-20">Product not found or data is unavailable.</div>;
  }

  // --- Main Component Render ---
  // We can now safely calculate chartData because `product` is guaranteed to be an object
  const chartData = product.sellers?.[0]?.priceHistory.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' }),
    price: item.price,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to Search Link */}
      <div className="max-w-4xl mx-auto mb-4">
        <Link to="/search" className="inline-flex items-center text-gray-600 hover:text-blue-800 transition-colors font-medium">
          <FaArrowLeft className="mr-2" />
          Back to Search Results
        </Link>
      </div>

      {/* Main Product Card */}
      <div className="max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          
          {/* Left Side: Image */}
          <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4">
            <img 
              src={product.imageURL} 
              alt={product.name} 
              className="max-h-[400px] w-auto object-contain" 
            />
          </div>

          {/* Right Side: Details & Actions */}
          <div className="flex flex-col">
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 leading-tight">
              {product.name}
            </h1>
            
            <div className="mt-4">
              <span className="text-sm text-gray-500">Current Lowest Price:</span>
              <p className="text-4xl font-extrabold text-blue-800">
                {product.currentLowestPrice ? `₹${product.currentLowestPrice.toLocaleString()}` : 'N/A'}
              </p>
            </div>

            <div className="mt-6 flex space-x-6 text-sm text-gray-600">
              <p>
                All-time Low: 
                <span className="block font-bold text-green-600 text-lg">
                  ₹{product.historicalLowestPrice?.toLocaleString() || 'N/A'}
                </span>
              </p>
              <p>
                All-time High: 
                <span className="block font-bold text-red-600 text-lg">
                  ₹{product.historicalHighestPrice?.toLocaleString() || 'N/A'}
                </span>
              </p>
            </div>
            
            {/* Set Alert Section */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <h3 className="text-lg font-semibold text-gray-800">Set a Price Alert</h3>
              <p className="text-sm text-gray-500 mb-3">Get an alert when the price drops below your target.</p>
              
              <form onSubmit={handleSetAlert} className="flex items-center gap-2">
                <div className="relative flex-grow">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">₹</span>
                  <input
                    type="number"
                    placeholder="Your Target Price"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(e.target.value)}
                    className="w-full pl-7 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 text-white font-bold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center"
                >
                  <FaBell className="mr-2" />
                  {isSubmitting ? 'Setting...' : 'Set Alert'}
                </button>
              </form>

              {/* API Response Message */}
              {alertMessage.text && (
                <div className={`mt-3 text-sm flex items-center ${alertMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                  {alertMessage.type === 'success' && <FaCheckCircle className="mr-2" />}
                  {alertMessage.text}
                </div>
              )}
            </div>

            {/* External Link Button */}
            <a 
              href={product.sellers?.[0]?.productURL} 
              target="_blank" 
              rel="noopener noreferrer"
              className="mt-6 w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors text-center text-lg"
            >
              View on Flipkart
            </a>
          </div>
        </div>

        {/* Price History Chart Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold mb-2 text-gray-800">Price History (Flipkart)</h2>
          <PriceHistoryChart data={chartData} />
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;