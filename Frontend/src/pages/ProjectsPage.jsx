import React, { useContext, useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { AppContext } from '../context/AppContext';
import CalendarCard from "../components/Calender"; // keep your existing path
import { useTranslation } from 'react-i18next';
import { useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const ProjectsPage = () => {
  const { userData, getuserData } = useContext(AppContext);
  const { projectId } = useParams(); // Get projectId from URL
  const { backendUrl, token } = useContext(AppContext);
  
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const { t, i18n } = useTranslation();

  const navigate = useNavigate();
  
  useEffect(() => {
    fetchProjectDetails();
  }, [projectId]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLang);
    localStorage.setItem("lang", newLang); // optional, to persist
  };

   const fetchProjectDetails = async () => {
    try {
      setLoading(true);
      
      const { data } = await axios.get(
        `${backendUrl}/api/projects/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      if (data.success) {
        setProjectData(data);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching project:", error);
      toast.error(error.response?.data?.message || "Failed to load project");
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!projectData) {
    return <div>Project not found</div>;
  }

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
          {/* NOTE: the important change is the arbitrary selector on this grid:
              [&>*]:max-h-[260px] => applies a max-height to all direct children (cards)
              [&>*]:overflow-y-auto => makes each card scroll internally when content overflows
              Adjust max-h value to taste (h-64 / h-72 etc). */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-5 lg:grid-cols-9 text-primary1 text-sm font-serif items-start [&>*]:max-h-[400px]">
            {/* kanban cards */}
            <div className="bg-white p-4 rounded-2xl shadow col-span-3 h-full  overflow-y-auto ">
              <h2 className="mb-2 text-md font-semibold text-gray-600">{t("ToDo")}</h2>
              <div className="space-y-3 mt-3 text-sm text-black">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">create the poster for xyz company</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">Task 1</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">Task 2</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">Task 3</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">Task 4</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">Task 5</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">Task 6</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">Task 7</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">Task 8</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">Task 9</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">Task 10</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">Task 11</span>
                </div>
              </div>
            </div>

            {/* middle big card */}
            <div className="bg-white p-4 rounded-2xl shadow lg:col-span-3 h-full">
              <div className="flex items-center justify-between font-semibold">
                <h2 className="mb-2 text-md font-semibold text-blue-800">{t("InProg")}</h2>
              </div>

              <div className="space-y-3 mt-3 text-sm text-black">
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">create the poster for xyz company</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">add fulan to the project</span>
                </div>
                <div className="flex items-center gap-3">
                  <input type="checkbox" className="w-4 h-4" />
                  <span className="flex-1">finish the xyz plan</span>
                </div>
              </div>
            </div>

            {/* Calendar card — parent wrapper provides max-height & scrolling */}
            <div className="bg-white p-4 rounded-2xl shadow col-span-3 h-full">
              <h2 className="mb-2 font-semibold text- text-emerald-600">{t("Done")}</h2>
             
            </div>
            </div>
        
           {/* middle row */}

        <div className="grid gap-x-8 grid-cols-1 md:grid-cols-5 lg:grid-cols-9 text-primary1 text-sm font-serif items-start [&>*]:max-h-[250px] mt-4 " >

            <div className="bg-white p-4 rounded-2xl shadow col-span-2">
            </div>
            <div className="bg-white p-4 rounded-2xl shadow col-span-3 h-full ">
              <h2 className="mb-2 font-semibold">{t("Upcomingdead")}</h2>
            </div>

            <div className="bg-white p-4 rounded-2xl shadow col-span-4 h-full">
              <h2 className="mb-2 font-semibold">{t("Activity")}</h2>
            </div>


          </div>
        </main>
        </div>
      </div>
  );
};

export default ProjectsPage;
