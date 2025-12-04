import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useUserContext } from "../UserContext.jsx";

export default function SearcharchedList() {
  const { user,setUser,token, setToken, activePage, setActivePage } = useUserContext();
  const navigate = useNavigate();
  const params = useParams();

  const [sugList, setsugList] = useState([]);

  useEffect(() => {
    if (params.suggestions) {
      try {
        const parsed = JSON.parse(params.suggestions);
        setsugList(parsed);
      } catch (e) {
        console.error("Invalid suggestions param:", params.suggestions);
      }
    }
  }, [params]);

  const handleClick = (s) => {
    if (token) {
      navigate(`/city/${s}`);
    } else {
      navigate(`/${s}`);
    }
    setCity("");
  };

  return (
    <div>
      <h1 className=' card card-title text-center'>Result</h1>
      {!sugList && <div className='alert alert-danger'> no result found </div>}

      <ul className="list-group position-absolute w-100 mt-1 shadow">
        {sugList.map((s, index) => (
          <li
            key={index}
            className="list-group-item list-group-item-action"
            onClick={() => handleClick(s)}
            style={{ cursor: "pointer" }}
          >
            {s}
          </li>
        ))}
      </ul>
    </div>
  );
}
