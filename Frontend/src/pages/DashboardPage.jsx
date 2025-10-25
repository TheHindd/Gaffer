import React, { useContext, useEffect } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { data, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import CalendarCard from "../components/Calender";


const Dashboard = () => {
  const { userData, getuserData } = useContext(AppContext);
  useEffect(() => {
    getuserData(); // ensure data loads on first render
  }, []);

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
      const newLang = i18n.language === "en" ? "ar" : "en";
      i18n.changeLanguage(newLang);
      localStorage.setItem("lang", newLang); // optional, to persist
    };
  const navigate = useNavigate();


  return (
    <div className="flex min-h-screen bg-background ">

      <aside className=" fixed top-0 left-0 h-full">
         <SideBar />
      </aside>
  
      <div  className="flex-1 flex flex-col"
        style={{
        marginInlineStart: "4rem",   // logical property -> auto flips with dir
       }}>

        <NavBar />

       <main className="flex-1 p-6 ml-3">
        <div className="grid gap-6 grid-cols-1 md:grid-cols-3 lg:grid-cols-9 text-primary1 font-serif gap-6 max-h-1/2">

           <div className="md:col-span-full lg:col-span-full">
             <h1 className="text-lg font-bold text-secondary1">{t("HomePage")}</h1>
            </div>
            {/* cards */}
            <div className="flex flex-row justify-evenly lg:col-span-3">
            <div className=" bg-white p-4 rounded-2xl shadow">
             <h className=" flex justify-center "> {t("welcome")}, {userData ? userData.name : "Loading..."} ! 👋 </h>
            </div>
            <div className= "bg-white p-4 rounded-2xl shadow mt-5">
              <h2 className="mb-2">{t("News")}</h2>
            </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow lg:col-span-4">
              <h2 className=" mb-2">{t("UpcomingTasks")}</h2>
              <button className="text-gray-400 hover:text-gray-600">
                  ✏️
                </button>

                <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">create the poster for xyz company</span>
                  <span className="text-red-500">🚩</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">add fulan to the project</span>
                  <span className="text-orange-500">🚩</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">finish the xyz plan</span>
                  <span className="text-gray-400">🚩</span>
                </div>
              </div>

              {/* task list */}
            </div>

            <div className="bg-white p-4 rounded-2xl shadow col-span-2">
                 <h2 className=" mb-2">{t("Calendar")}</h2>
                  <CalendarCard /> 
            </div>

            {/* bottom row */}
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className=" mb-2">{t("RecentProjects")}</h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className=" mb-2">{t("Notes")}</h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className=" mb-2">{t("Progress")}</h2>
            </div>

            
        </div>
      </main>
      </div>
      
    </div>
  );
};

export default Dashboard