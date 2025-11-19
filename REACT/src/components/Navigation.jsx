import { Link } from 'react-router-dom';
function Navegation() {
  return (
    <nav className="">
        <Link className="" to="/guest">Home</Link>

        <div className="">
          <ul className="">
            <li className="">
              <Link className="" to="/guest/login">Login</Link>
            </li>
            <li className="">
              <Link className="" to="/guest/signup">Sign Up</Link>
            </li>
          </ul>
        </div>
      </nav>
  );
}   
export default Navegation;