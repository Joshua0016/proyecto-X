
import user from "./assets/member.png"
import finance from "./assets/finance.svg"
import events from "./assets/event.png"
import report from "./assets/report.svg"

import church from "./assets/church.svg"
import { useOutlet, Link, Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MenuBar from "./menuBar/MenuBar"

export default function Home() {
    const navigate = useNavigate();
    const [view, setView] = useState(false);
    const outlet = useOutlet();

    useEffect(() => {
        let logged = localStorage.getItem("loggedIn");


        if (logged === "false") {
            navigate("/");
        }

    }, [])

    return (
        <>

            <div style={{ backgroundColor: "#1A1A1A", color: "white" }} className="p-2">

                <div className="xl:hidden flex flex-row gap-2 text-2xl" onClick={() => setView(!view)}>
                    <img src="/menu.svg" className="w-8 "></img>
                    <h2>Menu</h2>
                </div>
                <div className="hidden xl:flex gap-6 text-3xl p-4 text-white">
                    <Link to="members">Members</Link>
                    <Link to="finance">Finance</Link>
                    <Link to="events">Events</Link>
                    <Link to="report">Report</Link>
                </div>

            </div>
            {view ? <MenuBar setView={setView}></MenuBar> : ""}

            <div className="">
                <Outlet> </Outlet>
            </div>

        </>
    )
}