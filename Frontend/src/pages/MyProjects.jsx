import React from 'react'
import SideBar from '../components/Common/SideBar'
import NavBar from '../components/Common/NavBar'
import { useState, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate, useParams } from 'react-router-dom'
import { AppContext } from '../context/AppContext'

const MyProjects = () => {

    const [projectData, setProjectData] = useState(null);
    const { t, i18n } = useTranslation();
    const { userData, getuserData } = useContext(AppContext);
    const { projectId } = useParams(); // Get projectId from URL
    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();


    useEffect(() => {
        //fetchProjectDetails();
      }, [projectId]);
    
      const toggleLanguage = () => {
        const newLang = i18n.language === "en" ? "ar" : "en";
        i18n.changeLanguage(newLang);
        localStorage.setItem("lang", newLang); // optional, to persist
      };
    

  return (
     <div className="flex min-h-screen bg-background">
      <aside className="fixed top-0 left-0 h-full">
        <SideBar />
      </aside>

      <div
        className="flex-1 flex flex-col"
        style={{
          marginInlineStart: "4rem", // logical property -> auto flips with dir
        }}
      >
        <NavBar />

        <main className="flex-1 p-6 ml-2">
            <div className="flex md:col-span-full p-3 lg:col-span-full mb-3 font-serif">
              <h1 className="text-xl font-bold text-secondary1">{t("projects")}</h1>
            </div>

        </main>
        </div>
    </div>
  )
}

export default MyProjects
