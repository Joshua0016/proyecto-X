import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

// UI
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

// Services
import getAllFamilies from "@/apiServices/families/getAllFamilies";
import createFamily from "@/apiServices/families/createFamily";
import updateFamily from "@/apiServices/families/updateFamily";
import deleteFamily from "@/apiServices/families/deleteFamily";
import searchFamilies from "@/apiServices/families/searchFamilies";

import createMember from "@/apiServices/members/createMember";
import updateMember from "@/apiServices/members/updateMember";
import deleteMember from "@/apiServices/members/deleteMember";

// Schemas
const memberSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phoneNumber: z.string().optional(),
  birthDate: z.string().optional(),
});

const familySchema = z.object({
  lastName: z.string().min(2),
  sector: z.string().optional(),
});

export default function Family() {
  const [families, setFamilies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  const [memberModal, setMemberModal] = useState({ open: false, id: null, member: null });
  const [familyModal, setFamilyModal] = useState({ open: false, family: null });

  const memberForm = useForm({ resolver: zodResolver(memberSchema) });
  const familyForm = useForm({ resolver: zodResolver(familySchema) });

  const fetchFamilies = async () => {
    setLoading(true);
    const data = await getAllFamilies();
    setFamilies(data);
    setLoading(false);
  };

  useEffect(() => { fetchFamilies(); }, []);

  // 🔍 debounce search
  useEffect(() => {
    const delay = setTimeout(() => {
      if (!searchTerm.trim()) {
        fetchFamilies();
      } else {
        handleSearch(searchTerm);
      }
    }, 400);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleSearch = async (term) => {
    const results = await searchFamilies(term);
    setFamilies(results);
  };

  const filteredFamilies = useMemo(() => families, [families]);

  // CRUD
  const openFamily = (family = null) => {
    setFamilyModal({ open: true, family });
    family ? familyForm.reset(family) : familyForm.reset({});
  };

  const openMember = (id, member = null) => {
    setMemberModal({ open: true, id, member });
    member ? memberForm.reset(member) : memberForm.reset({});
  };

  const submitFamily = async (values) => {
    setLoading(true);
    if (familyModal.family) {
      await updateFamily(familyModal.family.id, values);
    } else {
      await createFamily(values);
    }
    await fetchFamilies();
    setFamilyModal({ open: false, family: null });
    setLoading(false);
  };

  const submitMember = async (values) => {
    setLoading(true);
    if (memberModal.member) {
      await updateMember({ ...values, memberId: memberModal.member.memberId });
    } else {
      await createMember({ ...values, id: memberModal.id });
    }
    await fetchFamilies();
    setMemberModal({ open: false, id: null, member: null });
    setLoading(false);
  };

  const removeFamily = async (id) => {
    if (!confirm("Eliminar familia?")) return;
    await deleteFamily(id);
    fetchFamilies();
  };

  const removeMember = async (id) => {
    if (!confirm("Eliminar miembro?")) return;
    await deleteMember(id);
    fetchFamilies();
  };

  return (
    <div className="p-8 max-w-5xl mx-auto text-gray-900 dark:text-gray-100">

      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          Familias
        </h1>

        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
              placeholder="Buscar..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button onClick={() => openFamily()}>
            <Plus className="mr-2 h-4 w-4" /> Nueva
          </Button>
        </div>
      </div>

      {loading && <Loader2 className="animate-spin mx-auto" />}

      {/* LISTA */}
      <Accordion type="single" collapsible className="space-y-4">
        {filteredFamilies.map((family, index) => {
          const id = family.id ?? index;

          return (
            <AccordionItem key={`family-${id}-${index}`} value={`f-${id}-${index}`}>

              <div className="flex justify-between items-center">

                <AccordionTrigger className="flex-1 text-left">
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-gray-100">
                      Familia {family.lastName || "Sin nombre"}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {family.sector}
                    </p>
                  </div>
                </AccordionTrigger>

                <div className="flex gap-2 ml-2">
                  <Button size="icon" variant="ghost" onClick={() => openFamily(family)}>
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <Button size="icon" variant="ghost" onClick={() => removeFamily(family.id)}>
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>

              </div>

              <AccordionContent>

                <div className="flex justify-between mb-4">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Miembros
                  </h4>
                  <Button size="sm" onClick={() => openMember(family.id)}>
                    <Plus className="mr-2 h-4 w-4" /> Agregar
                  </Button>
                </div>

                {!family.members?.length && (
                  <p className="text-sm text-gray-500">No hay miembros</p>
                )}

                {family.members?.map((member, index) => {
                  const mid = member.memberId ?? index;

                  return (
                    <div key={`member-${mid}-${index}`}
                      className="flex justify-between p-3 border rounded mb-2 bg-white dark:bg-gray-900">

                      <div>
                        <p className="text-gray-900 dark:text-gray-100">
                          {member.firstName} {member.lastName}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">
                          {member.phoneNumber || "Sin teléfono"}
                        </p>
                      </div>

                      <div className="flex gap-2">
                        <Button size="icon" variant="ghost"
                          onClick={() => openMember(family.id, member)}>
                          <Pencil className="h-4 w-4" />
                        </Button>

                        <Button size="icon" variant="ghost"
                          onClick={() => removeMember(member.memberId)}>
                          <Trash2 className="h-4 w-4 text-red-500" />
                        </Button>
                      </div>

                    </div>
                  );
                })}

              </AccordionContent>

            </AccordionItem>
          );
        })}
      </Accordion>

      {/* MODAL FAMILIA */}
      <Dialog open={familyModal.open} onOpenChange={(open) => setFamilyModal({ ...familyModal, open })}>
        <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>
              {familyModal.family ? "Editar Familia" : "Nueva Familia"}
            </DialogTitle>
            <DialogDescription>
              Completa la información de la familia.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={familyForm.handleSubmit(submitFamily)} className="space-y-4">
            <Input placeholder="Apellido" {...familyForm.register("lastName")} />
            <Input placeholder="Sector" {...familyForm.register("sector")} />

            <DialogFooter>
              <Button type="submit" className="w-full">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* MODAL MIEMBRO */}
      <Dialog open={memberModal.open} onOpenChange={(open) => setMemberModal({ ...memberModal, open })}>
        <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
          <DialogHeader>
            <DialogTitle>
              {memberModal.member ? "Editar Miembro" : "Nuevo Miembro"}
            </DialogTitle>
            <DialogDescription>
              Ingresa los datos del miembro.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={memberForm.handleSubmit(submitMember)} className="space-y-4">
            <Input placeholder="Nombre" {...memberForm.register("firstName")} />
            <Input placeholder="Apellido" {...memberForm.register("lastName")} />
            <Input placeholder="Email" {...memberForm.register("email")} />
            <Input placeholder="Teléfono" {...memberForm.register("phoneNumber")} />

            <DialogFooter>
              <Button type="submit" className="w-full">
                Guardar
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

    </div>
  );
}