import React from 'react'
import { Cursor, useTypewriter } from 'react-simple-typewriter'
import brandLogo from '../assets/brandLogoFavicon.png'
import { Link } from 'react-router-dom'
import BackgroundLines from './BackgroundLines'
import Lottie from "lottie-react"
import animation_lltowl4l from '../lotties/animation_lltowl4l.json'


function LandingPage() {
    const [text] = useTypewriter({
        words: ["Streamline Creativity", "Discover, Organize, Collaborate", "Your Ultimate Asset Companion"],
        loop: true,
        delaySpeed: 2000
    })
    return (
        <div className="relative text-white font-montserrat font-bold h-screen flex flex-col items-center justify-center space-y-[2.5rem] overflow-hidden">
            <BackgroundLines />
            <div className="flex w-full gap-5">
                <div className="w-[50%] flex justify-end items-center">
                    <Lottie animationData={animation_lltowl4l} className="w-[400px]" loop={true} />
                </div>
                <div className="flex-grow flex flex-col justify-center gap-5">
                    <div className="relative w-32 h-32 rounded-full ">
                        <img
                            src={brandLogo}
                            alt="Picture of the author"
                            className="rounded-full w-full h-full object-cover animate-pulse"
                        />
                        <div className="absolute top-0 left-0 rounded-full w-full h-full bg-[#08AEEA] bg-gradient-to-r from-[#08AEEA] to-[#782af5] -z-10 blur-[45px]"></div>
                    </div>
                    <div className="z-20 w-full">
                        <h1 className="pb-4 text-2xl uppercase tracking-[15px] text-[#75a5ff]">AssetNexus</h1>
                        <h1 className="tracking-wide text-4xl">
                            <span>{text}</span>
                            <Cursor cursorColor='gray' />
                        </h1>
                    </div>
                </div>
            </div>

            <Link to="/signUp">
                <button className="relative group rounded-full overflow-hidden px-5 py-3 hover:text-black active:scale-95 outline outline-white transition-all duration-500 ease-in-out duration-400">
                    Get Started
                    <div className="absolute top-0 left-0 w-[0%] h-full bg-white rounded-2xl group-hover:w-full transition-all duration-500 ease-in-out -z-10"></div>
                </button>
            </Link>
        </div>
    )
}

export default LandingPage