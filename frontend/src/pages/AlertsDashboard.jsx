import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const AlertsDashboard = () => {
  const [alerts, setAlerts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- FIX 1: Helper to get auth token from localStorage ---
  const getAuthToken = () => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    return userInfo ? userInfo.token : null;
  };

  useEffect(() => {
    const fetchUserAlerts = async () => {
      const token = getAuthToken();
      if (!token) {
        setError("You are not logged in.");
        setIsLoading(false);
        return;
      }

      try {
        // --- FIX 2: Correct API endpoint and add Authorization header ---
        const response = await fetch('/api/alerts', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        // --- FIX 3: Correctly handle the structured API response ---
        const result = await response.json();
        if (result.success) {
          setAlerts(result.data);
        } else {
          throw new Error(result.message || 'Failed to fetch alerts.');
        }

      } catch (err) {
        console.error("Failed to fetch alerts:", err);
        setError('Could not load your alerts. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserAlerts();
  }, []);

  const handleDelete = async (alertId) => {
    if (!window.confirm("Are you sure you want to delete this alert?")) {
      return;
    }

    const token = getAuthToken();
    if (!token) {
        alert("Authentication error. Please log in again.");
        return;
    }

    try {
      // --- FIX 4: Add Authorization header to the DELETE request ---
      await fetch(`/api/alerts/${alertId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      setAlerts(currentAlerts => currentAlerts.filter(alert => alert._id !== alertId));
    } catch (err) {
      console.error("Failed to delete alert:", err);
      alert("Could not delete the alert. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center p-10">
        <p className="text-lg text-gray-500">Loading your alerts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
          <strong className="font-bold">Error:</strong>
          <span className="block sm:inline ml-2">{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-800 pb-4 mb-6 border-b border-gray-200">
        My Price Alerts
      </h1>

      {alerts.length === 0 ? (
        <div className="text-center border-2 border-dashed border-gray-300 rounded-lg p-12">
          <h3 className="text-xl font-medium text-gray-800">No Alerts Found</h3>
          <p className="mt-2 text-gray-500">You haven't set any price alerts yet.</p>
          <Link
            to="/"
            className="mt-6 inline-block bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Start Tracking Products
          </Link>
        </div>
      ) : (
        <div className="shadow-md overflow-hidden border-b border-gray-200 sm:rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Price</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Your Target Range</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alerts.map((alert) => (
                <tr key={alert._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-16 w-16">
                        <img
                          className="h-16 w-16 object-contain rounded-md bg-gray-100"
                          src={alert.product?.imageURL}
                          alt={alert.product?.name ?? 'Product Image'}
                        />
                      </div>
                      <div className="ml-4 max-w-xs">
                        {alert.product ? (
                           <a
                            href={alert.product?.sellers[0]?.productURL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline break-words"
                          >
                            {alert.product?.name ?? 'Product name not available'}
                          </a>
                        ) : (
                          <span className="text-sm text-gray-500 italic">Product no longer available</span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-bold text-green-600">
                      ₹{alert.product?.currentLowestPrice?.toLocaleString() ?? 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                    ₹{alert.targetPriceLow?.toLocaleString() ?? 'N/A'} - ₹{alert.targetPriceHigh?.toLocaleString() ?? 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {alert.product ? (
                        <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        alert.product?.currentLowestPrice <= alert.targetPriceHigh
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {alert.product?.currentLowestPrice <= alert.targetPriceHigh ? 'In Range' : 'Tracking'}
                      </span>
                    ) : (
                        <span className="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                            Unknown
                        </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => handleDelete(alert._id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AlertsDashboard;