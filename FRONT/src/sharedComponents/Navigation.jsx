import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import axiosClient from "../axiosClient.js";
import { useUserContext } from "../UserContext.jsx";

export default function Navigation() {

  const { user, setUser, token, setToken } = useUserContext();
  const navigate = useNavigate();

  const userNav = [
    { name: "Profile", path: "/" },
    { name: "Favorites", path: "/favorites" },
    { name: "Log out", path: null },    
  ];

  const guestNav = [
    { name: "Login", path: "/login" },
    { name: "Register", path: "/signup" },
    { name: "About", path: "/about" },
  ];

  const navItems = token ? userNav : guestNav;

  const handleLogout = () => {
    axiosClient.post('/logout').finally(() => {
      setUser(null);
      setToken(null);
      navigate("/login");
    });
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">

        <button
          className="navbar-brand btn btn-link text-white p-0"
          onClick={() => navigate("/")}>
          home
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
              <li className="nav-item mx-3" key={i}>
                  <button className="nav-link btn btn-link text-white p-0"
                    onClick = { (item.name === "Log out") ? handleLogout : () => handleNavigation(item.path) }>
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
