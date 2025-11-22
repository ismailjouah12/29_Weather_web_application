import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import { useState , useRef } from 'react';

export default function Login() {

  const { user, setUser, token, setToken } = useUserContext();
  
  const [email, setEmail] = useState()
  const [password, setPassword] = useState()
  const [message, setMessage] = useState(null) 


  const onSubmit = ev => {
    ev.preventDefault()

    const userData = {
      email: email,
      password: password,
    }
    axiosClient.post('/login', userData)
      .then(({data}) => {
        setUser(data.user)
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;
        if (response && response.status === 422) {
          setMessage(response.data.message)
        }
      })
  }

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={onSubmit}>
          <h1 className="title">Login </h1>

          {message &&
            <div className="alert">
              <p>{message}</p>
            </div>
          }
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"/>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password"/>
          <button className="btn btn-block">Login</button>
          <p className="message">Not registered ? <Link to="/signup">Create an account</Link></p>
        </form>
      </div>
    </div>
  )
}