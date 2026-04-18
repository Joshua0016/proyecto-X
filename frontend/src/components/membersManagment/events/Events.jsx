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

// ─── Constantes ───────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  "Culto", "Congreso", "Retiro", "Campaña", "Reunión", "Taller",
  "Escuela", "Vigilia", "Convención", "Semana Especial", "Celebración", "Otro",
];
const EVENT_STATUSES = ["Programado", "EnCurso", "Finalizado", "Cancelado"];
const STATUS_LABELS = { Programado: "Programado", EnCurso: "En Curso", Finalizado: "Finalizado", Cancelado: "Cancelado" };
const STATUS_STYLES = {
  Programado: "bg-blue-100 text-blue-700",
  EnCurso:    "bg-green-100 text-green-700",
  Finalizado: "bg-gray-200 text-gray-600",
  Cancelado:  "bg-red-100 text-red-600",
};

// ─── Schema ───────────────────────────────────────────────────────────────────

const eventSchema = z.object({
  title:           z.string().min(5, "Mínimo 5 caracteres").max(100, "Máximo 100 caracteres"),
  type:            z.string().min(1, "El tipo es requerido").max(50, "Máximo 50 caracteres"),
  description:     z.string().max(1000, "Máximo 1000 caracteres").optional(),
  location:        z.string().optional(),
  capacity:        z.coerce.number().int().positive("Debe ser positivo").optional().or(z.literal("")),
  isOrdinary:      z.boolean().default(true),
  isRecurring:     z.boolean().default(false),
  status:          z.string().min(1, "Requerido"),
  startDate:       z.string().min(1, "La fecha de inicio es requerida"),
  endDate:         z.string().min(1, "La fecha de fin es requerida"),
  organizerUserId: z.coerce.number().optional().or(z.literal("")),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (d) => {
  if (!d) return "Sin fecha";
  return new Date(d).toLocaleDateString("es-ES", {
    year: "numeric", month: "short", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

// ─── Component ────────────────────────────────────────────────────────────────

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

  // Abre el modal si EventDetails redirigió con state.editEvent
  useEffect(() => {
    if (location.state?.editEvent) {
      openEvent(location.state.editEvent);
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
        title:           event.title ?? "",
        type:            event.type ?? "",
        description:     event.description ?? "",
        location:        event.location ?? "",
        capacity:        event.capacity ?? "",
        isOrdinary:      event.isOrdinary ?? true,
        isRecurring:     event.isRecurring ?? false,
        status:          event.status ?? "Programado",
        startDate:       event.startDate ? new Date(event.startDate).toISOString().slice(0, 16) : "",
        endDate:         event.endDate ? new Date(event.endDate).toISOString().slice(0, 16) : "",
        organizerUserId: event.organizerUserId ?? "",
      });
    } else {
      eventForm.reset({ isOrdinary: true, isRecurring: false, status: "Programado" });
    }
  };

  const submitEvent = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...values,
        capacity:        values.capacity === "" ? null : Number(values.capacity),
        organizerUserId: values.organizerUserId === "" ? null : Number(values.organizerUserId),
        startDate:       new Date(values.startDate).toISOString(),
        endDate:         new Date(values.endDate).toISOString(),
      };
      if (eventModal.event) await updateEvent(eventModal.event.eventId, payload);
      else await createEvent(payload);
      await fetchEvents();
      setEventModal({ open: false, event: null });
    } catch (err) {
      console.error("Error saving event:", err);
      setError("No se pudo guardar el evento.");
    } finally {
      setLoading(false);
    }
  };

  const [cancelConfirm, setCancelConfirm] = useState({ open: false, event: null });

  const removeEvent = async (id) => {
    if (!window.confirm("¿Eliminar este evento? También se eliminarán las asistencias registradas.")) return;
    try {
      const ok = await deleteEvent(id);
      if (ok) {
        await fetchEvents();
      } else {
        // deleteEvent retorna false cuando el backend responde con error
        // Si tiene donaciones, el backend devuelve 422 — ofrecemos cancelar
        const ev = events.find((e) => e.eventId === id);
        if (ev) setCancelConfirm({ open: true, event: ev });
      }
    } catch (err) {
      console.error("Error deleting event:", err);
      setError("No se pudo eliminar el evento.");
    }
  };

  const cancelEvent = async () => {
    const ev = cancelConfirm.event;
    if (!ev) return;
    const payload = {
      title: ev.title,
      type: ev.type,
      description: ev.description ?? "",
      location: ev.location ?? "",
      capacity: ev.capacity ?? null,
      isOrdinary: ev.isOrdinary,
      isRecurring: ev.isRecurring,
      status: "Cancelado",
      startDate: ev.startDate,
      endDate: ev.endDate,
      organizerUserId: ev.organizerUserId ?? null,
    };
    const ok = await updateEvent(ev.eventId, payload);
    if (ok) await fetchEvents();
    setCancelConfirm({ open: false, event: null });
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Eventos</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8 bg-white dark:bg-gray-900"
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
      <div className="space-y-1">
        {events.map((event) => (
          <div key={event.eventId} className="flex justify-between items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <Link
                  to={`/home/event/${event.eventId}`}
                  state={{ event }}
                  className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  {event.title || "Sin título"}
                </Link>
                {event.status && (
                  <span className={`text-xs px-2 py-0.5 rounded-full ${STATUS_STYLES[event.status] ?? "bg-gray-100 text-gray-600"}`}>
                    {STATUS_LABELS[event.status] ?? event.status}
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-0.5 truncate">
                {formatDate(event.startDate)} — {formatDate(event.endDate)}
              </p>
            </div>

            <div className="flex gap-1 ml-2 shrink-0">
              <Button size="icon" variant="ghost" onClick={() => openEvent(event)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => removeEvent(event.eventId)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {!loading && events.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No se encontraron eventos.</p>
      )}

      {/* MODAL EVENTO */}
      <Dialog open={eventModal.open} onOpenChange={(open) => setEventModal((prev) => ({ ...prev, open }))}>
        <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{eventModal.event ? "Editar Evento" : "Nuevo Evento"}</DialogTitle>
            <DialogDescription>
              {eventModal.event ? "Modifica los datos del evento." : "Completa la información para el nuevo evento."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={eventForm.handleSubmit(submitEvent)} className="space-y-4 mt-2">
            {/* Título */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Título</label>
              <Input placeholder="Ej: Retiro de Jóvenes" {...eventForm.register("title")} />
              {eventForm.formState.errors.title && <p className="text-xs text-red-500">{eventForm.formState.errors.title.message}</p>}
            </div>

            {/* Tipo y Estado */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Tipo</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800" {...eventForm.register("type")}>
                  <option value="">Seleccionar tipo</option>
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {eventForm.formState.errors.type && <p className="text-xs text-red-500">{eventForm.formState.errors.type.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Estado</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800" {...eventForm.register("status")}>
                  {EVENT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>
            </div>

            {/* Fechas */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Inicio</label>
                <Input type="datetime-local" {...eventForm.register("startDate")} />
                {eventForm.formState.errors.startDate && <p className="text-xs text-red-500">{eventForm.formState.errors.startDate.message}</p>}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Fin</label>
                <Input type="datetime-local" {...eventForm.register("endDate")} />
                {eventForm.formState.errors.endDate && <p className="text-xs text-red-500">{eventForm.formState.errors.endDate.message}</p>}
              </div>
            </div>

            {/* Lugar y Capacidad */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-sm font-medium">Lugar</label>
                <Input placeholder="Ej: Templo Central" {...eventForm.register("location")} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Capacidad</label>
                <Input type="number" placeholder="Ej: 200" {...eventForm.register("capacity")} />
                {eventForm.formState.errors.capacity && <p className="text-xs text-red-500">{eventForm.formState.errors.capacity.message}</p>}
              </div>
            </div>

            {/* Organizador */}
            <div className="space-y-1">
              <label className="text-sm font-medium">ID Organizador (Opcional)</label>
              <Input type="number" placeholder="ID del usuario organizador" {...eventForm.register("organizerUserId")} />
            </div>

            {/* Descripción */}
            <div className="space-y-1">
              <label className="text-sm font-medium">Descripción</label>
              <Textarea placeholder="Detalles sobre el evento..." className="resize-none" rows={3} {...eventForm.register("description")} />
              {eventForm.formState.errors.description && <p className="text-xs text-red-500">{eventForm.formState.errors.description.message}</p>}
            </div>

            {/* Checkboxes */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded" {...eventForm.register("isOrdinary")} />
                Actividad ordinaria
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="rounded" {...eventForm.register("isRecurring")} />
                Recurrente
              </label>
            </div>

            <DialogFooter className="pt-2">
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
      {/* MODAL CANCELAR EVENTO */}
      <Dialog open={cancelConfirm.open} onOpenChange={(open) => setCancelConfirm((prev) => ({ ...prev, open }))}>
        <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-md">
          <DialogHeader>
            <DialogTitle>No se puede eliminar</DialogTitle>
            <DialogDescription>
              Este evento tiene donaciones registradas y no puede eliminarse para preservar la integridad contable.
              ¿Deseas <span className="font-semibold text-red-500">cancelar el evento</span> en su lugar?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="pt-2">
            <Button variant="outline" onClick={() => setCancelConfirm({ open: false, event: null })}>
              Cerrar
            </Button>
            <Button variant="destructive" onClick={cancelEvent}>
              Cancelar evento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
