// src/pages/Auth/Login.jsx

import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FaUser, FaLock } from 'react-icons/fa';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation(); // Hook to access the state passed from navigate

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // --- THIS useEffect IS THE NEW ADDITION ---
  // It runs when the component loads to check for a success message
  useEffect(() => {
    if (location.state?.message) {
      setSuccessMessage(location.state.message);
      // Clean the location state to prevent the message from re-appearing on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleLogin = (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        setError('Please enter a valid email address.');
        return;
    }

    setIsLoading(true);
    setError('');
    setSuccessMessage(''); // Clear success message on new login attempt

    setTimeout(() => {
      const userName = email.split('@')[0];
      const loggedInUser = {
        id: new Date().getTime(),
        name: userName.charAt(0).toUpperCase() + userName.slice(1),
        email: email,
      };
      
      setUser(loggedInUser);
      localStorage.setItem('user', JSON.stringify(loggedInUser));
      navigate('/');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Welcome Back to Money-Prism
          </h1>
          <p className="mt-2 text-gray-600">
            Sign in to access your alerts and account.
          </p>
        </div>

        {/* --- THIS BLOCK DISPLAYS THE SUCCESS MESSAGE --- */}
        {successMessage && (
          <div className="p-3 my-2 text-sm text-center text-green-800 bg-green-100 rounded-lg">
            {successMessage}
          </div>
        )}

        {/* --- THIS BLOCK DISPLAYS THE ERROR MESSAGE --- */}
        {error && (
          <div className="p-3 my-2 text-sm text-center text-red-800 bg-red-100 rounded-lg">
            {error}
          </div>
        )}
        
        <form className="space-y-6" onSubmit={handleLogin}>
          <div className="relative">
            <FaUser className="absolute top-3.5 left-4 text-gray-400" />
            <input
              id="email-address"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Enter any valid email"
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3.5 left-4 text-gray-400" />
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Enter any password"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-gray-500 bg-gray-200 hover:bg-brand-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 hover:bg-gray-600 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </button>
          </div>
        </form>

        <div className="text-sm text-center text-gray-600">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-brand-blue hover:text-brand-blue-light">
              Register here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;