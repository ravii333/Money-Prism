import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { FaLock, FaEnvelope } from 'react-icons/fa';

const Login = ({ setUser }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const response = await axios.post('/api/users/login', { email, password });
      if (response.data && response.data.success) {
        localStorage.setItem('userInfo', JSON.stringify(response.data.data));
        setUser(response.data.data);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-gray-900">Welcome Back</h1>
        {successMessage && <div className="p-3 text-sm text-center text-green-800 bg-green-100 rounded-lg">{successMessage}</div>}
        {error && <div className="p-3 text-sm text-center text-red-800 bg-red-100 rounded-lg">{error}</div>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="relative"><FaEnvelope className="absolute top-3.5 left-4 text-gray-400" /><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md" placeholder="Email Address" required /></div>
          <div className="relative"><FaLock className="absolute top-3.5 left-4 text-gray-400" /><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md" placeholder="Password" required /></div>
          <button type="submit" disabled={isLoading} className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition disabled:bg-gray-400">{isLoading ? 'Signing In...' : 'Sign In'}</button>
        </form>
        <p className="text-sm text-center text-gray-600">Don't have an account? <Link to="/register" className="font-medium text-blue-600 hover:underline">Register here</Link></p>
      </div>
    </div>
  );
};
export default Login;