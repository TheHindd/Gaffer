import React from 'react'
import { assets } from '../assets/assets'
import { useTranslation } from 'react-i18next';

const NavBar = () => {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr"; // 👈 set text direction
  };
  return (
    <div className='w-full flex justify-between items-center absoulute h-106px py-3 px-3'>
      <div className="flex flex-col items-center">
      <button 
        onClick={toggleLanguage} 
        className="absolute top-4 right-4 bg-gray-200 px-2 py-1 rounded"
      >
        {i18n.language === "en" ? "AR" : "EN"}
      </button>
      </div>
        <div  className='flex justify-end gap-7 text-orange-400 font-bold cursor-pointer' onClick={()=> window.location.href='/'}>
          <img src={assets.blueLogo} alt="logo" className='w-16 ml-4'/>
          <p>الرئيسية</p>
          <p>من نحن </p>
          <p>خدماتنا</p>
          <p>أعمالنا </p>
          <p>تواصل معنا</p>
        </div>
        <div>

        <button className='flex items-center bg-blue-800 rounded-xl px-3 py-2 text-white text-sm hover:bg-blue-500 transition-all'>تسجيل الدخول</button>
        </div>
    </div>
  )
}

export default NavBar
