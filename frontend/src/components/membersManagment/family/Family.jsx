import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import createMember from "@/apiServices/members/createMember";
import updateMember from "@/apiServices/members/updateMember";
import deleteMember from "@/apiServices/members/deleteMember";
import getAllMembers from "@/apiServices/members/getAllMembers";

// UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Schema mejorado
const memberSchema = z.object({
  firstName: z.string().min(2, "El nombre es muy corto"),
  lastName: z.string().min(2, "El apellido es muy corto"),
  email: z.string().email("Correo inválido").optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  birthDate: z.string().refine(val => !isNaN(Date.parse(val)), {
    message: "Fecha inválida",
  }),
});

export default function Family() {
  const [families, setFamilies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  //  Modal unificado
  const [modalState, setModalState] = useState({
    open: false,
    familyId: null,
    member: null,
  });

  const form = useForm({
    resolver: zodResolver(memberSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      birthDate: "",
    },
  });

  //  API BASE
  const API = "/api/families";

  //   Fetch inicial
  const fetchFamilies = async () => {
    try {
      setLoading(true);
      const res = await fetch(API);
      if (!res.ok) throw new Error("Error al cargar familias");
      const data = await res.json();
      setFamilies(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFamilies();
  }, []);

  //  Filtrado optimizado
  const filteredFamilies = useMemo(() => {
    return families.filter(f =>
      (f.familyName || "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [families, searchTerm]);

  //  Abrir modal
  const openModal = (familyId, member = null) => {
    setModalState({ open: true, familyId, member });

    if (member) {
      form.reset(member);
    } else {
      form.reset({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        birthDate: "",
      });
    }
  };

  //  Crear o editar
  const onSubmit = async (values) => {
    try {
      setLoading(true);

      const isEdit = modalState.member;

      const url = isEdit
        ? `${API}/members/${modalState.member.memberId}`
        : `${API}/${modalState.familyId}/members`;

      const method = isEdit ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (!res.ok) throw new Error("Error al guardar");

      await fetchFamilies();
      setModalState({ open: false, familyId: null, member: null });

    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  //  Eliminar
  const deleteMember = async (memberId) => {
    if (!confirm("¿Seguro que deseas eliminar este miembro?")) return;

    try {
      setLoading(true);

      const res = await fetch(`${API}/members/${memberId}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar");

      await fetchFamilies();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Familias</h1>

        <div className="flex gap-3">
          <div className="relative w-64">
            <Search className="absolute left-2 top-2.5 h-4 w-4" />
            <Input
              placeholder="Buscar..."
              className="pl-8 bg-background text-foreground placeholder:text-muted-foreground"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button>
            <Plus className="h-4 w-4 mr-2" /> Nueva Familia
          </Button>
        </div>
      </div>

      {/* ESTADOS */}
      {loading && (
        <div className="flex justify-center py-10">
          <Loader2 className="animate-spin" />
        </div>
      )}

      {error && <p className="text-red-500">{error}</p>}

      {/* LISTA */}
      <Accordion type="single" collapsible className="space-y-4">
        {filteredFamilies.map((family) => (
          <AccordionItem key={family.familyId} value={`f-${family.familyId}`}>
            <AccordionTrigger>
              <div>
                <p className="font-semibold">Familia {family.familyName}</p>
                <p className="text-sm text-muted-foreground">{family.sector}</p>
              </div>
            </AccordionTrigger>

            <AccordionContent>
              <div className="flex justify-between mb-4">
                <h4>Miembros</h4>
                <Button size="sm" onClick={() => openModal(family.familyId)}>
                  <Plus className="h-4 w-4 mr-2" /> Agregar
                </Button>
              </div>

              {family.members?.map((member) => (
                <div key={member.memberId} className="flex justify-between p-3 border rounded mb-2">
                  <div>
                    <p>{member.firstName} {member.lastName}</p>
                    <p className="text-xs">{member.phoneNumber || "Sin teléfono"}</p>
                  </div>

                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openModal(family.familyId, member)}>
                      <Pencil className="h-4 w-4" />
                    </Button>

                    <Button size="icon" variant="ghost" onClick={() => deleteMember(member.memberId)}>
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      {/* MODAL */}
      <Dialog open={modalState.open} onOpenChange={(open) => setModalState(prev => ({ ...prev, open }))}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {modalState.member ? "Editar Miembro" : "Nuevo Miembro"}
            </DialogTitle>
          </DialogHeader>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">

              <div className="grid grid-cols-2 gap-4">
                <FormField name="firstName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="lastName" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Apellido</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <FormField name="email" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl><Input type="email" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="grid grid-cols-2 gap-4">
                <FormField name="phoneNumber" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Teléfono</FormLabel>
                    <FormControl><Input {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />

                <FormField name="birthDate" control={form.control} render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha</FormLabel>
                    <FormControl><Input type="date" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>

              <DialogFooter>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
                  {modalState.member ? "Guardar Cambios" : "Registrar"}
                </Button>
              </DialogFooter>

            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}