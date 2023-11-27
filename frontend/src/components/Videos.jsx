import React, { useContext, useState } from 'react'
import FileSaver from 'file-saver'
import { HiOutlineDocumentDownload } from 'react-icons/hi'
import { MdOutlineDeleteOutline } from 'react-icons/md';
import { toast } from 'react-toastify';
import { DriveContext } from '../context/ContextProvider.jsx'
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material'

function Videos({source, fileName, videoId}) {
  const {setAssets} = useContext(DriveContext)
  const [loading, setLoading] = useState(false)

  const handleDownload = () => {
    FileSaver.saveAs(source, fileName);
  }
  const handleDelete = async() => {
    try {
      setLoading(true)
      const brandName = localStorage.getItem('brandName');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/file/deleteOne/Video/${videoId}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({brandName})
      })

      const data = await response.json()
      if(data.success) {
        toast.success("Successfully deleted the video")

        const updatedAssets = data.updatedAssets
        setAssets(prev => updatedAssets);
      } else {
        toast.error(data.msg)
      }
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }
  return (
    <div className="relative group bg-gray-800 rounded-xl overflow-hidden">
      <Backdrop
        sx={{ color: '#fff', backdropFilter: 'blur(3px)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="p-[7px] w-[80px] h-10 flex gap-3 rounded-lg absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-gray-800/70 transition-opacity ease-in-out duration-300 z-20">
        <HiOutlineDocumentDownload onClick={handleDownload} className="w-full h-full hover:text-green-400 cursor-pointer"/>
        <MdOutlineDeleteOutline onClick={handleDelete} className="w-full h-full hover:text-red-400 cursor-pointer"/>
      </div>
      <video src={source} controls className="aspect-video w-full h-full"></video>
    </div>
  )
}

export default Videos