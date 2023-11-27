import React, { useState } from 'react'
import { BsEye } from 'react-icons/bs'
import { Link, useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import LoginGraphics from './LoginGraphics';

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const navigate = useNavigate();

  const handleMouseDown = () => {
    setShowPassword(prev => !prev)
  };

  const handleMouseUp = () => {
    setShowPassword(prev => !prev)
  };

  const handleLogin = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/verifyUser`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
        credentials: 'include'
      })
      console.log("respone => ", response);

      const data = await response.json()

      localStorage.setItem('brandName', data.brandName);
      
      if (data.success) {
        navigate("/dashboard")
        toast.dismiss();
        toast.success(data.msg)
      } else {
        toast.dismiss();
        toast.error(data.msg)
      }
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="text-white relative w-full h-screen overflow-hidden font-montserrat flex flex-col justify-center items-center">
      <LoginGraphics />
      <div className="mt-10 p-8 rounded-lg bg-gray-800/30">
        <form className="flex flex-col gap-2 w-[500px]">
          <label htmlFor="email" className="font-bold pl-1">Email</label>
          <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)} className="textField" placeholder='enter your email' />

          <label htmlFor="password" className="pl-1 font-bold mt-2">Password </label>
          <div className="relative flex flex-col">
            <input type={showPassword ? "text" : "password"} id="password" value={password} onChange={e => setPassword(e.target.value)} className="textField" placeholder='enter your password' />
            <BsEye onMouseUp={handleMouseUp} onMouseDown={handleMouseDown} className="absolute right-4 text-xl cursor-pointer top-1/2 -translate-y-1/2" />
          </div>

          <button onClick={handleLogin} className="mt-4 rounded-full w-fit m-auto font-bold px-10 py-2 outline outline-blue-500 hover:bg-blue-400 active:scale-95 transition duration-200 ease-in-out">Login</button>
          <Link to="/signUp" className="flex">
            <button className="mt-4 rounded-full w-fit m-auto font-bold px-10 py-2 outline outline-blue-500 hover:bg-blue-400 active:scale-95 transition duration-200 ease-in-out">Back to sign-up</button>
          </Link>
        </form>
      </div>
    </div>
  )
}

export default Login