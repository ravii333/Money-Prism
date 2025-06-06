import React, { useState, useMemo } from "react";
import { alerts } from "../Data/mockData";
import PriceHistoryChart from "../components/PriceHistoryChart";
import { Link } from "react-router-dom";
import { IoNotificationsCircleOutline } from "react-icons/io5";

// A new, small component for the cards on the left side.
const AlertCard = ({ alert, isSelected, onSelect }) => {
  return (
    <div
      onClick={() => onSelect(alert.id)}
      className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
        isSelected
          ? "bg-blue-50 border-brand-blue shadow-md"
          : "bg-white border-transparent hover:bg-gray-100 hover:border-gray-200"
      }`}
    >
      <img
        src={alert.image}
        alt={alert.name}
        className="w-16 h-16 object-contain rounded-md mr-4 bg-gray-100 p-1"
      />
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{alert.name}</p>
        <p className="text-sm text-gray-500">
          Current:{" "}
          <span className="font-bold text-gray-700">
            ₹{alert.currentPrice.toLocaleString()}
          </span>
        </p>
      </div>
      {alert.status === "Price Alert!" && (
        <IoNotificationsCircleOutline
          size={24}
          className="text-green-500 flex-shrink-0"
        />
      )}
    </div>
  );
};

const AlertsDashboard = () => {
  // State to track the ID of the selected alert. Default to the first alert if available.
  const [selectedAlertId, setSelectedAlertId] = useState(
    alerts.length > 0 ? alerts[0].id : null
  );

  // useMemo will find the selected alert object, but only re-run when the ID or alerts list changes.
  const selectedAlert = useMemo(
    () => alerts.find((a) => a.id === selectedAlertId),
    [selectedAlertId]
  );

  return (
    <div className="bg-gray-100 min-h-full">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">My Price Alerts</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: List of Alert Cards */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-xl shadow-lg space-y-3">
              {alerts.length > 0 ? (
                alerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    isSelected={selectedAlertId === alert.id}
                    onSelect={setSelectedAlertId}
                  />
                ))
              ) : (
                <p className="text-center text-gray-500 p-4">
                  You have no active alerts.
                </p>
              )}
              <Link
                to="/search"
                className="block w-full text-center bg-brand-blue text-white font-semibold mt-4 py-3 rounded-lg hover:bg-brand-blue-light transition"
              >
                + Add New Alert
              </Link>
            </div>
          </div>

          {/* Right Column: Detail View of Selected Alert */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-xl shadow-lg h-full">
              {selectedAlert ? (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">
                    {selectedAlert.name}
                  </h2>
                  <p
                    className={`text-md font-bold mb-6 ${
                      selectedAlert.statusColor || "text-gray-500"
                    }`}
                  >
                    Status: {selectedAlert.status}
                  </p>

                  <div className="grid grid-cols-2 gap-4 mb-8 text-center">
                    <div className="bg-green-50 p-4 rounded-lg">
                      <p className="text-sm text-green-700">Target Price</p>
                      <p className="text-2xl font-bold text-green-800">
                        ₹{selectedAlert.targetPrice.toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <p className="text-sm text-blue-700">Current Price</p>
                      <p className="text-2xl font-bold text-blue-800">
                        ₹{selectedAlert.currentPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold text-gray-700 mb-4">
                    Price History
                  </h3>
                  <PriceHistoryChart data={selectedAlert.history} />

                  <div className="mt-6 flex items-center justify-end space-x-3">
                    <button className="text-sm font-medium text-red-600 hover:text-red-800 transition">
                      Remove Alert
                    </button>
                    <Link
                      to={`/product/${selectedAlert.id}`}
                      className="bg-blue-100 text-blue-800 font-semibold py-2 px-4 rounded-lg hover:bg-blue-200 transition"
                    >
                      View Product Page
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <IoNotificationsCircleOutline
                    size={64}
                    className="text-gray-300 mb-4"
                  />
                  <h3 className="text-xl font-medium text-gray-700">
                    No Alert Selected
                  </h3>
                  <p className="text-gray-500 mt-1">
                    Please select an item from the list to view its details.
                  </p>
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
