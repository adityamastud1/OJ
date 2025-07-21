import React, { useState } from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signin() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '' });
  const [message, setMessage] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const endpoint = isSignup ? 'register' : 'login';

    try {
      const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/auth/${endpoint}`, formData);
      setUser(res.data.user);
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (user) return <h2 className="text-center text-white">You are already logged in</h2>;

  return (
    <div className="min-h-screen bg-[#1c1c1c] flex items-center justify-center px-4">
      <div className="bg-[#0f0f0f] rounded-lg shadow-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">
          {isSignup ? 'Sign Up' : 'Sign In'} to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-indigo-500"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring focus:ring-indigo-500"
          />
          <button
            type="submit"
            className="w-full bg-[#b1900c] hover:bg-[#7c6508] text-white py-2 rounded font-semibold transition-colors duration-300"
          >
            {isSignup ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p
          className="text-sm text-gray-400 mt-4 text-center cursor-pointer hover:text-indigo-400 transition-colors duration-300"
          onClick={() => setIsSignup(!isSignup)}
        >
          {isSignup ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
        </p>

        {message && <p className="text-red-400 mt-2 text-center">{message}</p>}

        <div className="flex items-center my-6">
          <hr className="flex-grow border-gray-600" />
          <span className="text-gray-400 px-3">OR</span>
          <hr className="flex-grow border-gray-600" />
        </div>

        <div className="flex justify-center">
          <GoogleLoginButton />
        </div>
      </div>
    </div>
  );
}
