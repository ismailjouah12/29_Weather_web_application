import React, { useState,useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import Search from './Search.jsx';
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';

//-----------------------------------------------------main city card----------------------------------------------

function MainCard({ city }) {
  const { user,setUser,token, setToken, activePage, setActivePage } = useUserContext();
  const [error, setError] = useState("");
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();


  useEffect(() => {
    setLoading(true);
    axiosClient.get(`/weather/current/city=${city}`)
      .then(({ data }) => {
        
        setWeather(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [city]);


  
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

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-md-10 col-lg-8">
          <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
            <div 
              className="card-header text-white rounded-top-4 position-relative"
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                padding: '2rem 1rem'
              }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <h4 className="mb-0 fw-bold">
                  <i className="fas fa-location-dot me-2"></i>
                  Current Weather
                </h4>
                {loading && (
                  <div className="spinner-border spinner-border-sm text-light" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                )}
              </div>
            </div>

            <div className="card-body text-center p-4">
              {loading ? (
                <div className="py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-3 text-muted">Loading weather data...</p>
                </div>
              ) : (
                <>
                  <h2 className="text-primary fw-bold mb-1">{weather[0].location.name}</h2>
                 {/* <h4>{weather[0].location.country}</h4>*/}
                  <p className="text-muted mb-4">
                    <i className="fas fa-map-marker-alt me-2"></i>
                    {weather[0].location.country}
                  </p>

                  <div className="row g-4 mt-2">
                    <div className="col-6 col-md-4 col-lg-2">
                      <div className="p-3 rounded-3 bg-primary">
                        <i className="fas fa-thermometer-half text-danger fs-2 mb-2"></i>
                        <h6 className="text-muted small">Temperature</h6>
                        <p className="fw-bold fs-5 mb-0 ">{weather[0].current.temp_c} °C </p>
                      </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                      <div className="p-3 rounded-3 bg-primary">
                        <i className="fas fa-droplet text-info fs-2 mb-2"></i>
                        <h6 className="text-muted small">Humidity</h6>
                        <p className="fw-bold fs-5 mb-0">{weather[0].current.humidity}%</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                      <div className="p-3 rounded-3 bg-primary">
                        <i className="fas fa-wind text-success fs-2 mb-2"></i>
                        <h6 className="text-muted small">Wind</h6>
                        <p className="fw-bold fs-5 mb-0">{weather[0].current.wind_kph} km/h</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                      <div className="p-3 rounded-3 bg-primary">
                        <i className="fas fa-cloud-rain text-primary fs-2 mb-2"></i>
                        <h6 className="text-muted small">Precipitation</h6>
                        <p className="fw-bold fs-5 mb-0">{weather[0].current.precip_mm}%</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                      <div className="p-3 rounded-3 bg-primary">
                        <i className="fas fa-gauge text-warning fs-2 mb-2"></i>
                        <h6 className="text-muted small">Pressure</h6>
                        <p className="fw-bold fs-5 mb-0">{weather[0].current.pressure_mb} hPa</p>
                      </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2">
                      <div className="p-3 rounded-3 bg-primary">
                        <i className="fas fa-thermometer-half text-secondary fs-2 mb-2"></i>
                        <h6 className="text-muted small">Feels Like</h6>
                        <p className="fw-bold fs-5 mb-0">{weather[0].current.feelslike_c}°C</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="card-footer bg-transparent border-0 p-0">
              <button 
                className="btn btn-light rounded-0 rounded-bottom-4 w-100 py-3 fw-semibold"
                onClick={handleClick}
                disabled={loading}
              >
                
                View Detailed Forecast
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
    </div>
  );
}

//-----------------------------------------------------other cities cards----------------------------------------------

function SecondaryCard({ city }) {
  const { token, setToken } = useUserContext();
  const [error, setError] = useState("");
  const [weather, setWeather] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
      axiosClient.get(`/weather/current/city=${city}`)
      .then(({ data }) => {
        setWeather(data);
        setError(null);
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [city]);

  const handleClick = () => {
    if (token) {
      navigate(`/city/${city}`);
      return;
    }
    navigate(`/signup`);
  }

   


  return (
    <div className="col-12 col-sm-6 col-lg-3 mb-4">
      <div
        className="card shadow-sm border-0 h-100 rounded-4 transition-all"
        style={{ 
          cursor: "pointer",
          transition: 'all 0.3s ease',
          minHeight: '200px'
        }}
        onClick={handleClick}
      >
        <div className="card-body text-center p-4 d-flex flex-column">
          {loading ? (
            <div className="d-flex justify-content-center align-items-center flex-grow-1">
              <div className="spinner-border spinner-border-sm text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-3">
                <h5 className="text-primary mb-2 fw-bold">
                  <i className="fas fa-city me-2"></i>
                  {weather[0].location.name}
                </h5>
                <p className="text-muted small mb-0">
                  <i className="fas fa-map-marker-alt me-1"></i>
                  {weather[0].location.country}
                </p>
              </div>

              <div className="row g-2 mt-auto">
                <div className="col-6">
                  <div className="p-2 rounded-3 bg-primary">
                    <i className="fas fa-thermometer-half text-danger fs-5 mb-1"></i>
                    <h6 className="text-muted small mb-1">Temp</h6>
                    <p className="fw-bold mb-0">{weather[0].current.temp_c}°C</p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="p-2 rounded-3 bg-primary">
                    <i className="fas fa-droplet text-info fs-5 mb-1"></i>
                    <h6 className="text-muted small mb-1">Humidity</h6>
                    <p className="fw-bold mb-0">{weather[0].current.humidity}%</p>
                  </div>
                </div>
              </div>

              {error && (
                <div className="alert alert-warning mt-3 py-2 small" role="alert">
                  <i className="fas fa-exclamation-triangle me-1"></i>
                  {error}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

//-----------------------------------------------------home component----------------------------------------------

export default function Home() {
  const { user, token } = useUserContext();
  const params = useParams();

  const defaultCities = ['Agadir', 'Paris, France', 'Chicago, united state of america ', 'Riyad', 'Palmares'];
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (!token) return;
    axiosClient.get('/saved-cities')
      .then(({ data }) => {
        setFavorites(data);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
      });
    },[token]);

  let cityList;

  if (token && favorites.length > 0) {
    // Extract city names from favorites objects
    const favoriteNames = favorites.map(fav => fav.city_name);
    cityList = [...favoriteNames, ...defaultCities.slice(favoriteNames.length, 5)];
  } else {
    cityList = defaultCities;
  }

  cityList = cityList.slice(0, 5);

 
  //------------------------ in case  failed to fetch data 







  return (
    <div className="container-fluid px-3 px-md-4">
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold text-dark mb-3">
              <i className="fas fa-cloud-sun me-3 "></i>
              Weather Infos
            </h1>
            <p className="lead text-muted">
              {token ? `Welcome back ${user?.name.toUpperCase() || 'User'}` : 'Get real-time weather updates for your favorite cities'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Weather Card */}
      <MainCard city={params.cityName ?? cityList[0]} />

      {/* Other Cities Section */}
      <div className="row mb-5">
        <div className="col-12">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h3 className="fw-bold text-dark">
              <i className="fas fa-globe-europe me-2"></i>
              Other Cities
            </h3>
          
          </div>
          
          <div className="row g-4">
            {cityList.slice(1).map((city, index) => (
              <SecondaryCard key={index} city={city} />
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action for Non-Logged Users */}
      {!token && (
        <div className="row mb-5">
          <div className="col-12">
            <div className="card bg-gradient border-0 rounded-4 shadow">
              <div className="card-body text-center py-5">
               
                <h4 className="text-white mb-4 opacity-75">
                  Sign up to save your favorite cities, get detailed forecasts...
                </h4>
                <Link to="/signup" className="btn btn-light btn-lg rounded-pill px-4">
                  <i className="fas fa-user-plus me-2"></i>
                  Create Free Account
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .transition-all:hover {
          transform: translateY(-5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.15) !important;
        }
        .bg-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        }
      `}</style>
    </div>
  );
}