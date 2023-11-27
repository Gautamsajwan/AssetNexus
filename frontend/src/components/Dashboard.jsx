import React, { useContext, useEffect, useState } from 'react'
import { FcDocument, FcFilm, FcMusic, FcStackOfPhotos } from 'react-icons/fc'
import Images from './Images.jsx'
import Music from './Music.jsx'
import Videos from './Videos.jsx'
import Docs from './Docs.jsx'
import { LuSearch } from 'react-icons/lu'
import { AiOutlineAlert } from 'react-icons/ai'
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { DriveContext } from '../context/ContextProvider.jsx'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'

function Dashboard() {
  const nav = useNavigate()
  const [fileType, setfileType] = useState('images')
  const {assets, setAssets} = useContext(DriveContext)
  const [loading, setLoading] = useState(false)
  const [searchInput, setSearchInput] = useState("")
  const [clicked, setClicked] = useState(false)
  const [searchSuccess, setSearchSuccess] = useState(false)

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true)
        const brandName = localStorage.getItem('brandName')
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/file/assets/${fileType}?brandName=${brandName}`, {
          method: 'GET',
          credentials: 'include'
        })

        const data = await response.json()
        if (data.msg === "Cookie not present or expired" || data.msg === "user isnt authenticated") {
          nav("/login")
          return;
        }

        if (data.success) {
          setAssets(data.assets)
        } else {
          console.log("error fetching assets")
        }
        setSearchSuccess(false)
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    }

    fetchAssets()
  }, [clicked])

  const handleClick = (fileType) => {
    setfileType(fileType)
    setClicked(prev => !prev)
  }

  const showAssets = assets.map((asset) => {
    if (fileType === 'images')
      return <Images key={asset._id} source={asset.assetURL} fileName={asset.fileName} imageId={asset._id} />
    else if (fileType === 'videos')
      return <Videos key={asset._id} source={asset.assetURL} fileName={asset.fileName} videoId={asset._id} />
    else if (fileType === 'music')
      return <Music key={asset._id} source={asset.assetURL} fileName={asset.fileName} musicId={asset._id} />
    else
      return <Docs key={asset._id} source={asset.assetURL} fileName={asset.fileName} docId={asset._id} />
  })

  showAssets.reverse()

  const handleSearchInput = (e) => {
    setSearchInput(e.target.value)
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const brandName = localStorage.getItem('brandName')
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/file/searchAssets/${searchInput}`, {
        method: 'POST',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({brandName})
      })

      const data = await response.json()
      if (data.success) {
        toast.success(data.msg)
        setAssets(data.assets)
        setSearchSuccess(true)
      } else {
        toast.error(data.msg)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const handleBack = () => {
    setClicked(prev => !prev)
    setSearchInput("")
  }

  return (
    <div className="w-full flex justify-end text-white">
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <motion.div
        initial={{
          x: -200,
          opacity: 0
        }}
        whileInView={{
          x: 0,
          opacity: 1,
        }}
        transition={{
          type: 'spring',
          duration: 1.2
        }}
        viewport={{
          once: true
        }}
        className="w-[30%] md:w-[20%] h-screen p-3 space-y-3 fixed left-0 border-r-[5px] border-gray-800 text-white font-montserrat font-bold">
        <button onClick={() => { handleClick('images') }} className="assetFolder group bg-[rgb(59,187,166)]">Images <FcStackOfPhotos className="text-3xl group-hover:-translate-x-2 group-hover:scale-125 group-hover:-rotate-[20deg] transition duration-200 ease-in-out" /></button>
        <button onClick={() => { handleClick('videos') }} className="assetFolder group bg-[rgb(110,149,255)]">Videos <FcFilm className="text-3xl group-hover:-translate-x-2 group-hover:scale-125 group-hover:-rotate-[20deg] transition duration-200 ease-in-out" /></button>
        <button onClick={() => { handleClick('music') }} className="assetFolder group bg-[rgb(255,119,119)]">Music <FcMusic className="text-3xl group-hover:-translate-x-2 group-hover:scale-125 group-hover:-rotate-[20deg] transition duration-200 ease-in-out" /></button>
        <button onClick={() => { handleClick('docs') }} className="assetFolder group bg-[rgb(87,98,253)]">Docs <FcDocument className="text-3xl group-hover:-translate-x-2 group-hover:scale-125 group-hover:-rotate-[20deg] transition duration-200 ease-in-out" /></button>

        <div className="bg-orange-300 rounded-md p-2 font-bold space-y-3">
          <AiOutlineAlert className="text-5xl bg-orange-500 rounded-full p-2" />
          <p className="bg-gray-600/20 p-2 rounded-md">Hover over an asset for more options</p>
        </div>
      </motion.div>

      <div className="w-[70%] md:w-[80%]">
        <form className="mt-1 p-3 flex gap-3 items-center" onSubmit={handleSearch}>
          <input type="text" value={searchInput} onChange={handleSearchInput} className="p-2 indent-3 border-4 border-gray-800 text-white font-montserrat outline-none rounded-full bg-gray-700 flex-grow" placeholder='search tags like mountain, car etc.' />
          <button type="submit" className="rounded-full bg-gray-700 p-2 outline outline-gray-800 group active:scale-95"> <LuSearch className="text-red-400 text-2xl group-hover:rotate-[45deg] group-hover:scale-125 transition duration-200 ease-in-out" /> </button>
        </form>

        <div
          className="px-4 pt-2 pb-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {(showAssets.length) ? showAssets : <p className="font-montserrat font-bold text-center text-lg col-span-full">No Assets found</p>}
        </div>

        {searchSuccess && <button onClick={handleBack} className="fixed bottom-7 right-1/4 w-32 font-montserrat font-bold px-3 py-2 rounded-full bg-gray-700/70 border-4 border-gray-300/20 z-20 hover:text-red-400">Back</button>}
      </div>
    </div>
  )
}

export default Dashboard