import React from 'react'
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom'
import { useDashboardData } from '../../hooks/useDashboardDatat';

const PersonalNotes = () => {

    const navigate = useNavigate();
      const { personalNotes} = useDashboardData();


    const { t, i18n } = useTranslation();
      const toggleLanguage = () => {
        const newLang = i18n.language === "en" ? "ar" : "en";
        i18n.changeLanguage(newLang);
        localStorage.setItem("lang", newLang); // optional, to persist
      };

  return (
    <div className="flex flex-col grow bg-white p-4 rounded-2xl shadow  ">
        <div className='flex flex-row justify-between'>
            <div> <h2 className="mb-2 font-semibold">{t("Notes")}</h2></div>
              
            <div className='flex '>
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 12 12" className='size-3 w-6 cursor-pointer'>
                <path fill="#364153" d="M6.5 1.75a.75.75 0 0 0-1.5 0V5H1.75a.75.75 0 0 0 0 1.5H5v3.25a.75.75 0 0 0 1.5 0V6.5h3.25a.75.75 0 0 0 0-1.5H6.5V1.75Z"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 16 16" className='size-3 w-6 cursor-pointer'>
                <path fill="#364153" d="M10.733 2.56a1.914 1.914 0 0 1 2.707 2.708l-.733.734l-2.708-2.708l.734-.733Zm-1.44 1.441L3.337 9.955a1.65 1.65 0 0 0-.398.644l-.914 2.743a.5.5 0 0 0 .632.633L5.4 13.06c.243-.08.463-.217.644-.398L12 6.709L9.292 4Z"/>
                </svg>
            </div>
        </div>

        <div className='flex flex column'>
          
        </div>
        
    </div>
  )
}

export default PersonalNotes
