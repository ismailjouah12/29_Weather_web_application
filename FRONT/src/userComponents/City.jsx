import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axiosClient from "../axiosClient.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUserContext } from "../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import NotFound from "../sharedComponents/NotFound.jsx";

function AddToFav({ city }) {
  const [isFavorite, setIsFavorite] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  

  useEffect(() => { 
    axiosClient.get('/saved-cities')
      .then(({ data }) => {
        setFavorites(data);
        const alreadyFavorited = data.some(c => c.city_name === city);
        setIsFavorite(alreadyFavorited);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
      });
  }, [city]);

  const removeFromFavorites = () => {
    setLoading(true);
    axiosClient.delete(`/saved-cities/${city}`)
      .then(() => {
        setIsFavorite(false);
        setMessage("");
      })
      .catch((err) => {
        console.error("Error removing favorite:", err);
        setMessage("Failed to remove from favorites");
      })
      .finally(() => setLoading(false));
  };

  const addToFavorites = () => {
    const alreadyExists = favorites.some(c => c.city_name === city);
    if (alreadyExists) {
      setMessage("This city is already in your favorites");
      return;
    }
    if(favorites.length === 5){
      setMessage("You have reached the limit (5 cities max)");
      return;
    }
    
    setLoading(true);
    axiosClient.post('/saved-cities', {
      saved_city: city
    })
      .then(() => {
        setIsFavorite(true);
        setMessage("");
      })
      .catch((err) => {
        setMessage("Failed to add to favorites");
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className="d-flex flex-column gap-2">
      <div className="d-flex gap-2">
        {isFavorite ? (
          <button 
            className="btn btn-danger btn-lg rounded-pill px-4 shadow-sm"
            onClick={removeFromFavorites}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <i className="fas fa-heart-broken me-2"></i>
            )}
            Remove from Favorites
          </button>
        ) : (
          <button 
            className="btn btn-gradient-primary btn-lg rounded-pill px-4 shadow-sm"
            onClick={addToFavorites}
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              <i className="fas fa-heart me-2"></i>
            )}
            Add to Favorites
          </button>
        )}
      </div>
      {message && (
        <div className={`alert ${isFavorite ? "alert-info" : "alert-warning"} glass-effect py-2 px-3`}>
          <i className={`fas ${isFavorite ? "fa-info-circle" : "fa-exclamation-triangle"} me-2`}></i>
          {message}
        </div>
      )}
    </div>
  );
}

