import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/hooks/useAuth"
import { getProfile, updateProfile } from "@/apiServices/securityService/userService"
import { changePasswordRequest } from "@/apiServices/authService/authService"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import {
  UserIcon,
  LockIcon,
  BellIcon,
  ShieldCheckIcon,
  Loader2Icon,
} from "lucide-react"

const profileSchema = z.object({
  name: z.string().min(3, "Nombre debe tener al menos 3 caracteres"),
  email: z.email("Email inválido"),
})

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Contraseña actual requerida"),
  newPassword: z.string().min(8, "Nueva contraseña debe tener al menos 8 caracteres"),
  confirmNewPassword: z.string(),
}).refine(data => data.newPassword === data.confirmNewPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmNewPassword"],
})

const TABS = [
  { id: "profile", label: "Perfil", icon: UserIcon },
  { id: "password", label: "Contraseña", icon: LockIcon },
  { id: "notifications", label: "Notificaciones", icon: BellIcon },
  { id: "verification", label: "Verificación", icon: ShieldCheckIcon },
]

export default function Profile() {
  const { user, apiClient, updateUser } = useAuth()
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [activeTab, setActiveTab] = useState("profile")

  const profileForm = useForm({ resolver: zodResolver(profileSchema) })
  const passwordForm = useForm({ resolver: zodResolver(changePasswordSchema) })

  useEffect(() => {
    if (!user?.userId || !apiClient) return
    getProfile(apiClient, user.userId)
      .then((data) => {
        profileForm.setValue("name", data.name || user.name)
        profileForm.setValue("email", data.email || user.email)
      })
      .catch(() => {
        profileForm.setValue("name", user.name)
        profileForm.setValue("email", user.email)
      })
      .finally(() => setLoadingProfile(false))
  }, [user?.userId, apiClient])

  const onSaveProfile = async (data) => {
    try {
      await updateProfile(apiClient, user.userId, {
        Name: data.name,
        Email: data.email,
        IdRol: parseInt(user.rol),
      })
      updateUser({ name: data.name, email: data.email })
      toast.success("Perfil actualizado")
    } catch (err) {
      toast.error(err.message || "Error al actualizar perfil")
    }
  }

  const onChangePassword = async (data) => {
    try {
      await changePasswordRequest(apiClient, user.userId, data.currentPassword, data.newPassword)
      toast.success("Contraseña cambiada exitosamente")
      passwordForm.reset()
    } catch (err) {
      toast.error(err.message || "Error al cambiar contraseña")
    }
  }

  const initials = (user?.name || "")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "U"

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2Icon className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-foreground mb-6">Configuración de cuenta</h1>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Menú lateral */}
        <nav className="md:w-56 shrink-0">
          <div className="space-y-1">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-primary text-primary-foreground shadow-md"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                <tab.icon className="size-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </nav>

        {/* Contenido */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <Card className="rounded-2xl">
              <CardContent className="p-6 space-y-6">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="size-16 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xl font-bold">
                    {initials}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{user?.name}</p>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                </div>

                {/* Formulario */}
                <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label htmlFor="name" className="text-sm">Nombre completo</Label>
                      <Input id="name" className="h-11 rounded-xl" {...profileForm.register("name")} />
                      {profileForm.formState.errors.name && (
                        <p className="text-xs text-red-500">{profileForm.formState.errors.name.message}</p>
                      )}
                    </div>
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-sm">Correo electrónico</Label>
                      <Input id="email" type="email" className="h-11 rounded-xl" {...profileForm.register("email")} />
                      {profileForm.formState.errors.email && (
                        <p className="text-xs text-red-500">{profileForm.formState.errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <Label className="text-sm">ID de usuario</Label>
                      <Input value={user?.userId || ""} disabled className="h-11 rounded-xl bg-muted" />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-sm">Rol</Label>
                      <Input value={user?.rol === "1" ? "Administrador" : "Usuario"} disabled className="h-11 rounded-xl bg-muted" />
                    </div>
                  </div>

                  <div className="flex justify-end pt-2">
                    <Button type="submit" disabled={profileForm.formState.isSubmitting} className="rounded-xl px-6">
                      {profileForm.formState.isSubmitting ? "Guardando..." : "Guardar cambios"}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "password" && (
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Cambiar contraseña</h2>
                <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-5 max-w-md">
                  <div className="space-y-1.5">
                    <Label htmlFor="currentPassword" className="text-sm">Contraseña actual</Label>
                    <Input id="currentPassword" type="password" className="h-11 rounded-xl" {...passwordForm.register("currentPassword")} />
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-xs text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="newPassword" className="text-sm">Nueva contraseña</Label>
                    <Input id="newPassword" type="password" className="h-11 rounded-xl" {...passwordForm.register("newPassword")} />
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-xs text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="confirmNewPassword" className="text-sm">Confirmar nueva contraseña</Label>
                    <Input id="confirmNewPassword" type="password" className="h-11 rounded-xl" {...passwordForm.register("confirmNewPassword")} />
                    {passwordForm.formState.errors.confirmNewPassword && (
                      <p className="text-xs text-red-500">{passwordForm.formState.errors.confirmNewPassword.message}</p>
                    )}
                  </div>
                  <Button type="submit" disabled={passwordForm.formState.isSubmitting} className="rounded-xl px-6">
                    {passwordForm.formState.isSubmitting ? "Cambiando..." : "Cambiar contraseña"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          )}

          {activeTab === "notifications" && (
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Notificaciones</h2>
                <p className="text-sm text-muted-foreground">Las preferencias de notificaciones se configuran desde la página de Configuración.</p>
                <Button variant="outline" className="mt-4 rounded-xl" onClick={() => window.location.href = "/home/settings"}>
                  Ir a Configuración
                </Button>
              </CardContent>
            </Card>
          )}

          {activeTab === "verification" && (
            <Card className="rounded-2xl">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4">Verificación</h2>
                <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800">
                  <ShieldCheckIcon className="size-5 text-emerald-600 dark:text-emerald-400" />
                  <div>
                    <p className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Cuenta verificada</p>
                    <p className="text-xs text-emerald-600 dark:text-emerald-400">Tu cuenta está activa y verificada en el sistema.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
