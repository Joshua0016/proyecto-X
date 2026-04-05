import React, { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

import getAllFamilies from "@/apiServices/families/getAllFamilies";
import createFamily from "@/apiServices/families/createFamily";
import updateFamily from "@/apiServices/families/updateFamily";
import deleteFamily from "@/apiServices/families/deleteFamily";
import searchFamilies from "@/apiServices/families/searchFamilies";

import createMember from "@/apiServices/members/createMember";
import updateMember from "@/apiServices/members/updateMember";
import deleteMember from "@/apiServices/members/deleteMember";
import getAllMembers from "@/apiServices/members/getAllMembers";

// Schemas
const memberSchema = z.object({
  memberId: z.number().optional(),
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.email().optional(),
  phoneNumber: z.string().optional(),
  birthDate: z.string().optional(),
  familyId: z.number(),
  photoUrl: z.string().optional(),
});

const familySchema = z.object({
  lastName: z.string().min(2),
  sector: z.string().optional(),
  address: z.string().optional(),
  createdAt: z.string().optional(),
  familyId: z.number().optional(),
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

  //  Busqueda de rebote
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

                  <div className="grid grid-cols-12 gap-2">

                    <div className="col-span-2 font-semibold text-gray-900 dark:text-gray-100 truncate">
                      {family.lastName || "Sin nombre"}
                    </div>

                    <div className="col-span-2 text-sm text-gray-900 dark:text-gray-100 truncate">
                      {family.sector || "Sin sector"}
                    </div>

                    <div className="col-span-3 text-sm text-gray-900 dark:text-gray-100 truncate">
                      {family.address || "Sin dirección"}
                    </div>

                    <div className="col-span-2 text-sm text-gray-900 dark:text-gray-100 truncate">
                      {family.createdAt || "Sin fecha"}
                    </div>

                    <div className="col-span-1 text-sm text-gray-900 dark:text-gray-100 truncate text-center">
                      {family.familyId || "Sin ID"}
                    </div>

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

              <AccordionContent className="p-3 border rounded mb-2 bg-white dark:bg-gray-900">


                <div className="flex justify-between mb-4">

                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Id
                  </h4>

                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Nombre
                  </h4>

                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Apellido
                  </h4>

                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Telefono
                  </h4>

                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Correo Electronico
                  </h4>

                  <h4 className="font-semibold text-gray-900 dark:text-gray-100">
                    Naciomiento
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
                    <div key={`member-${mid}-${index}`}>

                      <div className="flex justify-between">

                        <div className="flex-1 text-left grid grid-cols-12 gap-2">

                          <div className="grid col-span-1 text-xs text-gray-600 dark:text-gray-400 truncate">
                            {member.memberId || "Sin ID"}
                          </div>

                          <div className="grid col-span-2 text-gray-900 dark:text-gray-100 truncate">
                            {member.firstName || "Sin nombre"}
                          </div>

                          <div className="grid col-span-2 text-gray-900 dark:text-gray-100 truncate">
                            {member.lastName || "Sin apellido"}
                          </div>

                          <div className="grid col-span-2 text-xs text-gray-600 dark:text-gray-400 truncate">
                            {member.phoneNumber || "Sin teléfono"}
                          </div>

                          <div className="grid col-span-2 text-xs text-gray-600 dark:text-gray-400 truncate">
                            {member.email || "Sin email"}
                          </div>

                          <div className="grid col-span-2 text-xs text-gray-600 dark:text-gray-400 truncate">
                            {member.birthDate || "Sin cumpleaños"}
                          </div>

                        </div>


                        <div className="flex gap-2 ml-2">
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
            <Input placeholder="Dirección" {...familyForm.register("address")} />

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
            <Input placeholder="ID Familia" {...memberForm.register("familyId")} />
            <Input placeholder="Cumpleaños" {...memberForm.register("birthday")} />

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