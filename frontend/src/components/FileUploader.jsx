import React from 'react'
import DropZone from './DropZone.jsx'

function FileUploader() {
  return (
    <div>
      <DropZone className="m-7 h-[250px] rounded-md outline-dashed outline-3 outline-gray-700/50 hover:outline-blue-600 transition-all duration-200 ease-in-out flex flex-col space-y-4 justify-center items-center" />
    </div>
  )
}

export default FileUploader