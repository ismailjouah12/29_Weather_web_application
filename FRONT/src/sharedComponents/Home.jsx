import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import Search from './Search.jsx';
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

//-----------------------------------------------------main city card----------------------------------------------



function MainCard({ city }) {
const {token, setToken, activePage, setActivePage} = useUserContext();
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const navigate = useNavigate();
  
  axiosClient.get(`/weather?city=${city}`)
    .then(({ data }) => {
      setWeather(data);
      setError(null);
    })
    .catch(err => setError(err.message));

    
    const handleClick = () => {
      if (token) {
        navigate(`/city/${city}`);
        return;
      }
      navigate(`/signup`);
      setActivePage("Signup");
    }

  return (
    <div className="container mb-5">
      {error && <p className="text-danger text-center">{error}</p>}

      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow border-0 rounded-4">
            <div className="card-header bg-primary text-white rounded-top-4">
              <h4 className="mb-0">
                <i className="fas fa-location-dot me-2"></i>
                Current Weather
              </h4>
            </div>

            <div className="card-body text-center">
              <h2 className="text-primary">{weather.city}</h2>
              <p className="text-muted">{weather.location}</p>

              <div className="row mt-4">
                <div className="col-6 mb-3">
                  <i className="fas fa-thermometer-half text-danger fs-2"></i>
                  <h6 className="mt-2">Temperature</h6>
                  <p className="fw-bold">{weather.temperature}°C</p>
                </div>
                <div className="col-6 mb-3">
                  <i className="fas fa-droplet text-info fs-2"></i>
                  <h6 className="mt-2">Humidity</h6>
                  <p className="fw-bold">{weather.humidity}%</p>
                </div>
                <div className="col-6 mb-3">
                  <i className="fas fa-wind text-success fs-2"></i>
                  <h6 className="mt-2">Wind</h6>
                  <p className="fw-bold">{weather.wind} km/h</p>
                </div>
                <div className="col-6 mb-3">
                  <i className="fas fa-cloud-rain text-primary fs-2"></i>
                  <h6 className="mt-2">Precipitation</h6>
                  <p className="fw-bold">{weather.precipitation}%</p>
                </div>
                 <div className="col-6 mb-3 ">
                  <i className="fas fa-cloud-rain text-primary fs-2"></i>
                  <h6 className="mt-2">Pressure</h6>
                  <p className="fw-bold">{weather.pressure}%</p>
                </div>
              </div>

            </div>

            <button 
              className="btn btn-outline-primary rounded-bottom-4 w-100"
              onClick={() => handleClick()}
            >
              more
            </button>
          </div>
        </div>
           <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />

      </div>
    </div>
  );
}




///-----------------------------------------------------other cities cards----------------------------------------------

function SecondaryCard({ city }) {

  const {token, setToken } = useUserContext();
  const [error, setError] = useState("");
  const [weather, setWeather] = useState({});
  const navigate = useNavigate();

  const handleClick = (city) => {
      if (token) {
        navigate(`/city/${city}`);
        return;
      }
      navigate(`/signup`);    }

  axiosClient.get(`/weather?city=${city}`)
    .then(({ data }) => {
      setWeather(data);
      setError(null);
    })
    .catch(err => setError(err.message));

  return (
    <div className="col-12 col-sm-6 col-lg-3 mb-4">
      {error && <p className="text-danger">{error}</p>}

      <div
        className="card shadow-sm border-0 h-100 rounded-4 hover-shadow"
        style={{ cursor: "pointer" }}
        onClick={() => handleClick(weather.city)}
      >
        <div className="card-body text-center py-4">
          <h5 className="text-primary mb-3">
            <i className="fas fa-city me-2"></i>
            {weather.city}
          </h5>

          <div className="row">
            <div className="col-6">
              <i className="fas fa-thermometer-half text-danger fs-4"></i>
              <h6 className="text-muted">Temp</h6>
              <p className="fw-bold">{weather.temperature}°C</p>
            </div>

            <div className="col-6">
              <i className="fas fa-droplet text-info fs-4"></i>
              <h6 className="text-muted">Humidity</h6>
              <p className="fw-bold">{weather.humidity}%</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}



export default function Home() {

    const { user, token } = useUserContext();
    const params = useParams();

    const defaultCities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix'];
    const favorites = user.favorites || []; 

    let cityList;

    if (token && favorites.length > 0) {
      cityList = [...favorites, ...defaultCities.slice(favorites.length, 5)];
    } else {
      cityList = defaultCities;
    }

    cityList = cityList.slice(0, 5);
   return (
    <div className="container-fluid">

      <MainCard city={params.city ?? cityList[0]} />

      <div className="row mb-5 pb-5">
        <SecondaryCard city={cityList[1]} />
        <SecondaryCard city={cityList[2]} />
        <SecondaryCard city={cityList[3]} />
        <SecondaryCard city={cityList[4]} />
      </div>

    </div>
  );
  }