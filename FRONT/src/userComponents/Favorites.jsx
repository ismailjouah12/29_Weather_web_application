import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";

export default function Favorites() {

  const navigate = useNavigate();
  const { user, msg, setMsg } = useUserContext();

  const [favorites, setFavorites] = useState([]);
  
  const [loading, setLoading] = useState(true);
  

  useEffect(() => { 
    axiosClient.get('/saved-cities')
      .then(({ data }) => {
        setFavorites(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching favorites:", error);
        setLoading(false);
      });
  }, []);

  const handleClick = (cityName) => {
    navigate(`/city/${cityName}`);
  };

  const handleDelete = (cityName) => {
    axiosClient.delete(`/saved-cities/${cityName}`)
      .then(() => {
        setFavorites(favorites.filter(city => city.city_name !== cityName));
        setMsg("Deleted successfully!");
        setTimeout(() => {
          setMsg("");
        }, 1500);
      })
      .catch((err) => {
        console.error("Error deleting favorite:", err);
      });
  };

  if (loading) return <div>Loading...</div>;

  if (!favorites || favorites.length === 0) {
    return <div className="alert alert-danger">No favorites found</div>;
  }

  return (
    <div className="row">

      {favorites.map((city, index) => (
        <div 
          className="col-md-3 col-sm-6 mb-4" 
          key={index}
        >
          <button className="card-link bg-danger border-0 p-2 rounded-3 m-2" onClick={() => handleDelete(city.city_name)}>
            delete
          </button>
          <div 
            className="card shadow-sm  text-center"
            style={{ cursor: "pointer" }}
            onClick={() => handleClick(city.city_name)}
          >
            <h5 className="fw-bold">{city.city_name}</h5>
            <p>Saved at: <b>{city.created_at}</b></p>
          </div>
        </div>
      ))}

       {msg && (
          <div className="alert alert-success text-center py-2">
            {msg}
          </div>
        )}

    </div>
  );
}
