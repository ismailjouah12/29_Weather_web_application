import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from "../UserContext.jsx";

export default function SearcharchedList(suggestions){
  const { user, setUser, city, setCity, token, setToken } = useUserContext();
  // fake suggestions list
  const suggestionsl = ["New York", "Los Angeles", "Chicago", "Houston", "Phoenix",
  "Philadelphia", "San Antonio", "San Diego", "Dallas", "San Jose"];
  const navigate = useNavigate();

  const handleClick = (s) => {
    if (token) {
      navigate(`/city/${s}`);
      setCity("");
      return;

    }
    navigate(`/${s}`);
    
    setCity("");
    return;
  };

    return (
        <div>  
          <h1>Result</h1>     
           <div>
           <ul className="list-group position-absolute w-100 mt-1 shadow">
          {suggestionsl.map((s, index) => (
            <li
              key={index}
              className="list-group-item list-group-item-action"
              onClick={() => handleClick(s)}
              style={{ cursor: "pointer" }}
            >
              {s}
            </li>
          ))}
          </ul>
            </div>
        </div>

    );
}