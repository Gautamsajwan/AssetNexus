import React, { useEffect, useState } from 'react'
import './ImageEdit.css'
import { LuFlipHorizontal2, LuFlipVertical2, LuRotateCcw, LuRotateCw } from "react-icons/lu";
import { Link, useParams } from 'react-router-dom'
import { Helmet, HelmetProvider } from 'react-helmet-async'

function ImageEdit() {
  const { imageId } = useParams()
  console.log(imageId)
  const [imageUrl, setImageUrl] = useState("")

  useEffect(() => {
    const fetchById = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/file/findOne/${imageId}`, {
          method: 'GET',
        })

        console.log(response)
        if (response.ok) {
          const data = await response.json()
          console.log(data.asset)
          setImageUrl(data.assetURL)
        } else {
          console.log("error fetching image")
        }
      } catch (err) {
        console.error(err)
      }
    }

    fetchById()
  }, [])

  return (
    <HelmetProvider>
      <div className="my-14 container font-montserrat font-bold">
        <div className="wrapper">
          <div className="editor-panel">
            <div className="filter">
              <label className="title">Filters</label>
              <div className="options">
                <button id="brightness" className="active">Brightness</button>
                <button id="saturation">Saturation</button>
                <button id="inversion">Inversion</button>
                <button id="grayscale">Grayscale</button>
              </div>
              <div className="slider">
                <div className="filter-info">
                  <p className="name">Brighteness</p>
                  <p className="value">100%</p>
                </div>
                <input type="range" defaultValue="100" min="0" max="200" />
              </div>
            </div>
            <div className="rotate">
              <label className="title">Rotate & Flip</label>
              <div className="options">
                <button id="left"> <LuRotateCcw className="text-xl" /> </button>
                <button id="right"> <LuRotateCw className="text-xl" /> </button>
                <button id="horizontal"> <LuFlipHorizontal2 className="text-xl" /> </button>
                <button id="vertical"> <LuFlipVertical2 className="text-xl" /> </button>
              </div>
            </div>
          </div>
          <div className="preview-img">
            <img src={imageUrl} alt="preview-img" crossOrigin="anonymous" />
          </div>
        </div>
        <div className="controls">
          <button className="reset-filter">Reset Filters</button>
          <div className="final-buttons">
            <button className="save-img">Save Image</button>
            <button className="update-img">Update Image</button>
          </div>
        </div>
        <Link to="/dashboard"><button className="mt-5 font-bold text-white text-base text-center">Click here to view changes</button></Link>

        <Helmet>
          <script type="text/javascript" src="/script.js"></script>
        </Helmet>
      </div>
    </HelmetProvider>
  )
}

export default ImageEdit;