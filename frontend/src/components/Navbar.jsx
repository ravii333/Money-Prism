import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingBag, Heart } from "lucide-react";
// import { toast } from "react-toastify";

const Navbar = ({ user, setUser }) => {
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    // toast.success("Logged out successfully!");
    navigate("/");
  };

  return (
    <nav className="bg-blue-950 backdrop-blur-md shadow-md fixed top-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="text-xl font-bold text-white">
          MoneyPrism
        </Link>

        {/* Hamburger Icon for Mobile */}
        <div className="md:hidden text-white" onClick={() => setMenuOpen(!menuOpen)}>
          ☰
        </div>

        {/* Navigation Links */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } md:flex flex-col md:flex-row items-start md:items-center md:space-x-8 space-y-4 md:space-y-0 text-white absolute md:static top-16 left-0 w-full md:w-auto bg-blue-950 md:bg-transparent px-4 md:px-0 py-4 md:py-0`}
        >
          <Link to="/" className="hover:underline w-full md:w-auto">
            Home
          </Link>
          <Link to="/wishList" className="hover:underline flex items-center gap-1">
            <Heart className="w-5 h-5" color="#dedae2" />
            WishList
          </Link>
          <Link to="/cart" className="hover:underline flex items-center gap-1">
            <ShoppingBag className="w-5 h-5" color="#dedae2" />
            Cart
          </Link>

          {user ? (
            <div className="relative">
              <User
                className="cursor-pointer w-6 h-6"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-lg py-2 z-10">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 hover:bg-gray-100"
                    onClick={() => setDropdownOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-left w-full hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="px-4 py-2 bg-red-600 text-white rounded-3xl hover:bg-red-700 text-center w-full md:w-auto"
            >
              Login / Register
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
