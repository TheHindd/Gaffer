import React, {useEffect} from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import LoginPage from './pages/LoginPage'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer, toast } from 'react-toastify';
import DashboardPage from './pages/DashboardPage'
import { useTranslation } from 'react-i18next'
import CalendarPage from './pages/CalendarPage'
import ProjectsPage from './pages/ProjectsPage'
import MyProjects from './pages/MyProjects'
import ChatsPage from './pages/ChatsPage'
// import adminDashboard from './pages/Admin/adminDashboard'
// import managerDashboard from './pages/Manager/managerDashboard'
// import ManageUsers from './pages/Admin/ManageUsers'
// import createTask from './pages/Manager/createTask'
// import manageProjects from './pages/Manager/manageProjects'
// import manageTasks from './pages/Manager/manageTasks'
// import Privateroute from './components/Privateroute'

const App = () => {

      const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.lang = i18n.language;
    document.documentElement.dir = i18n.language === "ar" ? "rtl" : "ltr";
  }, [i18n.language]);

  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Team member Routes */}
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={<LoginPage/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        <Route path='/Dashboard' element={<DashboardPage/>} />
        <Route path='/CalendarPage' element={<CalendarPage/>} />
        <Route path='/Projects/:projectId' element={<ProjectsPage />} />
        <Route path='/Projects' element={<MyProjects />} />
        <Route path='/Chats' element={<ChatsPage />} />

        {/* Admin Routes */}
        {/* <Route element={<Privateroute allowedRoles={"admin"}/>}>
        <Route path='/admin/adminDashboard' element={<adminDashboard/>} />
        <Route path='/admin/ManageUsers' element={<ManageUsers/>} />
        </Route> */}

         {/* Manager Routes */}
        {/* <Route element={<Privateroute allowedRoles={"manager"}/>}>
        <Route path='/manager/managerDashboard' element={<managerDashboard/>} />
        <Route path='/manager/createTask' element={<createTask/>} />
        <Route path='/manager/manageProjects' element={<manageProjects/>} />
        <Route path='/manager/manageTasks' element={<manageTasks/>} />
        </Route> */}
      </Routes>
    </div>
  )
}

export default App
