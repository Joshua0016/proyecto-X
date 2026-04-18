import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { MailIcon, LockIcon, LogInIcon } from "lucide-react"

const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Contraseña requerida"),
})

export function LoginForm({ className, ...props }) {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [rememberMe, setRemember] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(loginSchema) })

  useEffect(() => {
    const remembered = localStorage.getItem("rememberUser")
    if (remembered) {
      setValue("email", remembered)
      setRemember(true)
    }
  }, [setValue])

  const onSubmit = async (data) => {
    const result = await login(data.email, data.password)
    if (result.success) {
      if (rememberMe) {
        localStorage.setItem("rememberUser", data.email)
      } else {
        localStorage.removeItem("rememberUser")
      }
      navigate("/home/members")
    } else {
      toast.error(result.error || "Error al iniciar sesión")
    }
  }

  return (
    <div className={cn("flex flex-col", className)} {...props}>
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">Bienvenido</h2>
        <p className="text-muted-foreground mt-2">
          Ingresa tus credenciales para continuar
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-1.5">
          <Label htmlFor="email" className="text-sm font-medium">Correo electrónico</Label>
          <div className="relative">
            <MailIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="email"
              type="email"
              placeholder="correo@ejemplo.com"
              className="h-12 pl-10 rounded-xl"
              {...register("email")}
            />
          </div>
          {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>}
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-sm font-medium">Contraseña</Label>
            <a href="#" className="text-xs text-primary hover:underline">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          <div className="relative">
            <LockIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="h-12 pl-10 rounded-xl"
              {...register("password")}
            />
          </div>
          {errors.password && <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>}
        </div>

        <div className="flex items-center gap-2">
          <Checkbox
            id="remember"
            checked={rememberMe}
            onCheckedChange={(checked) => setRemember(checked)}
          />
          <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">
            Recordar mi correo
          </Label>
        </div>

        <Button
          type="submit"
          className="w-full h-12 cursor-pointer text-sm font-semibold rounded-xl gap-2 shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all duration-300"
          disabled={isSubmitting}
          style={{ background: "linear-gradient(135deg, #1E3A8A 0%, #2563EB 100%)" }}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <span className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Ingresando...
            </span>
          ) : (
            <>
              <LogInIcon className="size-4" />
              Iniciar sesión
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
