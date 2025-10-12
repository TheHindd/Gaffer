import React from "react";
import axios from "axios";
import { createContext, useState, useEffect } from "react";

export const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [userData, setUserData] = useState(null);

  const getuserData = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ Check how you saved it after login
      if (!token) return;

      const { data } = await axios.get(`${backendUrl}/api/auth/data`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (data.success) {
        setUserData(data.userData);
      }
    } catch (error) {
      console.error("Error fetching user data:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    if (isLoggedin) getuserData();
  }, [isLoggedin]);

  return (
    <AppContext.Provider
      value={{
        backendUrl,
        isLoggedin,
        setIsLoggedin,
        userData,
        setUserData,
        getuserData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
