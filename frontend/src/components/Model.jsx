import React, { useContext } from 'react'
import { ModelContext } from '../context/ContextProvider'


function Model({ dialog }) {
    const {setConfirm, setShowModel} = useContext(ModelContext)
    const handleYes = () => {
        setConfirm(true)
        setShowModel(false)
    }

    const handleNo = () => {
        setShowModel(false)
    }

    return (
        <div className="absolute font-montserrat top-0 left-0 w-full h-full backdrop-blur-sm z-20 flex justify-center items-center">
            <div className="bg-[rgb(255,255,255)] max-w-[300px] rounded-lg p-3 text-black flex flex-col gap-2">
                <div>
                    <h1 className="font-bold text-lg pb-1 pl-[2px]">Are you sure ?</h1>
                    <div className="w-full h-[3px] bg-gray-300"></div>
                </div>

                <div className="flex w-full justify-evenly items-center gap-3 mt-[2px]">
                    <button onClick={handleNo} className="bg-red-500 hover:-skew-y-6 active:scale-95 w-[100px] px-4 py-2 rounded-md font-bold text-white transition-all ease-in-ou t">No</button>
                    <button onClick={handleYes} className="bg-green-500 hover:-skew-y-6 active:scale-95 w-[100px] px-4 py-2 rounded-md font-bold text-white transition-all ease-in-out">Yes</button>
                </div>
            </div>
        </div>
    )
}

export default Model