import { Children, createContext } from "react";
const stateUser = createContext({
    user: null,
    token: null,
});
export default UserContext;    

export const UserContext = ({Children}) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);

    return (
        <UserContext.Provider value={{user, setUser, token, setToken}}>
            {Children}
        </UserContext.Provider>
    );
};
        