import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

export default function Register() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    isOwner: false,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("http://localhost:5000/register", {
        ...values,
      });
      toast.success("Registration successful!");
    } catch (error) {
      toast.error("Registration failed. Please try again.");
      console.log(error);
    }
  };

  const handleCheckboxChange = (e) => {
    setValues({ ...values, isOwner: e.target.checked });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-card">
          <h2 className="login-title">Create Your Account</h2>
          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="form-input"
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                required
              />
            </div>
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
                placeholder="Create a password"
                className="form-input"
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })}
                required
              />
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                name="isOwner"
                id="isOwner"
                checked={values.isOwner}
                onChange={handleCheckboxChange}
                className="checkbox-input"
              />
              <label htmlFor="isOwner" className="checkbox-label">
                I am a restaurant owner
              </label>
            </div>
            <button type="submit" className="submit-button">Register</button>
            <div className="login-link">
              Already have an account? <Link to="/login" className="login-text">Login</Link>
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}