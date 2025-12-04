import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import { useParams } from "react-router-dom";
import { useNavigate, useLocation } from 'react-router-dom';

// Main city card component
function MainCard({ city }) {
  const { user, token, setActivePage } = useUserContext();
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
    setActivePage("Signup");
  };


  return (
    <div className="container mb-5">

      {error && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          <strong>Error!</strong> {error}
          <button type="button" className="btn-close" onClick={() => setError("")}></button>
        </div>
      )}

      <div className="row justify-content-center">
        <div className="col-12">

          <div className="card shadow-lg border-0 rounded-4 overflow-hidden glass-card">

            {/* HEADER */}
            <div
              className="card-header text-white rounded-top-4 weather-header"
              style={{ background:' rgba(62, 88, 233, 0.7)' }}
            >
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h2 className="mb-2 fw-bold text-white">
                    <i className="fas fa-location-dot me-3"></i>
                    Current Weather
                  </h2>

                  {!loading && weather[0] && (
                    <p className="mb-0 text-white-75">
                      <i className="fas fa-clock me-2"></i>
                      Last updated:{" "}
                      {new Date(weather[0].current.last_updated).toLocaleTimeString()}
                    </p>
                  )}
                </div>

                {loading && (
                  <div className="spinner-border spinner-border-sm text-light"></div>
                )}
              </div>
            </div>

            {/* BODY */}
            <div className="card-body text-center p-4 bg-transparent">

              {loading ? (
                <div className="py-5">
                  <div className="spinner-border text-primary"></div>
                  <p className="mt-3 text-muted">Loading weather data...</p>
                </div>
              ) : (
                <>
                  {/* Location */}
                  <div className="mb-4">
                    <h2 className="text-dark fw-bold mb-2">
                      {weather[0].location.name}
                    </h2>
                    <div className="d-flex align-items-center justify-content-center gap-3 text-muted">
                      <span>
                        <i className="fas fa-map-marker-alt me-2"></i>
                        {weather[0].location.country}
                      </span>
                      <span>
                        <i className="fas fa-temperature-high me-2"></i>
                        {weather[0].current.condition.text}
                      </span>
                    </div>
                  </div>

                  {/* Weather boxes */}
                  <div className="row g-3 mt-2">
                    {[
                      { icon: "fa-thermometer-half", label: "Temperature", value: `${weather[0].current.temp_c}°C`, color: "danger" },
                      { icon: "fa-droplet", label: "Humidity", value: `${weather[0].current.humidity}%`, color: "info" },
                      { icon: "fa-wind", label: "Wind", value: `${weather[0].current.wind_kph} km/h`, color: "success" },
                      { icon: "fa-cloud-rain", label: "Precipitation", value: `${weather[0].current.precip_mm} mm`, color: "primary" },
                      { icon: "fa-gauge", label: "Pressure", value: `${weather[0].current.pressure_mb} hPa`, color: "warning" },
                      { icon: "fa-temperature-arrow-up", label: "Feels Like", value: `${weather[0].current.feelslike_c}°C`, color: "secondary" }
                    ].map((item, i) => (
                      <div key={i} className="col-6 col-md-4 col-lg-2">
                        <div className="p-3 rounded-4 shadow-sm transition-hover glass-card">
                          <i className={`fas ${item.icon} text-${item.color} fs-3 mb-2`}></i>
                          <h6 className="text-muted small mb-1">{item.label}</h6>
                          <p className="fw-bold fs-5 mb-0 text-dark">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* FOOTER */}
            <div className="card-footer bg-transparent border-0 p-0">
              <button
                className="btn btn-gradient-primary rounded-0 rounded-bottom-4 w-100 py-3 fw-semibold text-white border-0"
                disabled={loading}
                onClick={handleClick}
              >
                <i className="fas fa-chart-line me-2"></i>
                View Detailed Forecast
              </button>
            </div>

          </div>
        </div>
      </div>

    </div>
  );
}


// Other cities cards component
function SecondaryCard({ city }) {
  const { token } = useUserContext();
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

  const getWeatherIcon = () => {
    if (!weather[0]?.current) return 'fa-cloud';
    const condition = weather[0].current.condition.text.toLowerCase();
    if (condition.includes('sunny') || condition.includes('clear')) return 'fa-sun';
    if (condition.includes('cloud')) return 'fa-cloud';
    if (condition.includes('rain')) return 'fa-cloud-rain';
    if (condition.includes('snow')) return 'fa-snowflake';
    return 'fa-cloud';
  };

  return (
    <div className="col-12 col-sm-6 col-lg-3 mb-4">
      <div
        className="card shadow-sm border-0 h-100 rounded-4 glass-effect transition-all"
        style={{ 
          cursor: "pointer",
          minHeight: '200px',
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(10px)'
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
                <div className="mb-3">
                  <i className={`fas ${getWeatherIcon()} fa-2x text-primary`}></i>
                </div>
                <h5 className="text-dark mb-2 fw-bold">
                  {weather[0].location.name}
                </h5>
                <p className="text-muted small mb-0">
                  <i className="fas fa-map-marker-alt me-1"></i>
                  {weather[0].location.country}
                </p>
              </div>

              <div className="row g-2 mt-auto">
                <div className="col-6">
                  <div className="p-2 rounded-3 bg-white bg-opacity-75 border border-light">
                    <i className="fas fa-thermometer-half text-danger fs-5 mb-1"></i>
                    <h6 className="text-muted small mb-1">Temp</h6>
                    <p className="fw-bold mb-0 text-dark">{weather[0].current.temp_c}°C</p>
                  </div>
                </div>

                <div className="col-6">
                  <div className="p-2 rounded-3 bg-white bg-opacity-75 border border-light">
                    <i className="fas fa-droplet text-info fs-5 mb-1"></i>
                    <h6 className="text-muted small mb-1">Humidity</h6>
                    <p className="fw-bold mb-0 text-dark">{weather[0].current.humidity}%</p>
                  </div>
                </div>
              </div>

              {weather[0]?.current?.condition && (
                <div className="mt-3">
                  <p className="text-muted small mb-0">
                    <i className="fas fa-info-circle me-1"></i>
                    {weather[0].current.condition.text}
                  </p>
                </div>
              )}

              {error && (
                <div className="alert alert-warning mt-3 py-2 small bg-opacity-75" role="alert">
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

// Home component
export default function Home() {
  const { user, token } = useUserContext();
  const params = useParams();

  const defaultCities = ['London', 'Paris, France', 'Chicago, USA', 'Riyadh', 'Palmares'];
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
  }, [token]);

  let cityList;
  if (token && favorites.length > 0) {
    const favoriteNames = favorites.map(fav => fav.city_name);
    cityList = [...favoriteNames, ...defaultCities.slice(favoriteNames.length, 5)];
  } else {
    cityList = defaultCities;
  }

  cityList = cityList.slice(0, 5);

  return (
    <div className="container-fluid px-3 px-md-4 py-4 min-vh-100" 
         style={{
           
           minHeight: '100vh'
         }}>
      
      {/* Welcome Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="text-center mb-5">
            <div className="glass-effect p-4 rounded-4 d-inline-block mb-3">
              <i className="fas fa-cloud-sun fa-3x text-primary"></i>
            </div>
            <h1 className="display-5 fw-bold text-dark mb-3">
              Weather Forecast
            </h1>
            <p className="lead text-muted">
              {token ? `Welcome back ${user?.name?.toUpperCase() || 'User'}!` : 'Get real-time weather updates for your favorite cities'}
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
            <div className="d-flex align-items-center">
              <div className="me-3 p-2 rounded-3 bg-primary bg-opacity-10">
                <i className="fas fa-globe-europe fa-lg text-primary"></i>
              </div>
              <div>
                <h3 className="fw-bold text-dark mb-0">Explore Cities</h3>
                <p className="text-muted small mb-0">Click on any city for detailed forecast</p>
              </div>
            </div>
            
            {token && (
              <Link to="/favorites" className="btn btn-outline-primary rounded-pill">
                <i className="fas fa-heart me-2"></i>
                View Favorites
              </Link>
            )}
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
          <div className="col-12 col-md-8 mx-auto">
            <div className="card glass-effect border-0 rounded-4 shadow-lg overflow-hidden">
              <div className="row g-0 align-items-center">
                <div className="col-md-8">
                  <div className="card-body p-4 p-md-5">
                    <h4 className="text-dark mb-3">
                      <i className="fas fa-star me-2 text-warning"></i>
                      Unlock Premium Features
                    </h4>
                    <ul className="list-unstyled text-muted mb-4">
                      <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Save favorite cities</li>
                      <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Detailed 7-day forecasts</li>
                      <li className="mb-2"><i className="fas fa-check-circle text-success me-2"></i>Weather alerts</li>
                      <li><i className="fas fa-check-circle text-success me-2"></i>Hourly breakdown</li>
                    </ul>
                    <Link to="/signup" className="btn btn-primary btn-lg rounded-pill px-4">
                      <i className="fas fa-user-plus me-2"></i>
                      Create Free Account
                    </Link>
                  </div>
                </div>
                <div className="col-md-4 d-none d-md-block">
                  <div className="p-4 text-center" style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    height: '100%'
                  }}>
                    <i className="fas fa-cloud-sun fa-4x text-white opacity-75"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Font Awesome CSS */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />

      {/* Custom Styles */}
      <style>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .transition-all:hover {
          transform: translateY(-8px);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.3s ease;
        }
        
        .transition-hover:hover {
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.2s ease;
        }
        
        .btn-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
        }
        
        .btn-gradient-primary:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .bg-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%) !important;
        }
        
        .text-gradient {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }
      `}</style>
    </div>
  );
}