export default function City() {
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCelsius, setIsCelsius] = useState(true);
  const { cityName } = useParams();
  const navigate = useNavigate();
  const { token } = useUserContext();

  useEffect(() => {
    if (!token) return;

    setLoading(true);
    setError(null);

    axiosClient.get(`/weather/forecast/city=${cityName}`)
      .then((response) => {
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

  if (loading) {  //waiting for data to be fetched
    return (
      <div className="container py-4" style={{
        
        minHeight: '100vh'
      }}>
        <div className="text-center mt-5 pt-5">
          <div className="spinner-border text-primary mb-3" style={{ width: '3rem', height: '3rem' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <h4 className="text-dark mb-2">Loading weather data for {cityName}...</h4>
          <p className="text-muted">Fetching the latest forecast information</p>
        </div>
      </div>
    );
  }

  if (error) {  // when fetchinf data failed
    return (
      <div className="container py-4" style={{  
        
        minHeight: '100vh'
      }}>
        <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '70vh' }}>
          <div className="card glass-effect border-0 shadow-lg" style={{ maxWidth: '500px' }}>
            <div className="card-body text-center p-5">
              <i className="fas fa-exclamation-triangle fa-3x text-danger mb-4"></i>
              <h4 className="text-dark mb-3">Oops! Something went wrong</h4>
              <p className="text-muted mb-4">{error}</p>
              <button 
                className="btn btn-gradient-primary rounded-pill px-4 py-2"
                onClick={() => window.location.reload()}
              >
                <i className="fas fa-redo me-2"></i>
                Try Again
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!weatherData || !weatherData.current || !weatherData.forecast) {
    return (
      <div className="container py-4" style={{
       
        minHeight: '100vh'
      }}>
        <div className="alert glass-effect alert-warning border-0 shadow-sm" role="alert">
          <h4 className="alert-heading d-flex align-items-center">
            <i className="fas fa-exclamation-circle me-2"></i>
            No Data Available
          </h4>
          <p>Weather data for {cityName} is not available at the moment.</p>
          <hr />
          <AddToFav city={cityName}/>
        </div>
      </div>
    );
  }

  const { location, current, forecast } = weatherData;
  const city = location?.name || cityName || "Unknown City";

  const getAirQuality = (pm2_5) => {
    if (!pm2_5) return { level: "Unknown", color: "secondary" };
    if (pm2_5 <= 12) return { level: "Good", color: "success" };
    if (pm2_5 <= 35.4) return { level: "Moderate", color: "warning" };
    return { level: "Unhealthy", color: "danger" };
  };

  const airQuality = getAirQuality(current.air_quality?.pm2_5);

  const safeAstroData = forecast.forecastday?.[0]?.astro || {
    sunrise: "N/A",
    sunset: "N/A",
    moonrise: "N/A",
    moonset: "N/A"
  };

  const safeHourlyData = forecast.forecastday?.[0]?.hour || [];
  const safeForecastDays = forecast.forecastday?.slice(0, 3) || [];

  const getIconUrl = (icon) => {
    if (!icon) return "https://cdn.weatherapi.com/weather/64x64/day/113.png";
    return icon.startsWith("//") ? `https:${icon}` : icon;
  };

  const celsiusToFahrenheit = (celsius) => ((celsius * 9/5) + 32).toFixed(1);
  const kmhToMph = (kmh) => (kmh * 0.621371).toFixed(1);
  
  const getTemp = (tempC) => isCelsius ? tempC : celsiusToFahrenheit(tempC);
  const getSpeed = (speedKmh) => isCelsius ? speedKmh : kmhToMph(speedKmh);
  const getTempUnit = () => isCelsius ? "°C" : "°F";
  const getSpeedUnit = () => isCelsius ? "km/h" : "mph";

  // Get background gradient based on weather
  const getWeatherGradient = () => {
    const condition = current.condition?.text?.toLowerCase();
    if (condition?.includes('sunny') || condition?.includes('clear')) {
      return 'linear-gradient(135deg, #ffd166 0%, #ff9e6d 100%)';
    } else if (condition?.includes('cloud') || condition?.includes('overcast')) {
      return 'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)';
    } else if (condition?.includes('rain') || condition?.includes('drizzle')) {
      return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
    } else if (condition?.includes('snow') || condition?.includes('ice')) {
      return 'linear-gradient(135deg, #a3bded 0%, #6991c7 100%)';
    } else {
      return 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }
  };

  return (
    <div className="container-fluid px-3 px-md-4 py-4 min-vh-100" style={{
      
      minHeight: '100vh'
    }}>
      
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3">
            <div >
              <h1 className="display-6 fw-bold text-light mb-1">
                <i className="fas fa-map-marker-alt me-2 text-primary"></i>
                {cityName}
              </h1>
              <p className="text text-light mb-0">
                {location?.region && `${location.region}, `}{location?.country}
              </p>
            </div>
            <div className="d-flex gap-2">
              <AddToFav city={cityName}/>
              <button 
                className="btn btn-outline-light bg-success border-0 rounded-pill px-4 py-2"
                onClick={() => setIsCelsius(!isCelsius)}
                style={{
                  background: 'rgba(102, 126, 234, 0.15)',
                  backdropFilter: 'blur(10px)'
                }}
              >
                <i className="fas fa-thermometer-half me-2"></i>
                {isCelsius ? "°F / mph" : "°C / km/h"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Current Weather Card */}
      <div className="card glass-effect border-0 shadow-lg mb-4 overflow-hidden">
        <div 
          className="card-body text-white p-4 p-md-5"
          style={{ background: getWeatherGradient() }}
        >
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start">
              <div className="mb-4">
                <h3 className="fw-bold mb-2">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                </h3>
                <p className="mb-0 opacity-75">
                  Last updated: {new Date(current.last_updated_epoch * 1000).toLocaleTimeString()}
                </p>
              </div>
              
              <div className="d-flex align-items-center justify-content-center justify-content-md-start gap-4 mb-4">
                <img 
                  src={getIconUrl(current.condition?.icon)} 
                  alt="weather icon" 
                  width={120} 
                  height={120} 
                  className="drop-shadow"
                />
                <div>
                  <h1 className="display-2 fw-bold">{getTemp(current.temp_c)}{getTempUnit()}</h1>
                  <p className="fs-4 mb-0">Feels like {getTemp(current.feelslike_c)}{getTempUnit()}</p>
                </div>
              </div>
              
              <h3 className="fs-2 fw-bold">
                <i className="fas fa-cloud-sun me-2"></i>
                {current.condition?.text || "Clear"}
              </h3>
            </div>

            <div className="col-md-6">
              <div className="row g-3">
                {[
                  { icon: 'fa-droplet', label: 'Humidity', value: `${current.humidity}%`, color: 'info' },
                  { icon: 'fa-wind', label: 'Wind', value: `${getSpeed(current.wind_kph)} ${getSpeedUnit()}`, color: 'success' },
                  { icon: 'fa-gauge', label: 'Pressure', value: `${current.pressure_mb} hPa`, color: 'warning' },
                  { icon: 'fa-eye', label: 'Visibility', value: `${current.vis_km} km`, color: 'light' }
                ].map((item, index) => (
                  <div key={index} className="col-6">
                    <div className="glass-effect rounded-4 p-3 text-center" style={{ background: 'rgba(255, 255, 255, 0.2)' }}>
                      <i className={`fas ${item.icon} fs-3 mb-2 text-${item.color}`}></i>
                      <p className="fw-bold fs-4 mb-1">{item.value}</p>
                      <small className="opacity-75">{item.label}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detailed Information Row */}
      <div className="row g-4 mb-4">
        {/* Weather Details */}
        <div className="col-lg-4">
          <div className="card glass-effect border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 py-3">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="fas fa-info-circle me-2 text-primary"></i>
                Weather Details
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3">
                {[
                  { icon: 'fa-temperature-arrow-up', label: 'Feels Like', value: `${getTemp(current.feelslike_c)}${getTempUnit()}` },
                  { icon: 'fa-cloud', label: 'Cloud Cover', value: `${current.cloud}%` },
                  { icon: 'fa-compass', label: 'Wind Direction', value: current.wind_dir },
                  { icon: 'fa-sun', label: 'UV Index', value: current.uv },
                  { icon: 'fa-cloud-rain', label: 'Precipitation', value: `${current.precip_mm} mm` },
                  { icon: 'fa-wind', label: 'Wind Gust', value: `${getSpeed(current.gust_kph)} ${getSpeedUnit()}` }
                ].map((item, index) => (
                  <div key={index} className="col-6">
                    <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: 'rgba(102, 126, 234, 0.05)' }}>
                      <i className={`fas ${item.icon} text-primary`}></i>
                      <div>
                        <small className="text-muted">{item.label}</small>
                        <p className="fw-bold mb-0 text-dark">{item.value}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Sun & Moon */}
        <div className="col-lg-4">
          <div className="card glass-effect border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 py-3">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="fas fa-sun me-2 text-warning"></i>
                Sun & Moon
              </h5>
            </div>
            <div className="card-body">
              <div className="row g-3 text-center">
                <div className="col-6">
                  <div className="p-3 rounded-4" style={{ background: 'linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)' }}>
                    <i className="fas fa-sunrise fs-2 text-warning mb-2"></i>
                    <p className="fw-bold mb-1 fs-5 text-dark">{safeAstroData.sunrise}</p>
                    <small className="text-muted">Sunrise</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-4" style={{ background: 'linear-gradient(135deg, rgba(255, 87, 34, 0.1) 0%, rgba(255, 152, 0, 0.1) 100%)' }}>
                    <i className="fas fa-sunset fs-2 text-orange mb-2"></i>
                    <p className="fw-bold mb-1 fs-5 text-dark">{safeAstroData.sunset}</p>
                    <small className="text-muted">Sunset</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-4" style={{ background: 'linear-gradient(135deg, rgba(158, 158, 158, 0.1) 0%, rgba(97, 97, 97, 0.1) 100%)' }}>
                    <i className="fas fa-moon fs-2 text-secondary mb-2"></i>
                    <p className="fw-bold mb-1 fs-5 text-dark">{safeAstroData.moonrise}</p>
                    <small className="text-muted">Moonrise</small>
                  </div>
                </div>
                <div className="col-6">
                  <div className="p-3 rounded-4" style={{ background: 'linear-gradient(135deg, rgba(66, 66, 66, 0.1) 0%, rgba(33, 33, 33, 0.1) 100%)' }}>
                    <i className="fas fa-star-and-crescent fs-2 text-secondary mb-2"></i>
                    <p className="fw-bold mb-1 fs-5 text-dark">{safeAstroData.moonset}</p>
                    <small className="text-muted">Moonset</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Air Quality */}
        <div className="col-lg-4">
          <div className="card glass-effect border-0 shadow-sm h-100">
            <div className="card-header bg-transparent border-0 py-3">
              <h5 className="fw-bold mb-0 text-dark">
                <i className="fas fa-wind me-2 text-success"></i>
                Air Quality
              </h5>
            </div>
            <div className="card-body">
              <div className="text-center mb-4">
                <div className={`badge bg-${airQuality.color} fs-6 px-4 py-2 rounded-pill mb-2`}>
                  <i className="fas fa-leaf me-2"></i>
                  {airQuality.level}
                </div>
                <p className="text-muted small">PM2.5: {current.air_quality?.pm2_5 || "N/A"} μg/m³</p>
              </div>
              <div className="row g-2 text-center">
                {[
                  { label: 'PM2.5', value: current.air_quality?.pm2_5 || "N/A", color: airQuality.color },
                  { label: 'PM10', value: current.air_quality?.pm10 || "N/A", color: 'secondary' },
                  { label: 'NO₂', value: current.air_quality?.no2 || "N/A", color: 'warning' },
                  { label: 'SO₂', value: current.air_quality?.so2 || "N/A", color: 'danger' },
                  { label: 'CO', value: current.air_quality?.co || "N/A", color: 'dark' },
                  { label: 'O₃', value: current.air_quality?.o3 || "N/A", color: 'info' }
                ].map((item, index) => (
                  <div key={index} className="col-4">
                    <div className="p-2 rounded-3" style={{ background: 'rgba(var(--bs-secondary-rgb), 0.05)' }}>
                      <small className="text-muted d-block">{item.label}</small>
                      <p className={`fw-bold mb-0 text-${item.color}`}>{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3-Day Forecast */}
      <div className="card glass-effect border-0 shadow-sm mb-4">
        <div className="card-header bg-transparent border-0 py-3">
          <h5 className="fw-bold mb-0 text-dark">
            <i className="fas fa-calendar-alt me-2 text-primary"></i>
            3-Day Forecast
          </h5>
        </div>
        <div className="card-body">
          {safeForecastDays.length > 0 ? (
            <div className="row g-3">
              {safeForecastDays.map((day, i) => (
                <div key={i} className="col-lg">
                  <div className="glass-effect rounded-4 p-3 h-100 hover-effect" style={{ cursor: 'pointer' }}>
                    <div className="text-center mb-3">
                      <h6 className="fw-bold text-dark mb-1">
                        {i === 0 ? 'Today' : new Date(day.date).toLocaleDateString("en-US", { weekday: "short" })}
                      </h6>
                      <small className="text-muted">
                        {new Date(day.date).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                      </small>
                    </div>
                    
                    <div className="text-center mb-3">
                      <img 
                        src={getIconUrl(day.day?.condition?.icon)} 
                        width={50} 
                        alt="weather" 
                        className="mb-2"
                      />
                      <p className="text-muted small mb-0">{day.day?.condition?.text}</p>
                    </div>
                    
                    <div className="text-center">
                      <div className="d-flex justify-content-center align-items-center gap-2 mb-2">
                        <span className="fw-bold text-warning">{getTemp(day.day?.maxtemp_c)}{getTempUnit()}</span>
                        <div className="progress flex-grow-1" style={{ height: '6px', maxWidth: '60px' }}>
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
                    
                    <div className="row g-1 mt-2">
                      <div className="col-6 text-center">
                        <small className="text-muted">Humidity</small>
                        <p className="fw-bold mb-0">{day.day?.avghumidity}%</p>
                      </div>
                      <div className="col-6 text-center">
                        <small className="text-muted">Precip</small>
                        <p className="fw-bold mb-0">{day.day?.totalprecip_mm}mm</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-3">No forecast data available</p>
          )}
        </div>
      </div>

      {/* Hourly Forecast */}
      <div className="card glass-effect border-0 shadow-sm mb-4">
        <div className="card-header bg-transparent border-0 py-3">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="fw-bold mb-0 text-dark">
              <i className="fas fa-clock me-2 text-primary"></i>
              24-Hour Forecast
            </h5>
            <small className="text-muted">Scroll horizontally →</small>
          </div>
        </div>
        <div className="card-body">
          {safeHourlyData.length > 0 ? (
            <div className="d-flex flex-row overflow-auto gap-3 pb-3">
              {safeHourlyData.map((h, i) => (
                <div 
                  key={i} 
                  className="card glass-effect border-0 text-center flex-shrink-0 hover-effect" 
                  style={{ width: '120px', background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.3) 0%, rgba(255, 255, 255, 0.1) 100%)' }}
                >
                  <div className="card-body p-3">
                    <p className="fw-bold text-dark mb-2">
                      {new Date(h.time).getHours()}:00
                    </p>
                    <img 
                      src={getIconUrl(h.condition?.icon)} 
                      width={45} 
                      alt="" 
                      className="my-2" 
                    />
                    <h5 className="fw-bold text-dark mb-1">{getTemp(h.temp_c)}{getTempUnit()}</h5>
                    <div className="d-flex justify-content-center gap-2 mt-2">
                      <small className="text-muted">
                        <i className="fas fa-droplet text-info"></i> {h.humidity}%
                      </small>
                      <small className="text-muted">
                        <i className="fas fa-wind text-success"></i> {getSpeed(h.wind_kph)}
                      </small>
                    </div>
                    <small className="text-muted d-block mt-2">{h.chance_of_rain}% rain</small>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted py-3">No hourly forecast data available</p>
          )}
        </div>
      </div>

      {/* Custom Styles */}
      <style>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .hover-effect:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1) !important;
          transition: all 0.3s ease;
        }
        
        .btn-gradient-primary {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border: none;
          color: white;
        }
        
        .btn-gradient-primary:hover {
          background: linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%);
          transform: translateY(-1px);
          box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }
        
        .drop-shadow {
          filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1));
        }
        
        .bg-gradient-warning {
          background: linear-gradient(135deg, #ffd166 0%, #ff9e6d 100%);
        }
        
        .bg-gradient-info {
          background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }
        
        .bg-gradient-success {
          background: linear-gradient(135deg, #7ee8fa 0%, #80ff72 100%);
        }
        
        ::-webkit-scrollbar {
          height: 6px;
          width: 6px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.05);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb {
          background: rgba(102, 126, 234, 0.5);
          border-radius: 10px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(102, 126, 234, 0.7);
        }
      `}</style>
      
      {/* Font Awesome */}
      <link 
        rel="stylesheet" 
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" 
      />
    </div>
  );
}