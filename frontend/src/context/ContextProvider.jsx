import React, { createContext, useState } from 'react'
const DriveContext = createContext()
const ModelContext = createContext()

function ContextProvider({ children }) {
    const [assets, setAssets] = useState([])
    const [brandName, setBrandName] = useState('')
    const [showModel, setShowModel] = useState(false)
    const [modelContent, setModelContent] = useState('')
    const [confirm, setConfirm] = useState(false)

    return (
        <DriveContext.Provider value={{ assets, setAssets, brandName, setBrandName}}>
            <ModelContext.Provider value={{showModel, setShowModel, modelContent, setModelContent, confirm, setConfirm}}>
                {children}
            </ModelContext.Provider>
        </DriveContext.Provider>
    )
}

export default ContextProvider
export { DriveContext, ModelContext }