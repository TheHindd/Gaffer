import {React, useState} from 'react'
import { assets } from '../../assets/assets';
import { useNavigate, useLocation } from 'react-router-dom'

const SideBar = () => {
  
  const navigate = useNavigate();
  const location = useLocation(); // ← get current route

  // helper to check if the path is active
  const isActive = (path) => location.pathname === path;


  return (
    <div className='flex fixed flex-col justify-start bg-white min-h-screen px-3 shadow-lg start-0 border-e border-gray-200'> 
       
        {/* Logo */}
       <div className='w-10 my-6 flex justify-center'>
         <img onClick={() => navigate("/")} src={assets.blueLogo} alt="logo" />
       </div>

        {/* Dashboard */}
         <div className=' flex flex-col p-1.5 gap-4 mt-18'>
              <svg onClick={() => navigate("/dashboard")} xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 512 512 " className={`size-7 w-6 mt-10 cursor-pointer transition-all ${ isActive("/dashboard") ? "text-primary1" : "text-gray-600 hover:text-primary1"}`}>
              <path fill={isActive("/dashboard") ? "#0000ffff" : "none"} strokeWidth="32" stroke={isActive("/dashboard") ? "#0000ffff" : "currentColor"} strokeLinecap="round" strokeLinejoin="round" d="M80 212v236a16 16 0 0 0 16 16h96V328a24 24 0 0 1 24-24h80a24 24 0 0 1 24 24v136h96a16 16 0 0 0 16-16V212"/>
              <path fill={isActive("/dashboard") ? "#0000ffff" : "none"} strokeWidth="32" stroke={isActive("/dashboard") ? "#0000ffff" : "currentColor"} strokeLinecap="round" strokeLinejoin="round" d="M480 256L266.89 52c-5-5.28-16.69-5.34-21.78 0L32 256m368-77V64h-48v69"/>
              </svg>

       {/* Chat*/}
            <svg onClick={() => navigate("/chats")} xmlns="http://www.w3.org/2000/svg" fill={isActive("/chats") ? "#0000ffff" : "none"}  viewBox="0 0 24 24" strokeWidth="1.7" stroke={isActive("/chats") ? "#0000ffff" : "currentColor"} className={`size-7 w-6 mt-10 cursor-pointer transition-all ${ isActive("/chats") ? "text-white" : "text-gray-600 hover:text-primary1"}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
            </svg>
       
      {/* Projects Icon */}
      <div onClick={() => navigate("/projects")}>
        {isActive("/projects") ? (
         <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" fill="#0000ffff" className={`size-7 w-6 mt-10 cursor-pointer transition-all"}`}><g fillRule="evenodd" clipRule="evenodd">
          <path d="M7.502 6h7.128A3.375 3.375 0 0 1 18 9.375v9.375a3 3 0 0 0 3-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 0 0-.673-.05A3 3 0 0 0 15 1.5h-1.5a3 3 0 0 0-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6ZM13.5 3A1.5 1.5 0 0 0 12 4.5h4.5A1.5 1.5 0 0 0 15 3h-1.5Z"/><path d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 0 1 3 20.625V9.375ZM6 12a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V12Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 15a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V15Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75ZM6 18a.75.75 0 0 1 .75-.75h.008a.75.75 0 0 1 .75.75v.008a.75.75 0 0 1-.75.75H6.75a.75.75 0 0 1-.75-.75V18Zm2.25 0a.75.75 0 0 1 .75-.75h3.75a.75.75 0 0 1 0 1.5H9a.75.75 0 0 1-.75-.75Z"/></g></svg>
        ) : (
         <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className={`size-7 w-6 mt-10 cursor-pointer transition-all text-gray-600 "}`}>
          <path fill="none" stroke="oklch(44.6% 0.03 256.802)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664c0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75a2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15a2.25 2.25 0 0 1 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z"/></svg>
        )}
      </div>

          
        
      {/* Calendar Icon */}
      <div onClick={() => navigate("/calendar")}>
        { isActive("/calendar") ? (
      <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 512 512" className={`size-7 w-6 mt-10 cursor-pointer transition-all"}`}>
        <path fill="#0000ffff" d="M480 128a64 64 0 0 0-64-64h-16V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 368 48v16H144V48.45c0-8.61-6.62-16-15.23-16.43A16 16 0 0 0 112 48v16H96a64 64 0 0 0-64 64v12a4 4 0 0 0 4 4h440a4 4 0 0 0 4-4ZM32 416a64 64 0 0 0 64 64h320a64 64 0 0 0 64-64V179a3 3 0 0 0-3-3H35a3 3 0 0 0-3 3Zm344-208a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm-80-80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Zm0 80a24 24 0 1 1-24 24a24 24 0 0 1 24-24Z"/></svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 24 24" className={`size-7 w-6 mt-10 cursor-pointer transition-all text-gray-600 "}`}>
            <path fill="none" stroke="oklch(44.6% 0.03 256.802)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"/></svg>
        )}
      </div>
    </div>
    </div>
  )
}

export default SideBar
