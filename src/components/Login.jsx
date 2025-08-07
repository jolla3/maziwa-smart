// src/components/Login.jsx
import React, { useState, useContext } from 'react';
import { Eye, EyeOff, User, Lock } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AppNavbar from './AppNavbar';
import { jwtDecode } from 'jwt-decode';
import { AuthContext } from '../components/PrivateComponents/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const { setUser, setToken } = useContext(AuthContext);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const togglePassword = () => setShowPassword((prev) => !prev);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post(
        'https://maziwasmart.onrender.com/api/userAuth/login',
        formData
      );

      const { token } = response.data;
      const decodedUser = jwtDecode(token);

      // ✅ Save with correct keys that AuthContext expects
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(decodedUser));

      setToken(token);
      setUser(decodedUser);

      toast.success('Login successful!', { autoClose: 1000 });

      // Navigate based on role
      setTimeout(() => {
        const role = decodedUser.role;

        if (role === 'admin') navigate('/admindashboard');
        else if (role === 'porter') navigate('/porterdashboard');
        else if (role === 'data_collector') navigate('/farmerdashboard');
        else navigate('/');
      }, 1200);
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <AppNavbar />
      <div className="login-container">
        <form className="login-form" onSubmit={handleLogin}>
          <h2>User Login</h2>

          <div className="input-group">
            <User className="icon" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="input-group">
            <Lock className="icon" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder="Password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            {showPassword ? (
              <EyeOff className="eye-icon" size={20} onClick={togglePassword} />
            ) : (
              <Eye className="eye-icon" size={20} onClick={togglePassword} />
            )}
          </div>

          <button className="login-btn" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="register-link">
            Don't have an account? <a href="/register">Register</a>
          </div>

          <p className="terms">By logging in, you agree to our terms.</p>
        </form>
        <ToastContainer position="top-center" />
      </div>
    </div>
  );
};

export default Login;
