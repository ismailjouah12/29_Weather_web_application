import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const { user, setUser, token, setToken, activePage, setActivePage, msg, setMsg } = useUserContext();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const navigate = useNavigate();

  const onSubmit = (ev) => {
    ev.preventDefault();
    setLoading(true);
    setMessage(null);

    axiosClient.post('/login', { email, password })
      .then(({ data }) => {
        setUser(data.data.user);
        setToken(data.data.token);
        setMessage("Logged in successfully!");
        setTimeout(() => {
          setMsg("");
          navigate(data.data.redirect);
        }, 1500);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 401) {
          setMessage(response.data.message);
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
      <div className="card shadow-lg border-0" style={{ maxWidth: "420px", width: "100%", borderRadius: "20px" }}>
        
        <div className="card-header bg-primary text-white text-center py-4" 
             style={{ 
               borderTopLeftRadius: "20px", 
               borderTopRightRadius: "20px",
               background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" 
             }}>
          <h2 className="mb-1 fw-bold">
            <i className="bi bi-person-circle me-2"></i>
            Login
          </h2>
          <p className="mb-0 opacity-75">Welcome back to WeatherApp</p>
        </div>

        <div className="card-body p-4">
          {/* Messages */}
          {message && (
            <div className={`alert ${message === 'Logged in successfully!' ? 'alert-success' : 'alert-danger'} 
                          alert-dismissible fade show rounded-3 mb-4`} 
                 role="alert">
              <div className="d-flex align-items-center">
                <i className={`bi ${message === 'Logged in successfully!' ? 'bi-check-circle' : 'bi-exclamation-triangle'} me-2`}></i>
                <span>{message}</span>
              </div>
              <button type="button" className="btn-close" onClick={() => setMessage(null)}></button>
            </div>
          )}

          <form onSubmit={onSubmit}>
            {/* Email Field */}
            <div className="mb-4">
              <label className="form-label fw-medium">
                <i className="bi bi-envelope me-1"></i>
                Email Address
              </label>
              <input 
                type="email" 
                className="form-control border-2 rounded-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
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
                className="form-control border-2 rounded-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                minLength="8"
                disabled={loading}
              />
              <div className="form-text">
                <i className="bi bi-info-circle me-1"></i>
                Must be at least 8 characters
              </div>
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary w-100 py-3 rounded-pill fw-bold"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                  Signing In...
                </>
              ) : (
                <>
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Login
                </>
              )}
            </button>
          </form>

          <div className="d-flex align-items-center my-4">
            <hr className="flex-grow-1" />
            <span className="mx-3 text-muted small">OR</span>
            <hr className="flex-grow-1" />
          </div>

          {/* Sign Up Link */}
          <div className="text-center">
            <p className="text-muted mb-3">
              Don't have an account?  
              <Link 
                to="/signup" 
                className="ms-1 fw-medium text-decoration-none"
              >
                Create an account
              </Link>
            </p>
          </div>
         
        </div>
      </div>
    </div>
  );
}