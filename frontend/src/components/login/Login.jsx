import { LoginForm } from "../login-form";
import logo from "@/assets/logo.svg";

export default function Login() {
  return (
    <div className="flex min-h-svh w-full">
      {/* Lado izquierdo: branding */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center relative overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 30%, #2563EB 60%, #3B82F6 100%)",
        }}
      >
        {/* Círculos decorativos */}
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-white/5" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[600px] h-[600px] rounded-full bg-white/5" />
        <div className="absolute top-[40%] right-[10%] w-[200px] h-[200px] rounded-full bg-white/5" />

        <div className="relative z-10 flex flex-col items-center gap-6 px-12 text-center">
          <img src={logo} alt="Logo Casa de Oración" className="w-64 h-auto brightness-0 invert drop-shadow-lg" />
          <div>
            <h1 className="text-4xl font-bold text-white tracking-tight">Casa de Oración</h1>
            <p className="text-lg text-white/70 mt-2">Bani, República Dominicana</p>
          </div>
          <p className="text-white/50 text-sm max-w-xs mt-4">
            Sistema de gestión integral para la iglesia
          </p>
        </div>
      </div>

      {/* Lado derecho: formulario */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6 md:p-10 bg-background">
        <div className="w-full max-w-md">
          {/* Logo móvil (visible solo en pantallas pequeñas) */}
          <div className="flex flex-col items-center gap-3 mb-8 lg:hidden">
            <img src={logo} alt="Logo" className="w-20 h-auto" />
            <h2 className="text-xl font-bold text-foreground">Casa de Oración</h2>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
