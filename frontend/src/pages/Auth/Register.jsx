import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios'; // Import axios
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();

  // The 'name' field is not in our User model, so we remove it.
  // The User model only requires email and password.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // This function now makes a real API call.
  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    // --- Form Validation ---
    if (password !== confirmPassword) {
      return setError('Passwords do not match.');
    }
    if (password.length < 6) {
      return setError('Password must be at least 6 characters long.');
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return setError('Please enter a valid email address.');
    }

    setIsLoading(true);

    try {
      // Make the API call to your backend registration endpoint.
      const response = await axios.post('/api/users/register', { email, password });

      if (response.data && response.data.success) {
        // On success, redirect the user to the login page with a helpful message.
        navigate('/login', {
          state: { message: 'Registration successful! Please log in.' }
        });
      }
    } catch (err) {
      // If the API returns an error (e.g., user already exists), display it.
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">Create an Account</h1>
          <p className="mt-2 text-gray-600">Join us to start saving today.</p>
        </div>
        
        <form className="space-y-6" onSubmit={handleRegister}>
          {/* Note: We removed the "Full Name" input as it's not in the User schema */}
          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-4 text-gray-400" />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md" placeholder="Email address" required />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3.5 left-4 text-gray-400" />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md" placeholder="Password" required />
          </div>
          <div className="relative">
            <FaLock className="absolute top-3.5 left-4 text-gray-400" />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md" placeholder="Confirm Password" required />
          </div>

          {error && <p className="text-sm text-red-600 text-center">{error}</p>}

          <div>
            <button type="submit" disabled={isLoading} className="w-full flex justify-center py-3 px-4 text-lg font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400">
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
        </form>
        <div className="text-sm text-center text-gray-600">
          <p>Already have an account? <Link to="/login" className="font-medium text-blue-600 hover:underline">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;