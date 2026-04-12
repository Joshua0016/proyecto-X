import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Pencil, Trash2, Loader2, MapPin, Users, CalendarDays,
  RefreshCw, CheckCircle2, Clock, XCircle, User,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

import updateEvent from "@/apiServices/events/updateEvent";
import deleteEvent from "@/apiServices/events/deleteEvent";

// ─── Constantes ──────────────────────────────────────────────────────────────

const EVENT_TYPES = [
  "Culto", "Congreso", "Retiro", "Campaña", "Reunión", "Taller",
  "Escuela", "Vigilia", "Convención", "Semana Especial", "Celebración", "Otro",
];

const EVENT_STATUSES = ["Programado", "EnCurso", "Finalizado", "Cancelado"];

const STATUS_LABELS = {
  Programado: "Programado",
  EnCurso: "En Curso",
  Finalizado: "Finalizado",
  Cancelado: "Cancelado",
};

const STATUS_STYLES = {
  Programado: "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300",
  EnCurso:    "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
  Finalizado: "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  Cancelado:  "bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300",
};

const STATUS_ICONS = {
  Programado: <Clock className="h-3 w-3" />,
  EnCurso:    <CheckCircle2 className="h-3 w-3" />,
  Finalizado: <CheckCircle2 className="h-3 w-3" />,
  Cancelado:  <XCircle className="h-3 w-3" />,
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (d) => {
  if (!d) return "Sin fecha";
  return new Date(d).toLocaleDateString("es-ES", {
    year: "numeric", month: "long", day: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
};

const toLocalInput = (d) =>
  d ? new Date(d).toISOString().slice(0, 16) : "";

// ─── Schema ───────────────────────────────────────────────────────────────────

const eventSchema = z.object({
  title:          z.string().min(5, "Mínimo 5 caracteres").max(100, "Máximo 100 caracteres"),
  type:           z.string().min(1, "Requerido").max(50, "Máximo 50 caracteres"),
  description:    z.string().max(1000, "Máximo 1000 caracteres").optional(),
  location:       z.string().optional(),
  capacity:       z.coerce.number().int().positive("Debe ser positivo").optional().or(z.literal("")),
  isOrdinary:     z.boolean(),
  isRecurring:    z.boolean(),
  status:         z.string().min(1, "Requerido"),
  startDate:      z.string().min(1, "Requerido"),
  endDate:        z.string().min(1, "Requerido"),
  organizerUserId:z.coerce.number().optional().or(z.literal("")),
});

// ─── InfoCard ─────────────────────────────────────────────────────────────────

const InfoCard = ({ icon, label, value }) => (
  <div className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl">
    <div className="mt-0.5 text-gray-400 shrink-0">{icon}</div>
    <div>
      <p className="text-xs text-gray-500 uppercase font-medium mb-0.5">{label}</p>
      <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{value || "—"}</p>
    </div>
  </div>
);

// ─── Component ───────────────────────────────────────────────────────────────

export default function EventDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const { event: initialEvent } = location.state || {};

  const [event, setEvent] = useState(initialEvent);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const form = useForm({ resolver: zodResolver(eventSchema) });

  if (!event) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">No se encontraron datos del evento.</p>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </div>
    );
  }

  const handleEdit = () => {
    form.reset({
      title:           event.title ?? "",
      type:            event.type ?? "",
      description:     event.description ?? "",
      location:        event.location ?? "",
      capacity:        event.capacity ?? "",
      isOrdinary:      event.isOrdinary ?? true,
      isRecurring:     event.isRecurring ?? false,
      status:          event.status ?? "Programado",
      startDate:       toLocalInput(event.startDate),
      endDate:         toLocalInput(event.endDate),
      organizerUserId: event.organizerUserId ?? "",
    });
    setOpen(true);
  };

  const handleUpdate = async (values) => {
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
      const ok = await updateEvent(event.eventId, payload);
      if (!ok) { setLoading(false); return; }
      const updated = { ...event, ...payload };
      setEvent(updated);
      navigate(`/home/event/${event.eventId}`, { replace: true, state: { event: updated } });
      setOpen(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el evento.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("¿Eliminar este evento? También se eliminarán las asistencias registradas.")) return;
    try {
      const ok = await deleteEvent(event.eventId);
      if (ok) navigate("/home/events");
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el evento.");
    }
  };

  const status = event.status ?? "Programado";

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center p-6">
      <div className="w-full max-w-2xl space-y-4">

        {/* BACK */}
        <button
          className="text-sm text-white bg-gray-900 hover:bg-gray-700 py-1 px-4 rounded-lg transition"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* CARD PRINCIPAL */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">

          {/* HEADER con color según estado */}
          <div className="bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-800 dark:to-gray-900 p-6">
            <div className="flex justify-between items-start">
              <div className="flex-1 min-w-0 pr-4">
                <h1 className="text-2xl font-bold text-white leading-tight">{event.title}</h1>
                <div className="flex flex-wrap gap-2 mt-2">
                  {/* tipo */}
                  <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                    {event.type || "Sin tipo"}
                  </span>
                  {/* estado */}
                  <span className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLES[status]}`}>
                    {STATUS_ICONS[status]}
                    {STATUS_LABELS[status] ?? status}
                  </span>
                  {/* ordinario */}
                  {event.isOrdinary !== undefined && (
                    <span className="text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                      {event.isOrdinary ? "Ordinario" : "Extraordinario"}
                    </span>
                  )}
                  {/* recurrente */}
                  {event.isRecurring && (
                    <span className="inline-flex items-center gap-1 text-xs bg-white/20 text-white px-2 py-0.5 rounded-full">
                      <RefreshCw className="h-3 w-3" /> Recurrente
                    </span>
                  )}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={handleEdit}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-red-300 hover:bg-white/20" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">

            {/* DESCRIPCIÓN */}
            {event.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
                {event.description}
              </p>
            )}

            {/* FECHAS */}
            <div className="grid grid-cols-2 gap-3">
              <InfoCard
                icon={<CalendarDays className="h-4 w-4" />}
                label="Inicio"
                value={formatDate(event.startDate)}
              />
              <InfoCard
                icon={<CalendarDays className="h-4 w-4" />}
                label="Fin"
                value={formatDate(event.endDate)}
              />
            </div>

            {/* DETALLES */}
            <div className="grid grid-cols-2 gap-3">
              {event.location && (
                <InfoCard
                  icon={<MapPin className="h-4 w-4" />}
                  label="Lugar"
                  value={event.location}
                />
              )}
              {event.capacity != null && (
                <InfoCard
                  icon={<Users className="h-4 w-4" />}
                  label="Capacidad"
                  value={`${event.capacity} personas`}
                />
              )}
              {event.organizerName && (
                <InfoCard
                  icon={<User className="h-4 w-4" />}
                  label="Organizador"
                  value={event.organizerName}
                />
              )}
            </div>

          </div>
        </div>

        {/* ── MODAL EDITAR ─────────────────────────────────────────────────── */}
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-lg max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Editar Evento</DialogTitle>
              <DialogDescription>Modifica los datos del evento.</DialogDescription>
            </DialogHeader>

            <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-4 mt-2">

              {/* Título */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Título</label>
                <Input placeholder="Ej: Retiro de Jóvenes" {...form.register("title")} />
                {form.formState.errors.title && <p className="text-xs text-red-500">{form.formState.errors.title.message}</p>}
              </div>

              {/* Tipo */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Tipo</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800" {...form.register("type")}>
                  <option value="">Seleccionar tipo</option>
                  {EVENT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
                {form.formState.errors.type && <p className="text-xs text-red-500">{form.formState.errors.type.message}</p>}
              </div>

              {/* Estado */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Estado</label>
                <select className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800" {...form.register("status")}>
                  {EVENT_STATUSES.map((s) => <option key={s} value={s}>{STATUS_LABELS[s]}</option>)}
                </select>
              </div>

              {/* Fechas */}
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

              {/* Lugar y Capacidad */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Lugar</label>
                  <Input placeholder="Ej: Templo Central" {...form.register("location")} />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Capacidad</label>
                  <Input type="number" placeholder="Ej: 200" {...form.register("capacity")} />
                  {form.formState.errors.capacity && <p className="text-xs text-red-500">{form.formState.errors.capacity.message}</p>}
                </div>
              </div>

              {/* Organizador */}
              <div className="space-y-1">
                <label className="text-sm font-medium">ID Organizador (Opcional)</label>
                <Input type="number" placeholder="ID del usuario organizador" {...form.register("organizerUserId")} />
              </div>

              {/* Descripción */}
              <div className="space-y-1">
                <label className="text-sm font-medium">Descripción</label>
                <Textarea placeholder="Detalles del evento..." className="resize-none" rows={3} {...form.register("description")} />
                {form.formState.errors.description && <p className="text-xs text-red-500">{form.formState.errors.description.message}</p>}
              </div>

              {/* Checkboxes */}
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded" {...form.register("isOrdinary")} />
                  Actividad ordinaria
                </label>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" className="rounded" {...form.register("isRecurring")} />
                  Recurrente
                </label>
              </div>

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancelar</Button>
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
