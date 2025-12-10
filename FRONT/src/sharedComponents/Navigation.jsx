import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Navigation() {

  const { user,setUser,token, setToken, activePage, setActivePage } = useUserContext();
  const navigate = useNavigate();
  const location = useLocation();   

  const userNav = [
    { name: "Profile", path: "/profile" },
    { name: "Events", path: "/events"},
    { name: "Favorites", path: "/favorites" },  /// nav for the user
    { name: "History", path: "/history" },
    { name: "About", path: "/about"},
    { name: "Log out", path: null },
  ];

  const guestNav = [
    { name: "Login", path: "/login" },
    { name: "Register", path: "/signup" },  //nav for the guest
    { name: "About", path: "/about" },
  ];

  const navItems = !(token == null) ? userNav : guestNav;

  const handleLogout = () => {
    axiosClient.post('/logout').then(() => {
      setUser(null);
      setToken(null);
      navigate("/login");
    });
  };
  const handleHomeClick = () => {
    navigate("/");
  };


  return (
    <nav className="navbar navbar-expand-lg rounded-3 navbar-dark bg-dark shadow mb-3">
      <div className="container">
        <button
          className="navbar-brand btn btn-link text-white p-0 fs-4 fw-semibold"
          onClick={handleHomeClick}
        >
          Home
        </button>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">

            {navItems.map((item, i) => (
              <li className="nav-item mx-2" key={i}>
                <button
                  className={`nav-link btn btn-link hover-bg-danger  p-2  ${
                    item.path && location.pathname === item.path
                      ? "active fw-bold bg-primary text-warning"
                      : ""
                  }   ${item.path === null ? "text-danger" : " text-white"}`}
                  onClick={() =>
                    item.name === "Log out"
                      ? handleLogout()
                      : navigate(item.path)
                  }
                >
                  {item.name}
                </button>
              </li>
            ))}

          </ul>
        </div>

      </div>
    </nav>
  );
}