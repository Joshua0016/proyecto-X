"use client"

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Plus, SearchX, Trash2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"


const familyFormSchema = z.object({
  familyName: z.string().min(2, "El nombre de la familia es obligatorio"),
  members: z.array(
    z.object({
      relationship: z.string().min(1, "Seleccione parentesco"),//de seleccion
      firstName: z.string().trim().min(2, "Nombre obligatorio").max(25, "Máximo 25 caracteres"),
      lastName: z.string().trim().min(2, "Apellido obligatorio").max(25, "Máximo 25 caracteres"),
      nationality: z.string().optional(),//de seleccion
      sex: z.string(),//de seleccion
      academicLevel: z.string().trim().min(2, "Nivel académico obligatorio").optional(),//de seleccion
      occupation: z.string().trim().min(2, "Ocupación obligatoria").optional(),
      profession: z.string().trim().min(2, "Profesión obligatoria").optional(),
      idCard: z.string().transform(val => val.replace(/\D/g, ""))
        .pipe(z.string().regex(/^\d{11}$/, "La cédula debe tener 11 dígitos")).optional(),
      passport: z.string().toUpperCase()
        .regex(/^[A-Z]\d{7}$/, "Formato de pasaporte inválido (ej: RD1234567 o A1234567)").optional(),
      birthDate: z.coerce.date().optional(),//calendario
      district: z.string().trim().max(500, "Máximo 500 caracteres").optional(),//de seleccion
      sector: z.string().trim().min(3).optional(),//de seleccion
      address: z.string().trim().max(500, "Máximo 500 caracteres").optional(),
      phoneNumber: z.string().regex(/^\d{10}$/, "El número debe tener exactamente 10 dígitos").optional(),
      emergencyNumber: z.string().regex(/^\d{10}$/, "El número debe tener exactamente 10 dígitos").optional(),
      email: z.string().email("Correo electrónico inválido").optional(),
      medicalCondition: z.string().trim().max(500, "Máximo 500 caracteres").optional(),
    })
  ).min(1, "Debe agregar al menos un integrante"),
})

export default function Family() {
  const form = useForm({
    resolver: zodResolver(familyFormSchema),
    defaultValues: {
      familyName: "",
      members: [{
        firstName: "", lastName: "", nationality: "", sex: "", academicLevel: "", occupation: "",
        profession: "", relationship: "", idCard: "", passport: "", birthDate: "", district: "", sector: "",
        address: "", phoneNumber: "", emergencyNumber: "", email: "", medicalCondition: ""
      }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "members",
    control: form.control,
  })

  function onSubmit(data) {
    console.log("Datos para el API:", data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 max-w-4xl mx-auto p-4">
        <Card>
          <CardHeader>
            <CardTitle>Registro de Familia</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="familyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellido Familiar</FormLabel>
                  <FormControl><Input {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Mapeo de miembros dinámicos */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-foreground">Miembros</h3>
            <Button type="button" onClick={() => append({
              firstName: "", lastName: "", nationality: "", sex: "", academicLevel: "", occupation: "",
              profession: "", relationship: "", idCard: "", passport: "", birthDate: "", district: "", sector: "",
              address: "", phoneNumber: "", emergencyNumber: "", email: "", medicalCondition: ""
            })}>
              <Plus className="w-4 h-4 mr-2" /> Agregar
            </Button>
          </div>

          {fields.map((field, index) => (
            <Card key={field.id}>
              <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-4">

                <FormField
                  control={form.control}
                  name={`members.${index}.firstName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.lastName`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Apellido</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.relationship`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Parentesco</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="cabeza">Cabeza</SelectItem>
                          <SelectItem value="conyuge">Cónyuge</SelectItem>
                          <SelectItem value="hijo/a">Hijo/a</SelectItem>
                          <SelectItem value="nieto/a">Nieto/a</SelectItem>
                          <SelectItem value="papa">Papa</SelectItem>
                          <SelectItem value="mama">Mama</SelectItem>
                          <SelectItem value="hermano/a">Hermano/a</SelectItem>
                          <SelectItem value="sobrino/a">Sobrino/a</SelectItem>
                          <SelectItem value="tio/a">Tío/a</SelectItem>
                          <SelectItem value="primo/a">Primo/a</SelectItem>
                          <SelectItem value="cuñado/a">Cuñado/a</SelectItem>
                          <SelectItem value="hijastro/a">Hijastro/a</SelectItem>
                          <SelectItem value="otro">Otro</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.idCard`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cédula</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.passport`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pasaporte</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.sex`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sexo</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Female">Femenino</SelectItem>
                          <SelectItem value="Male">Masculino</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.birthDate`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de nacimiento</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.nationality`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nacionalidad</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`members.${index}.academicLevel`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nivel Academico</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                        <SelectContent>
                          <SelectItem value="Basic">Basica</SelectItem>
                          <SelectItem value="Middle">Media</SelectItem>
                          <SelectItem value="Higher">Superior</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Correo Electrónico</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.phoneNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Teléfono</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.emergencyNumber`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Emergencia</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.occupation`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ocupación</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.profession`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profesión</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`members.${index}.medicalCondition`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Condición Médica</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`members.${index}.address`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name={`members.${index}.sector`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Sector</FormLabel>
                      <FormControl><Input {...field} /></FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button variant="destructive" onClick={() => remove(index)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
        <Button type="submit" className="w-full">Guardar</Button>
      </form>
    </Form>
  )
} 