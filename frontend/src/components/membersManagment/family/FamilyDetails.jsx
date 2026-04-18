import React, { useState, useCallback } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import dayjs from "dayjs";
import { Pencil, Trash2, Loader2, Plus, UserCircle, Users, CalendarDays, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

import updateFamily from "@/apiServices/families/updateFamily";
import deleteFamily from "@/apiServices/families/deleteFamily";
import getFamilyById from "@/apiServices/families/getFamilyById";
import createMember from "@/apiServices/members/createMember";
import updateMember from "@/apiServices/members/updateMember";
import deleteMember from "@/apiServices/members/deleteMember";

// ─── Constantes ───────────────────────────────────────────────────────────────

const RELATIONSHIPS = [
  "Padre","Madre","Hijo","Hija","Abuelo","Abuela","Nieto","Nieta",
  "Hermano","Hermana","Tío","Tía","Sobrino","Sobrina","Primo","Prima",
  "Cónyuge","Suegro","Suegra","Yerno","Nuera","Cuñado","Cuñada",
  "Padrastro","Madrastra","Hijastro","Hijastra","Tutor","Pupilo","Otro",
];
const GENDERS = [{ value: "M", label: "Masculino" }, { value: "F", label: "Femenino" }];
const MARITAL_STATUSES = ["Soltero","Casado","Viudo","Divorciado"];
const MEMBER_TYPES = ["Comunion","Activos","Pasivos","Visitantes","Ministeriales","Catecumenos","Adherentes"];
const ACADEMIC_LEVELS = ["Primaria","Secundaria","Grado","Postgrado"];

// ─── Schemas ──────────────────────────────────────────────────────────────────

// La tabla family solo tiene lastName (familyId y createdAt son auto)
const familySchema = z.object({
  lastName: z.string().min(2, "Mínimo 2 caracteres").max(100, "Máximo 100 caracteres"),
});

const memberSchema = z.object({
  firstName:            z.string().min(2, "Mínimo 2 caracteres"),
  secondName:           z.string().optional(),
  lastName:             z.string().min(2, "Mínimo 2 caracteres"),
  secondLastName:       z.string().optional(),
  gender:               z.string().min(1, "Requerido"),
  birthDate:            z.string().min(1, "Requerido"),
  maritalStatus:        z.string().min(1, "Requerido"),
  relationship:         z.string().min(1, "Requerido"),
  email:                z.string().email("Email inválido").optional().or(z.literal("")),
  phoneNumber:          z.string().optional(),
  nationalId:           z.string().optional(),
  address:              z.string().optional(),
  bloodType:            z.string().optional(),
  medicalCondition:     z.string().optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone:z.string().optional(),
  memberType:           z.string().optional(),
  academicLevel:        z.string().optional(),
  profession:           z.string().optional(),
  occupation:           z.string().optional(),
  baptized:             z.boolean().default(false),
  baptismDate:          z.string().optional(),
  baptismPlace:         z.string().optional(),
  familyId:             z.coerce.number(),
});

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (d) => d ? dayjs(d).format("DD MMM YYYY") : "—";

const InfoBadge = ({ label, value }) => value ? (
  <div className="flex flex-col">
    <span className="text-xs text-gray-500 uppercase">{label}</span>
    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">{value}</span>
  </div>
) : null;

// ─── Component ────────────────────────────────────────────────────────────────

export default function FamilyDetails() {
  const location = useLocation();
  const navigate = useNavigate();

  const [family, setFamily] = useState(location.state?.family ?? null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [familyModal, setFamilyModal] = useState(false);
  const [memberModal, setMemberModal] = useState({ open: false, member: null });

  const familyForm = useForm({ resolver: zodResolver(familySchema) });
  const memberForm = useForm({ resolver: zodResolver(memberSchema) });

  const refreshFamily = useCallback(async () => {
    if (!family?.familyId) return;
    const updated = await getFamilyById(family.familyId);
    if (updated) setFamily(updated);
  }, [family?.familyId]);

  if (!family) {
    return (
      <div className="p-8 flex flex-col items-center justify-center gap-4">
        <p className="text-gray-500">No se encontraron datos de la familia.</p>
        <Button onClick={() => navigate(-1)}>Volver</Button>
      </div>
    );
  }

  // ── Familia ────────────────────────────────────────────────────────────────

  const openFamilyEdit = () => {
    familyForm.reset({ lastName: family.lastName });
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

  const handleFamilyDelete = async () => {
    if (!window.confirm("¿Eliminar esta familia y todos sus vínculos?")) return;
    try {
      await deleteFamily(family.familyId);
      navigate("/home/families");
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la familia.");
    }
  };

  // ── Miembro ────────────────────────────────────────────────────────────────

  const openMember = (member = null) => {
    setMemberModal({ open: true, member });
    if (member) {
      memberForm.reset({
        firstName:             member.firstName ?? "",
        secondName:            member.secondName ?? "",
        lastName:              member.lastName ?? "",
        secondLastName:        member.secondLastName ?? "",
        gender:                member.gender ?? "",
        birthDate:             member.birthDate ? dayjs(member.birthDate).format("YYYY-MM-DD") : "",
        maritalStatus:         member.maritalStatus ?? "",
        relationship:          member.relationship ?? "",
        email:                 member.email ?? "",
        phoneNumber:           member.phoneNumber ?? "",
        nationalId:            member.nationalId ?? "",
        address:               member.address ?? "",
        bloodType:             member.bloodType ?? "",
        medicalCondition:      member.medicalCondition ?? "",
        emergencyContactName:  member.emergencyContactName ?? "",
        emergencyContactPhone: member.emergencyContactPhone ?? "",
        memberType:            member.memberType ?? "",
        academicLevel:         member.academicLevel ?? "",
        profession:            member.profession ?? "",
        occupation:            member.occupation ?? "",
        baptized:              member.baptized ?? false,
        baptismDate:           member.baptismDate ? dayjs(member.baptismDate).format("YYYY-MM-DD") : "",
        baptismPlace:          member.baptismPlace ?? "",
        familyId:              family.familyId,
      });
    } else {
      memberForm.reset({ familyId: family.familyId, baptized: false });
    }
  };

  const handleMemberSubmit = async (values) => {
    setLoading(true);
    setError(null);
    try {
      const payload = {
        ...values,
        familyId:   family.familyId,
        birthDate:  dayjs(values.birthDate).toISOString(),
        baptismDate:values.baptismDate ? dayjs(values.baptismDate).toISOString() : null,
        photoUrl:   memberModal.member?.photoUrl ?? "",
        memberType: values.memberType || null,
        academicLevel: values.academicLevel || null,
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

  const members = family.members ?? [];

  // ─── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-950 flex justify-center p-6">
      <div className="w-full max-w-3xl space-y-4">

        <button
          className="text-sm text-white bg-blue-900 hover:bg-blue-800 py-1 px-4 rounded-lg transition"
          onClick={() => navigate(-1)}
        >
          ⇐ Volver
        </button>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 text-red-700 dark:text-red-300 text-sm px-4 py-3 rounded-xl">
            {error}
          </div>
        )}

        {/* CARD FAMILIA */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-900 to-gray-700 p-6">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-2xl font-bold text-white">Familia {family.lastName}</h1>
                <p className="text-gray-400 text-sm mt-1">
                  Registrada el {fmt(family.createdAt ?? family.CreatedAt)}
                </p>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="text-white hover:bg-white/20" onClick={openFamilyEdit}>
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" className="text-red-300 hover:bg-white/20" onClick={handleFamilyDelete}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="flex gap-4 mt-3 text-sm text-gray-300">
              <span className="flex items-center gap-1"><Hash className="h-3 w-3" /> ID: {family.familyId}</span>
              <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {members.length} miembro{members.length !== 1 ? "s" : ""}</span>
            </div>
          </div>
        </div>

        {/* MIEMBROS */}
        <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Miembros</h2>
            <Button size="sm" onClick={() => openMember()}>
              <Plus className="mr-2 h-4 w-4" /> Agregar
            </Button>
          </div>

          {members.length === 0 && (
            <p className="text-gray-500 text-sm">No hay miembros en esta familia.</p>
          )}

          <div className="space-y-3">
            {members.map((member) => {
              const mid = member.memberId;
              const fullName = [member.firstName, member.secondName, member.lastName, member.secondLastName]
                .filter(Boolean).join(" ");

              return (
                <div key={mid} className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800 hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <Link
                      to={`/home/member/${mid}`}
                      state={{ member }}
                      className="flex items-center gap-3 flex-1 min-w-0"
                    >
                      <UserCircle className="h-11 w-11 text-gray-400 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400 truncate">
                          {fullName || "Sin nombre"}
                        </p>
                        <div className="flex flex-wrap gap-1 mt-0.5">
                          {member.relationship && (
                            <span className="text-xs bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded-full">
                              {member.relationship}
                            </span>
                          )}
                          {member.memberType && (
                            <span className="text-xs bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full">
                              {member.memberType}
                            </span>
                          )}
                          {member.isActive !== undefined && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${member.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                              {member.isActive ? "Activo" : "Inactivo"}
                            </span>
                          )}
                        </div>
                          
                      </div>
                    </Link>
                    <div className="flex gap-1 ml-2 shrink-0">
                      <Button size="icon" variant="ghost" onClick={() => openMember(member)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleMemberDelete(mid)}>
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── MODAL EDITAR FAMILIA ──────────────────────────────────────────── */}
        <Dialog open={familyModal} onOpenChange={setFamilyModal}>
          <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-sm">
            <DialogHeader>
              <DialogTitle>Editar Familia</DialogTitle>
              <DialogDescription>Solo se puede modificar el apellido de la familia.</DialogDescription>
            </DialogHeader>
            <form onSubmit={familyForm.handleSubmit(handleFamilyUpdate)} className="space-y-4 mt-2">
              <div className="space-y-1">
                <label className="text-sm font-medium">Apellido</label>
                <Input placeholder="Apellido" {...familyForm.register("lastName")} />
                {familyForm.formState.errors.lastName && (
                  <p className="text-xs text-red-500">{familyForm.formState.errors.lastName.message}</p>
                )}
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

        {/* ── MODAL MIEMBRO ─────────────────────────────────────────────────── */}
        <Dialog open={memberModal.open} onOpenChange={(open) => setMemberModal((p) => ({ ...p, open }))}>
          <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{memberModal.member ? "Editar Miembro" : "Nuevo Miembro"}</DialogTitle>
              <DialogDescription>Ingresa los datos del miembro de la familia.</DialogDescription>
            </DialogHeader>

            <form onSubmit={memberForm.handleSubmit(handleMemberSubmit)} className="space-y-5 mt-2">

              {/* Identidad */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Identidad</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Primer Nombre *</label>
                    <Input placeholder="Nombre" {...memberForm.register("firstName")} />
                    {memberForm.formState.errors.firstName && <p className="text-xs text-red-500">{memberForm.formState.errors.firstName.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Segundo Nombre</label>
                    <Input placeholder="Segundo nombre" {...memberForm.register("secondName")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Primer Apellido *</label>
                    <Input placeholder="Apellido" {...memberForm.register("lastName")} />
                    {memberForm.formState.errors.lastName && <p className="text-xs text-red-500">{memberForm.formState.errors.lastName.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Segundo Apellido</label>
                    <Input placeholder="Segundo apellido" {...memberForm.register("secondLastName")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Cédula / ID</label>
                    <Input placeholder="000-0000000-0" {...memberForm.register("nationalId")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Relación con la familia *</label>
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800" {...memberForm.register("relationship")}>
                      <option value="">Seleccionar</option>
                      {RELATIONSHIPS.map((r) => <option key={r} value={r}>{r}</option>)}
                    </select>
                    {memberForm.formState.errors.relationship && <p className="text-xs text-red-500">{memberForm.formState.errors.relationship.message}</p>}
                  </div>
                </div>
              </div>

              {/* Datos personales */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Datos Personales</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Género *</label>
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800" {...memberForm.register("gender")}>
                      <option value="">Seleccionar</option>
                      {GENDERS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
                    </select>
                    {memberForm.formState.errors.gender && <p className="text-xs text-red-500">{memberForm.formState.errors.gender.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Estado Civil *</label>
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800" {...memberForm.register("maritalStatus")}>
                      <option value="">Seleccionar</option>
                      {MARITAL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {memberForm.formState.errors.maritalStatus && <p className="text-xs text-red-500">{memberForm.formState.errors.maritalStatus.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Fecha de Nacimiento *</label>
                    <Input type="date" {...memberForm.register("birthDate")} />
                    {memberForm.formState.errors.birthDate && <p className="text-xs text-red-500">{memberForm.formState.errors.birthDate.message}</p>}
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Tipo de Sangre</label>
                    <Input placeholder="Ej: O+" {...memberForm.register("bloodType")} />
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Contacto</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Teléfono</label>
                    <Input placeholder="809-000-0000" {...memberForm.register("phoneNumber")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Email</label>
                    <Input placeholder="correo@ejemplo.com" {...memberForm.register("email")} />
                    {memberForm.formState.errors.email && <p className="text-xs text-red-500">{memberForm.formState.errors.email.message}</p>}
                  </div>
                  <div className="col-span-2 space-y-1">
                    <label className="text-sm font-medium">Dirección</label>
                    <Input placeholder="Calle, sector..." {...memberForm.register("address")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Contacto de Emergencia</label>
                    <Input placeholder="Nombre" {...memberForm.register("emergencyContactName")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Teléfono de Emergencia</label>
                    <Input placeholder="809-000-0000" {...memberForm.register("emergencyContactPhone")} />
                  </div>
                </div>
              </div>

              {/* Membresía */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Membresía</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Tipo de Miembro</label>
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800" {...memberForm.register("memberType")}>
                      <option value="">Seleccionar</option>
                      {MEMBER_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Fecha de Ingreso</label>
                    <Input type="date" {...memberForm.register("joinDate")} />
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <input type="checkbox" id="baptized" className="rounded" {...memberForm.register("baptized")} />
                    <label htmlFor="baptized" className="text-sm font-medium cursor-pointer">Bautizado</label>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Fecha de Bautismo</label>
                    <Input type="date" {...memberForm.register("baptismDate")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Lugar de Bautismo</label>
                    <Input placeholder="Iglesia..." {...memberForm.register("baptismPlace")} />
                  </div>
                </div>
              </div>

              {/* Educación y trabajo */}
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Educación y Trabajo</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Nivel Académico</label>
                    <select className="w-full border rounded-md px-3 py-2 text-sm bg-white dark:bg-gray-800" {...memberForm.register("academicLevel")}>
                      <option value="">Seleccionar</option>
                      {ACADEMIC_LEVELS.map((a) => <option key={a} value={a}>{a}</option>)}
                    </select>
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Profesión</label>
                    <Input placeholder="Ej: Ingeniero" {...memberForm.register("profession")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Ocupación</label>
                    <Input placeholder="Ej: Empleado" {...memberForm.register("occupation")} />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-medium">Condición Médica</label>
                    <Input placeholder="Opcional" {...memberForm.register("medicalCondition")} />
                  </div>
                </div>
              </div>

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
