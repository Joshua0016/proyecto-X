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
  useSidebar,
} from "@/components/ui/sidebar";
import {
  TerminalSquareIcon,
  PieChartIcon,
  LucideBook,
  LucideGem,
  ShieldIcon,
  MenuIcon,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.svg";

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
      { title: "Cuentas Por Pagar", url: "ExpenseInvoice" },
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
  {
    title: "Administración",
    url: "#",
    icon: <ShieldIcon />,
    requiredRoles: ["1"],
    items: [
      { title: "Usuarios", url: "admin/users" },
      { title: "Auditoría", url: "admin/audit" },
    ],
  },
];

export function AppSidebar({ ...props }) {
  const { user } = useAuth();
  const { toggleSidebar } = useSidebar();

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
      <SidebarHeader />
      <SidebarContent>
        <NavMain items={navMain} />
        <NavSecondary items={[]} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
