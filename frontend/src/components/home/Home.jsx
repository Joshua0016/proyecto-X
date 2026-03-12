
import GroupIcon from '@mui/icons-material/Group';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssessmentIcon from '@mui/icons-material/Assessment';
import PaidIcon from '@mui/icons-material/Paid';

import { useOutlet, Link, Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import MenuBar from "./menuBar/MenuBar"
import Paper from "@mui/material/Paper"
import StatCard from './statCard/StatCard';

import MenuPopupState from './account/Account';
export default function Home() {
    const navigate = useNavigate();
    const outlet = useOutlet();
    const [view, setView] = useState(false);


    useEffect(() => {
        let logged = localStorage.getItem("loggedIn");
        if (logged === "false") {
            navigate("/");
        }

    }, [])

    return (
        <>

            <Paper className="p-2" elevation={3}>
                <div className='flex w-[90%] mx-auto flex justify-between'>
                    <div className="xl:hidden flex flex-row gap-2 text-2xl" onClick={() => setView(!view)}>
                        <img src="/menu.svg" className="w-8 "></img>
                        <h2>Menu</h2>
                    </div>

                    <div className="hidden xl:flex gap-6 text-2xl p-4 text-white">
                        <Link to="members">Members</Link>
                        <Link to="finance">Finance</Link>
                        <Link to="events">Events</Link>
                        <Link to="report">Report</Link>
                    </div>
                    <div className='top-0 bottom-0 flex my-auto cursor-pointer'>
                        <MenuPopupState></MenuPopupState>
                    </div>
                </div>
            </Paper>

            {view && <MenuBar setView={setView}></MenuBar>}

            <div className="">
                {outlet ? <Outlet> </Outlet> :
                    <Paper elevation={1} className='grid grid-cols-1 mt-[100px] gap-5 p-10 md:w-[80%] md:h-[600px] mx-auto md:mt-[300px] md:grid md:grid-cols-2 lg:w-[60%]'>
                        <StatCard title={"Member"} icon={<GroupIcon sx={{ color: "blue" }} ></GroupIcon>} value={"Pending"} color={"blue"}></StatCard>
                        <StatCard title={"Finace"} icon={<PaidIcon sx={{ color: "green" }}></PaidIcon>} value={"Pending"} color={"green"}></StatCard>
                        <StatCard title={"Event"} icon={<CalendarMonthIcon sx={{ color: "yellow" }}></CalendarMonthIcon>} value={"Pending"} color={"yellow"}></StatCard>
                        <StatCard title={"Report"} icon={<AssessmentIcon sx={{ color: "white" }}></AssessmentIcon>} value={"Pending"} color={"white"}></StatCard>
                    </Paper>}

            </div>

        </>
    )
}