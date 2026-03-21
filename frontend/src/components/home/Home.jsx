

import { useOutlet, Link, Outlet } from "react-router-dom"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

import { TooltipProvider } from '../ui/tooltip';


import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import {
    SidebarInset,
    SidebarProvider,
} from "@/components/ui/sidebar"
export const iframeHeight = "800px"
export const description = "A sidebar with a header and a search form."



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

            <TooltipProvider>
                <div className="[--header-height:calc(--spacing(14))]">
                    <SidebarProvider className="flex flex-col">
                        <SiteHeader />
                        <div className="flex flex-1">
                            <AppSidebar />
                            <SidebarInset>
                                <div className="flex flex-1 flex-col gap-4 p-4">

                                    <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min relative">
                                        <Outlet />
                                    </div>

                                </div>
                            </SidebarInset>
                        </div>
                    </SidebarProvider>
                </div>
            </TooltipProvider>

        </>
    )
}