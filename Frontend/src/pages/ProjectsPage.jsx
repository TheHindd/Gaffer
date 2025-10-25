import React, { useContext, useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import "react-day-picker/style.css";
import { DayPicker } from "react-day-picker";

const Dashboard = () => {
  const { userData, getuserData } = useContext(AppContext);
  const [selected, setSelected] = useState(new Date());
  
  useEffect(() => {
    getuserData();
  }, []);

  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    document.dir = newLang === "ar" ? "rtl" : "ltr";
  };

  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen bg-background">
      
      <aside className="fixed top-0 left-0 h-full">
        <SideBar />
      </aside>
  
      <div 
        className="flex-1 flex flex-col"
        style={{
          marginInlineStart: "4rem",
        }}
      >
        <NavBar />

        <main className="flex-1 p-6 ml-3">
          
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-secondary1">{t("HomePage")}</h1>
          </div>

          {/* Main Grid - 4 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-primary1 auto-rows-fr">

            {/* ROW 1 */}
            
            {/* Welcome Card - 1 column */}
            <div className="bg-white p-6 rounded-2xl shadow flex items-center">
              <h2 className="text-base font-semibold">
                {t("welcome")}, {userData ? userData.name : "Loading..."}! 👋
              </h2>
            </div>

            {/* Upcoming Tasks - 2 columns */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold">{t("UpcomingTasks")}</h2>
                <button className="text-orange-500 hover:text-orange-600">
                  ✏️
                </button>
              </div>
              
              {/* Task List */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1 text-sm">create the poster for xyz company</span>
                  <span className="text-red-500 text-lg">🚩</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1 text-sm">add fulan to the project</span>
                  <span className="text-red-500 text-lg">🚩</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1 text-sm">finish the xyz plan</span>
                  <span className="text-red-500 text-lg">🚩</span>
                </div>
              </div>
            </div>

            {/* Calendar - 1 column, spans 3 rows */}
            <div className="lg:row-span-3 bg-white p-4 rounded-2xl shadow">
              <h2 className="font-semibold mb-2 text-sm">{t("Calendar")}</h2>
              <DayPicker
                mode="single"
                selected={selected}
                onSelect={setSelected}
                showOutsideDays
                today={new Date()}
                classNames={{
                  root: "text-sm",
                  months: "flex flex-col",
                  month: "space-y-2",
                  caption: "flex justify-center relative items-center mb-2",
                  caption_label: "text-sm font-medium",
                  nav: "space-x-1 flex items-center",
                  nav_button: "h-6 w-6 bg-transparent p-0 opacity-50 hover:opacity-100",
                  nav_button_previous: "absolute left-0",
                  nav_button_next: "absolute right-0",
                  table: "w-full border-collapse",
                  head_row: "flex",
                  head_cell: "text-gray-500 rounded-md w-8 font-normal text-xs",
                  row: "flex w-full mt-1",
                  cell: "text-center text-xs p-0 relative",
                  day: "h-8 w-8 p-0 font-normal hover:bg-blue-50 rounded-md flex items-center justify-center cursor-pointer",
                  day_selected: "bg-blue-600 text-white hover:bg-blue-700 rounded-md",
                  day_today: "bg-blue-600 text-white font-bold rounded-md",
                  day_outside: "text-gray-300 opacity-50",
                }}
              />
            </div>

            {/* ROW 2 */}

            {/* News - 1 column */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="font-semibold mb-4 text-sm">{t("News")}</h2>
              <p className="text-gray-400 text-xs text-center">No recent news</p>
            </div>

            {/* Recent Projects - 1 column */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="font-semibold mb-4 text-sm">{t("RecentProjects")}</h2>
              <p className="text-gray-400 text-xs text-center">
                You weren't added to any project yet.
              </p>
            </div>

            {/* Personal Notes - 1 column */}
            <div className="bg-white p-6 rounded-2xl shadow">
              <div className="flex justify-between items-center mb-4">
                <h2 className="font-semibold text-sm">{t("Notes")}</h2>
                <div className="flex gap-2">
                  <button className="text-orange-500 hover:text-orange-600">✏️</button>
                  <button className="text-orange-500 hover:text-orange-600 text-lg">+</button>
                </div>
              </div>
              <p className="text-gray-400 text-xs text-center">
                Add your personal notes and reminders.
              </p>
            </div>

            {/* ROW 3 - Progress spans from row 2 to row 3 */}

            {/* Empty spacers to maintain grid flow */}
            <div className="lg:col-span-3 bg-white p-6 rounded-2xl shadow flex flex-col items-center justify-center">
              {/* Circular Progress */}
              <div className="relative w-28 h-28 mb-3">
                <svg className="transform -rotate-90 w-28 h-28">
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="#e5e7eb"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="56"
                    cy="56"
                    r="50"
                    stroke="#f97316"
                    strokeWidth="8"
                    fill="none"
                    strokeDasharray="314.16"
                    strokeDashoffset="43.98"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-blue-900">86%</span>
                </div>
              </div>
              
              <h3 className="text-center font-semibold text-sm mb-1">
                The coffee shop project
              </h3>
              <p className="text-xs text-gray-500">{t("Progress")}</p>
            </div>

          </div>
        </main>
      </div>
      
    </div>
  );
};

export default Dashboard;