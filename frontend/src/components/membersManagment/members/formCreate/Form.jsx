"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import * as z from "zod";
//aqui funciona
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Field,
    FieldGroup,
    FieldLabel,
    FieldError,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import dayjs from "dayjs";
import createMember from "@/apiServices/members/createMember";
import getAllMembers from "@/apiServices/members/getAllMembers";
import updateMember from "@/apiServices/members/updateMember";

// --- Enums ---
const genderOptions = [
    { label: "Masculino", value: "0" },
    { label: "Femenino", value: "1" },
];

const maritalStatusOptions = [
    { label: "Soltero", value: "0" },
    { label: "Casado", value: "1" },
    { label: "Viudo", value: "2" },
    { label: "Divorciado", value: "3" }
];


const formSchema = z.object({
    FirstName: z
        .string()
        .min(3, "El nombre debe tener al menos 3 caracteres.")
        .max(20, "El nombre solo puede tener un máximo de 50 caracteres.")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "Solo puede contener letras y espacios."
        ),
    LastName: z
        .string()
        .min(3, "Apellido debe tener al menos 3 caracteres.")
        .max(20, "Apellido solo puede tener un máximo de 50 caracteres.")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "Only letters and spaces are allowed."
        ),
    Email: z
        .string()
        .min(5, "Email debe tener un mínimo de 5 caracteres.")
        .max(150, "Email debe tener un máximo de 150 caracteres."),

    PhoneNumber: z
        .string()
        .min(10, "El número de telefono debe contener 10 digitos")
        .max(10, "El número de telefono debe contener 10 digitos")
        .regex(
            /^(809|829|849)\d{7}$/,
            "El número de teléfono debe comenzar con: 829/809/849 seguido de 7 digitos"
        ),
    BirthDate: z.coerce
        .date("Fecha requerida"),

    address: z
        .string()
        .regex(
            /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑüÜ#\s.,\-\/]*$/,
            "Solo permite letras, números, espacios, acentos y símbolos básicos (# . , - /)"
        ),
    gender: z
        .coerce.number("seleccionar el género correspondiente"),

    maritalStatus: z
        .coerce.number("seleccionar estado civil"),

    // Otros campos (opcionales para Zod pero necesarios en el objeto)
    secondName: z.string().optional(),
    secondLastName: z.string().optional(),
    nationalId: z.string().optional(),
    passportNumber: z.string().optional(),
    birthPlace: z.string().optional(),
    nationality: z.string().optional(),
    sectorId: z.coerce.number().optional(),
    emergencyContactName: z.string().optional(),
    emergencyContactPhone: z.string().optional(),
    medicalCondition: z.string().optional(),
    bloodType: z.string().optional(),
    memberType: z.string().optional(),
    isActive: z.boolean().default(true),
    joinDate: z.string().optional(),
    conversionDate: z.string().optional(),
    originChurch: z.string().optional(),
    baptized: z.boolean().default(false),
    baptismDate: z.string().optional(),
    baptismPlace: z.string().optional(),
    discipleshipLevel: z.string().optional(),
    smallGroupId: z.coerce.number().optional(),
    churchRoleId: z.coerce.number().optional(),
    memberSkills: z.string().optional(),
    discipline: z.boolean().default(false),
    courtCase: z.boolean().default(false),
    academicLevel: z.string().optional(),
    profession: z.string().optional(),
    occupation: z.string().optional(),
    memberCourses: z.string().optional(),
});

