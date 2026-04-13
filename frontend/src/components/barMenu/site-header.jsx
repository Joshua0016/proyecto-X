import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Button } from "@/components/ui/button"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SettingsIcon, BadgeCheckIcon, LogOutIcon, MenuIcon } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useSidebar } from "@/components/ui/sidebar"
import logo from "@/assets/logo.svg"

export function SiteHeader() {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  const { toggleSidebar } = useSidebar()

  const initials = (user?.name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U"

  return (
    <header className="sticky top-0 z-50 flex w-full items-center border-b bg-background">
      <div className="flex h-(--header-height) w-full items-center gap-3 px-4">
        <Button variant="ghost" size="icon" className="h-8 w-8 text-[#1E3A8A] hover:text-[#1E40AF] dark:text-[#5B9CF6] dark:hover:text-[#93C5FD]" onClick={toggleSidebar}>
          <MenuIcon className="size-5" />
        </Button>
        <a href="/home" className="flex items-center gap-2">
          <img src={logo} alt="Logo" className="h-8" />
          <span className="hidden sm:inline font-bold text-base text-foreground">Casa de Oración</span>
        </a>

        <div className="ml-auto flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-[#1E3A8A] hover:text-[#1E40AF] dark:text-[#5B9CF6] dark:hover:text-[#93C5FD]"
            onClick={() => navigate("/home/settings")}
            title="Configuración"
          >
            <SettingsIcon className="size-5" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8 ring-2 ring-[#1E3A8A]/20 dark:ring-[#5B9CF6]/20">
                  <AvatarImage src="/avatars/shadcn.jpg" alt={user?.name} />
                  <AvatarFallback className="text-xs bg-[#1E3A8A] text-white dark:bg-[#5B9CF6] dark:text-[#0B1120]">{initials}</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 rounded-lg">
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-2 py-2 text-left text-sm">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/avatars/shadcn.jpg" alt={user?.name} />
                    <AvatarFallback className="text-xs">{initials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-medium">{user?.name}</span>
                    <span className="truncate text-xs text-muted-foreground">{user?.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/home/profile")} className="cursor-pointer">
                  <BadgeCheckIcon className="mr-2 size-4" />
                  Perfil de usuario
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/home/settings")} className="cursor-pointer">
                  <SettingsIcon className="mr-2 size-4" />
                  Configuración
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={logout} className="cursor-pointer">
                <LogOutIcon className="mr-2 size-4" />
                Desconectar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
