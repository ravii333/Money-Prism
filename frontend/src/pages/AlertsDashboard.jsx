import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios"; // We'll need axios for API calls
import PriceHistoryChart from "../components/PriceHistoryChart";
import { IoNotificationsCircleOutline } from "react-icons/io5";

// AlertCard component remains the same. It's perfect.
const AlertCard = ({ alert, isSelected, onSelect }) => {
  // The unique ID will come from MongoDB (_id)
  const id = alert._id || alert.id; 
  
  return (
    <div
      onClick={() => onSelect(id)}
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
        isSelected
          ? "bg-blue-50 border-blue-600 shadow-md"
          : "bg-white border-transparent hover:bg-gray-100"
      }`}
    >
      {/* Assuming your alert data has a product object nested inside */}
      <img
        src={alert.product?.imageURL || 'https://via.placeholder.com/150'}
        alt={alert.product?.name}
        className="w-16 h-16 object-contain rounded-md mr-4 bg-gray-100 p-1"
      />
      <div className="flex-grow">
        <p className="font-semibold text-gray-800 line-clamp-2">{alert.product?.name}</p>
        <p className="text-sm text-gray-500">
          Target:{" "}
          <span className="font-bold text-gray-700">
            ₹{alert.targetPrice.toLocaleString()}
          </span>
        </p>
      </div>
      {/* Logic to determine if the alert should be highlighted */}
      {alert.product?.currentLowestPrice <= alert.targetPrice && (
        <IoNotificationsCircleOutline
          size={28}
          className="text-green-500 flex-shrink-0 animate-pulse"
        />
      )}
    </div>
  );
};

const AlertsDashboard = () => {
  // ✅ 1. Add state for data fetching: loading, error, and the alerts array.
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedAlertId, setSelectedAlertId] = useState(null);

  // ✅ 2. Use useEffect to fetch the user's alerts from the backend on component mount.
  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        setLoading(true);
        // This is a hypothetical API endpoint. You will need to create this on your backend.
        // It should be a protected route that gets alerts for the logged-in user.
        const response = await axios.get('/api/alerts'); 
        
        if (response.data && response.data.success) {
          setAlerts(response.data.data);
          // Automatically select the first alert if the list is not empty
          if (response.data.data.length > 0) {
            setSelectedAlertId(response.data.data[0]._id);
          }
        }
      } catch (err) {
        setError("Failed to load your alerts. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []); // Empty array means this runs once when the component mounts.

  const selectedAlert = useMemo(
    // The unique ID from MongoDB is `_id`
    () => alerts.find((a) => a._id === selectedAlertId),
    [selectedAlertId, alerts]
  );
  
  // ✅ 3. Handle the "Remove Alert" functionality
  const handleRemoveAlert = async (alertId) => {
    // Optimistically remove the alert from the UI
    const originalAlerts = [...alerts];
    setAlerts(alerts.filter(a => a._id !== alertId));
    
    // If the removed alert was selected, select the next one or null
    if (selectedAlertId === alertId) {
        const remainingAlerts = originalAlerts.filter(a => a._id !== alertId);
        setSelectedAlertId(remainingAlerts.length > 0 ? remainingAlerts[0]._id : null);
    }

    try {
      // Make the API call to delete the alert from the database
      await axios.delete(`/api/alerts/${alertId}`);
    } catch (err) {
      // If the API call fails, revert the UI change and show an error
      setError("Could not remove alert. Please try again.");
      setAlerts(originalAlerts); // Put the alert back
      console.error(err);
    }
  };


  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">My Price Alerts</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-lg space-y-3">
              {/* ✅ 4. Add conditional rendering for loading and error states */}
              {loading ? (
                <p className="text-center text-gray-500 p-4">Loading alerts...</p>
              ) : error ? (
                <p className="text-center text-red-500 p-4">{error}</p>
              ) : alerts.length > 0 ? (
                alerts.map((alert) => (
                  <AlertCard
                    key={alert._id}
                    alert={alert}
                    isSelected={selectedAlertId === alert._id}
                    onSelect={setSelectedAlertId}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 p-4">You have no active alerts.</p>
              )}
              <Link
                to="/search"
                className="block w-full text-center bg-blue-600 text-white font-semibold mt-4 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                + Add New Alert
              </Link>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg h-full">
              {selectedAlert ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">{selectedAlert.product?.name}</h2>
                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <button 
                      onClick={() => handleRemoveAlert(selectedAlert._id)}
                      className="text-sm font-medium text-red-600 hover:text-red-800 transition"
                    >
                      Remove Alert
                    </button>
                    <Link
                      to={`/product/${selectedAlert.product?._id}`}
                      className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition"
                    >
                      View Product Page
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                  <IoNotificationsCircleOutline size={64} className="mb-4" />
                  <h3 className="text-xl font-medium">No Alert Selected</h3>
                  <p className="mt-1">Select an item from the list to view its details.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertsDashboard;