import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App.jsx";
import City from "./userComponents/City";
import Favorites from "./userComponents/Favorites";
import Login from "./guestComponents/Login.jsx";
import Signup from "./guestComponents/Signup.jsx";
import NotFound from "./sharedComponents/NotFound.jsx";
import Home from "./sharedComponents/Home.jsx";
import Profile from "./userComponents/Profile.jsx";
import SearchedList  from "./sharedComponents/SearchedList.jsx";
import History from "./userComponents/History.jsx";
import About from "./sharedComponents/About.jsx";
import AboutUs from "./sharedComponents/About.jsx"; 
import Admin from "./Admin.jsx";
import Events from "./userComponents/Events.jsx"




const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [
      {
        path: "/:cityName",
        element: <Home/>
      },

      {
        path: "/" ,
        element: <Home/>
      },

      {
        path: "/city/:cityName",
        element: <City/>
      },
      {
        path: "/searchedList/:suggestions",
        element: <SearchedList/>
      },
      {
        path: "/history",
        element: <History/>
      },

      {
        path: "/favorites",
        element: <Favorites/>
      },

      {path: "profile",
       element: <Profile/>
      },
      {
        path: "/events",
        element: <Events/>
      },
      {
        path: "/login",
        element: <Login/>
      },

      {
        path: "signup",
        element: <Signup/>
      },
      {
        path: "about",
        element: <About/>
      }

    ]
  },

  {
    path: "/admin",
    element: <Admin/>
  },
  
  {
    path: "*",
    element: <NotFound/>
  }
]);


export default router;