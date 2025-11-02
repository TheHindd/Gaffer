import React, { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import { useTranslation } from "react-i18next";
import { AppContextProvider } from "./context/AppContext";
import AppRoutes from "./routes/AppRoutes"; // 👈 imported route file
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { i18n } = useTranslation();
  
  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <AppContextProvider>
      <div className="min-h-screen bg-gray-50 text-gray-900">
        <ToastContainer position="top-right" />
        <AppRoutes /> {/* 👈 handles all routing */}
      </div>
    </AppContextProvider>
  );
};

export default App;
