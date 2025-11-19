import { createBrowserRouter } from "react-router-dom";
import App from "./App.jsx";                
import Guest from "./pages/Guest.jsx";
import User from "./pages/User.jsx";
import Login from "./components/Login.jsx";
import SignUp from "./components/SignUp.jsx";
import NotFound from "./components/NotFound.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Guest />,     
    children: [
      {index: true, element: <App /> }, 
      { path: "/guest/login", element: <Login /> },    
      { path: "/guest/signup", element: <SignUp /> }
               
    ]
  },

  { path: "user", element: <User /> },

  { 
    path: "*", 
    element: <NotFound /> 
  },  

]);

export default router;
