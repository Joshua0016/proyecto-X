import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Pencil, Trash2, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import updateEvent from "@/apiServices/events/updateEvent";
import deleteEvent from "@/apiServices/events/deleteEvent";

const eventSchema = z.object({
  eventId: z.number().optional(),
  title: z.string().min(5, "Mínimo 5 caracteres").max(150, "Máximo 150 caracteres"),
  type: z.string().min(1, "El tipo es requerido").max(50, "Máximo 50 caracteres"),
  description: z.string().max(1000, "Máximo 1000 caracteres").optional(),
  startDate: z.string().min(1, "La fecha de inicio es requerida"),
  endDate: z.string().min(1, "La fecha de fin es requerida"),
  organizerUserId: z.coerce.number().optional().or(z.literal("")),
});

const formatDate = (dateString) => {
  if (!dateString) return "Sin fecha";
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function EventDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event } = location.state || {};

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: event
      ? {
          ...event,
          startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
          endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
        }
      : {},
  });

  if (!event) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <p className="text-gray-500">No se encontraron datos del evento.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>
          Volver
        </Button>
      </div>
    );
  }

  const handleUpdate = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await updateEvent(event.eventId, values);
      setOpen(false);
      // Navega de vuelta actualizando el state con los nuevos valores
      navigate(`/home/event/${event.eventId}`, {
        replace: true,
        state: { event: { ...event, ...values } },
      });
    } catch (err) {
      console.error("Error actualizando evento:", err);
      setError("No se pudo guardar el evento.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar este evento?")) return;
    try {
      await deleteEvent(event.eventId);
      navigate("/home/events");
    } catch (err) {
      console.error("Error eliminando evento:", err);
      setError("No se pudo eliminar el evento.");
    }
  };

  // Abre el modal de edición con las fechas formateadas para datetime-local
  const handleEdit = () => {
    form.reset({
      ...event,
      startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
      endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
    });
    setOpen(true);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">

        {/* BACK */}
        <button
          className="mb-4 text-sm text-white bg-gray-900 hover:bg-gray-700 py-1 px-4 rounded-lg"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">{event.title}</h1>

          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={handleEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* tipo */}
        <span className="inline-block mt-2 mb-4 px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
          {event.type || "Sin tipo"}
        </span>

        {/* descripción */}
        <p className="mb-6 text-gray-700 dark:text-gray-300">
          {event.description || "Sin descripción"}
        </p>

        {/* fechas */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500">Inicio</p>
            <p className="font-medium">{formatDate(event.startDate)}</p>
          </div>
          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500">Culminación</p>
            <p className="font-medium">{formatDate(event.endDate)}</p>
          </div>
        </div>

        {/* MODAL EDITAR */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Evento</DialogTitle>
              <DialogDescription>Modifica los datos del evento.</DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-3 mt-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Título</label>
                <Input placeholder="Título" {...form.register("title")} />
                {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Tipo</label>
                <Input placeholder="Tipo" {...form.register("type")} />
                {form.formState.errors.type && <p className="text-xs text-red-500">{form.formState.errors.type.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Descripción</label>
                <Textarea placeholder="Descripción" className="resize-none" rows={3} {...form.register("description")} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Inicio</label>
                  <Input type="datetime-local" {...form.register("startDate")} />
                  {form.formState.errors.startDate && <p className="text-xs text-red-500">{form.formState.errors.startDate.message}</p>}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Fin</label>
                  <Input type="datetime-local" {...form.register("endDate")} />
                  {form.formState.errors.endDate && <p className="text-xs text-red-500">{form.formState.errors.endDate.message}</p>}
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
