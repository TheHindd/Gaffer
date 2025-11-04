import React from 'react';
import NavBar from '../components/Common/NavBar';
import SideBar from '../components/Common/SideBar';


const CalendarPage = () => {
  return (
    <div className="flex min-h-screen bg-background">
       <SideBar/>
       <NavBar /> 
    </div>
  )
}

export default CalendarPage
