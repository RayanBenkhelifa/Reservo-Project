import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userType: null,
    user: null,
  });
  const [loading, setLoading] = useState(true);

  // Function to check authentication status and fetch user data
  const checkAuth = async () => {
    try {
      const response = await fetch("/auth/check-auth", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setAuthState({
          isAuthenticated: data.isAuthenticated,
          userType: data.userType,
          user: data.user,
        });
      } else {
        setAuthState({
          isAuthenticated: false,
          userType: null,
          user: null,
        });
      }
    } catch (error) {
      console.error("Error checking authentication:", error);
      setAuthState({
        isAuthenticated: false,
        userType: null,
        user: null,
      });
    } finally {
      setLoading(false);
    }
  };

  // Call checkAuth on component mount
  useEffect(() => {
    checkAuth();
  }, []);

  const login = async (userType) => {
    // After login, call checkAuth to update authState
    await checkAuth();
  };

  const logout = async () => {
    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        setAuthState({
          isAuthenticated: false,
          userType: null,
          user: null,
        });
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ authState, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
