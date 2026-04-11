import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Search, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";

import getAllFamilies from "@/apiServices/families/getAllFamilies";
import createFamily from "@/apiServices/families/createFamily";
import updateFamily from "@/apiServices/families/updateFamily";
import deleteFamily from "@/apiServices/families/deleteFamily";
import searchFamilies from "@/apiServices/families/searchFamilies";

const familySchema = z.object({
  lastName: z.string().min(2, "Mínimo 2 caracteres"),
  sector: z.string().optional(),
  address: z.string().optional(),
});

export default function Family() {
  const [families, setFamilies] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [familyModal, setFamilyModal] = useState({ open: false, family: null });
  const familyForm = useForm({ resolver: zodResolver(familySchema) });
  const location = useLocation();

  const fetchFamilies = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllFamilies();
      setFamilies(data || []);
    } catch (err) {
      console.error("Error fetching families:", err);
      setError("No se pudieron cargar las familias.");
    } finally {
      setLoading(false);
    }
  }, []);

  // Si FamilyDetails redirige con state.editFamily, abre el modal
  useEffect(() => {
    if (location.state?.editFamily) {
      openFamily(location.state.editFamily);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  useEffect(() => { fetchFamilies(); }, [fetchFamilies]);

  useEffect(() => {
    const delay = setTimeout(async () => {
      if (!searchTerm.trim()) {
        fetchFamilies();
      } else {
        try {
          const results = await searchFamilies(searchTerm);
          setFamilies(results || []);
        } catch (err) {
          console.error("Error searching families:", err);
          setError("Error al buscar familias.");
        }
      }
    }, 400);
    return () => clearTimeout(delay);
  }, [searchTerm, fetchFamilies]);

  const openFamily = (family = null) => {
    setFamilyModal({ open: true, family });
    familyForm.reset(family ? { lastName: family.lastName, sector: family.sector ?? "", address: family.address ?? "" } : {});
  };

  const submitFamily = async (values) => {
    setLoading(true);
    setError(null);
    try {
      if (familyModal.family) await updateFamily(familyModal.family.familyId, values);
      else await createFamily(values);
      await fetchFamilies();
      setFamilyModal({ open: false, family: null });
    } catch (err) {
      console.error("Error saving family:", err);
      setError("No se pudo guardar la familia.");
    } finally {
      setLoading(false);
    }
  };

  const removeFamily = async (id) => {
    if (!window.confirm("¿Eliminar esta familia?")) return;
    try {
      await deleteFamily(id);
      await fetchFamilies();
    } catch (err) {
      console.error("Error deleting family:", err);
      setError("No se pudo eliminar la familia.");
    }
  };

  return (
    <div className="p-8 max-w-3xl mx-auto text-gray-900 dark:text-gray-100">
      {/* HEADER */}
      <div className="flex justify-between mb-6">
        <h1 className="text-3xl font-bold">Familias</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2 h-4 w-4 text-gray-500" />
            <Input
              className="pl-8 bg-white dark:bg-gray-900"
              placeholder="Buscar familia..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button onClick={() => openFamily()}>
            <Plus className="mr-2 h-4 w-4" /> Nueva
          </Button>
        </div>
      </div>

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}
      {loading && <Loader2 className="animate-spin mx-auto my-4 h-8 w-8 text-blue-500" />}

      {/* LISTA */}
      <div className="space-y-1">
        {families.map((family) => (
          <div
            key={family.familyId}
            className="flex justify-between items-center py-3 px-2 border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 rounded transition"
          >
            <Link
              to={`/home/family/${family.familyId}`}
              state={{ family }}
              className="flex-1 font-semibold text-gray-900 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
            >
              Familia {family.lastName}
            </Link>

            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => openFamily(family)}>
                <Pencil className="h-4 w-4" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => removeFamily(family.familyId)}>
                <Trash2 className="h-4 w-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {!loading && families.length === 0 && (
        <p className="text-center text-gray-500 mt-8">No se encontraron familias.</p>
      )}

      {/* MODAL FAMILIA */}
      <Dialog open={familyModal.open} onOpenChange={(open) => setFamilyModal((prev) => ({ ...prev, open }))}>
        <DialogContent className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 max-w-md">
          <DialogHeader>
            <DialogTitle>{familyModal.family ? "Editar Familia" : "Nueva Familia"}</DialogTitle>
            <DialogDescription>
              {familyModal.family ? "Modifica los datos de la familia." : "Completa la información de la nueva familia."}
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={familyForm.handleSubmit(submitFamily)} className="space-y-4 mt-2">
            <div className="space-y-1">
              <label className="text-sm font-medium">Apellido</label>
              <Input placeholder="Ej: Romero" {...familyForm.register("lastName")} />
              {familyForm.formState.errors.lastName && (
                <p className="text-xs text-red-500">{familyForm.formState.errors.lastName.message}</p>
              )}
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Sector</label>
              <Input placeholder="Ej: Villa Sombrero" {...familyForm.register("sector")} />
            </div>
            <div className="space-y-1">
              <label className="text-sm font-medium">Dirección</label>
              <Input placeholder="Ej: Calle 5, Baní" {...familyForm.register("address")} />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setFamilyModal({ open: false, family: null })}>
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
