import React from 'react'
import brandLogo from '../assets/brandLogoFull.png'
import { Link, useNavigate } from 'react-router-dom'

function Navbar() {
  const nav = useNavigate();

  async function LogOut() {
    const save = document.cookie;
    console.log("cookie", save)
    const arr = save.split("=");
    console.log(arr)
    document.cookie = `${arr[0]}=; expires=Thu, 01 Jan 1970 00:00:00 GMT;`;
    nav("/login");
  }

  return (
    <div className="bg-[rgb(19,24,32)] z-20 sticky top-0 text-white w-full text-lg font-bold font-montserrat px-4 py-3 flex justify-between items-center border-b-[5px] border-gray-800">
      <Link to='/dashboard'>
        <img className="w-48 object-cover filter contrast-125 cursor-pointer" src={brandLogo} alt="brandlogo" />
      </Link>

      <div className="flex items-center flex-grow justify-end">
        <ul className="flex gap-2 px-3 py-1 mr-4 border-r-[3px] border-gray-500">
          <li><Link to="/dashboard" className="bg-gray-600 text-base px-3 py-2 rounded-full hover:bg-blue-400 transition ease-in-out">Dashboard</Link></li>
          <li><Link to="/upload" className="bg-gray-600 text-base px-3 py-2 rounded-full hover:bg-blue-400 transition ease-in-out">Upload</Link></li>
        </ul>

        <button className="px-4 py-2 text-white rounded-md text-base bg-gray-600/40 hover:bg-blue-500 transition-all ease-in-out duration-200" onClick={LogOut}>Log out</button>
      </div>
    </div>
  )
}

export default Navbar