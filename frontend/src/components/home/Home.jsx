import { Outlet } from "react-router-dom";
import { TooltipProvider } from "../ui/tooltip";
import { AppSidebar } from "@/components/barMenu/app-sidebar";
import { SiteHeader } from "@/components/barMenu/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <TooltipProvider>
      <div className="[--header-height:calc(--spacing(14))]">
        <SidebarProvider className="flex flex-col">
          <SiteHeader />
          <div className="flex flex-1">
            <AppSidebar />
            <SidebarInset>
              <div className="flex flex-1 flex-col p-4 md:p-6">
                <Outlet />
              </div>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
      <Toaster />
    </TooltipProvider>
  );
}
