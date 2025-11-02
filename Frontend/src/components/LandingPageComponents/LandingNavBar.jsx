import React from 'react'
import { assets } from '../../assets/assets'; 
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

const NavBarLanding = () => {

  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr"; // 👈 set text direction
  };

  
  return (
    <div className='w-full flex justify-between items-center absoulute h-106px py-3 px-3'>
        <div  className='flex justify-end gap-7 text-primary1 font-bold cursor-pointer' onClick={()=> window.location.href='/'}>
          <img src={assets.blueLogo} alt="logo" className='w-16 ml-4'/>
          <p>{t("Home")}</p>
          <p>{t("AboutUs")}</p>
          <p>{t("OurServices")}</p>
          <p>{t("OurWork")}</p>
          <p>{t("ContactUs")}</p>
        </div>
        
  <div className="flex flex-row items-center">
      <button 
        onClick={toggleLanguage} 
        className="bg-gray-200 rounded mr-4 ml-4 px-3 py-2 text-sm hover:bg-gray-400 transition-all">
        {i18n.language === "en" ? "AR" : "EN"}
      </button>
      <button onClick={() => navigate("/Login")} className='flex justify-center bg-secondary1 rounded-xl py-2 w-32 text-white text-sm hover:bg-blue-500 transition-all'>{t("login")}</button>
      </div>
        
    </div>
  )
}

export default NavBarLanding
