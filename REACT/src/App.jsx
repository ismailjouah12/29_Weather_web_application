import React from "react";
import { Outlet, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import Search from "./components/Search.jsx";
import Navigation from "./components/Navigation.jsx";
import WeatherCard from "./components/WethearCard.jsx";



export default function App() {
  return (
    <div className="">
      <h1 className="">WETHEAR APP</h1>
  
      <Navigation />

      <Search />

      <WeatherCard city="AGADIR" temperature={25} condition="Sunny" />
      <WeatherCard city="MARRAKECH" temperature={30} condition="Hot" />
      <WeatherCard city="CASABLANCA" temperature={22} condition="Cloudy" />

    </div>
  );
}

 
