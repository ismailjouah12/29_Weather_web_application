import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App.jsx";
import City from "./userComponents/City";
import Favorites from "./userComponents/Favorites";
import Login from "./guestComponents/Login.jsx";
import Signup from "./guestComponents/Signup.jsx";
import NotFound from "./sharedComponents/NotFound.jsx";
import WeatherCards from "./sharedComponents/WeatherCards.jsx";




const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [

      {
        index: true,
        element: <WeatherCards/>
      },

      {
        path: '/city',
        element: <City/>
      },

      {
        path: '/favorites',
        element: <Favorites/>
      },

      {
        path: '/login',
        element: <Login/>
      },

      {
        path: '/signup',
        element: <Signup/>
      }
      
    ]
  },

  {
    path: "*",
    element: <NotFound/>
  }
])

export default router;