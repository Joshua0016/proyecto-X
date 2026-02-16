
import user from "./assets/member.png"
import finance from "./assets/finance.svg"
import events from "./assets/event.png"
import report from "./assets/report.svg"

import church from "./assets/church.svg"
import { useOutlet, Link, Outlet } from "react-router-dom"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export default function Home() {
    const navigate = useNavigate();
    const outlet = useOutlet();

    useEffect(() => {
        let logged = localStorage.getItem("loggedIn");


        if (logged === "false") {
            navigate("/");
        }

    }, [])

    return (
        <>
            {/* <nav className="bg-white w-[100%] h-[58px] relative">
                <p className="text-[20px]  text-center pt-1 md:text-[32px] ">Sistema de gestión</p>

                <div className=" flex absolute right-0 top-0 bottom-0 my-auto items-center p-5 ">

                    <img src={user} alt="Admin" className="w-[18px] md:w-[48px]"></img>
                    <Link to={"admin"} className="pl-2 md:text-[24px]">Admin</Link>
                </div>
            </nav> */}

            <nav style={{ backgroundColor: "#1A1A1A", color: "white" }} className="fixed w-[136px] h-full flex flex-col p-[3px] md:w-[154px] lg:w-[174px] 2xl:w-[200px]">

                <div className=" my-auto">
                    <div className="flex mt-[5px]  items-center ">
                        <img src={user} alt="members" className="w-[42px] m-2 md:w-[38px]" style={{ color: "white" }}></img>
                        <Link to={"members"} className="md:text-[22px] ">Members</Link>
                    </div>
                    <div className="flex mt-[5px] items-center ">
                        <img src={finance} alt="finance" className="w-[42px] m-2 md:w-[48px]"></img>
                        <Link to={"finance"} className="md:text-[22px]">Finance</Link>

                    </div>
                    <div className="flex mt-[5px] items-center">
                        <img src={events} alt="events" className="w-[42px] m-2 md:w-[48px]"></img>
                        <Link to={"events"} className="md:text-[22px]">Events</Link>

                    </div>
                    <div className="flex mt-[5px] items-center ">
                        <img src={report} alt="events" className="w-[42px] m-2 md:w-[48px]"></img>
                        <Link to={"report"} className="md:text-[22px]">Report</Link>

                    </div>

                </div>


            </nav>

            <div className="w-[65%] sm:w-[80%] lg:w-[83%] xl:w-[86%] 2xl:w-[92%] mx-auto absolute right-0 h-full flex flex-col p-[5px]">
                {outlet ? <Outlet> </Outlet> : <div className="my-auto"><img src={church} className="w-[500px] mx-auto"></img></div>}
            </div>

        </>
    )
}