import React, { useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom';
import { useDashboardData } from '../../hooks/useDashboardDatat';
import { AppContext } from '../../context/AppContext';


const NavBar = () => {


  const { userData, getuserData } = useContext(AppContext);  

    useEffect(() => {
      getuserData(); // ensure data loads on first render
    }, []);

  const initials = () => {
    let name = userData ? userData.name: "";  
    let char= name.toUpperCase().split("");
    
    return char[0]; 
  }

  const { i18n } = useTranslation();
  const navigate = useNavigate();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang); // optional, to persist
  };

  
  return (
    <div className='flex flex-row justify-end bg-white w-full border-b border-gray-200 py-3 top-0 h-14 '>
        
        <div className='flex flex-row px-3'>
          <button 
            onClick={toggleLanguage} 
            className="bg-gray-200 px-2 py-1 rounded mr-4 mt-1"
          >
          {i18n.language === "en" ? "AR" : "EN"}
          </button>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 w-6 text-primary1 mt-2 mr-4 cursor-pointer hover:text-primary1 transition-all">
         <path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0" />
        </svg>
          
          <div className='flex justify-center bg-primary1 w-9 h-9 rounded-full overflow-hidden cursor-pointer'>
              <h2 className='flex items-center text-white text-2xl '> {initials(userData ? userData.name : "Loading...")} </h2>
          </div>

        {/* <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="size-6 w-6 text-primary1 mt-2 mr-4 cursor-pointer hover:text-primary1 transition-all" >
         <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>  */}
        </div>
             
    </div>
  )
}

export default NavBar
