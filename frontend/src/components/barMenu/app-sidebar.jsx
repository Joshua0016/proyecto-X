import * as React from "react";
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
  PieChartIcon,
  TerminalIcon,
  LucideBook,
  LucideGem,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const allNavMain = [
  {
    title: "Gestión de miembros",
    url: "#",
    icon: <TerminalSquareIcon />,
    isActive: true,
    items: [
      { title: "Miembros", url: "members" },
      { title: "Eventos", url: "events" },
      { title: "Familias", url: "families" },
    ],
  },
  {
    title: "Finanzas",
    url: "#",
    icon: <LucideGem />,
    requiredRoles: ["1"],
    items: [
      { title: "Diario Entrada", url: "journalEntry" },
      { title: "Cuentas Por Pagar", url: "#" },
      { title: "Donaciones", url: "donations" },
    ],
  },
  {
    title: "Informes",
    url: "#",
    icon: <PieChartIcon />,
    requiredRoles: ["1"],
    items: [
      { title: "Balance General", url: "#" },
      { title: "Estado de Resultados", url: "#" },
      { title: "Flujo de Efectivo", url: "#" },
      { title: "Estado Financiero", url: "#" },
    ],
  },
  {
    title: "Plan de cuentas",
    url: "#",
    icon: <LucideBook />,
    requiredRoles: ["1"],
    items: [
      { title: "Cuentas del libro mayor", url: "ledgerAccount" },
    ],
  },
];

export function AppSidebar({ ...props }) {
  const { user } = useAuth();

  const navMain = allNavMain.filter(
    (item) => !item.requiredRoles || item.requiredRoles.includes(user?.rol)
  );

  const userData = {
    name: user?.name ?? "",
    email: user?.email ?? "",
    avatar: "/avatars/shadcn.jpg",
  };

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
        <NavMain items={navMain} />
        <NavSecondary items={[]} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
