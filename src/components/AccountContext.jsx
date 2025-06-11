import { useNavigate } from "react-router-dom";

const { createContext, useState, useEffect } = require("react");

export const AccountContext = createContext();

const UserContext = ({ children }) => {
  const [user, setUser] = useState({ loggedIn: null });
  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    fetch(`${API_URL}/auth/login`, { // Express Server on port 4000
      credentials: "include",
    })
    .catch(err => { // error, dont log in
      console.error('Auth check failed:', err);
      setUser({ loggedIn: false });
        return;
    })
    .then(r => { // unauthorized, dont log in
      if (!r || !r.ok || r.status >= 400) {
        setUser({ loggedIn: false });
        return;
      }
      return r.json();
    })
    .then(data => { // has data
      if (!data) { // wrong data
        setUser({ loggedIn: false });
        return;
      }
      setUser({ ...data }); // right data
    });
  }, []);
  return (
    <AccountContext.Provider value={{ user, setUser }}>
      {children}
    </AccountContext.Provider>
  );
};

export default UserContext;
