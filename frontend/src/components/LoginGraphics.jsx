import React from 'react'

function LoginGraphics() {
    return (
        <div className="w-full h-screen absolute -z-10">
            <div className="w-56 h-2 bg-red-400 absolute top-10 left-10"></div>
            <div className="w-56 h-2 bg-orange-400 absolute bottom-10 right-10"></div>
            <div className="w-48 h-48 rounded-full bg-blue-500 border-[20px] border-blue-400 absolute -top-28 right-8 rotate-[-45deg]"></div>
            <div className="w-48 h-48 rounded-full bg-green-500 border-[20px] border-green-400 absolute -bottom-28 left-8 rotate-[-45deg]"></div>
        </div>
    )
}

export default LoginGraphics