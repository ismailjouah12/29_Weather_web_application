import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Link } from 'react-router-dom';
import axiosClient from "./axiosClient.js";
import { useUserContext } from "./UserContext.jsx";import { Navigate, Outlet } from "react-router-dom";
import Navigation from "./sharedComponents/Navigation.jsx";
import Search from "./sharedComponents/Search.jsx";
import weatherIcon from './assets/Weather.png';

export default function App() {
const { user, setUser, token, setToken } = useUserContext();
 
       

return (
  <div className="container-fluid min-vh-100 d-flex flex-column p-3">

  <div className="container bg-success p-3 rounded mb-3 d-flex justify-content-between align-items-center">
    <div className="d-flex align-items-center mb-3">
      <h3 className="me-3 mb-0">Weather APP</h3>
      <img 
        src={weatherIcon} 
        alt="weather app logo" 
        className="img-fluid" 
        style={{ width: "30px", height: "30px" }}   
      />
    </div>

    <Search />
    <Navigation />
  </div>
  <div className="container bg-primary p-3 rounded flex-grow-1 align-items-center">
    <Outlet />
  </div>

</div>

);
}

 
