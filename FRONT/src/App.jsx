import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import { Outlet } from "react-router-dom";
import { useUserContext } from "./UserContext.jsx";
import { useEffect,useState } from "react";
import Navigation from "./sharedComponents/Navigation.jsx";
import Search from "./sharedComponents/Search.jsx";
import weatherIcon from './assets/Weather.png';
import "./index.css";
import Back from"./assets/back_v1.avif";



export default function App() {
  const { user,setUser,token, setToken, activePage, setActivePage } = useUserContext();
  
  
  return (
    <div className="container-fluid p-4" style={{ minHeight: "100vh", backgroundColor: "#41a2f6ff",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat" }}>

      {/* Top Banner */}
      <div className="container rounded mb-3 d-flex justify-content-between align-items-center flex-wrap">
        <div className="d-flex align-items-center ">
          <h4 className="mb-0 me-2">WeatherApp</h4> 
          <img 
            src={weatherIcon} 
            alt="weather app logo"
            style={{ width: "35px", height: "35px" }}
          />
        </div>
        <div className=" container-fluid " >
          <Search />
        </div>
        
      </div>

      {/* Navigation BELOW */}
      <Navigation/>

      {/* Pages */}
      <Outlet />
    </div>
  );
}
