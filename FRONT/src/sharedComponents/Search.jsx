import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import "bootstrap-icons/font/bootstrap-icons.css";
import SearcharchedList from './SearchedList.jsx';


export default function Search() {

  const { user,setUser,token, setToken, activePage, setActivePage } = useUserContext();
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(false);
  const [debouncedCity, setDebouncedCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedCity(city);
    }, 400);
    return () => clearTimeout(timer);
  }, [city]);

  // here we fetch  suggestions cities from the backend
  useEffect(() => {
    const searchCity = () => {
      if (!debouncedCity.trim()) {
        setSuggestions([]);
        return;
      }

      setLoading(true);

      axiosClient.get(`cities/search?q=${debouncedCity}`)
        .then((response) => {
          const results = response.data.results; 
          

          setSuggestions(results.map(city => city.name+", "+city.country));
        })
        .catch((err) => {
          setSuggestions([]);
        })
        .finally(() => {
          setLoading(false);
        });
    };

      searchCity();
      }, [debouncedCity]);

  // When clicking suggestion
  const handleClick = (cityName) => {
    setCity(cityName);
    setSuggestions([]);

    if (token) {
      navigate(`/city/${cityName}`);
    } else {
      navigate(`/${cityName}`);
    }

    setCity("");
  };

  // when searching for input 
  const handleSearch = () => {

    if (suggestions.length === 1) {
      let target = suggestions[0];

      if (token) navigate(`/city/${target}`);
      else navigate(`/${target}`);

      setCity("");
      return;
    }
    navigate(`/searchedList/${encodeURIComponent(JSON.stringify(suggestions))}`);
    setCity("");
  };

  return (
    <div className="mt-4 position-relative ">

      {/* Search Bar */}
      <div  className="d-flex gap-2 ">

        <div className="input-group shadow">
          <span className="input-group-text bg-primary text-white">
            <i className="bi bi-search"></i>
          </span>

          <input
            type="text"
            className="form-control"
            placeholder="Search city..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />
        </div>

        <button onClick={handleSearch} className="btn btn-primary" type="submit">
          Search
        </button>
      </div>

      {/* Loading text */}
      {loading && (
        <div className="text-muted small mt-1">Searching...</div>
      )}

      {/* Suggestions dropdown */}
      {suggestions.length > 0 && (
        <ul
          className="list-group position-absolute w-100 mt-1 shadow-lg"
          style={{ zIndex: 20 }}
        >
          {suggestions.map((s, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action bg-light"
              onClick={() => handleClick(s)}
              style={{ cursor: "pointer" }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}

    </div>
  );
}
