import { createContext, useContext, useState, useEffect } from "react";

const UserContext = createContext({
  user: null,
  token: null,
  activePage: null,
  msg :"",
  setUser: () => {},
  setToken: () => {},
  setActivePage: () => {}, 
  setMsg : () => {}
});

export const ContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("/");
  const [token, _setToken] = useState(localStorage.getItem("ACCESS_TOKEN"));
  const [msg, setMsg] = useState("");

  //  Restore user and token on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("USER");
    const storedToken = localStorage.getItem("ACCESS_TOKEN");
    
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    if (storedToken) {
      _setToken(storedToken);
    }
  }, []);

  //  When user is updated (login / profile update), save it
  const saveUser = (userData) => {
    setUser(userData);
    if (userData) {
      localStorage.setItem("USER", JSON.stringify(userData));
    } else {
      localStorage.removeItem("USER");
    }
  };

  const setToken = (token) => {
    _setToken(token);
    if (token) {
      localStorage.setItem("ACCESS_TOKEN", token);
    } else {
      localStorage.removeItem("ACCESS_TOKEN");
    }
  };

  return (
    <UserContext.Provider
      value={{
        user,
        setUser: saveUser,  // use the new saveUser
        activePage,
        setActivePage,
        token,
        setToken,
        msg,
        setMsg
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
