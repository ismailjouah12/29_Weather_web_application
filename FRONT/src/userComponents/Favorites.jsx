import { Link, Navigate } from 'react-router-dom';
import {useState, useEffect} from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import NotFound from '../sharedComponents/NotFound.jsx';




export default function Favorites() {

    const [favorites, setFavorites] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch favorites data on component mount

  useEffect(() => { 
    axiosClient.get('/favorites')
      .then(({data}) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  
  // Check if favorites data exists
  if (!favorites.main || !favorites.secondary) {
    return <div className='text-danger alert alert-danger'>No favorites found</div>;
  }

  return (
    <div className="container mt-5">

      <h2 className="text-center mb-4 text-primary fw-bold">Your Favorite Cities</h2>

      {/* MAIN CITY CARD */}
      <div className="card shadow-lg p-4 mb-5 mx-auto" style={{ maxWidth: "500px" }}>
        <h3 className="fw-bold text-center">{favorites.main.city}</h3>

        <div className="d-flex justify-content-center align-items-center mt-3">
          <img src={favorites.main.icon} alt="" />
          <div className="ms-3">
            <h1 className="fw-bold">{favorites.main.temperature}°C</h1>
            <p className="text-muted">{favorites.main.condition}</p>
          </div>
        </div>
      </div>

      {/* SECONDARY CITIES */}
      <div className="row">
        {favorites.secondary.map((city, index) => (
          <div className="col-md-3 col-sm-6 mb-4" key={index}>
            <div className="card shadow-sm p-3 text-center">
              <h5 className="fw-bold">{city.city}</h5>
              <img src={city.icon} alt="" className="my-2" />
              <h3>{city.temperature}°C</h3>
              <p className="text-muted">{city.condition}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}
