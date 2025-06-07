import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEnvelope } from 'react-icons/fa';

const Register = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = (e) => {
    e.preventDefault();
    setError('');

    // --- Form Validation ---
    if (!name || !email || !password || !confirmPassword) {
      setError('All fields are required.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return;
    }

    setIsLoading(true);

    setTimeout(() => {
      
      console.log('Simulating registration for:', { name, email });
      
      setIsLoading(false);
      navigate('/login', {
        state: { message: 'Registration successful! Please log in.' }
      });

    }, 1500); 
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-2xl shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900">
            Create Your PartWise Account
          </h1>
          <p className="mt-2 text-gray-600">
            Join us to start saving on parts today.
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleRegister}>
          <div className="relative">
            <FaUser className="absolute top-3.5 left-4 text-gray-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Full Name"
              required
            />
          </div>

          <div className="relative">
            <FaEnvelope className="absolute top-3.5 left-4 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Email address"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3.5 left-4 text-gray-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Password"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute top-3.5 left-4 text-gray-400" />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-blue"
              placeholder="Confirm Password"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent text-lg font-medium rounded-md text-gray-500 bg-gray-100 hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Register'}
            </button>
          </div>
        </form>

        <div className="text-sm text-center text-gray-600">
          <p>
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-brand-blue hover:text-brand-blue-light">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;