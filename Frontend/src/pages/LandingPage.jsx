import React from "react"
import NavBar from "../components/LandingPageComponents/LandingNavBar"
import { useTranslation } from "react-i18next"

const LandingPage = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr"; // 👈 set text direction
  };
  return (
    <div>
      <NavBar />
    </div>
  )
}

export default LandingPage
