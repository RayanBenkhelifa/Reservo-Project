import React, { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize authState from localStorage
  const [authState, setAuthState] = useState({
    isAuthenticated: !!localStorage.getItem("userId"),
    userType: localStorage.getItem("userType"),
    user: localStorage.getItem("userId")
      ? {
          id: localStorage.getItem("userId"),
          username: localStorage.getItem("username"), // Initialize username
          email: localStorage.getItem("email"), // Initialize email
        }
      : null,
  });

  // No need for loading state since we're not fetching from the backend
  // const [loading, setLoading] = useState(false);

  // The login function updates the authState and stores data in localStorage
  const login = (userType) => {
    setAuthState({
      isAuthenticated: true,
      userType: userType,
      user: {
        id: localStorage.getItem("userId"),
        username: localStorage.getItem("username"), // Initialize username
        email: localStorage.getItem("email"), // Initialize email
      },
    });
  };

  // The logout function clears the authState and localStorage
  const logout = async () => {
    try {
      const response = await fetch("/auth/logout", {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        // Clear localStorage
        localStorage.removeItem("userId");
        localStorage.removeItem("userType");
        localStorage.removeItem("username"); // Initialize username
        localStorage.removeItem("email"); // Initialize email

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
    <AuthContext.Provider value={{ authState, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
