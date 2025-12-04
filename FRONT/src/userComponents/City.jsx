import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axiosClient.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUserContext } from "../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import NotFound from "../sharedComponents/NotFound.jsx";
import About from "../sharedComponents/About.jsx"


function CityClimate({city}){

  const [climate, setClimate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [climateUrl, setClimateUrl] = useState("");

  useEffect(() => {
    axiosClient
      .get(`/climate-info/${city}`)
      .then(({ data }) => {
        setClimate(data);
        setClimateUrl("https://en.wikipedia.org/api/rest_v1/page/summary/${city}");
      })
      .catch(() => {
        setClimate(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [city]);

  if (loading) return <p className="text-muted">Loading climate info...</p>;

  if (!climate) return (
    <div className="alert alert-secondary">
      Climate information not available.
    </div>
  );

  return (
    <div className="card mt-3 shadow-sm">
      <div className="card-body d-flex">
        
        {/* Thumbnail */}
        {climate.thumbnail && (
          <img 
            src={climate.thumbnail} 
            alt={climate.title} 
            style={{ width: "120px", height: "120px", borderRadius: "10px", objectFit: "cover", marginRight: "15px" }}
          />
        )}

        {/* Text */}
        <div>
          <h5 className="card-title">Climate in {climate.title}</h5>
          <p className="card-text" style={{ fontSize: "0.95rem" }}>
            {climate.summary.substring(0, 250)}...
          </p>
          <a 
            href={climate.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="btn btn-sm btn-primary"
          >
            Learn more on Wikipedia
          </a>
        </div>

      </div>
    </div>
  );


}



function AddToFav({ city }) {

  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => { 
    axiosClient.get('/saved-cities')
      .then(({ data }) => {
        setFavorites(data);
        // Check if current city is already favorited
        const alreadyFavorited = data.some(c => c.city_name === city);
        setIsFavorite(alreadyFavorited);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
      });
  }, [city]);

  const removeFromFavorites = () => {
    axiosClient.delete(`/saved-cities/${city}`)
      .then(() => {
        setIsFavorite(false);
        setMessage("");
      })
      .catch((err) => console.error("Error removing favorite:", err));
  };

  const addToFavorites = () => {
    // Check if city already exists in favorites
    const alreadyExists = favorites.some(c => c.city_name === city);
    if (alreadyExists) {
      setMessage("This city is already in your favorites");
      return;
    }
    if(favorites.length === 5){
      setMessage("You have reached the limite");
      return;
    }
    axiosClient.post("/saved-cities", {
      saved_city: city
    })
      .then(() => {
        setIsFavorite(true);
        setMessage("");
      })
      .catch((err) => {
        console.error("Error adding favorite:", err);
        setMessage("Failed to add to favorites");
      });
  };

  return (
    <div className="row mb-4">
      <div className="col-12">
        <div className="d-flex justify-content-between align-items-center">

          {isFavorite ? (
            <button 
              className="btn btn-danger"
              onClick={removeFromFavorites}
            >
              <i className="bi bi-heart-fill me-2"></i>
              Remove from Favorites
            </button>
          ) : (
            <button 
              className="btn btn-primary"
              onClick={addToFavorites}
            >
              <i className="bi bi-heart me-2"></i>
              Add to Favorites
            </button>
          )}

        </div>
        {message && (
          <div className={`alert mt-2 ${isFavorite ? "alert-info" : "alert-warning"}`}>
            {message}
          </div>
        )}
      </div>
    </div>
  );
}


export default function City() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const {cityName}  = useParams();
  const navigate = useNavigate();
  const { user,setUser,token, setToken, activePage, setActivePage } = useUserContext();

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError(null);

    // Fetch weather data from single endpoint
    axiosClient.get(`/weather/forecast/city=${cityName}`)
      .then((response) => {
        console.log(response);
        setWeatherData(response.data[0]);
      })
      .catch((err) => {
        setError("Failed to fetch weather data. Please try again.");
        console.error("Error fetching weather data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [cityName, token]);

  if (!token) {  
    return (<NotFound/>);
  }

  // Loading state
  if (loading) {
    return (
      <div className="container py-4">
        <div className="text-center mt-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3">Loading weather data for {cityName}...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container py-4">
        <div className="alert alert-danger text-center" role="alert">
          <h4 className="alert-heading">Oops! Something went wrong</h4>
          <p>{error}</p>
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Data not available state
  if (!weatherData || !weatherData.current || !weatherData.forecast) {
    return (
      <div className="container py-4">
        <div className="alert alert-warning text-center" role="alert">
          <h4 className="alert-heading">No Data Available</h4>
          <p>Weather data for {cityName} is not available at the moment.</p>
        </div>
        <AddToFav/>
      </div>
    );
  }

  const {  location, current, forecast } = weatherData;
  const city = location?.name || cityName || "Unknown City";

  // Air quality indicator (with fallback)
  const getAirQuality = (pm2_5) => {
    if (!pm2_5) return { level: "Unknown", color: "secondary" };
    if (pm2_5 <= 12) return { level: "Good", color: "success" };
    if (pm2_5 <= 35.4) return { level: "Moderate", color: "warning" };
    return { level: "Unhealthy", color: "danger" };
  };

  const airQuality = getAirQuality(current.air_quality?.pm2_5);

  // Safe data access with fallbacks
  const safeAstroData = forecast.forecastday?.[0]?.astro || {
    sunrise: "N/A",
    sunset: "N/A",
    moonrise: "N/A",
    moonset: "N/A"
  };

  const safeHourlyData = forecast.forecastday?.[0]?.hour || [];
  const safeForecastDays = forecast.forecastday?.slice(0, 5) || [];

  // Fix icon URLs - add https: if missing
  const getIconUrl = (icon) => {
    if (!icon) return "https://cdn.weatherapi.com/weather/64x64/day/113.png";
    return icon.startsWith("//") ? `https:${icon}` : icon;
  };

  // Unit conversion helpers
  const celsiusToFahrenheit = (celsius) => ((celsius * 9/5) + 32).toFixed(1);
  const kmhToMph = (kmh) => (kmh * 0.621371).toFixed(1);
  
  const getTemp = (tempC) => isCelsius ? tempC : celsiusToFahrenheit(tempC);
  const getSpeed = (speedKmh) => isCelsius ? speedKmh : kmhToMph(speedKmh);
  const getTempUnit = () => isCelsius ? "°C" : "°F";
  const getSpeedUnit = () => isCelsius ? "km/h" : "mph";

  return (
    <div className="container py-4"  >
      <div className="d-flex justify-content-between align-items-center mb-4">
        <AddToFav city={cityName}/>
        <button 
          className="btn btn-outline-primary btn-xl bg-dark-subtle text-light"
          onClick={() => setIsCelsius(!isCelsius)}
        >
          <i className="bi bi-thermometer me-2"></i>
          {isCelsius ?  "°F / mph" : "°C / km/h"}
        </button>
      </div>
      
      {/* -------- CURRENT WEATHER CARD -------- */}
      <div className="card shadow-lg mb-4 border-0 bg-gradient-primary" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
        <div className="card-body text-white">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <h2 className="fw-bold mb-1">{cityName}</h2>
              <p className="mb-0">
                {location?.region && `${location.region}, `}{location?.country}
              </p>
              <p className="mb-0">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              
              <div className="d-flex align-items-center justify-content-center justify-content-md-start mt-3">
                <img 
                  src={getIconUrl(current.condition?.icon)} 
                  alt="weather icon" 
                  width={100} 
                  height={100} 
                />
                <div>
                  <h1 className="display-3 fw-bold">{getTemp(current.temp_c)}{getTempUnit()}</h1>
                  <p className="fs-5 mb-0">Feels like {getTemp(current.feelslike_c)}{getTempUnit()}</p>
                </div>
              </div>
              
              <p className="fs-4 mt-2">{current.condition?.text || "Clear"}</p>
            </div>

            <div className="col-md-6">
              <div className="row g-3">
                <div className="col-6">
                  <div className="bg-white text-dark bg-opacity-20 rounded p-3 text-center">
                    <i className="bi bi-droplet fs-4"></i>
                    <p className="mb-0 fw-bold">{current.humidity}%</p>
                    <small>Humidity</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white bg-opacity-20 rounded p-3 text-center">
                    <i className="bi bi-wind fs-4"></i>
                    <p className="mb-0 fw-bold">{getSpeed(current.wind_kph)} {getSpeedUnit()}</p>
                    <small>Wind</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white text-dark bg-opacity-20 rounded p-3 text-center">
                    <i className="bi bi-speedometer2 fs-4"></i>
                    <p className="mb-0 fw-bold">{current.pressure_mb} hPa</p>
                    <small>Pressure</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="bg-white text-dark bg-opacity-20 rounded p-3 text-center">
                    <i className="bi bi-eye fs-4"></i>
                    <p className="mb-0 fw-bold">{current.vis_km} km</p>
                    <small>Visibility</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        {/* -------- DETAILED WEATHER INFO -------- */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="fw-bold mb-0">Weather Details</h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                <div className="col-6">
                  <small className="text-muted">Feels Like</small>
                  <p className="fw-bold mb-0">{getTemp(current.feelslike_c)}{getTempUnit()}</p>
                </div>
                <div className="col-6">
                  <small className="text-muted">Cloud Cover</small>
                  <p className="fw-bold mb-0">{current.cloud}%</p>
                </div>
                <div className="col-6">
                  <small className="text-muted">Wind Direction</small>
                  <p className="fw-bold mb-0">{current.wind_dir}</p>
                </div>
                <div className="col-6">
                  <small className="text-muted">UV Index</small>
                  <p className="fw-bold mb-0">{current.uv}</p>
                </div>
                <div className="col-6">
                  <small className="text-muted">Precipitation</small>
                  <p className="fw-bold mb-0">{current.precip_mm} mm</p>
                </div>
                <div className="col-6">
                  <small className="text-muted">Air Quality</small>
                  <p className={`fw-bold mb-0 text-${airQuality.color}`}>
                    {airQuality.level}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------- SUN & MOON -------- */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="fw-bold mb-0">Sun & Moon</h5>
            </div>
            <div className="card-body">
              <div className="row g-3 text-center">
                <div className="col-6">
                  <i className="bi bi-sunrise fs-2 text-warning"></i>
                  <p className="fw-bold mb-0">{safeAstroData.sunrise}</p>
                  <small className="text-muted">Sunrise</small>
                </div>
                <div className="col-6">
                  <i className="bi bi-sunset fs-2 text-orange"></i>
                  <p className="fw-bold mb-0">{safeAstroData.sunset}</p>
                  <small className="text-muted">Sunset</small>
                </div>
                <div className="col-6">
                  <i className="bi bi-moon fs-2 text-secondary"></i>
                  <p className="fw-bold mb-0">{safeAstroData.moonrise}</p>
                  <small className="text-muted">Moonrise</small>
                </div>
                <div className="col-6">
                  <i className="bi bi-moon-stars fs-2 text-secondary"></i>
                  <p className="fw-bold mb-0">{safeAstroData.moonset}</p>
                  <small className="text-muted">Moonset</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* -------- AIR QUALITY -------- */}
        <div className="col-lg-4 mb-4">
          <div className="card shadow-sm border-0 h-100">
            <div className="card-header bg-transparent border-0">
              <h5 className="fw-bold mb-0">Astronomy</h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-3">
                <span className={`badge bg-${airQuality.color} fs-6`}>
                  {airQuality.level}
                </span>
              </div>
              <div className="row g-2 text-center">
                <div className="col-4">
                  <small className="text-muted">PM2.5</small>
                  <p className="fw-bold mb-0">{current.air_quality?.pm2_5 || "N/A"}</p>
                </div>
                <div className="col-4">
                  <small className="text-muted">PM10</small>
                  <p className="fw-bold mb-0">{current.air_quality?.pm10 || "N/A"}</p>
                </div>
                <div className="col-4">
                  <small className="text-muted">NO₂</small>
                  <p className="fw-bold mb-0">{current.air_quality?.no2 || "N/A"}</p>
                </div>
                <div className="col-4">
                  <small className="text-muted">SO₂</small>
                  <p className="fw-bold mb-0">{current.air_quality?.so2 || "N/A"}</p>
                </div>
                <div className="col-4">
                  <small className="text-muted">CO</small>
                  <p className="fw-bold mb-0">{current.air_quality?.co || "N/A"}</p>
                </div>
                <div className="col-4">
                  <small className="text-muted">O₃</small>
                  <p className="fw-bold mb-0">-</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

     

      {/* -------- 5-DAY FORECAST -------- */}
      <div className="card shadow-sm border-0 mb-4">
        <div className="card-header bg-transparent border-0">
          <h5 className="fw-bold mb-0">5-Day Forecast</h5>
        </div>
        <div className="card-body">
          {safeForecastDays.length > 0 ? (
            <div>
              {safeForecastDays.map((day, i) => (
                <div key={i}>
                  <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center justify-content-sm-between p-3 rounded-3 hover-effect">
                    <div className="d-flex align-items-center mb-2 mb-sm-0" style={{ minWidth: '100px' }}>
                      <h6 className="fw-bold mb-0">
                        {i === 0 ? 'Today' : new Date(day.date).toLocaleDateString("en-US", { weekday: "long" })}
                      </h6>
                    </div>
                    <img 
                      src={getIconUrl(day.day?.condition?.icon)} 
                      width={45} 
                      alt="" 
                      className="mx-2"
                    />
                    <div className="text-start text-sm-center mx-2" style={{ minWidth: '100px' }}>
                      <small className="text-muted">{day.day?.condition?.text || "Clear"}</small>
                    </div>
                    <div className="d-flex align-items-center gap-2 gap-sm-3 mt-2 mt-sm-0">
                      <span className="fw-bold text-warning">{getTemp(day.day?.maxtemp_c)}{getTempUnit()}</span>
                      <div className="progress" style={{ width: '60px', height: '6px' }}>
                        <div 
                          className="progress-bar bg-warning" 
                          style={{ 
                            width: `${Math.min(100, ((day.day?.maxtemp_c - day.day?.mintemp_c) / 20) * 100)}%` 
                          }}
                        ></div>
                      </div>
                      <span className="fw-bold text-primary">{getTemp(day.day?.mintemp_c)}{getTempUnit()}</span>
                    </div>
                  </div>
                  {i < safeForecastDays.length - 1 && <hr className="my-1" />}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">No forecast data available</p>
          )}
        </div>
      </div>


       {/* -------- HOURLY FORECAST -------- */}
      <div className="card shadow-sm border-0 m-4">
        <div className="card-header bg-transparent border-0">
          <h5 className="fw-bold mb-0">24-Hour Forecast</h5>
        </div>
        <div className="card-body">
          {safeHourlyData.length > 0 ? (
            <div className="d-flex flex-row overflow-auto gap-3 pb-2">
              {safeHourlyData.map((h, i) => (
                <div key={i} className="card shadow-sm border-0 text-center " style={{ minWidth: "100px",  background:'linear-gradient(135deg, #111d24ff 0%, #a07ec2ff 100%)'}}>
                  <div className="card-body p-2">
                    <p className="text-muted fw-bold ">
                      {new Date(h.time).getHours()}:00
                    </p>
                    <img 
                      src={getIconUrl(h.condition?.icon)} 
                      width={40} 
                      alt="" 
                      className="my-2" 
                    />
                    <p className="fw-bold mb-1">{getTemp(h.temp_c)}{getTempUnit()}</p>
                    <small className="text-muted">{h.humidity}%</small>
                    <div className="mt-1">
                      <small className="text-muted">{getSpeed(h.wind_kph)} {getSpeedUnit()}</small>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted">No hourly forecast data available</p>
          )}
        </div>
        
      </div>
    </div>
  );
}