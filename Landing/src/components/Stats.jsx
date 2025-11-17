import React from 'react'

const Stats = () => {
  return (
    <div className='flex  h-100 w-full my-20 py-3'>
      <img src="/films.png" alt="stats background" className="flex absolute h-98 w-full object-cover z-0 "/>
     
      <div className='flex justify-around items-center w-full z-1 text-center overflow-hidden '>
        <div className='flex justify-center items-center  border w-80 border-red-200 text-3xl font-bold h-50  '> <h1>50+ <p>Cliensts</p></h1></div>
         <div className='flex justify-center items-center  w-80 border border-red-200 text-3xl font-bold h-50 '> <h1>100+ <p>Satisfied Customer</p></h1></div>
          <div className='flex justify-center items-center  w-80 border border-red-200 text-3xl  font-bold h-50 '> <h1 >30% <p>increase in slaes</p></h1> </div>
          
       
      
        </div>
    </div>
  )
}

export default Stats
