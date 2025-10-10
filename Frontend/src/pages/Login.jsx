import React from 'react'
import { assets } from '../assets/assets'
import { data, useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { useContext , useState } from 'react'


const Login = () => {
  const navigate = useNavigate();

  const { backendUrl, setIsLoggedin } = useContext(AppContext);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) =>{
    try {
      e.preventDefault();

      const{data}= await axios.post(backendUrl + '/api/auth/login' , {email, password})
      if(data.success){
        setIsLoggedin(true)
        navigate('/Dashboard')
      }
      else{
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed. Please try again.");
    };
  }
  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-violet-50 to-white" /*style={{backgroundColor: '#F4F7FE'}}*/ >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.4" stroke="black" class="size-7 absolute center bottom-8 cursor-pointer" onClick={()=> navigate('/')}>
          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
        </svg>  
       <div className="flex bg-white rounded-3xl shadow-lg animate-fadeInUp overflow-hidden max-w-3xl w-250 h-120">
           <div className="flex items-center justify-center p-8 bg-white w-3/5">
          <img src={assets.sideillust} alt="Login" className="max-h-150 object-contain" />
        </div>
        {/* Form Section */}
        <div className="flex flex-col justify-center p-8 w-2/5">
            <div className='flex justify-center'> <img src={assets.blueLogo} alt="icon" className=' w-20 mb-4'/> </div>
          <h2 className="text-2xl font-bold mb-6 text-center" style={{color:'#F0706C'}}> Welcome Back</h2>
          <form onSubmit={onSubmitHandler}>
            <div className="flex items-center mb-4 border-b border-stone-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="grey" className="size-4">
                  <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                </svg>
                  <input onChange={e => setEmail(e.target.value)}
                  value={email}
                  name= "email"
                  type="text" required
                  placeholder="Email"
                  className="text-sm w-full px-4 py-2 focus:outline-none"
                  />
              </div>
              <div className="flex items-center mb-4 border-b border-stone-200 ">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="grey" className="size-4">
                      <path fill-rule="evenodd" d="M12 1.5a5.25 5.25 0 0 0-5.25 5.25v3a3 3 0 0 0-3 3v6.75a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3v-6.75a3 3 0 0 0-3-3v-3c0-2.9-2.35-5.25-5.25-5.25Zm3.75 8.25v-3a3.75 3.75 0 1 0-7.5 0v3h7.5Z" clip-rule="evenodd" />
                </svg>
                  <input onChange={e => setPassword(e.target.value)}
                  value={password}
                  name="password"
                  type="password" required
                  placeholder="Password"
                  autoComplete="off"
                  className="text-sm w-full px-4 py-2 focus:outline-none"
                  />
              </div>
            <div className="flex items-center mb-4">
              <input type="checkbox" id="remember" className="mr-2" />
              <label htmlFor="remember" className="text-sm">Remember me</label>
            </div>
            <button type="submit" className="w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-500 mb-4">
              Log in
            </button>
          </form>
          <div className="flex justify-center text-sm text-blue-700 mt-2">
            <a href="/ResetPassword" className="underline cursor-pointer">forgot password?</a>
          </div>
         </div>
      </div>
     </div>
    </div>
  )
}

export default Login
