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
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import updateEvent from "@/apiServices/events/updateEvent";
import deleteEvent from "@/apiServices/events/deleteEvent";

const eventSchema = z.object({
  eventId: z.number().optional(),
  title: z.string().min(5, "Mínimo 5 caracteres").max(150),
  type: z.string().min(1, "El tipo es requerido"),
  description: z.string().optional(),
  startDate: z.string().min(1),
  endDate: z.string().min(1),
  organizerUserId: z.coerce.number().optional().or(z.literal("")),
});

export default function EventDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: eventSchema.parse(location.state?.event || {}),
  });

  const handleUpdate = async (values) => {
    setLoading(true);
    try {
      await updateEvent(event.eventId, values);
      setOpen(false);
      navigate("/home/events"); // o recargar state si quieres mejorar UX
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const { event } = location.state || {};

  if (!event) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <p className="text-gray-500">No se encontraron datos del evento.</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => navigate(-1)}
        >
          Volver
        </button>
      </div>
    );
  }

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


  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar este evento?")) return;

    try {
      await deleteEvent(event.eventId);
      navigate("/home/events");
    } catch (error) {
      console.error("Error eliminando evento:", error);
    }
  };

  const handleEdit = () => {
    // redirige a Events con state para editar
    navigate("/home/events", {
      state: { editEvent: event },
    });
  };


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center p-6">
      <div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">

        {/* BACK */}
        <button
          className="mb-4 text-sm text-white bg-gray-900 hover:bg-gray-700 py-1 px-4 rounded-lg"
          onClick={() => navigate(-1)}>
          ← Volver
        </button>

        {/* HEADER */}
        <div className="flex justify-between items-start">
          <h1 className="text-3xl font-bold">
            {event.title}
          </h1>

          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={() => setOpen(true)}>
              <Pencil className="h-4 w-4" />
            </Button>

            <Button size="icon" variant="ghost" onClick={handleDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        <div>
          {/* tipo */}
          <span className="inline-block mb-4 px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
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
              <p className="font-medium">
                {formatDate(event.startDate)}
              </p>
            </div>

            <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
              <p className="text-gray-500">Culminación</p>
              <p className="font-medium">
                {formatDate(event.endDate)}
              </p>
            </div>
          </div>
        </div>
        {/* MODAL EDITAR */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar evento</DialogTitle>
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleUpdate)}
              className="space-y-3 mt-4"
            >
              <Input placeholder="Título" {...form.register("title")} />
              <Input placeholder="Tipo" {...form.register("type")} />
              <Textarea placeholder="Descripción" {...form.register("description")} />
              <Input type="datetime-local" {...form.register("startDate")} />
              <Input type="datetime-local" {...form.register("endDate")} />

              <DialogFooter>
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












    //<div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center p-6">
      //<div className="w-full max-w-2xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
