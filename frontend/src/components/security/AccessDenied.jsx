import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";

export default function AccessDenied() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-full gap-4">
      <h1 className="text-2xl font-bold">Acceso Denegado</h1>
      <p className="text-muted-foreground">No tienes permisos para acceder a esta página.</p>
      <Button onClick={() => navigate("/home/members")}>Volver al inicio</Button>
    </div>
  );
}
