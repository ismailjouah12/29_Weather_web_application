import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import { useState } from 'react';

export default function Login() {

  const { setUser, setToken, activePage, setActivePage } = useUserContext();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);

  const onSubmit = (ev) => {
    ev.preventDefault();

    axiosClient.post('/login', { email, password })
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message);
        }
      });
  };
  const handleClick = (e) => {
    setMessage(null);
    setActivePage("Signup");

  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "420px", width: "100%" }}>
        
        <h2 className="text-center mb-4">Login</h2>

        {message && (
          <div className="alert alert-danger text-center py-2">
            {message}
          </div>
        )}

        <form onSubmit={onSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input 
              type="email" 
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Password</label>
            <input 
              type="password" 
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button className="btn btn-primary w-100 mt-2">
            Login
          </button>
        </form>

        <p className="text-center mt-3">
          Not registered?  
          <Link to="/signup" onClick={(e) => handleClick(e) } className="ms-1">Create an account</Link>
        </p>

      </div>
    </div>
  );
}
