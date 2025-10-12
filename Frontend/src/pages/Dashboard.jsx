import React, { useContext, useEffect } from "react";
import { AppContext } from "../context/AppContext";

const Dashboard = () => {
  const { userData, getuserData } = useContext(AppContext);

  useEffect(() => {
    getuserData(); // ensure data loads on first render
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">
        Welcome back, {userData ? userData.name : "Loading..."} 👋
      </h1>
    </div>
  );
};

export default Dashboard;
