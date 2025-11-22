import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import Search from './Search.jsx';

function MainCard({city}) {

  const { user, setUser, token, setToken } = useUserContext();

  const weatherData = axiosClient.get('/weather',city);

  return (
    <div className="card p-3 mt-3">
          <h3 className="text-center">city</h3>
          <p>Temperature: 20 °C</p>
          <p>Humidity: 10%</p>
          <p>Wind: 50 m/s</p>
        </div>
  );
}

function SecondaryCard({city}) {

  const { user, setUser, token, setToken } = useUserContext();

  //const weatherData = axiosClient.get('/weather',city);


  return (
    <div className="card p-5 mb-3 " style={{ Width: '25rem', Height: '25rem'   }}>
          <h3 className="text-center">city</h3>
          <p>Temperature: 20 °C</p>
        </div>
  );
}
export default function WeatherCards() {

  const { user, setUser, token, setToken } = useUserContext();
  const isFavorite = false;
  const [cityList,setCityList] = useState(['Agadir', 'Paris', 'Chicago', 'Tokyo', 'Rabat']); //static data for testing

  if (!token) {
      
      if( isFavorite){
        cityList[0] = 'Favorite City 1';
        cityList[1] = 'Favorite City 2';
        cityList[2] = 'Favorite City 3';
        cityList[3] = 'Favorite City 4';
        cityList[4] = 'Favorite City 5';
  }
  }

  return (
  <div className="">
    <div className="container text-white bg-info mt-lg-5 w-100 mb-5 mt-5">
      <MainCard value={cityList[0]}/>
    </div>
    <div className="container-fluid d-flex justify-content-between mt-5 pt-5">
      <SecondaryCard value={cityList[1]}/>
      <SecondaryCard value={cityList[2]}/>
      <SecondaryCard value={cityList[3]}/>
      <SecondaryCard value={cityList[4]}/>
    </div>
    

    
  </div>
   
  );
  }