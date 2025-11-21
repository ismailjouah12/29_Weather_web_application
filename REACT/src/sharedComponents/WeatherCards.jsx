import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import Search from './Search.jsx';


export default function WeatherCards() {

  const { user, setUser, token, setToken } = useUserContext();

  if(token){
    return (
      <div className="">
        <h1>USER_CARDS</h1>
  
        
      </div>
       
    );
  }
    

  return (<div className="">
    <h1>CARDS</h1>

    
  </div>
   
  );
  }