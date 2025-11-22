import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Link } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";


export default function Search(){

    const { user, setUser, token, setToken } = useUserContext();
    
    if(token){
    return (
      <div className="">
        <h1>UserSearch</h1>
  
        
      </div>
       
    );
    }

    return (<div className="">

       
        <h1>Search</h1>
    
    </div>)
}
