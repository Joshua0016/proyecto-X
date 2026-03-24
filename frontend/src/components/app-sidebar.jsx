import * as React from "react";
import { useEffect } from "react";
import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  TerminalSquareIcon,
  BotIcon,
  BookOpenIcon,
  Settings2Icon,
  LifeBuoyIcon,
  SendIcon,
  FrameIcon,
  PieChartIcon,
  MapIcon,
  TerminalIcon,
} from "lucide-react";

const data = {
  user: {
    name: "User Logged",
    email: localStorage.getItem("email"),
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Gestión de miembros",
      url: "#",
      icon: <TerminalSquareIcon />,
      isActive: true,
      items: [
        {
          title: "Miembros",
          url: "members",
        },
        {
          title: "Eventos",
          url: "events",
        },
        {
          title: "Familias",
          url: "families",
        },
      ],
    },
    {
      title: "Finanzas",
      url: "#",
      icon: <BotIcon />,
      items: [
        {
          title: "Diario Entrada",
          url: () => console.log("Hola"),
        },
        {
          title: "Cuentas Por Pagar",
          url: "#",
        },
        {
          title: "Donaciones",
          url: "#",
        },
      ],
    },
    {
      title: "Informes",
      url: "#",
      icon: <PieChartIcon />,
      items: [
        {
          title: "Balance General",
          url: "#",
        },
        {
          title: "Estado de Resultados",
          url: "#",
        },
        {
          title: "Flujo de Efectivo",
          url: "#",
        },
        {
          title: "Estado Financiero",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: <Settings2Icon />,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  navSecondary: [],
  projects: [],
};

export function AppSidebar({ ...props }) {

  return (
    <Sidebar
      className="top-(--header-height) h-[calc(100svh-var(--header-height))]!"
      {...props}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <TerminalIcon className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Casa de oración</span>
                  <span className="truncate text-xs">Bani</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
