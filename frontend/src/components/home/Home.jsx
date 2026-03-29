import { useOutlet, Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { TooltipProvider } from "../ui/tooltip";

import { AppSidebar } from "@/components/barMenu/app-sidebar";
import { SiteHeader } from "@/components/barMenu/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
export const iframeHeight = "800px";
export const description = "A sidebar with a header and a search form.";

export default function Home() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  useEffect(() => {
    let logged = localStorage.getItem("loggedIn");
    if (logged === "false") {
      navigate("/");
    }
    getMessage();

  }, []);

  function getMessage() {
    const time = new Date().getHours();
    if (time >= 6 && time < 12) {
      setMessage("Buenos días")
    } else if (time >= 12 && time < 20) {
      setMessage("Buenas tardes")
    } else {
      setMessage("Buenas noches");
    }
  }
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
                  <h1 className="text-2xl font-semibold text-muted-foreground pb-2">
                    Bienvenido, {message}
                  </h1>
                  <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
                    <Outlet />
                  </div>
                </div>
              </SidebarInset>
            </div>
          </SidebarProvider>
        </div>
      </TooltipProvider>
    </>
  );
}