export default function FormRhfMember({ setformMember, setRows, rowMember }) {
    const defaultValues = rowMember?.isUpdate
        ? {
            ...rowMember,
            FirstName: rowMember.firstName || "",
            LastName: rowMember.lastName || "",
            Email: rowMember.email || "",
            PhoneNumber: rowMember.phoneNumber || "",
            BirthDate: dayjs(rowMember.birthDate).format("YYYY-MM-DD"),
            address: rowMember.address || "",
            gender: rowMember.gender === "M" ? "0" : "1",
            maritalStatus: maritalStatusOptions.find(opt => opt.label === rowMember.maritalStatus)?.value || "0",
            // Mapeo del resto de campos de la tabla
            secondName: rowMember.secondName || "",
            secondLastName: rowMember.secondLastName || "",
            nationalId: rowMember.nationalId || "",
            passportNumber: rowMember.passportNumber || "",
            birthPlace: rowMember.birthPlace || "",
            nationality: rowMember.nationality || "",
            sectorId: rowMember.sectorId || null,
            emergencyContactName: rowMember.emergencyContactName || "",
            emergencyContactPhone: rowMember.emergencyContactPhone || "",
            medicalCondition: rowMember.medicalCondition || "",
            bloodType: rowMember.bloodType || "",
            memberType: rowMember.memberType || "Activos",
            isActive: rowMember.isActive ?? true,
            joinDate: rowMember.joinDate ? dayjs(rowMember.joinDate).format("YYYY-MM-DD") : "",
            conversionDate: rowMember.conversionDate ? dayjs(rowMember.conversionDate).format("YYYY-MM-DD") : "",
            baptized: rowMember.baptized ?? false,
            baptismDate: rowMember.baptismDate ? dayjs(rowMember.baptismDate).format("YYYY-MM-DD") : "",
            baptismPlace: rowMember.baptismPlace || "",
            discipleshipLevel: rowMember.discipleshipLevel || "",
            smallGroupId: rowMember.smallGroupId || null,
            churchRoleId: rowMember.churchRoleId || null,
            memberSkills: rowMember.memberSkills || "",
            discipline: rowMember.discipline ?? false,
            courtCase: rowMember.courtCase ?? false,
            academicLevel: rowMember.academicLevel || "",
            profession: rowMember.profession || "",
            occupation: rowMember.occupation || "",
            memberCourses: rowMember.memberCourses || "",
            originChurch: rowMember.originChurch || "",
        }
        : {
            FirstName: "", secondName: "", LastName: "", secondLastName: "",
            Email: "", PhoneNumber: "", BirthDate: "", address: "",
            gender: "select", maritalStatus: "select",
            isActive: true, baptized: false, memberType: "Activos",
            joinDate: dayjs().format("YYYY-MM-DD")
        };

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues,
    });

    function onSubmit(data) {
        const Save = async () => {
            const { isUpdate, ...dataUpdate } = data;

            // Preparar el objeto con los nombres exactos de Swagger
            const finalData = {
                firstName: data.FirstName,
                secondName: data.secondName || "",
                lastName: data.LastName,
                secondLastName: data.secondLastName || "",
                gender: data.gender === 0 ? "M" : "F", // El DTO espera el char/string
                birthDate: dayjs(data.BirthDate).toISOString(),
                maritalStatus: ["Soltero", "Casado", "Viudo", "Divorciado"][data.maritalStatus] || "Soltero",
                nationalId: data.nationalId || "",
                phoneNumber: data.PhoneNumber,
                email: data.Email,
                address: data.address || "",
                // IMPORTANTE: AcademicLevel debe ser uno de los strings del Enum
                academicLevel: data.academicLevel || "Primaria",
                isActive: data.isActive,
                baptized: data.baptized,
                photoUrl: "text",
                joinDate: data.joinDate ? dayjs(data.joinDate).toISOString() : dayjs().toISOString(),
            };

            if (rowMember?.isUpdate) {
                try {

                    const response = await updateMember(rowMember.memberId, finalData);

                    if (response) {
                        setRows(await getAllMembers());
                        setformMember(false);
                    }
                } catch (error) {
                    console.log("Error Update:", error);
                }
            } else {
                // Lógica de Create (que dijiste que funciona bien)
                try {
                    const response = await createMember(finalData);
                    if (response) {
                        setRows(await getAllMembers());
                        setformMember(false);
                    }
                } catch (error) {
                    console.log("Error Create:", error);
                }
            }
        }
        Save();
    }
    const SectionLabel = ({ children }) => (
        <div className="col-span-full border-b border-zinc-100 pb-2 mt-6 mb-2">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-300">{children}</span>
        </div>
    );

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-950/60 backdrop-blur-md p-4">
            <Card className="w-full max-w-4xl max-h-[92vh] shadow-2xl border-none overflow-hidden bg-white ring-1 ring-zinc-200 flex flex-col">
                <CardHeader className="bg-gradient-to-b from-zinc-50 to-white border-b border-zinc-100 py-6 px-10">
                    <div className="flex justify-between items-end">
                        <div className="space-y-1">
                            <CardTitle className="text-2xl font-light tracking-tight text-zinc-900">
                                {rowMember?.isUpdate ? 'Edición de Perfil' : 'Registro de Membresía'}
                            </CardTitle>
                            <CardDescription className="text-zinc-400 font-medium tracking-wide">Iglesia Central Baní — Sistema de Control</CardDescription>
                        </div>
                        {rowMember?.isUpdate && <div className="text-[10px] font-bold bg-zinc-900 text-white px-3 py-1 tracking-widest uppercase">ID {rowMember.memberId}</div>}
                    </div>
                </CardHeader>

                <CardContent className="p-10 overflow-y-auto custom-scrollbar">
                    <form id="member-form" onSubmit={form.handleSubmit(onSubmit)} className="space-y-0">
                        <FieldGroup className="grid grid-cols-1 md:grid-cols-3 gap-x-10 gap-y-8">

                            <SectionLabel>Identidad</SectionLabel>
                            <FormField label="Primer Nombre" name="FirstName" form={form} />
                            <FormField label="Segundo Nombre" name="secondName" form={form} />
                            <FormField label="Primer Apellido" name="LastName" form={form} />
                            <FormField label="Segundo Apellido" name="secondLastName" form={form} />
                            <FormField label="Cédula" name="nationalId" form={form} placeholder="001-..." />
                            <FormField label="Pasaporte" name="passportNumber" form={form} />

                            <SectionLabel>Nacimiento y Contacto</SectionLabel>
                            <FormField label="Fecha de Nacimiento" name="BirthDate" form={form} type="date" />
                            <FormField label="Lugar de Nacimiento" name="birthPlace" form={form} />

                            <Controller
                                name="gender"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="flex flex-col gap-2">
                                        <FieldLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Género</FieldLabel>
                                        <Select value={String(field.value)} onValueChange={field.onChange}>
                                            <SelectTrigger className="h-10 border-0 border-b-2 border-zinc-100 rounded-none bg-transparent px-0 focus:ring-0 focus:border-zinc-900 transition-all">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="select" disabled>Seleccionar</SelectItem>
                                                {genderOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError className="text-[10px] font-bold text-red-500 mt-1">{fieldState.error?.message}</FieldError>}
                                    </Field>
                                )}
                            />

                            <Controller
                                name="maritalStatus"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field className="flex flex-col gap-2">
                                        <FieldLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Estado Civil</FieldLabel>
                                        <Select value={String(field.value)} onValueChange={field.onChange}>
                                            <SelectTrigger className="h-10 border-0 border-b-2 border-zinc-100 rounded-none bg-transparent px-0 focus:ring-0 focus:border-zinc-900 transition-all">
                                                <SelectValue placeholder="Seleccionar" />
                                            </SelectTrigger>
                                            <SelectContent className="bg-white">
                                                <SelectItem value="select" disabled>Seleccionar</SelectItem>
                                                {maritalStatusOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        {fieldState.invalid && <FieldError className="text-[10px] font-bold text-red-500 mt-1">{fieldState.error?.message}</FieldError>}
                                    </Field>
                                )}
                            />

                            <FormField label="Teléfono" name="PhoneNumber" form={form} />
                            <FormField label="Email" name="Email" form={form} type="email" />
                            <div className="md:col-span-2">
                                <FormField label="Dirección Residencial" name="address" form={form} />
                            </div>

                            <SectionLabel>Vida Eclesiástica</SectionLabel>
                            <FormField label="Fecha de Ingreso" name="joinDate" form={form} type="date" />
                            <FormField label="Conversión" name="conversionDate" form={form} type="date" />
                            <FormField label="Iglesia Origen" name="originChurch" form={form} />
                            <FormField label="Bautismo (Fecha)" name="baptismDate" form={form} type="date" />
                            <FormField label="Lugar Bautismo" name="baptismPlace" form={form} />
                            <FormField label="Nivel Discipulado" name="discipleshipLevel" form={form} />

                            <SectionLabel>Salud y Otros</SectionLabel>
                            <FormField label="Tipo de Sangre" name="bloodType" form={form} />
                            <div className="md:col-span-2">
                                <FormField label="Condición Médica" name="medicalCondition" form={form} />
                            </div>

                            <SectionLabel>Académico y Profesión</SectionLabel>
                            <FormField label="Nivel Académico" name="academicLevel" form={form} placeholder="Ej. Grado" />
                            <FormField label="Profesión" name="profession" form={form} />
                            <FormField label="Ocupación" name="occupation" form={form} />

                            <SectionLabel>Estado Actual</SectionLabel>
                            <div className="md:col-span-3 flex gap-12 pt-2">
                                <CheckField label="Miembro Activo" name="isActive" form={form} />
                                <CheckField label="Bautizado" name="baptized" form={form} />
                                <CheckField label="Disciplina" name="discipline" form={form} />
                                <CheckField label="Caso Judicial" name="courtCase" form={form} />
                            </div>
                        </FieldGroup>
                    </form>
                </CardContent>

                <CardFooter className="bg-zinc-50/80 border-t border-zinc-100 p-8 flex justify-between items-center">
                    <button type="button" onClick={() => setformMember(false)} variant="" className="cursor-pointer text-[12px] font-bold uppercase tracking-[0.2em] text-zinc-400 hover:text-red-500 transition-colors">
                        Descartar
                    </button>
                    <Button type="submit" form="member-form" className="cursor-pointer bg-zinc-900 text-white hover:bg-black h-12 px-12 rounded-none text-[11px] font-bold uppercase tracking-[0.2em] shadow-2xl shadow-zinc-200 transition-all active:scale-[0.98]">
                        {rowMember?.isUpdate ? 'Guardar Cambios' : 'Registrar Miembro'}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}

