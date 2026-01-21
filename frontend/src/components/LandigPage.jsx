import { Routes, Route, Link } from "react-router-dom"
import logo from "../assets/logo.svg";
export default function LandingPage() {

    return (
        <>
            <header>

                <nav className="bg-gray-950 h-[50px] md:h-[65px] lg:h-[90px] xl:h-[120px] flex justify-between items-center px-4 ">
                    <img src={logo} alt="logo" className="w-[50px] md:w-[75px] lg:w-[100px] xl:w-[150px]"></img>
                    <div className="w-[60%]  text-white flex justify-between text-[12px] md:text-sm lg:text-lg xl:text-2xl">
                        <Link to="/">About Us </Link>
                        <Link to="/"> Comunity </Link>
                        <Link to="/"> Get involved </Link>
                        <Link to="/"> Events </Link>
                        <Link to=".."> FAQ</Link>
                    </div>

                    <button className="bg-blue-500 rounded-[30px] text-white text-center text-xs w-16 md:text-sm md:w-20 lg:text-lg lg:w-24 xl:text-2xl xl:w-[115px]">
                        Log in
                    </button>

                    <Routes>
                        <Route></Route>
                    </Routes>

                </nav>



            </header>
        </>
    )
}