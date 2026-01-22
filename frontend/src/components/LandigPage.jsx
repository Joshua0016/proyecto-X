import { Routes, Route, Link } from "react-router-dom"
import logo from "../assets/logo.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css"
import { Autoplay } from "swiper/modules"

export default function LandingPage() {

    return (
        <>
            <header>

                <nav className="bg-gray-950 h-[50px] md:h-[65px] lg:h-[90px] xl:h-[120px] flex justify-between items-center px-4 ">
                    <img src={logo} alt="logo" className="w-[50px] md:w-[75px] lg:w-[100px] xl:w-[150px]"></img>
                    <div className="w-[65%]  text-white flex justify-between text-[12px] md:text-sm  lg:text-lg xl:text-2xl xl:w-[50%]">
                        <Link to="/">About Us </Link>
                        <Link to="/"> Comunity </Link>
                        <Link to="/"> Get involved </Link>
                        <Link to="/"> Events </Link>
                        <Link to=".."> FAQ</Link>
                    </div>

                    <button className="bg-blue-500 rounded-[30px] text-white text-center text-xs w-16 md:text-sm md:w-20 lg:text-lg lg:w-24 xl:w-[115px] cursor-pointer xl:mr-[100px] ">
                        Log in
                    </button>

                    <Routes>
                        <Route path="/" element={""}></Route>
                    </Routes>

                </nav>

            </header>

            <Swiper className="h-[430-px]" loop={true} autoplay={{ delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }} modules={[Autoplay]}  >
                <SwiperSlide><img src="slide1.png" className="w-full "></img></SwiperSlide>
                <SwiperSlide><img src="slide2.png" className="w-full "></img></SwiperSlide>

            </Swiper>

            <div className=" w-[90%] mx-auto my-[300px] flex justify-around">
                <div>
                    <h1 className="text-[18px] text-center text-black sm:text-[32px] md:text-[42px] lg:text-[48px]">Asamblea de Dios <br /> casa de oración</h1>
                    <p className="text-[14px] text-center sm:text-[16px] md:text-[18px] lg:text-[24px] xl:text-2xl">lore impous lore lore lore lore lore <br />lor lore lore lore lore lore lore lore lore <br />lore lore lore lore lore lore lore </p>

                </div>

                <img src="mosaico.png" className="w-50 sm:w-75 md:w-85 lg:w-120 xl:w-200"></img>
            </div>

            <div className="w-[80%] mx-auto my-[300px] bg-stone-100 relative rounded-[24px] p-[32px]">

                <h1 className="absolute top-[-100px] text-[24px] md:text-4xl lg:text-5xl xl:text-6xl xl:top-[-100px]">Nuestros</h1>
                <h1 className="absolute top-[-45px] text-[32px] font-bold md:text-5xl lg:text-6xl xl:text-7xl">Pastores</h1>

                <div className="  xl:flex items-center xl:justify-around">
                    <div className="text-center text-[14px] md:text-[22px] lg:text-[18px] xl:text-2xl">
                        <p>lore lore lore lore lore lore lore <br />lore lore lore lore lore lore lorel ore impous impus pmsu impuus <br />imspu impsou msopus yo erstuve aqui</p>
                        <p>lore lore lore lore lore lore lore <br />lore lore lore lore lore lore lorel ore impous impus pmsu impuus <br />imspu impsou msopus yo erstuve aqui</p>
                        <p>lore lore lore lore lore lore lore <br />lore lore lore lore lore lore lorel ore impous impus pmsu impuus <br />imspu impsou msopus yo erstuve aqui</p>
                        <p>lore lore lore lore lore lore lore <br />lore lore lore lore lore lore lorel ore impous impus pmsu impuus <br />imspu impsou msopus yo erstuve aqui</p>
                    </div>
                    <img src="pastores.jpg" className="w-110 rounded-2xl my-[20px] sm:mx-auto xl:mx-0"></img>
                </div>
            </div>

            <footer className="bg-gray-300 ">footer</footer>

        </>
    )
}