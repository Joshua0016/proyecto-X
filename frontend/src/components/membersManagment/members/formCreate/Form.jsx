"use client"

import { zodResolver } from "@hookform/resolvers/zod"; //libreria de validaciones de esquemas 
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

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
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldContent,
} from "@/components/ui/field";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import createMember from "@/apiServices/members/createMember";
import { useState } from "react";
import getAllMembers from "@/apiServices/members/getAllMembers";
import updateMember from "@/apiServices/members/updateMember";

const gender = [
    { label: "Masculino", value: "0" },
    { label: "Femenino", value: "1" },
];
const maritalStatus = [
    { label: "Soltero", value: "0" },
    { label: "Casado", value: "1" },
    { label: "Viudo", value: "2" },
    { label: "Divorciado", value: "3" }
]

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
        .min(10, "phone number must be at least 10 digits")
        .max(10, "Phone number must be at most 10 digits.")
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
})

export default function FormRhfInput({ setformMember, setRows, rowMember }) {
    const defaultValues = rowMember?.isUpdate
        ? {
            FirstName: rowMember.FirstName || "",
            LastName: rowMember.LastName || "",
            Email: rowMember.Email || "",
            PhoneNumber: rowMember.PhoneNumber || "",
            BirthDate: dayjs(rowMember.BirthDate).format("YYYY-MM-DD") || "",
            address: rowMember.address || "",
            gender: rowMember.gender || "",
            maritalStatus: rowMember.maritalStatus || "",
        }
        : {
            FirstName: "",
            LastName: "",
            Email: "",
            PhoneNumber: "",
            BirthDate: "",
            address: "",
            gender: "select",
            maritalStatus: "select"
        };

    const form = useForm(
        {
            resolver: zodResolver(formSchema),
            defaultValues,
        })

    function onSubmit(data) {
        const Save = async () => {
            console.log(data)
            const { isUpdate, ...dataUpdate } = data;

            const finalData = {
                ...dataUpdate,
                BirthDate: dayjs(data.BirthDate).toISOString(),
                PhotoUrl: "text",
            }

            if (rowMember?.isUpdate) {
                try {

                    const updatePayLoad = { ...finalData, id: rowMember.id } //agrego el id de la fila que se esta actualizando
                    const { BirthDate, ...updatePayLoad2 } = updatePayLoad //extraigo BirthDate porque gadiel le puso otro nombre a la variable
                    const updatePayLoad3 = { ...updatePayLoad2, Birth: finalData.BirthDate };//agregamos Birth que es lo que espera el backend
                    const response = await updateMember(updatePayLoad3.id, updatePayLoad3);
                    if (response) {

                        setRows(await getAllMembers());
                        setformMember(false);
                    }
                } catch (error) {
                    console.log("Error al intentar actualizr  update/create form member--> " + error)
                }

            }
            else {
                try {
                    const response = await createMember(finalData);
                    if (response) {

                        setRows(await getAllMembers());
                        setformMember(false);
                    }

                } catch (error) {
                    console.log("error al crear el miembro update/create ---> " + error)
                }
            }

        }
        Save();
    }



    return (
        <>
            <div className="fixed z-50 inset-0 bg-black/70 backdrop-blur-[5px] flex p-2">
                <Card className="w-[90%] h-[85%] md:h-[70%] lg:w-[90%] lg:h-[90%] xl:w-[20%] xl:h-[58%] mx-auto my-auto overflow-y-auto">
                    <CardHeader>
                        <CardTitle>Configuración de miembro</CardTitle>
                        <CardDescription>
                            Llena de forma adecuada las siguientes informaciones:
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
                            <FieldGroup>
                                <Controller
                                    name="FirstName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-input-name">
                                                Nombre
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-input-name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="nombre"
                                                autoComplete="Name"
                                            />

                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="LastName"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-input-lastName">
                                                Apellido
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-input-lastName"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Apellido"
                                                autoComplete="Last name"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}


                                />
                                <FieldDescription>
                                    Este es tu nombre y apllido. deben contener entre 3 y 10
                                    caracteres. Solo debe contener letras.
                                </FieldDescription>
                                <Controller
                                    name="address"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-input-address">
                                                Dirección
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-input-address"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Dirección"
                                                autoComplete="direccion"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}


                                />
                                <FieldDescription>
                                    Esta es tu dirección de vivienda.
                                </FieldDescription>
                                <Controller
                                    name="gender"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            orientation="responsive"
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldContent>
                                                <FieldLabel htmlFor="form-rhf-select-gender">
                                                    Género
                                                </FieldLabel>
                                                <FieldDescription>
                                                    Selecciona el sexo
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                                <Select
                                                    name={field.name}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger
                                                        id="form-rhf-select-gender"
                                                        aria-invalid={fieldState.invalid}
                                                        className="min-w-[80px]"
                                                    >
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent position="item-aligned">
                                                        <SelectItem value="select">Select</SelectItem>
                                                        <SelectSeparator />
                                                        {gender.map((element) => (
                                                            <SelectItem key={element.value} value={element.value}>
                                                                {element.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </FieldContent>
                                        </Field>
                                    )}
                                />
                                <FieldDescription>
                                    Masculino o Femenino
                                </FieldDescription>

                                <Controller
                                    name="maritalStatus"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            orientation="responsive"
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldContent>
                                                <FieldLabel htmlFor="form-rhf-select-maritalStatus">
                                                    Estado civil
                                                </FieldLabel>
                                                <FieldDescription>
                                                    Selecciona el estado civil del miembro
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                                <Select
                                                    name={field.name}
                                                    value={field.value}
                                                    onValueChange={field.onChange}
                                                >
                                                    <SelectTrigger
                                                        id="form-rhf-select-maritalStatus"
                                                        aria-invalid={fieldState.invalid}
                                                        className="min-w-[80px]"
                                                    >
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent position="item-aligned">
                                                        <SelectItem value="select">Select</SelectItem>
                                                        <SelectSeparator />
                                                        {maritalStatus.map((element) => (
                                                            <SelectItem key={element.value} value={element.value}>
                                                                {element.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                            </FieldContent>

                                        </Field>
                                    )}
                                />
                                <Controller
                                    name="Email"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-html-input-email">
                                                Email
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-input-email"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="name@example.com"
                                                type="email"
                                                autoComplete="email"
                                            />
                                            {fieldState.invalid &&
                                                (<FieldError errors={[fieldState.error]} />)
                                            }

                                        </Field>
                                    )}
                                />
                                <FieldDescription>
                                    Este es tu correo electrónico. solo puede contener 150 caracteres.

                                </FieldDescription>
                                <Controller
                                    name="PhoneNumber"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-html-input-phoneNumber">
                                                Teléfono
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-input-phoneNumber"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="80930000000"
                                                type="tel"
                                                autoComplete="Teléfono"
                                            />
                                            {fieldState.invalid &&
                                                (<FieldError errors={[fieldState.error]} />)
                                            }

                                        </Field>
                                    )}
                                />
                                <FieldDescription>
                                    Este es tu número de teléfono. debe contener 10 digitos.
                                </FieldDescription>
                                <Controller
                                    name="BirthDate"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-html-input-birth">
                                                Cumpleaños
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-input-birth"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="yyyy-MM-dd"
                                                type="date"
                                                autoComplete="birth"
                                            />
                                            {fieldState.invalid &&
                                                (<FieldError errors={[fieldState.error]} />)
                                            }

                                        </Field>
                                    )}
                                />
                            </FieldGroup>
                        </form>
                    </CardContent>
                    <CardFooter>
                        <Field className="">
                            <div className="flex justify-between">
                                <div>
                                    <Button type="button" variant="outline" className="cursor-pointer" onClick={() => form.reset()}>
                                        Restablecer
                                    </Button>
                                    <Button type="submit" form="form-rhf-input" className="cursor-pointer">
                                        Guardar
                                    </Button>

                                </div>
                                <Button onClick={() => { setformMember(false); }} className="bg-red-600 cursor-pointer">Cancel</Button>
                            </div>

                        </Field>
                    </CardFooter>
                </Card>
            </div>

        </>

    )
}
