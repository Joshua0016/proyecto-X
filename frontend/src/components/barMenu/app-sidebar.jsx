import * as React from "react";
import { useEffect } from "react";
import { NavMain } from "@/components/barMenu/nav-main";

import { NavSecondary } from "@/components/barMenu/nav-secondary";
import { NavUser } from "@/components/barMenu/nav-user";
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
  LucideBook,
  LucideGoal,
  LucideGem,
} from "lucide-react";

const data = {
  user: {
    name: localStorage.getItem("name"),
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
      icon: <LucideGem />,
      items: [
        {
          title: "Diario Entrada",
          url: "journalEntry",
        },
        {
          title: "Cuentas Por Pagar",
          url: "#",
        },
        {
          title: "Donaciones",
          url: "donations",
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
      title: "Plan de cuentas",
      url: "#",
      icon: <LucideBook />,
      items: [
        {
          title: "Cuentas del libro mayor",
          url: "ledgerAccount",
        },
        // {
        //   title: "Team",
        //   url: "#",
        // },
        // {
        //   title: "Billing",
        //   url: "#",
        // },
        // {
        //   title: "Limits",
        //   url: "#",
        // },
      ],
    },
  ],
  navSecondary: [],

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

        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
