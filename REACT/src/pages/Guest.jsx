import { Outlet, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css'
import Search from "../components/Search.jsx";
import Navigation from "../components/Navigation.jsx";


export default function Guest() {
  return (<>
  <div className="">

     
     
    
    
    <Outlet />
      
    </div>
    
    </>
  );
}