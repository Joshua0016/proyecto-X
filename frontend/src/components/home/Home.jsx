
import user from "./assets/User.svg"
import finance from "./assets/finance.svg"
import events from "./assets/events.svg"
import report from "./assets/report.svg"
import hands from "./assets/hands.png"
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
            <nav className="bg-white w-[100%] h-[58px] relative">
                <p className="text-[20px]  text-center pt-1 md:text-[32px] ">Sistema de gestión</p>

                <div className=" flex absolute right-0 top-0 bottom-0 my-auto items-center p-5 ">

                    <img src={user} alt="Admin" className="w-[18px] md:w-[48px]"></img>
                    <Link to={"admin"} className="pl-2 md:text-[24px]">Admin</Link>
                </div>
            </nav>

            <nav className="fixed shadow-sm bg-white top-[30%] w-[120px] h-[190px] p-[3px] rounded-[10px] md:h-[260px] md:w-[164px]">


                <div className="flex mt-[5px] items-center">
                    <img src={user} alt="members" className="w-[18px] m-2 md:w-[38px]"></img>
                    <Link to={"members"} className="md:text-[22px]">Members</Link>
                </div>
                <div className="flex mt-[5px] items-center">
                    <img src={finance} alt="finance" className="w-[18px] m-2 md:w-[38px]"></img>
                    <Link to={"finance"} className="md:text-[22px]">Finance</Link>

                </div>
                <div className="flex mt-[5px] items-center">
                    <img src={events} alt="events" className="w-[18px] m-2 md:w-[38px]"></img>
                    <Link to={"events"} className="md:text-[22px]">Events</Link>

                </div>
                <div className="flex mt-[5px] items-center">
                    <img src={report} alt="events" className="w-[18px] m-2 md:w-[38px]"></img>
                    <Link to={"report"} className="md:text-[22px]">Report</Link>

                </div>

            </nav>

            <div className="w-[65%] m-[10px] rounded-[10px] p-2 absolute right-1 top-[30%] text-center bg-white border-2 border-gray-300 sm:w-[80%] md:w-[75%] lg:w-[80%] xl:w-[85%] ">
                {outlet ? (<Outlet></Outlet>) : <img src={hands} className="mx-auto md:w-[200px]" ></img>}
            </div>

        </>
    )
}