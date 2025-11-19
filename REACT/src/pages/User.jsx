import Search from "../components/Search.jsx";
import 'bootstrap/dist/css/bootstrap.min.css'
import React from "react";
import WeatherCard from "../components/WethearCard.jsx";
import App from "../App.jsx";
import { Outlet } from "react-router-dom";

export default function User() {
  return (<>
  <div className="">
    <Outlet />

  </div>

  
    
    </>
  );
}