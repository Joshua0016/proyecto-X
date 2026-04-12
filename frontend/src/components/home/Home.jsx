import { Outlet } from "react-router-dom";
import { useState, useEffect } from "react";
import { TooltipProvider } from "../ui/tooltip";
import { AppSidebar } from "@/components/barMenu/app-sidebar";
import { SiteHeader } from "@/components/barMenu/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuth } from "@/hooks/useAuth";
import { Toaster } from "sonner";

export default function Home() {
  const { user } = useAuth();
  const [message, setMessage] = useState("");

  useEffect(() => {
    const time = new Date().getHours();
    if (time >= 6 && time < 12) setMessage("Buenos días");
    else if (time >= 12 && time < 20) setMessage("Buenas tardes");
    else setMessage("Buenas noches");
  }, []);

  return (
    <TooltipProvider>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col gap-4 p-4">
                <h1 className="text-2xl font-semibold text-muted-foreground pb-2">
                  Bienvenido {user?.name}, {message}
                </h1>
                <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-6">
                  <Outlet />
                </div>
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
