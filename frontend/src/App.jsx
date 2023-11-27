import React, { useContext } from "react"
import Navbar from "./components/Navbar"
import FileUploader from "./components/FileUploader"
import { Route, Routes } from 'react-router-dom';
import About from "./components/About";
import ImageEdit from "./components/ImageEdit";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";
import LandingPage from "./components/LandingPage";
import { ModelContext } from "./context/ContextProvider";
import Model from './components/Model.jsx';

function App() {
  const {showModel} = useContext(ModelContext)
  return (
        <div>
          {showModel && <Model />}
          <Routes>
            <Route exact path='/' element={<LandingPage />}/>
            <Route exact path='/signUp' element={<SignUp />} />
            <Route exact path='/login' element={<Login />} />
            <Route exact path='/upload' element={[<Navbar key = "navbar" />, <FileUploader key="fileuploader" />]} />
            <Route exact path='/about' element={[<Navbar key = "navbar" />, <About key="about" />]} />
            <Route exact path='/editImage/:imageId' element={[<Navbar key = "navbar" />, <ImageEdit key="image-edit" />]} />
            <Route exact path='/dashboard' element={[<Navbar key = "navbar" />, <Dashboard key="dashboard" />]} />
          </Routes>
        </div>
  )
}

export default App
