import {createContext, useContext, useState} from "react";

const UserContext = createContext({
  user: null,
  token: null,
  activePage: null,
  setUser: () => {},
  setToken: () => {},
  setActivePage: () => {},
})

export const ContextProvider = ({children}) => {
  const [user, setUser] = useState({});
  const [activePage, setActivePage] = useState("/");
  const [token, _setToken] = useState(12);

  const setToken = (token) => {
    _setToken(token)
    if (token) {
      localStorage.setItem('ACCESS_TOKEN', token);
    } else {
      localStorage.removeItem('ACCESS_TOKEN');
    }
  }

  return (
    <UserContext.Provider value={{
      user,
      setUser,
      activePage,
      setActivePage,
      token,
      setToken,
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserContext = () => useContext(UserContext);