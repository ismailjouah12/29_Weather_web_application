import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link, useNavigate } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";

export default function Signup() {

  const { setUser, setToken } = useUserContext();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [message, setMessage] = useState(null);

  const userData = {
    name,
    email,
    password,
    password_confirmation: passwordConfirmation
  };

  const onSubmit = (ev) => {
    ev.preventDefault();

    axiosClient.post('/register', userData)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
        navigate('/');
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
              className="form-control"
              placeholder="Enter a password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <input 
              type="password"
              className="form-control"
              placeholder="Confirm your password"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              required
            />
          </div>

          <button className="btn btn-success w-100 mt-2">
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
