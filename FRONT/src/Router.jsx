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




const router = createBrowserRouter([
  {
    path: '/',
    element: <App/>,
    children: [

      {
        index: true,
        element: <Home/>
      },

      {
        path: ":cityName",
        element: <Home/>
      },

      {
        path: "city",
        element: <City/>
      },
      {
        path:  "searchedList",
        element: <SearchedList/>
      },
      {
        path: "history",
        element: <History/>
      },

      {
        path: "favorites",
        element: <Favorites/>
      },
      {path: "profile",
       element: <Profile/>
      },

      {
        path: "login",
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
    path: "*",
    element: <NotFound/>
  }
]);


export default router;