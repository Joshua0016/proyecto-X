import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

export default function Profile() {
  const { user, apiClient, updateUser } = useAuth()
  const [loadingProfile, setLoadingProfile] = useState(true)

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

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
      </div>
    )
  }

  return (
    <div className="max-w-lg mx-auto space-y-6 p-4">
      <Card>
        <CardHeader>
          <CardTitle>Perfil de usuario</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={profileForm.handleSubmit(onSaveProfile)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input id="name" {...profileForm.register("name")} />
              {profileForm.formState.errors.name && (
                <p className="text-sm text-red-500">{profileForm.formState.errors.name.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" {...profileForm.register("email")} />
              {profileForm.formState.errors.email && (
                <p className="text-sm text-red-500">{profileForm.formState.errors.email.message}</p>
              )}
            </div>
            <Button type="submit" disabled={profileForm.formState.isSubmitting}>
              {profileForm.formState.isSubmitting ? "Guardando..." : "Guardar cambios"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cambiar contraseña</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={passwordForm.handleSubmit(onChangePassword)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Contraseña actual</Label>
              <Input id="currentPassword" type="password" {...passwordForm.register("currentPassword")} />
              {passwordForm.formState.errors.currentPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.currentPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">Nueva contraseña</Label>
              <Input id="newPassword" type="password" {...passwordForm.register("newPassword")} />
              {passwordForm.formState.errors.newPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.newPassword.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmNewPassword">Confirmar nueva contraseña</Label>
              <Input id="confirmNewPassword" type="password" {...passwordForm.register("confirmNewPassword")} />
              {passwordForm.formState.errors.confirmNewPassword && (
                <p className="text-sm text-red-500">{passwordForm.formState.errors.confirmNewPassword.message}</p>
              )}
            </div>
            <Button type="submit" disabled={passwordForm.formState.isSubmitting}>
              {passwordForm.formState.isSubmitting ? "Cambiando..." : "Cambiar contraseña"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
