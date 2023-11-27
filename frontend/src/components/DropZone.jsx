import React, { useCallback, useEffect, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { ArrowUpTrayIcon, TrashIcon } from '@heroicons/react/24/outline'
import brandLogo from '../assets/brandLogoFavicon.png'
import { toast } from 'react-toastify'
import Backdrop from '@mui/material/Backdrop';
import { Box, LinearProgress } from '@mui/material'
import { useNavigate } from 'react-router-dom'

function DropZone({ className }) {
    const nav = useNavigate();
    const [selectedFiles, setSelectedFiles] = useState([])
    const [oneFile, setOneFile] = useState({})
    const [multipleFiles, setMultipleFiles] = useState([])
    const [loading, setLoading] = useState(false)

    const onDrop = useCallback(acceptedFiles => {
        setOneFile(acceptedFiles[acceptedFiles.length - 1])
        setMultipleFiles(acceptedFiles)

        setSelectedFiles(prevFiles => [
            ...prevFiles,
            ...acceptedFiles.map(file => ({
                file,
                preview: URL.createObjectURL(file)
            }))
        ])
    }, [])

    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop })

    const removeFiles = (name) => {
        setSelectedFiles(prevFiles => prevFiles.filter(asset => asset.file.path !== name))
        setMultipleFiles(prevFiles => prevFiles.filter(asset => asset.path !== name))
        setOneFile({})
    }

    const handleUpload = async () => {
        if (multipleFiles.length === 0) {
            toast.error('No file selected')
            return
        }

        const brandName = localStorage.getItem('brandName')
        console.log("calling first function")
        const data = new FormData()
        console.log("accepted file: ", oneFile);

        data.append('brandName', brandName);
        data.append('asset', oneFile);

        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/file/upload`, {
                method: 'POST',
                body: data,
            });
            
            const data2 = await response.json();
            if (data2.success) {
                toast.success(data2.msg);
            } else {
                toast.dismiss();
                toast.error(data2.msg);
            }
        } catch (error) {
            console.error('Internal server error', error);
        }

        setSelectedFiles([])
        setMultipleFiles([])
        setOneFile({})
        setLoading(false)
    }

    const handleUpload2 = async () => {
        const brandName = localStorage.getItem('brandName')
        console.log("calling second function")
        const data = new FormData()
        console.log("accepted file: ", multipleFiles);

        data.append('brandName', brandName);
        for (let i = 0; i < multipleFiles.length; i++) {
            data.append("assets", multipleFiles[i]);
        }

        try {
            setLoading(true)
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/file/multiple`, {
                method: 'POST',
                body: data,
            });

            const data2 = await response.json();
            if (data2.success) {
                toast.success(data2.msg);
            } else {
                toast.dismiss();
                toast.error(data2.msg);
            }
        } catch (error) {
            console.error('Internal server error', error);
        }
        setSelectedFiles([]);
        setMultipleFiles([]);
        setOneFile({})
        setLoading(false)
    }

    // function 
 
    async function checkLoginStatus(){
        console.log("Login status")
        const save = document.cookie;
        console.log("Save", save);
        if(save.length === 0 ) {
            nav("/login");
            return;
        }
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/checkLoginStatus`,{
            method: 'POST',
            credentials: 'include'
        })

        const data = await response.json();
        console.log("data =>", data)
        if(!data.success){
            nav("/login");
        }
    }

    // Below snippet line is commented just because cookie is giving error in production
    // useEffect(()=>{
    //     console.log("Dropzone.jsx")
    //     checkLoginStatus();
    // })

    return (
        <div className="pb-7 space-y-7 font-montserrat text-white cursor-pointer">
            <Backdrop
                sx={{ color: '#fff', backdropFilter: 'blur(3px)', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={loading}
            >
                <div className="w-[80%] max-w-[500px] rounded-full">
                    <h1 className="text-xl p-2 font-bold tracking-wide border-[3px] border-blue-400 translate-y-2 -translate-x-3 rounded-md"><span className="animate-pulse">Uploading...</span></h1>
                    <Box sx={{ width: '95%' }}>
                        <LinearProgress sx={{ color: 'red', height: '15px', background: '#90caf9', borderRadius: '3px', border: '3px solid rgb(96 165 250)' }} />
                    </Box>
                </div>
            </Backdrop>

            <div {...getRootProps({ className: className })}>
                <input {...getInputProps({})} />
                <img className="filter grayscale opacity-100 animate-pulse" src={brandLogo} alt="" />
                {
                    isDragActive ?
                        <p className="text-sm tracking-wide">Drop the files here ...</p> :
                        <div className="text-center text-sm tracking-wide">
                            <p>Drag 'n' drop some files here, or click to select files</p>
                            <p>( Max file upload size limit is 10MB )</p>
                        </div>
                }
            </div>

            <div className="flex justify-center relative">
                <button onClick={(multipleFiles.length > 1) ? handleUpload2 : handleUpload} className="font-bold flex items-center gap-2 px-7 py-3 text-lg text-white rounded-tr-lg rounded-bl-lg bg-[rgb(19,24,32)] z-20 outline outline-[5px] outline-gray-700 hover:outline-blue-600 hover:bg-blue-400 transition-all ease-in-out duration-200">
                    Upload
                    <ArrowUpTrayIcon className="w-[25px]" />
                </button>
                <div className="absolute -top-[2px] left-0 -translate-y-1/2 w-1/2 h-[4.5px] bg-gray-700"></div>
                <div className="absolute -bottom-[6px] right-0 -translate-y-1/2 w-1/2 h-[4.5px] bg-gray-700"></div>
            </div>

            <div className="flex flex-col justify-center items-center">
                <h1 className="text-gray-400 text-2xl font-bold text-center tracking-[10px] uppercase ">Preview</h1>
                <p className="text-sm text-gray-400 font-bold tracking-wide">( Files you select will appear here... )</p>
            </div>

            <ul className="m-7 grid grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-2 gap-5">
                {selectedFiles.map((asset, index) => (
                    <li key={index} className="relative group bg-gray-800 rounded-lg flex flex-col overflow-hidden">
                        <div className="h-60 border-b-[5px] border-gray-700">
                            {asset.file.type.startsWith('image') ? (
                                <img className="h-full w-full object-cover" src={asset.preview} alt={asset.file.path} />
                            ) : (
                                <iframe className="w-full h-full" src={asset.preview} title={asset.file.path}>
                                    Your browser does not support iframes.
                                </iframe>
                            )}
                        </div>
                        {/* <iframe src={asset.preview}></iframe> */}
                        <h2 className="m-2">{(asset.file.path.length > 20) ? `${asset.file.path.slice(0, 15)}...` : asset.file.path}</h2>

                        <div className="p-[10px] w-16 h-12 flex gap-3 rounded-bl-lg absolute top-0 right-0 opacity-0 group-hover:opacity-100 group-hover:bg-gray-800/80 transition-opacity ease-in-out duration-300">
                            <TrashIcon className="w-full h-full hover:text-red-400" onClick={() => removeFiles(asset.file.path)} />
                        </div>
                    </li>
                ))}
            </ul>

            {/* <iframe className='absolute top-0 bottom-0 w-full h-full' src={selectedFiles[0].preview} frameborder="0"></iframe> */}
        </div>
    )
}

export default DropZone