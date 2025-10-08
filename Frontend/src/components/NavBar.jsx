import React from 'react'
import { assets } from '../assets/assets'

const NavBar = () => {
  return (
    <div className='w-full flex justify-between items-center p-3 absoulute top-0 sm:py-6 sm:px-24'>
      <button className='flex items-center gap-2 gap-2 border border-blue-500 rounded-full px-6 py-2 text-grey hover:bg-blue-100 transition-all'>Login</button>
      <img src={assets.blueLogo} alt="logo" className='w-15 sm:w-32'/>
    </div>
  )
}

export default NavBar
