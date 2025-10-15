import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer, toast } from 'react-toastify';
import Dashboard from './pages/Dashboard'
// import adminDashboard from './pages/Admin/adminDashboard'
// import managerDashboard from './pages/Manager/managerDashboard'
// import ManageUsers from './pages/Admin/ManageUsers'
// import createTask from './pages/Manager/createTask'
// import manageProjects from './pages/Manager/manageProjects'
// import manageTasks from './pages/Manager/manageTasks'
//import Privateroute from './components/Privateroute'

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Team member Routes */}
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
        <Route path='/Dashboard' element={<Dashboard/>} />

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
