import flecha from "./assets/flecha.svg"
import user from "./assets/User.svg"
import finance from "./assets/finance.svg"
import events from "./assets/events.svg"
import report from "./assets/report.svg"
import { Routes, Route, Link, Outlet } from "react-router-dom"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate();

    useEffect(() => {
        let logged = localStorage.getItem("loggedIn");


        if (logged === "false") {
            navigate("/");
        }

    }, [])

    return (
        <>
            <nav className="bg-white w-[100%] h-[58px] relative">
                <p className="text-[20px]  text-center pt-1 xl:text-[32px] ">Sistema de gestión</p>

                <div className=" flex absolute right-0 top-0 bottom-0 my-auto items-center p-5 ">

                    <img src={user} alt="Admin" className="w-[18px] xl:w-[28px]"></img>
                    <Link to={"admin"} className="pl-2 xl:text-[24px]">Admin</Link>
                </div>
            </nav>

            <nav className="fixed shadow-sm bg-white top-[20%] w-[120px] h-[190px] p-[3px] rounded-[10px] xl:h-[210px] xl:w-[120px]">


                <div className="flex mt-[5px] items-center">
                    <img src={user} alt="members" className="w-[18px] m-2 xl:w-[24px]"></img>
                    <Link to={"members"} className="xl:text-[16px]">Members</Link>
                </div>
                <div className="flex mt-[5px] items-center">
                    <img src={finance} alt="finance" className="w-[18px] m-2 xl:w-[24px]"></img>
                    <Link to={"finance"} className="xl:text-[16px]">Finance</Link>

                </div>
                <div className="flex mt-[5px] items-center">
                    <img src={events} alt="events" className="w-[18px] m-2 xl:w-[24px]"></img>
                    <Link to={"events"} className="xl:text-[16px]">Events</Link>

                </div>
                <div className="flex mt-[5px] items-center">
                    <img src={report} alt="events" className="w-[18px] m-2 xl:w-[24px]"></img>
                    <Link to={"report"} className="xl:text-[16px]">Report</Link>

                </div>

            </nav>

            <div className="w-[65%] m-[10px] rounded-[10px] p-2 absolute right-1 my-[200px] text-center bg-white border-2 border-gray-300 sm:w-[80%] md:w-[80%] lg:w-[85%] xl:w-[90%] ">
                <Outlet></Outlet>
            </div>

        </>
    )
}