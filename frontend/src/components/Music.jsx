import React, { useContext, useState } from 'react'
import FileSaver from 'file-saver'
import { HiOutlineDocumentDownload } from 'react-icons/hi'
import { FcMusic } from 'react-icons/fc'
import { MdOutlineDeleteOutline } from 'react-icons/md'
import { toast } from 'react-toastify'
import { DriveContext } from '../context/ContextProvider.jsx'
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material'

function Music({source, fileName, musicId}) {
  const {setAssets} = useContext(DriveContext)
  const [loading, setLoading] = useState(false)
  
  const handleDownload = () => {
    FileSaver.saveAs(source, fileName);
  }
  const handleDelete = async() => {
    try {
      setLoading(true)
      const brandName = localStorage.getItem('brandName')
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/file/deleteOne/Music/${musicId}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json'
        },
        body: JSON.stringify({brandName})
      })

      const data = await response.json()
      if(data.success) {
        toast.success("Successfully deleted the music file")
        const updatedAssets = data.updatedAssets

        setAssets(prev => updatedAssets)
      } else {
        toast.error(data.msg)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }
  return (
    <div className="py-1 relative group bg-red-100 flex flex-col justify-between items-center rounded-xl overflow-hidden">
      <Backdrop
        sx={{ color: '#fff', backdropFilter: 'blur(3px)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <FcMusic className="text-5xl p-2 bg-red-300 rounded-full mt-3" />
      <div className="p-[7px] w-[80px] h-10 flex gap-3 rounded-lg absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-gray-800/70 transition-opacity ease-in-out duration-300 z-20">
        <HiOutlineDocumentDownload onClick={handleDownload} className="w-full h-full hover:text-green-400 cursor-pointer"/>
        <MdOutlineDeleteOutline onClick={handleDelete} className="w-full h-full hover:text-red-400 cursor-pointer"/>
      </div>
      <div className="mt-3 w-full h-14 flex items-center justify-center">
        <audio src={source} controls className="px-[6px] py-1"></audio>
      </div>
    </div>
  )
}

export default Music