import React from 'react'
import { Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer, toast } from 'react-toastify';


const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<LandingPage/>} />
        <Route path='/login' element={<Login/>} />
        <Route path='/reset-password' element={<ResetPassword/>} />
      </Routes>
    </div>
  )
}

export default App
