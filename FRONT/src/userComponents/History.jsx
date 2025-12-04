import { Link } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import { useNavigate } from "react-router-dom";

export default function History() {
  const { user,setUser,token, setToken, activePage, setActivePage, msg, setMsg } = useUserContext();
  

  const [history, setHistory] = useState([]);

  
  // Fetch history data on component mount
  useEffect(() => { 
    axiosClient.get('/search/history')
      .then(({data}) => {
        setHistory(data);
      })
      .catch((error) => {
        console.error("Error fetching history:", error);
      });
  }, []);

  // Clear history function
 

  const clearHistory = () => {
    axiosClient.delete('/search/history')
      .then(() => {
        setHistory([]);
        setMsg("Cleared successfully!");
        setTimeout(() => {
          setMsg("");
        }, 1500);
      })
      .catch((error) => {
        console.error("Error clearing history:", error);
      });
  };

  return (
    <div className="container mt-4 mb-5">

      {/* ---- Header ---- */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="fw-bold">Recente search History</h2>
        {history.length > 0 && (
          <button className="btn btn-danger" onClick={clearHistory}>Clear History</button>
        )}
      </div>

      {/* ---- Empty State ---- */}
      {history.length === 0 && (
        <div className="alert alert-info text-center py-4">
          <h5>No history yet</h5>
          <p>Search for a city to see it appear here.</p>
        </div>
      )}

      {/* ---- History Cards ---- */}
      <div className="row">
        {history.map((item, i) => (
          <div key={i} className="col-md-4 col-lg-3 col-sm-6 mb-4">
            <div className="card shadow-sm h-100">

              <div className="card-body text-center">
                
                <h5 className="fw-bold">{item.city_name}</h5>
                <p className="text-muted mb-2" style={{ fontSize: "0.85rem" }}>
                  Searched on: {item.created_at}
                </p>

                <Link to={`/city/${item.city_name}`} className="btn btn-outline-primary btn-sm w-100">
                  View Weather
                </Link>
              </div>

            </div>
          </div>
        ))}
      </div>

      {msg && (
          <div className="alert alert-success text-center py-2">
            {msg}
          </div>
        )}

    </div>
  );
}
