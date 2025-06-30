import React, { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import {
  FaShoppingBag,
  FaHeart,
  FaUser,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronUp,
} from "react-icons/fa";

const Navbar = ({ user, handleLogout }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [exploreOpen, setExploreOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const closeAllMenus = () => {
    setMenuOpen(false);
    setExploreOpen(false);
    setUserDropdownOpen(false);
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/" onClick={closeAllMenus} className="text-2xl font-bold">
          MoneyPrism
        </Link>

        {/* Hamburger Menu Icon for Mobile */}
        <div className="md:hidden">
          <button onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
          </button>
        </div>

        {/* Navigation Links */}
        <div
          className={`
            md:flex md:items-center md:space-x-6 
            ${
              menuOpen
                ? "absolute top-full left-0 w-full bg-brand-blue flex flex-col items-center space-y-4 py-6 shadow-xl"
                : "hidden"
            }
          `}
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

          <div className="relative">
            <button
              onClick={() => setExploreOpen(!exploreOpen)}
              className="flex items-center gap-1 hover:text-gray-300 focus:outline-none"
            >
              Explore{" "}
              {exploreOpen ? (
                <FaChevronUp size={12} />
              ) : (
                <FaChevronDown size={12} />
              )}
            </button>
            {exploreOpen && (
              <div className="md:absolute top-full mt-2 w-48 bg-gray-900 text-white shadow-lg rounded-lg py-2 z-20">
                <Link
                  to="/search?category=mobiles"
                  onClick={closeAllMenus}
                  className="block px-4 py-2  hover:border-b-1 border-white "
                >
                  Mobiles
                </Link>
                <Link
                  to="/search?category=laptops"
                  onClick={closeAllMenus}
                  className="block px-4 py-2 hover:border-b-2 border-white"
                >
                  Laptops
                </Link>
              </div>
            )}
          </div>

          <NavLink
            to="/alerts"
            onClick={closeAllMenus}
            className={({ isActive }) =>
              isActive ? "pb-1 border-b-2 border-white" : "hover:text-gray-200"
            }
          >
            My Alerts
          </NavLink>

          {/* Icons and User Auth */}
          <div className="flex items-center gap-5 md:ml-4 border-t md:border-none border-blue-400 pt-4 md:pt-0 mt-4 md:mt-0">
            <Link
              to="/wishlist"
              onClick={closeAllMenus}
              className="hover:border-b-2 border-white"
              title="Wishlist"
            >
              <FaHeart size={15} />
              Wishlist
            </Link>

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="focus:outline-none"
                >
                  <FaUser size={20} />
                </button>
                {userDropdownOpen && (
                  <div className="md:absolute right-0 mt-2 w-40 bg-brand-blue shadow-lg rounded-lg py-2 z-20">
                    <div className="px-4 py-2 text-blue-200 text-sm border-b border-blue-500">
                      Hi, {user.name}!
                    </div>
                    <Link
                      to="/profile"
                      onClick={closeAllMenus}
                      className="block px-4 py-2 hover:bg-brand-blue-light"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={() => {
                        handleLogout();
                        closeAllMenus();
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-brand-blue-light"
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
                className="bg-white text-gray-500 font-bold px-4 py-2 rounded-md hover:bg-gray-600 transition-colors hover:text-white"
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
