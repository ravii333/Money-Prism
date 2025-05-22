import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Register() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', {
        identifier,
        password,
      });

      if (res.status === 201) {
        alert('Registration successful!');
        navigate('/login');
      }
    } catch (err) {
      console.error(err);
      alert('Registration failed. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-700 via-indigo-900 to-fuchsia-600  flex items-center justify-center px-4">
      <div className="backdrop-blur-md bg-white/10 border border-white/20 p-6 sm:p-8 rounded-xl shadow-xl w-full max-w-sm sm:max-w-md md:max-w-lg">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-white">Register</h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label htmlFor="email" className="text-white text-sm">Email or Phone No.</label>
            <input
              id="email"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Enter your email or phone"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-1 focus:ring-gray-300"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-white text-sm">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-1 focus:ring-gray-300"
              required
            />
          </div>

          <div className="space-y-1">
            <label htmlFor="confirmPassword" className="text-white text-sm">Confirm Password</label>
            <input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your password"
              className="w-full p-3 rounded-lg bg-white/20 text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-1 focus:ring-gray-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-semibold py-3 rounded-lg transition"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
