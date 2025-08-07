import React, { useState } from 'react';
import axios from 'axios';
// import '../pages/Login.css';
import { FaUser, FaPhone, FaEnvelope, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import AppNavbar from './AppNavbar'
// import { div } from 'framer-motion/client';
const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    password: ''
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '' });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    setAlert({ type: '', message: '' });

    try {
       await axios.post('https://maziwasmart.onrender.com/api/userAuth/register', {
        ...formData
      });

      setAlert({ type: 'success', message: 'Admin registered successfully!' });
      setTimeout(() => {
        navigate('/admin-login');
      }, 2000);
    } catch (error) {
      setAlert({ type: 'error', message: error.response?.data?.message || 'Something went wrong!' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>

      <AppNavbar />
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2>Register Admin</h2>

        {alert.message && (
          <div className="alert-msg" style={{ backgroundColor: alert.type === 'error' ? '#ffcdd2' : '#e0f2f1', color: alert.type === 'error' ? '#b71c1c' : '#004d40' }}>
            {alert.message}
          </div>
        )}

        <div className="input-group">
          <FaUser className="icon" />
          <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <FaPhone className="icon" />
          <input type="tel" name="phone" placeholder="Phone Number" value={formData.phone} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        </div>

        <div className="input-group">
          <FaEnvelope className="icon" />
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
          />
          <span className="eye-icon" onClick={() => setShowPassword(prev => !prev)}>
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>

        <button className="login-btn" type="submit" disabled={loading}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div className="terms">Already have an account? <a href="/login">Login</a></div>
      </form>
    </div>
     </div>
  );
};

export default AdminRegister;
