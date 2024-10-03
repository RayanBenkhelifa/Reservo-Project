import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    token: null,
    userType: null,
  });
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    const userType = localStorage.getItem("userType");
    if (token && userType) {
      setAuthState({ token, userType });
    }
    setLoading(false); // Set loading to false once authState is populated
  }, []);

  const login = (token, userType) => {
    localStorage.setItem("authToken", token);
    localStorage.setItem("userType", userType);
    setAuthState({ token, userType });
  };

  const logout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userType");
    setAuthState({ token: null, userType: null });
  };

  return (
    <AuthContext.Provider value={{ authState, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
