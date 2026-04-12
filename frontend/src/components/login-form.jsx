import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "@/hooks/useAuth"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

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
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FieldGroup>
              <Field>
                <div className="flex gap-3">
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <div className="flex">
                    <Checkbox checked={rememberMe} onCheckedChange={(checked) => setRemember(checked)} />
                    <Label htmlFor="remember-checkbox">Remember</Label>
                  </div>
                </div>
                <Input id="email" type="email" placeholder="m@example.com" {...register("email")} />
                {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}
              </Field>
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
                    Forgot your password?
                  </a>
                </div>
                <Input id="password" type="password" {...register("password")} />
                {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
              </Field>
              <Field>
                <Button type="submit" className="cursor-pointer" disabled={isSubmitting}>
                  {isSubmitting ? "Cargando..." : "Login"}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
