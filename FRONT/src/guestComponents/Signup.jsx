import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";

export default function Signup() {

  const { user,setUser,token, setToken, activePage, setActivePage, msg, setMsg } = useUserContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
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
    
    if (!isPasswordValid) {
      setMessage("Password must be at least 8 characters long");
      return;
    }
    
    if (!isPasswordMatch) {
      setMessage("Passwords do not match");
      return;
    }

    axiosClient.post('/register', userData)
      .then(({ data }) => {
        setUser(data.data.user);
        setToken(data.data.token);
        setMsg("Signed up successfully!");
        setTimeout(() => {
          setMsg("");
          navigate('/');
        }, 1500);
      })
      .catch(err => {
        const res = err.response;
        if (res && res.status === 422) {
          setMessage(res.data.errors || res.data.message);
        }
      });
  };



  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      
      <div className="card shadow-lg p-4" style={{ maxWidth: "450px", width: "100%" }}>
        
        <h2 className="text-center mb-4">Create Your Account</h2>

        {msg && (
          <div className="alert alert-success text-center py-2">
            {msg}
          </div>
        )}

        {message && (
          <div className="alert alert-danger">
            {typeof message === "string"
              ? <p>{message}</p>
              : Object.keys(message).map(key => (
                  <p key={key}>{message[key][0]}</p>
                ))
            }
          </div>
        )}

        <form onSubmit={onSubmit}>
          
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input 
              type="text"
              className="form-control"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email"
              className="form-control"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password"
              className={`form-control ${password && !isPasswordValid ? 'is-invalid' : ''}`}
              placeholder="Enter a password (min. 8 characters)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            {password && !isPasswordValid && (
              <div className="invalid-feedback d-block">
                Password must be at least 8 characters long
              </div>
            )}
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password"
              className={`form-control ${passwordConfirmation && !isPasswordMatch ? 'is-invalid' : ''}`}
              placeholder="Confirm your password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
            {passwordConfirmation && !isPasswordMatch && (
              <div className="invalid-feedback d-block">
                Passwords do not match
              </div>
            )}
          </div>

          <button className="btn btn-outline-success w-100 mt-2" disabled={!isFormValid}>
            Sign Up
          </button>

        </form>

        <p className="text-center mt-3">
          Already registered?
          <Link to="/login" className="ms-1">Sign In</Link>
        </p>

      </div>
    </div>
  );
}
