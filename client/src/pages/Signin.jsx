import React, { useState } from 'react';
import GoogleLoginButton from '../components/GoogleLoginButton';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Signin() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [isSignup, setIsSignup] = useState(false); // toggle between login/signup
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const endpoint = isSignup ? 'register' : 'login';
    try {
      const res = await axios.post(`http://localhost:5000/auth/${endpoint}`, formData);
      setUser(res.data.user); // store user in context
      localStorage.setItem('token', res.data.token); // optional
      navigate('/'); // redirect to homepage
    } catch (err) {
      setMessage(err.response?.data?.message || 'Something went wrong');
    }
  };

  if (user) {
    return <h2>You are already logged in</h2>;
  }

  return (
    <div style={{ maxWidth: '400px', margin: '2rem auto', textAlign: 'center' }}>
      <h2>{isSignup ? 'Sign Up' : 'Login'} with Email</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {isSignup && (
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
            required
          />
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button type="submit">{isSignup ? 'Sign Up' : 'Login'}</button>
        <p style={{ cursor: 'pointer', color: 'blue' }} onClick={() => setIsSignup(!isSignup)}>
          {isSignup ? 'Already have an account? Login' : "Don't have an account? Sign Up"}
        </p>
        {message && <p style={{ color: 'red' }}>{message}</p>}
      </form>

      <hr style={{ margin: '2rem 0' }} />
      <h3>OR</h3>
      <GoogleLoginButton />
    </div>
  );
}
