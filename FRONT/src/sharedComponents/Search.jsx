import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { Link } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";


export default function Search(){

    const { user, setUser, token, setToken } = useUserContext();
    
    return (<div>
        <form className="d-flex" role="search">
            <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
            <button className="btn btn-outline-light" type="submit">Search</button>
        </form>
    
    </div>)
}


