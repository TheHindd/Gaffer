import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import SideBar from "../components/SideBar";
import NavBar from "../components/NavBar";

const Dashboard = () => {
  const { userData, getuserData } = useContext(AppContext);

  useEffect(() => {
    getuserData(); // ensure data loads on first render
  }, []);

  return (
    <div className="flex gap-4 bg-background ">
      <NavBar />
      <SideBar />
      <div className=" flex flex-col ml- mt-20 ml-18 py-3 px-8 bg-white rounded-2xl shadow-md ">
        <h className=" font-bold">
        Welcome back, {userData ? userData.name : "Loading..."} 👋
       </h>
      </div>
      
      
    </div>
  );
};

export default Dashboard;
