import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import { useNavigate, useLocation } from 'react-router-dom';

export default function Profile() {
  const { user, setUser, token, setToken, activePage, setActivePage } = useUserContext();
  const [editingField, setEditingField] = useState(null);
  const [value, setValue] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const navigate = useNavigate();

  const startEditing = (field) => {
    setEditingField(field);
    setValue(field === "password" ? "" : user[field]);
    setPasswordConfirm("");
    setMessage({ type: '', text: '' });
  };

  const cancelEditing = () => {
    setEditingField(null);
    setValue("");
    setPasswordConfirm("");
    setMessage({ type: '', text: '' });
  };

  const saveField = () => {
    if (!value.trim()) {
      setMessage({ type: 'error', text: 'Field cannot be empty' });
      return;
    }

    if (editingField === 'password') {
      if (value.length < 8) {
        setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
        return;
      }
      if (value !== passwordConfirm) {
        setMessage({ type: 'error', text: 'Passwords do not match' });
        return;
      }
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    let endpoint = "";
    let payload = {};

    if (editingField === "name") { //changing user name
      endpoint = '/profile/name';
      payload = { new_name : value };
    } else if (editingField === "email") { //changing user email
      endpoint = '/profile/email';
      payload = { new_email : value };
    } else if (editingField === "password") { //changing user password
      endpoint = "/profile/password";
      payload = {
        new_password: value,
        new_password_confirmation: passwordConfirm
      };
    }

    axiosClient
      .put(endpoint, payload)
      .then(({ data }) => {
        setUser(data.user);
        setMessage({ 
          type: 'success', 
          text: `${editingField.charAt(0).toUpperCase() + editingField.slice(1)} updated successfully!` 
        });
        setTimeout(() => {
          cancelEditing();
        }, 1500);
      })
      .catch((err) => {
        if (err.response && err.response.data.errors) {
          const errors = Object.values(err.response.data.errors).flat();
          setMessage({ type: 'error', text: errors[0] });
        } else {
          setMessage({ type: 'error', text: 'Failed to update. Please try again.' });
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getFieldIcon = (field) => {
    switch (field) {
      case 'name': return 'bi-person';
      case 'email': return 'bi-envelope';
      case 'password': return 'bi-shield-lock';
      default: return 'bi-gear';
    }
  };

  // Sign out function 
  const signOut = () => {
    console.log("Signing out...");
    axiosClient.post('/logout').then(() => {
      setUser(null);
      setToken(null);
      navigate("/login");
    });
  };



  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          {/* Profile Header */}
          <div className="text-center mb-5">
            <div className="position-relative d-inline-block mb-4">
              <div className="rounded-circle bg-gradient-primary d-flex align-items-center justify-content-center" 
                   style={{ width: '100px', height: '100px' }}>
                <i className="bi bi-person-fill text-white fs-1"></i>
              </div>
              <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-2 shadow-sm border">
                <i className="bi bi-pencil text-primary"></i>
              </div>
            </div>
            <h1 className="fw-bold text-dark mb-2">{user?.name}</h1>
            <p className="text-muted mb-4">{user?.email}</p>
            <div className="d-inline-flex gap-2 bg-light rounded-pill px-4 py-2">
              <span className="text-muted">Member since</span>
              <span className="fw-medium">
                {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Messages */}
          {message.text && (
            <div className={`alert alert-${message.type === 'error' ? 'danger' : 'success'} 
                          alert-dismissible fade show rounded-3 shadow-sm border-0 mb-4`} 
                 role="alert">
              <div className="d-flex align-items-center">
                <i className={`bi ${message.type === 'error' ? 'bi-exclamation-triangle' : 'bi-check-circle'} 
                            fs-5 me-3`}></i>
                <span className="fw-medium">{message.text}</span>
              </div>
              <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
            </div>
          )}

          {/* Profile Card */}
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div className="card-header bg-gradient-primary text-white py-4">
              <div className="d-flex align-items-center">
                <i className="bi bi-person-badge fs-3 me-3"></i>
                <div>
                  <h4 className="fw-bold mb-0">Profile Settings</h4>
                  <p className="mb-0 opacity-75">Manage your account information</p>
                </div>
              </div>
            </div>

            <div className="card-body p-4 p-lg-5">
              {/* Name Section */}
              <div className="profile-section mb-5 pb-4 border-bottom">
                <div className="d-flex align-items-center mb-4">
                  <div className="rounded-circle bg-primary bg-opacity-10 p-3 me-3">
                    <i className="bi bi-person fs-4 text-primary"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Personal Information</h5>
                    <p className="text-muted mb-0">Update your name and contact details</p>
                  </div>
                </div>

                <div className="row g-4">
                  <div className="col-md-6">
                    <label className="form-label text-muted mb-2">
                      <i className="bi bi-person me-2"></i>
                      Full Name
                    </label>
                    {editingField === "name" ? (
                      <div className="mb-4">
                        <input
                          type="text"
                          className="form-control border-2 border-primary-subtle rounded-3 py-3"
                          value={value}
                          onChange={(e) => setValue(e.target.value)}
                          placeholder="Enter your name"
                          autoFocus
                        />
                        <div className="mt-3 d-flex gap-2">
                          <button 
                            className="btn btn-primary px-4 py-2 rounded-pill flex-fill"
                            onClick={saveField}
                            disabled={loading}
                          >
                            {loading ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                Saving...
                              </>
                            ) : (
                              <>
                                <i className="bi bi-check-circle me-2"></i>
                                Save Changes
                              </>
                            )}
                          </button>
                          <button 
                            className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                            onClick={cancelEditing}
                            disabled={loading}
                          >
                            <i className="bi bi-x-circle me-2"></i>
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-3">
                        <div>
                          <p className="fw-bold fs-5 mb-0">{user?.name}</p>
                        </div>
                        <button 
                          className="btn btn-outline-primary rounded-pill px-3"
                          onClick={() => startEditing("name")}
                        >
                          <i className="bi bi-pencil me-1"></i>
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Email Section */}
              <div className="profile-section mb-5 pb-4 border-bottom">
                <div className="d-flex align-items-center mb-4">
                  <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                    <i className="bi bi-envelope fs-4 text-success"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Email Address</h5>
                    <p className="text-muted mb-0">Update your email for notifications</p>
                  </div>
                </div>

                {editingField === "email" ? (
                  <div className="mb-4">
                    <div className="form-floating mb-3">
                      <input
                        type="email"
                        className="form-control border-2 border-success-subtle rounded-3"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        placeholder="name@example.com"
                        id="emailInput"
                      />
                      <label htmlFor="emailInput">
                        <i className="bi bi-envelope me-2"></i>
                        Email Address
                      </label>
                    </div>
                    <div className="mt-3 d-flex gap-2">
                      <button 
                        className="btn btn-success px-4 py-2 rounded-pill flex-fill"
                        onClick={saveField}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-check-circle me-2"></i>
                            Update Email
                          </>
                        )}
                      </button>
                      <button 
                        className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                        onClick={cancelEditing}
                        disabled={loading}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-3">
                    <div>
                      <p className="fw-bold fs-5 mb-0">{user?.email}</p>
                      <small className="text-muted">
                        <i className="bi bi-check-circle text-success me-1"></i>
                        Verified email address
                      </small>
                    </div>
                    <button 
                      className="btn btn-outline-success rounded-pill px-3"
                      onClick={() => startEditing("email")}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Change
                    </button>
                  </div>
                )}
              </div>

              {/* Password Section */}
              <div className="profile-section">
                <div className="d-flex align-items-center mb-4">
                  <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                    <i className="bi bi-shield-lock fs-4 text-warning"></i>
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0">Password & Security</h5>
                    <p className="text-muted mb-0">Update your password for account security</p>
                  </div>
                </div>

                {editingField === "password" ? (
                  <div className="mb-4">
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="password"
                            className="form-control border-2 border-warning-subtle rounded-3"
                            value={value}
                            onChange={(e) => setValue(e.target.value)}
                            placeholder="New Password"
                            id="newPassword"
                          />
                          <label htmlFor="newPassword">
                            <i className="bi bi-key me-2"></i>
                            New Password
                          </label>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="password"
                            className="form-control border-2 border-warning-subtle rounded-3"
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                            placeholder="Confirm Password"
                            id="confirmPassword"
                          />
                          <label htmlFor="confirmPassword">
                            <i className="bi bi-key-fill me-2"></i>
                            Confirm Password
                          </label>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="alert alert-warning border-0 rounded-3 mb-3">
                        <div className="d-flex align-items-center">
                          <i className="bi bi-info-circle me-2"></i>
                          <small>Password must be at least 8 characters long</small>
                        </div>
                      </div>
                    </div>
                    <div className="d-flex gap-2">
                      <button 
                        className="btn btn-warning px-4 py-2 rounded-pill flex-fill"
                        onClick={saveField}
                        disabled={loading}
                      >
                        {loading ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Updating...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-shield-check me-2"></i>
                            Update Password
                          </>
                        )}
                      </button>
                      <button 
                        className="btn btn-outline-secondary px-4 py-2 rounded-pill"
                        onClick={cancelEditing}
                        disabled={loading}
                      >
                        <i className="bi bi-x-circle me-2"></i>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center justify-content-between bg-light p-3 rounded-3">
                    <div>
                      <p className="fw-bold fs-5 mb-0">••••••••••</p>
                      <small className="text-muted">
                        <i className="bi bi-check-circle text-success me-1"></i>
                        Password last changed recently
                      </small>
                    </div>
                    <button 
                      className="btn btn-outline-warning rounded-pill px-3"
                      onClick={() => startEditing("password")}
                    >
                      <i className="bi bi-pencil me-1"></i>
                      Change Password
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer */}
            <div className="card-footer bg-light border-top py-4">
              <div className="row align-items-center">
                
                  <button onClick={() => signOut()} className="btn btn-outline-danger rounded-pill px-4">
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Sign Out  
                  </button>
                
              </div>
            </div>
          </div>

          
          
        </div>
      </div>
    </div>
  );
}

// Add CSS for custom colors
const styles = `
  .bg-gradient-primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  .bg-purple {
    background-color: #6f42c1;
  }
  .text-purple {
    color: #6f42c1;
  }
  .profile-section {
    transition: all 0.3s ease;
  }
  .hover-lift:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0,0,0,0.1);
  }
`;

// Add styles to document head
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement("style");
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}