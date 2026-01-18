import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";

import PriceHistoryChart from "../components/PriceHistoryChart";
import SkeletonLoader from "../components/SkeletonLoader";
import {
  FaArrowLeft,
  FaBell,
  FaCheckCircle,
  FaExclamationTriangle,
} from "react-icons/fa";

const ProductDetail = ({ user }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [targetPriceLow, setTargetPriceLow] = useState('');
  const [targetPriceHigh, setTargetPriceHigh] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alertMessage, setAlertMessage] = useState({ type: "", text: "" });

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

          if (fetchedProduct.currentLowestPrice) {
            setTargetPriceLow(Math.floor(fetchedProduct.currentLowestPrice * 0.9).toString());
            setTargetPriceHigh(fetchedProduct.currentLowestPrice.toString());
          }
        } else {
          setError(response.data.message || "Product not found.");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load product details."
        );
        console.error("Error fetching product:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleSetAlert = async (e) => {
    e.preventDefault();
    if (!targetPriceLow || !targetPriceHigh || !product) return;

    if (Number(targetPriceLow) > Number(targetPriceHigh)) {
        setAlertMessage({ type: 'error', text: 'Low price cannot be higher than high price.' });
        return;
    }

    setIsSubmitting(true);
    setAlertMessage({ type: "", text: "" });

    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));

      if (!userInfo || !userInfo.token) {
        navigate("/login");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const response = await axios.post('/api/alerts', { 
        productId: product._id, 
        targetPriceLow: Number(targetPriceLow),
        targetPriceHigh: Number(targetPriceHigh)
      }, config);

      if (response.data && response.data.success) {
        setAlertMessage({ type: "success", text: response.data.message });
      } else {
        setAlertMessage({
          type: "error",
          text: response.data.message || "Failed to set alert.",
        });
      }
    } catch (err) {
      setAlertMessage({
        type: "error",
        text:
          err.response?.data?.message || "An error occurred. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setAlertMessage({ type: "", text: "" }), 4000);
    }
  };

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
    return (
      <div className="text-center py-20 text-red-500 font-semibold">
        {error}
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 text-gray-500">
        Product not found or is unavailable.
      </div>
    );
  }

  const chartData = product.sellers?.[0]?.priceHistory.map((item) => ({
    date: new Date(item.date).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    }),
    price: item.price,
  }));

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back to Search Link */}
      <div className="max-w-7xl mx-auto mb-4">
        <Link to="/search" className="inline-flex items-center text-gray-600 hover:text-blue-800 transition-colors font-medium">
          <FaArrowLeft className="mr-2" />
          Back to Search Results
        </Link>
      </div>

      <div className="max-w-7xl mx-auto bg-white p-6 sm:p-8 rounded-2xl shadow-xl">
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              <div className="flex items-center justify-center bg-gray-50 rounded-lg p-4 h-full">
                <img 
                  src={product.imageURL} 
                  alt={product.name} 
                  className="max-h-[400px] w-auto object-contain" 
                />
              </div>

              <div className="flex flex-col md:col-span-1">
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
                  <p>All-time Low: <span className="block font-bold text-green-600 text-lg">₹{product.historicalLowestPrice?.toLocaleString() || 'N/A'}</span></p>
                  <p>All-time High: <span className="block font-bold text-red-600 text-lg">₹{product.historicalHighestPrice?.toLocaleString() || 'N/A'}</span></p>
                </div>

                <a 
                  href={product.sellers?.[0]?.productURL} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-auto w-full bg-yellow-500 text-white font-bold py-3 px-6 rounded-lg hover:bg-yellow-600 transition-colors text-center text-lg"
                >
                  View on Flipkart
                </a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 lg:border-l lg:pl-8 border-gray-200">
            <h2 className="text-xl font-semibold mb-2 text-gray-800">Price History</h2>
            <PriceHistoryChart data={chartData} />
          </div>

        </div>

        <div className="mt-12 pt-8 border-t border-gray-200">
            {user ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">Set Your Price Zone</h3>
                    <p className="text-sm text-gray-500">Get an alert if the price enters this range.</p>
                </div>
                <div>
                    <form onSubmit={handleSetAlert}>
                        <div className="grid grid-cols-2 gap-3">
                            {/* Low Price Input */}
                            <div className="relative">
                                <label htmlFor="lowPrice" className="text-xs font-semibold text-gray-500">Low Price</label>
                                <span className="absolute top-7 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                <input id="lowPrice" type="number" placeholder="e.g., 45,000" value={targetPriceLow} onChange={(e) => setTargetPriceLow(e.target.value)}
                                    className="w-full pl-7 pr-2 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                            </div>
                            {/* High Price Input */}
                            <div className="relative">
                                <label htmlFor="highPrice" className="text-xs font-semibold text-gray-500">High Price</label>
                                <span className="absolute top-7 left-0 flex items-center pl-3 text-gray-500">₹</span>
                                <input id="highPrice" type="number" placeholder="e.g., 50,000" value={targetPriceHigh} onChange={(e) => setTargetPriceHigh(e.target.value)}
                                    className="w-full pl-7 pr-2 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required />
                            </div>
                        </div>
                        <button type="submit" disabled={isSubmitting} className="mt-4 w-full bg-blue-600 text-white font-bold py-3 px-5 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed inline-flex items-center justify-center text-md">
                            <FaBell className="mr-2" />
                            {isSubmitting ? 'Setting Range...' : 'Set Alert Range'}
                        </button>
                    </form>
                    {/* API Response Message Display */}
                    {alertMessage.text && (
                        <div className={`mt-3 text-sm flex items-center ${alertMessage.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
                            {alertMessage.type === 'success' ? <FaCheckCircle className="mr-2" /> : <FaExclamationTriangle className="mr-2" />}
                            {alertMessage.text}
                        </div>
                    )}
                </div>
              </div>
            ) : (
              <div className="text-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800">Want Price Alerts?</h3>
                <p className="text-sm text-gray-500 mb-4">Log in to track this product and get notified when the price drops into your desired range.</p>
                <button onClick={() => navigate('/login')} className="bg-blue-600 text-white font-bold py-2 px-8 rounded-lg hover:bg-blue-700 transition-colors inline-flex items-center justify-center">
                  <FaBell className="mr-2" />
                  Login to Set Alert
                </button>
              </div>
            )}
        </div>

      </div>
    </div>
  );
};

export default ProductDetail;
