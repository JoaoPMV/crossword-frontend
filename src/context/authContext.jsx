import React, { createContext, useContext, useEffect, useState } from "react";
import { fetchUserByToken } from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const loadUser = async () => {
      const token = localStorage.getItem("authToken");

      if (!token) {
        if (!cancelled) setUser(null);
        return;
      }

      try {
        const data = await fetchUserByToken(token);
        if (!cancelled) {
          if (data && data.user) setUser(data.user);
          else setUser(null);
        }
      } catch {
        if (!cancelled) setUser(null);
      }
    };

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
