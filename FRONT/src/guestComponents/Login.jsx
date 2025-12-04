import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Login() {

  const { user,setUser,token, setToken, activePage, setActivePage, msg, setMsg } = useUserContext();
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState(null);
  const [err, setErr] =useState("");
  const navigate = useNavigate();
  const onSubmit = (ev) => {
    ev.preventDefault();

    axiosClient.post('/login', { email, password })
      .then(({ data }) => {
        setUser(data.data.user);
        setToken(data.data.token);
        setRole(role);
        setMessage("Logged in successfully!");
        setTimeout(() => {
          setMsg("");
          navigate(data.data.redirect);
        }, 1500);
      })
        .catch((err) => {
        const response = err.response;
        if (response && response.status === 401) {
          setMsg(response.data.message);
        }
      });
  };
  const handleClick = (e) => {
    setErr(null);
    setActivePage("Signup");
    navigate('signup');

  }

  return (
    <div className="container d-flex justify-content-center align-items-center vh-100">
      <div className="card shadow-lg p-4" style={{ maxWidth: "420px", width: "100%" }}>
        
        <h2 className="text-center mb-4">Login</h2>

        {msg && (
          <div className="alert alert-danger text-center py-2">
            {msg}
          </div>
        )}


        {message && (
          <div className="alert alert-success text-center py-2">
            {message}
          </div>
        )}

        {err && (
          <div className="alert alert-danger text-center py-2">
            {err}
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
              minlenght="8"
            />
          </div>

          
          <button className="btn btn-outline-primary w-100 mt-2">
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