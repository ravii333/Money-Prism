import React from 'react';
import { Link } from 'react-router-dom';

function Login() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-800 via-blue-950 to-red-800 flex items-center justify-center px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">Login</h2>
        <form className="space-y-4">
          <div className="space-y-1">
            <label htmlFor="loginEmail" className="text-white text-sm">Email or Phone No.</label>
            <input
              id="loginEmail"
              type="text"
              placeholder="Enter your email or phone"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="loginPassword" className="text-white text-sm">Password</label>
            <input
              id="loginPassword"
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-1 focus:ring-gray-300"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Login
          </button>

          <div className="flex justify-between text-sm text-white mt-2">
            <Link to="/register" className="hover:underline">Register</Link>
            <Link to="/forgot_password" className="hover:underline">Forgot Password?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
