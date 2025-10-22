import React, { useContext, useEffect } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { data, useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import "react-day-picker/style.css";
import { DayPicker } from "react-day-picker";

const Dashboard = () => {
  const { userData, getuserData } = useContext(AppContext);
  useEffect(() => {
    getuserData(); // ensure data loads on first render
  }, []);

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr"; // 👈 set text direction
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
        <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-9 text-primary1">

           <div className="md:col-span-full lg:col-span-full">
             <h1 className="text-2xl font-bold text-secondary1">{t("HomePage")}</h1>
            </div>
            {/* cards */}
            <div className="md:col-span-1 lg:col-span-3">
            <div className=" bg-white p-4 rounded-2xl shadow">
             <h className=" flex justify-center font-bold"> {t("welcome")}, {userData ? userData.name : "Loading..."} 👋 </h>
            </div>
            <div className= "bg-white p-4 rounded-2xl shadow mt-5">
              <h2 className="font-semibold mb-2">{t("News")}</h2>
            </div>
            </div>
            
            <div className="bg-white p-4 rounded-2xl shadow col-span-3">
              <h2 className="font-semibold mb-2">{t("UpcomingTasks")}</h2>
              {/* task list */}
            </div>

            <div className="bg-white p-4 rounded-2xl shadow col-span-2">
              <h2 className="font-semibold mb-2">{t("Calendar")}</h2>
              {/* calendar */}
               <DayPicker
                  mode="single"
                  showOutsideDays
                  classNames={{
                    root: "p-0",
                    nav_button_previous: "text-gray-500 hover:text-primary",
                    nav_button_next: "text-gray-500 hover:text-primary",
                    day: "hover:bg-primary-light rounded-full",
                    day_selected: "bg-primary text-white rounded-full",
                  }}
                />
            </div>

            {/* bottom row */}
            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="font-semibold mb-2">{t("RecentProjects")}</h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="font-semibold mb-2">{t("Notes")}</h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow">
              <h2 className="font-semibold mb-2">{t("Progress")}</h2>
            </div>

            
        </div>
      </main>
      </div>
      
    </div>
  );
};

export default Dashboard;
