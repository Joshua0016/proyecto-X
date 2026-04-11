import React, { useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dayjs from "dayjs";
import { Pencil, Trash2, Loader2, Plus, UserCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

import updateFamily from "@/apiServices/families/updateFamily";
import deleteFamily from "@/apiServices/families/deleteFamily";
import getFamilyById from "@/apiServices/families/getFamilyById";
import createMember from "@/apiServices/members/createMember";
import updateMember from "@/apiServices/members/updateMember";
import deleteMember from "@/apiServices/members/deleteMember";

// ─── Schemas ────────────────────────────────────────────────────────────────

const familySchema = z.object({
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  sector: z.string().optional(),
  address: z.string().optional(),
});

const RELATIONSHIPS = [
  "Padre", "Madre", "Hijo", "Hija", "Abuelo", "Abuela",
  "Nieto", "Nieta", "Hermano", "Hermana", "Tío", "Tía",
  "Sobrino", "Sobrina", "Primo", "Prima", "Cónyuge",
  "Suegro", "Suegra", "Yerno", "Nuera", "Cuñado", "Cuñada",
  "Padrastro", "Madrastra", "Hijastro", "Hijastra", "Tutor", "Pupilo", "Otro",
];

const GENDERS = ["M", "F"];
const MARITAL_STATUSES = ["Soltero", "Casado", "Viudo", "Divorciado"];

const memberSchema = z.object({
  memberId: z.number().optional(),
  firstName: z.string().min(2, "Mínimo 2 caracteres"),
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  gender: z.string().min(1, "Requerido"),
  birthDate: z.string().min(1, "Requerido"),
  maritalStatus: z.string().min(1, "Requerido"),
  email: z.string().email("Email inválido").optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  familyId: z.coerce.number(),
  relationship: z.string().min(1, "Requerido"),
});

// ─── Helpers ─────────────────────────────────────────────────────────────────

const formatDate = (d) =>
  d ? dayjs(d).format("DD MMM YYYY") : "Sin fecha";

// ─── Component ───────────────────────────────────────────────────────────────

export default function FamilyDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const [family, setFamily] = useState(location.state?.family ?? null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  // modals
  const [familyModal, setFamilyModal] = useState(false);
  const [memberModal, setMemberModal] = useState({ open: false, member: null });

  const familyForm = useForm({ resolver: zodResolver(familySchema) });
  const memberForm = useForm({ resolver: zodResolver(memberSchema) });

  // ── Refresh desde API ──────────────────────────────────────────────────────
  const refreshFamily = useCallback(async () => {
    if (!family?.familyId) return;
    const updated = await getFamilyById(family.familyId);
    if (updated) setFamily(updated);
  }, [family?.familyId]);

  // ── Guard ──────────────────────────────────────────────────────────────────
  if (!family) {
    return (
      <div className="p-8 flex flex-col items-center justify-center">
        <p className="text-gray-500">No se encontraron datos de la familia.</p>
        <Button className="mt-4" onClick={() => navigate(-1)}>Volver</Button>
      </div>
    );
  }

  // ── Familia: editar ────────────────────────────────────────────────────────
  const openFamilyEdit = () => {
    familyForm.reset({
      lastName: family.lastName,
      sector: family.sector ?? "",
      address: family.address ?? "",
    });
    setFamilyModal(true);
  };

  const handleFamilyUpdate = async (values) => {
    setLoading(true);
    setError(null);
    try {
      await updateFamily(family.familyId, values);
      setFamily((prev) => ({ ...prev, ...values }));
      setFamilyModal(false);
    } catch (err) {
      console.error(err);
      setError("No se pudo actualizar la familia.");
    } finally {
      setLoading(false);
    }
  };

  // ── Familia: eliminar ──────────────────────────────────────────────────────
  const handleFamilyDelete = async () => {
    if (!window.confirm("¿Eliminar esta familia?")) return;
    try {
      await deleteFamily(family.familyId);
      navigate("/home/families");
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la familia.");
    }
  };

  // ── Miembro: abrir modal ───────────────────────────────────────────────────
  const openMember = (member = null) => {
    setMemberModal({ open: true, member });
    memberForm.reset(
      member
        ? {
            ...member,
            firstName: member.firstName ?? member.FirstName ?? "",
            lastName: member.lastName ?? member.LastName ?? "",
            gender: member.gender ?? member.Gender ?? "",
            maritalStatus: member.maritalStatus ?? member.MaritalStatus ?? "",
            birthDate: member.birthDate ?? member.BirthDate
              ? dayjs(member.birthDate ?? member.BirthDate).format("YYYY-MM-DD")
              : "",
            email: member.email ?? member.Email ?? "",
            phoneNumber: member.phoneNumber ?? member.PhoneNumber ?? "",
            familyId: family.familyId,
            relationship: member.relationship ?? member.Relationship ?? "",
          }
        : { familyId: family.familyId, relationship: "" }
    );
  };

  // ── Miembro: guardar ───────────────────────────────────────────────────────
  const handleMemberSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...values,
        familyId: family.familyId,
        birthDate: dayjs(values.birthDate).toISOString(),
        photoUrl: values.photoUrl ?? "",
      };
      if (memberModal.member) {
        await updateMember(memberModal.member.memberId, payload);
      } else {
        await createMember(payload);
      }
      await refreshFamily();
      setMemberModal({ open: false, member: null });
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el miembro.");
    } finally {
      setLoading(false);
    }
  };

  // ── Miembro: eliminar ──────────────────────────────────────────────────────
  const handleMemberDelete = async (memberId) => {
    if (!window.confirm("¿Eliminar este miembro?")) return;
    try {
      await deleteMember(memberId);
      await refreshFamily();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el miembro.");
    }
  };

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center p-6">
      <div className="w-full max-w-3xl bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">

        {/* BACK */}
        <button
          className="mb-4 text-sm text-white bg-gray-900 hover:bg-gray-700 py-1 px-4 rounded-lg"
          onClick={() => navigate(-1)}
        >
          ← Volver
        </button>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {/* HEADER FAMILIA */}
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Familia {family.lastName}
          </h1>
          <div className="flex gap-2">
            <Button size="icon" variant="ghost" onClick={openFamilyEdit}>
              <Pencil className="h-4 w-4" />
            </Button>
            <Button size="icon" variant="ghost" onClick={handleFamilyDelete}>
              <Trash2 className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        </div>

        {/* META FAMILIA */}
        <div className="flex flex-wrap gap-3 text-sm text-gray-500 mb-6 border-b pb-4">
          {family.sector && <span>📍 {family.sector}</span>}
          {family.address && <span>🏠 {family.address}</span>}
          <span>📅 {formatDate(family.createdAt ?? family.CreatedAt)}</span>
        </div>

        {/* MIEMBROS */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Miembros
          </h2>
          <Button size="sm" onClick={() => openMember()}>
            <Plus className="mr-2 h-4 w-4" /> Agregar
          </Button>
        </div>

        {!family.members?.length && (
          <p className="text-gray-500 text-sm">No hay miembros en esta familia.</p>
        )}

        <div className="space-y-3">
          {family.members?.map((member) => {
            const memberId = member.memberId ?? member.MemberId;
            const firstName = member.firstName ?? member.FirstName ?? "Sin nombre";
            const lastName = member.lastName ?? member.LastName ?? "";
            const phone = member.phoneNumber ?? member.PhoneNumber;
            const email = member.email ?? member.Email;
            const birthDate = member.birthDate ?? member.BirthDate;
            const relationship = member.relationship ?? member.Relationship;

            return (
              <div
                key={memberId}
                className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 shadow-sm hover:shadow-md transition"
              >
                <div className="flex justify-between items-start">
                  {/* Info — click navega al detalle del miembro */}
                  <Link
                    to={`/home/member/${memberId}`}
                    state={{ member }}
                    className="flex items-center gap-3 flex-1 min-w-0"
                  >
                    <UserCircle className="h-10 w-10 text-gray-400 shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400">
                        {firstName} {lastName}
                      </p>
                      {relationship && (
                        <span className="inline-block text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full mb-1">
                          {relationship}
                        </span>
                      )}
                      <p className="text-sm text-gray-500 truncate">{phone ?? "Sin teléfono"}</p>
                      <p className="text-sm text-gray-500 truncate">{email ?? "Sin email"}</p>
                      {birthDate && (
                        <p className="text-xs text-gray-400 mt-0.5">🎂 {formatDate(birthDate)}</p>
                      )}
                    </div>
                  </Link>

                  {/* Acciones */}
                  <div className="flex gap-1 ml-2 shrink-0">
                    <Button size="icon" variant="ghost" onClick={() => openMember(member)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => handleMemberDelete(memberId)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── MODAL EDITAR FAMILIA ─────────────────────────────────────────── */}
        <Dialog open={familyModal} onOpenChange={setFamilyModal}>
          <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-md">
            <DialogHeader>
              <DialogTitle>Editar Familia</DialogTitle>
              <DialogDescription>Modifica los datos de la familia.</DialogDescription>
            </DialogHeader>
            <form onSubmit={familyForm.handleSubmit(handleFamilyUpdate)} className="space-y-4 mt-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Apellido</label>
                <Input placeholder="Apellido" {...familyForm.register("lastName")} />
                {familyForm.formState.errors.lastName && (
                  <p className="text-xs text-red-500">{familyForm.formState.errors.lastName.message}</p>
                )}
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Sector</label>
                <Input placeholder="Sector" {...familyForm.register("sector")} />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium">Dirección</label>
                <Input placeholder="Dirección" {...familyForm.register("address")} />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setFamilyModal(false)}>Cancelar</Button>
                <Button type="submit" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Guardar
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* ── MODAL MIEMBRO ────────────────────────────────────────────────── */}
        <Dialog open={memberModal.open} onOpenChange={(open) => setMemberModal((p) => ({ ...p, open }))}>
          <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-md max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{memberModal.member ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
              <DialogDescription>Ingresa los datos del miembro.</DialogDescription>
            </DialogHeader>
            <form onSubmit={memberForm.handleSubmit(handleMemberSubmit)} className="space-y-3 mt-2">

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Nombre</label>
                  <Input placeholder="Nombre" {...memberForm.register("firstName")} />
                  {memberForm.formState.errors.firstName && (
                    <p className="text-xs text-red-500">{memberForm.formState.errors.firstName.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Apellido</label>
                  <Input placeholder="Apellido" {...memberForm.register("lastName")} />
                  {memberForm.formState.errors.lastName && (
                    <p className="text-xs text-red-500">{memberForm.formState.errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-sm font-medium">Género</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800"
                    {...memberForm.register("gender")}
                  >
                    <option value="">Seleccionar</option>
                    {GENDERS.map((g) => <option key={g} value={g}>{g === "M" ? "Masculino" : "Femenino"}</option>)}
                  </select>
                  {memberForm.formState.errors.gender && (
                    <p className="text-xs text-red-500">{memberForm.formState.errors.gender.message}</p>
                  )}
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium">Estado Civil</label>
                  <select
                    className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800"
                    {...memberForm.register("maritalStatus")}
                  >
                    <option value="">Seleccionar</option>
                    {MARITAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                  {memberForm.formState.errors.maritalStatus && (
                    <p className="text-xs text-red-500">{memberForm.formState.errors.maritalStatus.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Fecha de Nacimiento</label>
                <Input type="date" {...memberForm.register("birthDate")} />
                {memberForm.formState.errors.birthDate && (
                  <p className="text-xs text-red-500">{memberForm.formState.errors.birthDate.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Relación con la familia</label>
                <select
                  className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800"
                  {...memberForm.register("relationship")}
                >
                  <option value="">Seleccionar relación</option>
                  {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
                {memberForm.formState.errors.relationship && (
                  <p className="text-xs text-red-500">{memberForm.formState.errors.relationship.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Email</label>
                <Input placeholder="correo@ejemplo.com" {...memberForm.register("email")} />
                {memberForm.formState.errors.email && (
                  <p className="text-xs text-red-500">{memberForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-1">
                <label className="text-sm font-medium">Teléfono</label>
                <Input placeholder="809-000-0000" {...memberForm.register("phoneNumber")} />
              </div>

              {/* familyId oculto */}
              <input type="hidden" {...memberForm.register("familyId")} />

              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setMemberModal({ open: false, member: null })}>
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
