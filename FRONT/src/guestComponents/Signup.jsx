import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";

export default function Signup() {
  const { user, setUser, token, setToken, activePage, setActivePage, msg, setMsg } = useUserContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  
  const isPasswordValid = password.length >= 8;
  const isPasswordMatch = password === passwordConfirmation && password.length > 0;
  const isFormValid = name && email && isPasswordValid && isPasswordMatch;

  const userData = {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    setMessage(null);
    
    if (!isPasswordValid) {
      setMessage("Password must be at least 8 characters long");  //varify password
      setLoading(false);
      return;
    }
    
    if (!isPasswordMatch) {
      setMessage("Passwords do not match");  
      setLoading(false);
      return;
    }

    axiosClient.post('/register', userData)
      .then(({ data }) => {
        setUser(data.data.user);
        setToken(data.data.token);
        setMsg("Account created successfully!");
        setTimeout(() => {
          setMsg("");
          navigate('/');
        }, 1500);
      })
      .catch(err => {
        const res = err.response;
        if (res && res.status === 422) {
          setMessage(res.data.errors || res.data.message);
        } else {
          setMessage('An error occurred. Please try again.');
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      
      <div className="card shadow-lg border-0" style={{ maxWidth: "450px", width: "100%", borderRadius: "20px" }}>
        
        {/* Card Header with Gradient */}
        <div className="card-header bg-success text-white text-center py-4" 
             style={{ 
               borderTopLeftRadius: "20px", 
               borderTopRightRadius: "20px",
               background: "linear-gradient(135deg, #38a169 0%, #276749 100%)" 
             }}>
          <h2 className="mb-1 fw-bold">
            <i className="bi bi-person-plus me-2"></i>
            Create Account
          </h2>
          <p className="mb-0 opacity-75">Join WeatherApp today</p>
        </div>

        <div className="card-body p-4">
          {/* Messages */}
          {msg && (
            <div className="alert alert-success alert-dismissible fade show rounded-3 mb-4" role="alert">
              <div className="d-flex align-items-center">
                <i className="bi bi-check-circle me-2"></i>
                <span>{msg}</span>
              </div>
              <button type="button" className="btn-close" onClick={() => setMsg("")}></button>
            </div>
          )}

          {message && (
            <div className="alert alert-danger alert-dismissible fade show rounded-3 mb-4" role="alert">
              <div className="d-flex align-items-center">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <div>
                  {typeof message === "string"
                    ? <p className="mb-0">{message}</p>
                    : Object.keys(message).map(key => (
                        <p key={key} className="mb-1">{message[key][0]}</p>
                      ))
                  }
                </div>
              </div>
              <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
            </div>
          )}

          <form onSubmit={onSubmit}>
            {/* Name Field */}
            <div className="mb-4">
              <label className="form-label fw-medium">
                <i className="bi bi-person me-1"></i>
                Full Name
              </label>
              <input 
                type="text"
                className="form-control border-2 rounded-3"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Email Field */}
            <div className="mb-4">
              <label className="form-label fw-medium">
                <i className="bi bi-envelope me-1"></i>
                Email Address
              </label>
              <input 
                type="email"
                className="form-control border-2 rounded-3"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
              />
            </div>

            {/* Password Field */}
            <div className="mb-4">
              <label className="form-label fw-medium">
                <i className="bi bi-lock me-1"></i>
                Password
              </label>
              <input 
                type="password"
                className={`form-control border-2 rounded-3 ${password && !isPasswordValid ? 'is-invalid' : ''}`}
                placeholder="Enter a password (min. 8 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                disabled={loading}
              />
              <div className="form-text">
                <i className="bi bi-info-circle me-1"></i>
                Must be at least 8 characters
              </div>
              {password && !isPasswordValid && (
                <div className="invalid-feedback d-block">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  Password must be at least 8 characters long
                </div>
              )}
            </div>

            {/* Confirm Password Field */}
            <div className="mb-4">
              <label className="form-label fw-medium">
                <i className="bi bi-lock-fill me-1"></i>
                Confirm Password
              </label>
              <input 
                type="password"
                className={`form-control border-2 rounded-3 ${passwordConfirmation && !isPasswordMatch ? 'is-invalid' : ''}`}
                placeholder="Confirm your password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                required
                disabled={loading}
              />
              {passwordConfirmation && !isPasswordMatch && (
                <div className="invalid-feedback d-block">
                  <i className="bi bi-exclamation-circle me-1"></i>
                  Passwords do not match
                </div>
              )}
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-success w-100 py-3 rounded-pill fw-bold"
              disabled={!isFormValid || loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  <i className="bi bi-person-plus me-2"></i>
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted small">OR</span>
            <hr className="flex-grow-1" />
          </div>

          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-muted mb-3">
              Already have an account?
              <Link 
                to="/login" 
                className="ms-1 fw-medium text-decoration-none"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}