import React, { useContext, useEffect } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import CalendarCard from "../components/Calender"; // keep your existing path
import { useTranslation } from 'react-i18next';

const Dashboard = () => {
  const { userData, getuserData } = useContext(AppContext);

  useEffect(() => {
    getuserData(); // ensure data loads on first render
  }, []);

  const { t, i18n } = useTranslation();

    const CircularProgress = ({ percentage, projectName }) => {
    const circumference = 2 * Math.PI * 60;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className="flex flex-col items-center justify-center h-full">
        <div className="relative w-40 h-40">
          <svg className="transform -rotate-90 w-40 h-40">
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="#e5e7eb"
              strokeWidth="10"
              fill="none"
            />
            <circle
              cx="80"
              cy="80"
              r="60"
              stroke="#f97316"
              strokeWidth="9"
              fill="none"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-primary1">{percentage}%</span>
          </div>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-center text-primary1 mb-3">
          {projectName}
        </h3>
        <p className="text-xs text-gray-500">{t("Progress")}</p>
      </div>
    );
  };
  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang); // optional, to persist
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
          marginInlineStart: "4rem", // logical property -> auto flips with dir
        }}
      >
        <NavBar />

        <main className="flex-1 p-6 ml-2">

           <div className="flex md:col-span-full p-3 lg:col-span-full mb-3 font-serif">
              <h1 className="text-xl font-bold text-secondary1">{t("HomePage")}</h1>
            </div>
          {/* NOTE: the important change is the arbitrary selector on this grid:
              [&>*]:max-h-[260px] => applies a max-height to all direct children (cards)
              [&>*]:overflow-y-auto => makes each card scroll internally when content overflows
              Adjust max-h value to taste (h-64 / h-72 etc). */}
          <div className="grid gap-6 grid-cols-0 md:grid-cols-4 lg:grid-cols-9 text-primary1 text-xs font-serif items-start [&>*]:max-h-[300px] ">
            {/* left column cards */}
            <div className="flex flex-col md:col-span-1 lg:col-span-3 ">
              <div className="bg-white p-4 rounded-2xl shadow">
                <div className="flex justify-center font-semibold uppercase ">
                  {t("welcome")}, {userData ? userData.name : "Loading..."} ! 👋
                </div>
              </div>

              {/* removed h-full here so it respects parent's max-height */}
              <div className=" flex bg-white p-4 rounded-2xl shadow mt-5 h-60">
                <h2 className="mb-2 font-semibold ">{t("News")}</h2>
                {/* news content goes here */}
              </div>
            </div>

            {/* middle big card */}
            <div className="bg-white p-4 rounded-2xl shadow md:col-span-2 lg:col-span-4 h-full overflow-y-auto">
              <div className="flex items-center justify-between font-semibold">
                <h2 className="mb-2">{t("UpcomingTasks")}</h2>
                <button className="text-gray-400 hover:text-gray-600">✏️</button>
              </div>

              <div className="space-y-3 mt-3 text-sm text-black">
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
            </div>

            {/* Calendar card — parent wrapper provides max-height & scrolling */}
            <div className="bg-white p-4 rounded-2xl shadow md:col-span-1 lg:col-span-2 h-full">
              <h2 className="mb-2 font-semibold">{t("Calendar")}</h2>
              <CalendarCard />
            </div>

            {/* bottom row */}
            <div className="bg-white p-4 rounded-2xl shadow col-span-3 h-full ">
              <h2 className="mb-2 font-semibold">{t("RecentProjects")}</h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow col-span-4 h-full">
              <h2 className="mb-2 font-semibold">{t("Notes")}</h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow col-span-2">
              <CircularProgress 
                percentage={86} 
                projectName="The coffee shop project"
              />
            </div>

          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
