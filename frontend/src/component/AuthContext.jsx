import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authState, setAuthState] = useState({
    isAuthenticated: false,
    userType: null,
    user: null, // Add user property
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/auth/check-auth", {
          method: "GET",
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setAuthState({
            isAuthenticated: true,
            userType: data.userType,
            user: data.user, // Set the user data
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

    checkAuth();
  }, []);
  const login = (userType) => {
    setAuthState({
      isAuthenticated: true,
      userType: userType,
    });
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
