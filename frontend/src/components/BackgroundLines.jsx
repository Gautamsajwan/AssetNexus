import React from 'react'

function BackgroundLines() {
  return (
    <div className="w-full h-screen absolute -z-10">
      <div className="w-56 h-2 bg-red-400 absolute top-10 left-10 rotate-[-40deg]"></div>
      <div className="w-56 h-2 bg-orange-400 absolute bottom-10 right-10 rotate-[-40deg]"></div>
      <div className="w-48 h-48 rounded-full bg-blue-500 border-[20px] border-blue-400 absolute -top-24 -right-20 rotate-[-40deg]"></div>
      <div className="w-48 h-48 bg-green-500 border-[20px] border-green-400 absolute -bottom-16 -left-20 rotate-[-40deg]"></div>
    </div>
  )
}

export default BackgroundLines