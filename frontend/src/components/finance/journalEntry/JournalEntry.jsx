"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useFieldArray, useForm } from "react-hook-form"

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
    Table,
    TableBody,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow

} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { TableCell } from "@mui/material"
import { Plus, Trash2 } from "lucide-react"
import getAllAccounts from "@/apiServices/ledgerAccount/getAllAccount"
import DataTable from "react-data-table-component"
import journalEntry from "@/apiServices/journalEntry/journalEntryCreate"
import dayjs from "dayjs"
import { getSession } from "@/apiServices/authService/tokenStorage"


const formSchema = z.object({
    date: z.coerce
        .date("fecha requerida"),
    memo: z
        .string()
        .min(1, "La descripción es obligatoira")
        .max(250, "Esta descripción tiene un máximo de 250 caracteres")
        .regex(
            /^[[a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]+$/,
            "La descripción solo puede contener letras"
        )
    ,
    reference: z
        .string()
        .min(1, "La referencia es obligatoria")
        .max(50, "Solo puede contener un máximo de 50 caracteres")
        .regex(
            /^[a-zA-Z0-9áéíóúÁÉÍÓÚñÑ-\s]+$/,
            "La referencia solo puede contener letras"
        )
    ,
    ledgerTransactions: z.array(
        z.object({
            accountCode: z.string()
                .min(4, "El codigo de cuenta debe contener un mínimo de 4 caracteres")
                .max(20, "El código de cuenta debe contener un máximo de 20 caracteres.")
                .regex(
                    /^[a-zA-Z0-9\s]+$/,
                    "El código de cuetna solo puede contener letras y números"
                ),
            debit: z.coerce.number(),
            credit: z.coerce.number(),

        }
        )
    )

})

export default function JournalEntry() {


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: "",
            memo: "",
            reference: "",
            ledgerTransactions: [{
                accountCode: "",
                debit: 0,
                credit: 0,
            }]

        },
    })

    const { fields, append, remove } = useFieldArray({//fields es el array, append para agregar nueva fila y remove para eliminar usando el indice
        control: form.control,
        name: "ledgerTransactions"
    });

    function onSubmit(data) {
        const save = async () => {
            const userId = parseInt(getSession()?.userId ?? "0");
            let newData = { ...data, date: dayjs(data.date).toISOString(), recordedByUserId: userId }
            console.log(newData)
            let response = await journalEntry(newData);
            if (response) {
                form.reset();
            }
        }
        save()
    }

    return (
        <>
            <Card className="lg:w-full xl:p-8">
                <CardHeader>
                    <CardTitle>Diario de entrada</CardTitle>
                    <CardDescription>
                        Ingresa la información del diario a continuación
                    </CardDescription>
                </CardHeader>
                <CardContent className="">
                    <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <div className="lg:w-full xl:w-[80%] xl:p-8 mx-auto flex justify-between">

                                <div className="flex flex-col w-[25%] gap-8 top-0 bottom-0 my-auto">
                                    <Controller
                                        name="date"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="form-rhf-input-date">
                                                    Fecha
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="form-rhf-input-date"
                                                    type="date"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="yyyy-MM-DD"
                                                    autoComplete="fecha"
                                                />
                                                <FieldDescription>
                                                    Periodo a que pertenece el movimiento
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller

                                        name="memo"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="form-rhf-demo-memo">
                                                    Concepto
                                                </FieldLabel>
                                                <InputGroup className="w-full">
                                                    <InputGroupTextarea
                                                        {...field}
                                                        id="form-rhf-demo-memo"
                                                        placeholder="Concepto"
                                                        rows={6}
                                                        className="min-h-24 w-full resize-none "
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    <InputGroupAddon align="block-end">
                                                        <InputGroupText className="tabular-nums">
                                                            {field.value.length}/250 caracteres
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <FieldDescription>
                                                    Esta es tu Descripcion de cuenta
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller

                                        name="reference"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="form-rhf-demo-reference">
                                                    Referencia
                                                </FieldLabel>
                                                <InputGroup>
                                                    <InputGroupTextarea
                                                        {...field}
                                                        id="form-rhf-demo-reference"
                                                        placeholder="Referencia"
                                                        rows={6}
                                                        className="min-h-12 resize-none  "
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    <InputGroupAddon align="block-end">
                                                        <InputGroupText className="tabular-nums">
                                                            {field.value.length}/50 caracteres
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <FieldDescription>
                                                    Esta es tu referencia
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                </div>

                                {/*Tabla de shadcn*/}
                                <div className="md:w-[65%] lg:w-[70%]  sm:h-[450px] bg-slate-100 border rounded-2xl overflow-auto">
                                    <Table className="">
                                        <TableHeader className="bg-slate-50">
                                            <TableRow>
                                                <TableHead className="md:w-[140px] lg:w-[150px] xl:w-[300px]">Cuenta</TableHead>
                                                <TableHead className="text-right">Débito</TableHead>
                                                <TableHead className="text-right">Crédito</TableHead>
                                                <TableHead className="w-[50px]"></TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {fields.map((field, index) => (
                                                <TableRow key={field.id}>
                                                    {/* Columna Cuenta */}
                                                    <TableCell>
                                                        <Controller
                                                            name={`ledgerTransactions.${index}.accountCode`}
                                                            control={form.control}
                                                            render={({ field, fieldState }) => (
                                                                <Field data-invalid={fieldState.invalid}>
                                                                    <Input
                                                                        {...field}
                                                                        placeholder="Código"
                                                                        aria-invalid={fieldState.invalid}
                                                                    />
                                                                    {fieldState.invalid && (
                                                                        <FieldError errors={[fieldState.error]} />
                                                                    )}
                                                                </Field>
                                                            )}
                                                        />
                                                    </TableCell>

                                                    {/* Columna Debito */}
                                                    <TableCell>
                                                        <Controller
                                                            name={`ledgerTransactions.${index}.debit`}
                                                            control={form.control}
                                                            render={({ field, fieldState }) => (
                                                                <Field data-invalid={fieldState.invalid}>
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                        aria-invalid={fieldState.invalid}
                                                                    />
                                                                    {fieldState.invalid && (
                                                                        <FieldError errors={[fieldState.error]} />
                                                                    )}
                                                                </Field>
                                                            )}
                                                        />
                                                    </TableCell>

                                                    {/* Columna Credito */}
                                                    <TableCell>
                                                        <Controller
                                                            name={`ledgerTransactions.${index}.credit`}
                                                            control={form.control}
                                                            render={({ field, fieldState }) => (
                                                                <Field data-invalid={fieldState.invalid}>
                                                                    <Input
                                                                        {...field}
                                                                        type="number"
                                                                        aria-invalid={fieldState.invalid}
                                                                    />
                                                                    {fieldState.invalid && (
                                                                        <FieldError errors={[fieldState.error]} />
                                                                    )}
                                                                </Field>
                                                            )}
                                                        />
                                                    </TableCell>

                                                    {/* Boton de borrar */}
                                                    <TableCell>
                                                        <Button variant="ghost" className="cursor-pointer" onClick={() => remove(index)}>
                                                            <Trash2 className="h-4 w-4" />
                                                        </Button>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>

                                        <TableFooter>
                                            <TableRow>
                                                <TableCell colSpan={4}>
                                                    <Button type="button" variant="outline" className="cursor-pointer" onClick={() => append({ accountCode: "", debit: 0, credit: 0 })} >
                                                        <Plus className="h-4 w-4" />
                                                    </Button>
                                                </TableCell>
                                            </TableRow>
                                        </TableFooter>
                                    </Table>
                                </div>

                            </div>

                        </FieldGroup>
                    </form>
                </CardContent>
                <CardFooter>
                    <Field orientation="horizontal">
                        <Button type="button" variant="outline" onClick={() => form.reset()} className="cursor-pointer">
                            Restablecer
                        </Button>
                        <Button type="submit" form="form-rhf-input" className="cursor-pointer">
                            Guardar
                        </Button>
                    </Field>

                </CardFooter>
            </Card>

            <AccountCode></AccountCode>


        </>
    )
}

function AccountCode() {
    const [code, setAccountCode] = useState();

    useEffect(() => {
        async function getCode() {
            let result = await getAllAccounts();
            if (result) {
                setAccountCode(result);
            }
        }
        getCode();
    }, [])

    const columns = [
        {
            name: "Código de cuenta",
            selector: (row) => row.accountCode,
            sortable: true,
        },
        {
            name: "Descripción",
            selector: (row) => row.name,
        }
    ];
    const customStyles = {
        header: {
            style: {
                minHeight: "56px",
            },
        },
        headRow: {
            style: {
                borderTopStyle: "solid",
                borderTopWidth: "1px",
                borderTopColor: "#e5e7eb",
                backgroundColor: "#f9fafb",
            },
        },
        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "14px",
                color: "#374151",
            },
        },
        cells: {
            style: {
                fontSize: "14px",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
        rows: {
            style: {
                minHeight: "64px", // Filas más altas para que respiren
                "&:not(:last-of-type)": {
                    borderBottomStyle: "solid",
                    borderBottomWidth: "1px",
                    borderBottomColor: "#e5e7eb",
                },
            },
        },
    };

    return (
        <>
            <Card className="w-[70%] mx-auto mt-8 p-8">
                <CardTitle>
                    Cuentas
                </CardTitle>

                <CardContent>
                    <DataTable columns={columns} data={code} customStyles={customStyles} pagination paginationPerPage={3} paginationRowsPerPageOptions={[3, 5, 10]} />
                </CardContent>
            </Card>
        </>
    )
}
