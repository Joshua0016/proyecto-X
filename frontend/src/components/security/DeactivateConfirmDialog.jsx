import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export default function DeactivateConfirmDialog({ open, onOpenChange, user, onConfirm, loading }) {
  const isActive = user?.active

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isActive ? "Confirmar desactivación" : "Confirmar activación"}</DialogTitle>
          <DialogDescription>
            ¿Estás seguro de que deseas {isActive ? "desactivar" : "activar"} al usuario{" "}
            <span className="font-semibold">{user?.name}</span> ({user?.email})?
            {isActive
              ? " Esta acción cambiará el estado del usuario a inactivo."
              : " Esta acción cambiará el estado del usuario a activo."}
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" variant={isActive ? "destructive" : "default"} disabled={loading} onClick={onConfirm}>
            {loading ? (isActive ? "Desactivando..." : "Activando...") : (isActive ? "Desactivar" : "Activar")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