// --- Componentes Reutilizables ---
function FormField({ label, name, form, type = "text", placeholder = "" }) {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="flex flex-col gap-2 group">
                    <FieldLabel className="text-[11px] font-bold uppercase tracking-[0.15em] text-zinc-400 group-focus-within:text-zinc-900 transition-colors">
                        {label}
                    </FieldLabel>
                    <Input
                        {...field}
                        type={type}
                        placeholder={placeholder}
                        className="h-10 border-0 border-b-2 border-zinc-100 rounded-none bg-transparent px-0 focus-visible:ring-0 focus-visible:border-zinc-900 transition-all placeholder:text-zinc-200"
                    />
                    {fieldState.invalid && <FieldError className="text-[10px] font-bold text-red-500 mt-1">{fieldState.error?.message}</FieldError>}
                </Field>
            )}
        />
    );
}

function CheckField({ label, name, form }) {
    return (
        <Controller
            name={name}
            control={form.control}
            render={({ field }) => (
                <div className="flex items-center space-x-3 cursor-pointer group">
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id={name} className="border-zinc-300 data-[state=checked]:bg-zinc-900 data-[state=checked]:border-zinc-900" />
                    <label htmlFor={name} className="text-[11px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 cursor-pointer transition-colors">{label}</label>
                </div>
            )}
        />
    );
}