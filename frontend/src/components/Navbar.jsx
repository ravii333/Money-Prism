import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { FaHeart, FaBars, FaTimes, FaUser } from "react-icons/fa";

const Navbar = ({ user, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const closeAllMenus = () => {
    setMenuOpen(false);
    setUserDropdownOpen(false);
  };

  const onLogoutClick = () => {
    handleLogout();
    closeAllMenus();
    navigate("/");
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" onClick={closeAllMenus} className="text-2xl font-bold">
          MoneyPrism
        </Link>

        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        <div
          className={`md:flex md:items-center md:space-x-6 ${menuOpen ? "absolute top-full left-0 w-full bg-gray-800 flex flex-col items-center space-y-4 py-6 shadow-xl" : "hidden"}`}
        >
          <NavLink
            to="/"
            onClick={closeAllMenus}
            className={({ isActive }) =>
              isActive ? "pb-1 border-b-2 border-white" : "hover:text-gray-300"
            }
          >
            Home
          </NavLink>
          {/* Add your Explore dropdown here if needed */}

          {user && ( // Only show "My Alerts" if the user is logged in
            <NavLink
              to="/alerts"
              onClick={closeAllMenus}
              className={({ isActive }) =>
                isActive
                  ? "pb-1 border-b-2 border-white"
                  : "hover:text-gray-300"
              }
            >
              My Alerts
            </NavLink>
          )}

          <div className="flex items-center gap-5 md:ml-4 border-t md:border-none border-gray-700 pt-4 md:pt-0 mt-4 md:mt-0">
            {user && ( // Only show Wishlist if the user is logged in
              <Link
                to="/wishlist"
                onClick={closeAllMenus}
                className="flex items-center gap-2 hover:text-gray-300"
                title="Wishlist"
              >
                <FaHeart size={20} />
                <span className="md:hidden">Wishlist</span>
              </Link>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="focus:outline-none p-2 rounded-full hover:bg-gray-700"
                >
                  <FaUser size={20} />
                </button>
                {userDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-900 shadow-lg rounded-lg py-2 z-20">
                    <div className="px-4 py-2 text-sm text-gray-400 border-b border-gray-700">
                      Signed in as {user.email}
                    </div>
                    <button
                      onClick={onLogoutClick}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/login"
                onClick={closeAllMenus}
                className="bg-blue-600 text-white font-bold px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
