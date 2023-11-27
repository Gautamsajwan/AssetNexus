import React, { useContext, useState } from 'react'
import FileSaver from 'file-saver'
import { HiOutlineDocumentDownload } from 'react-icons/hi'
import { BiEditAlt } from 'react-icons/bi'
import { MdOutlineDeleteOutline} from 'react-icons/md'
import { toast } from 'react-toastify'
import { DriveContext, ModelContext } from '../context/ContextProvider.jsx'
import Backdrop from '@mui/material/Backdrop';
import { CircularProgress } from '@mui/material'
import { useNavigate } from "react-router-dom";

function Images({ source, fileName, imageId }) {
  const {setAssets} = useContext(DriveContext)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate();
  // const {setShowModel, confirm , setConfirm} = useContext(ModelContext)

  const handleDownload = () => {
    FileSaver.saveAs(source, fileName);
  }
  const handleDelete = async() => {
    try {
      setLoading(true)
      const brandName = localStorage.getItem('brandName');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/file/deleteOne/Image/${imageId}`, {
        method: 'DELETE',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({brandName})
      })

      const data = await response.json()
      console.log(data)
      if(data.success) {
        toast.success("Successfully deleted the image")
        
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
  
  const handleEdit = () => {
    // setShowModel(true)
    // if(confirm) {
      localStorage.setItem('assetId', imageId)
      navigate(`/editImage/${imageId}`)
    // }
    // setConfirm(false)
    // setShowModel(false)
  }

  return (
    <div className="relative group bg-gray-800 rounded-xl overflow-hidden">
      <Backdrop
        sx={{ color: '#fff', backdropFilter: 'blur(3px)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="p-[7px] w-[150px] h-10 flex gap-3 rounded-lg absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-gray-800/70 transition-opacity ease-in-out duration-300 z-20">
        <BiEditAlt onClick={handleEdit} className="w-full h-full hover:text-blue-400 cursor-pointer" />
        <HiOutlineDocumentDownload onClick={handleDownload} className="w-full h-full hover:text-green-400 cursor-pointer"/>
        <MdOutlineDeleteOutline onClick={handleDelete} className="w-full h-full hover:text-red-400 cursor-pointer"/>
      </div>
      <img className="w-full h-full object-cover" src={source} alt={fileName} />
    </div>
  )
}

export default Images