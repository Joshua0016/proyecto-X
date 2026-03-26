"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldContent
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

import {
    InputGroup,
    InputGroupTextarea,
    InputGroupAddon,
    InputGroupText
} from "@/components/ui/input-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectSeparator,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const type = [
    { label: "Activo", value: "activo" },
    { label: "Pasivo", value: "pasivo" },
    { label: "Ingreso", value: "ingreso" },
    { label: "Gasto", value: "gasto" },
]
const formSchema = z.object({
    accountCode: z
        .string()
        .min(4, "El codigo de cuenta debe contener un mínimo de 4 caracteres")
        .max(20, "El código de cuenta debe contener un máximo de 20 caracteres.")
        .regex(
            /^[a-zA-Z0-9\s]+$/,
            "El código de cuetna solo puede contener letras y números"
        ),
    name: z
        .string()
        .max(100, "Este campo solo puede contener un máximo de 100 caracteres")
        .regex(
            /^[a-zA-Z0-9\s-]+$/,
            "La descripción de la cuenta solo puede contener letras, números y guiones"
        )

})

export default function LedgerAccount() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            accountCode: "",
            name: "",
        },
    })

    function onSubmit(data) {

    }

    return (
        <Card className="w-full mx-auto mt-[100px] sm:max-w-4xl flex p-8">
            <CardHeader>
                <CardTitle>Configuración de cuenta</CardTitle>
                <CardDescription>
                    Ingresa la información de tu cuenta a continuación
                </CardDescription>
            </CardHeader>
            <CardContent className="">
                <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <div className="flex gap-7 p-8 ">
                            <div className="flex flex-col gap-8 top-0 bottom-0 my-auto">
                                <Controller
                                    name="accountCode"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-input-accountCode">
                                                Código de cuenta
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-input-account"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="Código"
                                                autoComplete="account"
                                            />
                                            <FieldDescription>
                                                Código de cuenta público, solo puede contener
                                                números y letras.
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                                <Controller

                                    name="name"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-rhf-demo-name">
                                                Descripción
                                            </FieldLabel>
                                            <InputGroup>
                                                <InputGroupTextarea
                                                    {...field}
                                                    id="form-rhf-demo-description"
                                                    placeholder="Descripción"
                                                    rows={6}
                                                    className="min-h-24 resize-none"
                                                    aria-invalid={fieldState.invalid}
                                                />
                                                <InputGroupAddon align="block-end">
                                                    <InputGroupText className="tabular-nums">
                                                        {field.value.length}/100 caracteres
                                                    </InputGroupText>
                                                </InputGroupAddon>
                                            </InputGroup>
                                            <FieldDescription>
                                                Esta es tu descripción de cuenta
                                            </FieldDescription>
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}
                                />
                            </div>

                            {/*Select form*/}
                            <div>
                                <Controller
                                    name="language"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field
                                            orientation="responsive"
                                            data-invalid={fieldState.invalid}
                                        >
                                            <FieldContent>
                                                <FieldLabel htmlFor="form-rhf-select-language">
                                                    Categoria contable
                                                </FieldLabel>
                                                <FieldDescription>
                                                    Selecciona el tipo de categoria
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </FieldContent>

                                            <Select
                                                name={field.name}
                                                value={field.value}
                                                onValueChange={field.onChange}
                                            >
                                                <SelectTrigger
                                                    id="form-rhf-select-language"
                                                    aria-invalid={fieldState.invalid}
                                                    className="min-w-[80px]"
                                                >
                                                    <SelectValue placeholder="Select" />
                                                </SelectTrigger>
                                                <SelectContent position="item-aligned">
                                                    <SelectItem value="auto">Auto</SelectItem>
                                                    <SelectSeparator />
                                                    {type.map((language) => (
                                                        <SelectItem key={language.value} value={language.value}>
                                                            {language.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>


                                        </Field>
                                    )}
                                />
                            </div>

                        </div>

                    </FieldGroup>
                </form>
            </CardContent>
            <CardFooter>
                <Field orientation="horizontal">
                    <Button type="button" variant="outline" onClick={() => form.reset()}>
                        Reset
                    </Button>
                    <Button type="submit" form="form-rhf-input">
                        Save
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
