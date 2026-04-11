import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";

import getAllEvents from "@/apiServices/events/getAllEvents";
import createEvent from "@/apiServices/events/createEvent";
import updateEvent from "@/apiServices/events/updateEvent";
import deleteEvent from "@/apiServices/events/deleteEvent";
import searchEvents from "@/apiServices/events/searchEvents";

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
  const options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };
  return new Date(dateString).toLocaleDateString("es-ES", options);
};

export default function Events() {
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [eventModal, setEventModal] = useState({ open: false, event: null });
  const eventForm = useForm({ resolver: zodResolver(eventSchema) });
  const location = useLocation();

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllEvents();
      setEvents(data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("No se pudieron cargar los eventos.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Abre el modal de edición si EventDetails redirigió con state.editEvent
  useEffect(() => {
    if (location.state?.editEvent) {
      openEvent(location.state.editEvent);
      // Limpia el state para no re-abrir al navegar
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  useEffect(() => { fetchEvents(); }, [fetchEvents]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!searchTerm.trim()) {
        fetchEvents();
      } else {
        try {
          const results = await searchEvents(searchTerm);
          setEvents(results || []);
        } catch (err) {
          console.error("Error searching events:", err);
          setError("Error al buscar eventos.");
        }
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm, fetchEvents]);

  const openEvent = (event = null) => {
    setEventModal({ open: true, event });
    if (event) {
      eventForm.reset({
        ...event,
        startDate: event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
        endDate: event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
      });
    } else {
      eventForm.reset({});
    }
  };

  const submitEvent = async (values) => {
    setLoading(true);
    setError(null);
    try {
      if (eventModal.event) await updateEvent(eventModal.event.eventId, values);
      else await createEvent(values);
      await fetchEvents();
      setEventModal({ open: false, event: null });
    } catch (err) {
      console.error("Error saving event:", err);
      setError("No se pudo guardar el evento.");
    } finally {
      setLoading(false);
    }
  };

  const removeEvent = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este evento?")) return;
    try {
      await deleteEvent(id);
      await fetchEvents();
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("No se pudo eliminar el evento.");
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          Eventos
        </h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Buscar evento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => openEvent()}>
            <Plus className="mr-2 h-4 w-4" /> Nuevo
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading && <Loader2 className="animate-spin mx-auto my-4 h-8 w-8 text-blue-500" />}

      {/* LISTA */}
      {events.map((event) => (
        <div key={event.eventId} className="flex justify-between items-center py-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <div className="font-semibold text-gray-900 dark:text-gray-100">
              <Link to={`/home/event/${event.eventId}`} state={{ event }}>
                {event.title || "Sin título"}
              </Link>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">
              {formatDate(event.startDate)} — {formatDate(event.endDate)}
            </div>
          </div>

          <div className="flex gap-2 ml-2">
            <Button size="icon" variant="ghost" onClick={() => openEvent(event)}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={() => removeEvent(event.eventId)}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>
      ))}

      {!loading && events.length === 0 && (
        <div className="text-center text-gray-500 mt-8">No se encontraron eventos.</div>
      )}

      {/* MODAL EVENTO */}
      <Dialog open={eventModal.open} onOpenChange={(open) => setEventModal((prev) => ({ ...prev, open }))}>
        <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-md">
          <DialogHeader>
            <DialogTitle>{eventModal.event ? "Editar Evento" : "Nuevo Evento"}</DialogTitle>
            <DialogDescription>
              {eventModal.event ? "Modifica los datos del evento." : "Completa la información para el nuevo evento."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={eventForm.handleSubmit(submitEvent)} className="space-y-4 mt-4">
            <div className="space-y-1">
              <label className="text-sm font-medium">Título</label>
              <Input placeholder="Ej: Retiro de Jóvenes" {...eventForm.register("title")} />
              {eventForm.formState.errors.title && <p className="text-xs text-red-500">{eventForm.formState.errors.title.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Tipo de Evento</label>
              <Input placeholder="Ej: Conferencia, Taller..." {...eventForm.register("type")} />
              {eventForm.formState.errors.type && <p className="text-xs text-red-500">{eventForm.formState.errors.type.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium">Fecha y Hora de Inicio</label>
                <Input type="datetime-local" {...eventForm.register("startDate")} />
                {eventForm.formState.errors.startDate && <p className="text-xs text-red-500">{eventForm.formState.errors.startDate.message}</p>}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Fecha y Hora de Fin</label>
                <Input type="datetime-local" {...eventForm.register("endDate")} />
                {eventForm.formState.errors.endDate && <p className="text-xs text-red-500">{eventForm.formState.errors.endDate.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">ID Organizador (Opcional)</label>
              <Input type="number" placeholder="ID del Usuario" {...eventForm.register("organizerUserId")} />
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea placeholder="Detalles sobre el evento..." className="resize-none" rows={3} {...eventForm.register("description")} />
              {eventForm.formState.errors.description && <p className="text-xs text-red-500">{eventForm.formState.errors.description.message}</p>}
            </div>

            <DialogFooter className="pt-4">
              <Button type="button" variant="outline" onClick={() => setEventModal({ open: false, event: null })}>
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
  );
}
