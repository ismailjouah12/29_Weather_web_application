import { Link, Navigate } from 'react-router-dom';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import { useNavigate } from "react-router-dom";
import NotFound from '../sharedComponents/NotFound.jsx';


export default function Favorites() {
  const { user, setUser, token, setToken } = useUserContext();
  if (!token) 
    return Navigate({ to: '/*' });

  return (<>
    <h1 className="">FAVORITES Component</h1>
  </>);
  }