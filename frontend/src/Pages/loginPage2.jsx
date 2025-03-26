import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import axios from 'axios';

export default function Login() {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/login", values, {
        withCredentials: true
      });

      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.role);
        if (data.role === "owner") {
          navigate("/admin");
        } else {
          navigate("/home");
        }
      }

    } catch (error) {
      console.log(error)
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Login to Your Account</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="email" className="form-label">Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                className="form-input"
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className="form-label">Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter your password"
                className="form-input"
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="submit-button">Login</button>
            <div className="register-link">
              Don't have an account? <Link to="/register" className="register-text">Register</Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}