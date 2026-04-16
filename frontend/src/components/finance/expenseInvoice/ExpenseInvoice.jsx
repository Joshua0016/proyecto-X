"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import * as z from "zod"
import { useEffect, useState } from "react"
import dayjs from "dayjs"
import DataTable from "react-data-table-component"

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

import createExpenseInvoice from "@/apiServices/expenseInvoice/createExpenseInvoice"
import getAllExpenseInvoices from "@/apiServices/expenseInvoice/getAllExpenseInvoices"
import getAllVendors from "@/apiServices/expenseInvoice/getAllVendors"
import { dataTableStyles, paginationOptions } from "@/components/shared/dataTableStyles"

const paymentMethods = [
    { label: "Efectivo", value: "0" },
    { label: "Transferencia", value: "1" },
    { label: "Cheque", value: "2" },
    { label: "Depósito", value: "3" },
]

const statusOptions = [
    { label: "Pendiente", value: "Pending" },
    { label: "Pagado", value: "Paid" },
    { label: "Cancelado", value: "Cancelled" },
    { label: "Vencido", value: "Overdue" },
]

const statusLabels = {
    Pending: "Pendiente",
    Paid: "Pagado",
    Cancelled: "Cancelado",
    Overdue: "Vencido",
}

const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800",
    Paid: "bg-green-100 text-green-800",
    Cancelled: "bg-red-100 text-red-800",
    Overdue: "bg-orange-100 text-orange-800",
}

const formSchema = z.object({
    vendorId: z.coerce.number().min(1, "Seleccione un proveedor"),
    invoiceNumber: z
        .string()
        .min(1, "El número de factura es obligatorio")
        .max(50, "Máximo 50 caracteres"),
    description: z.string().max(500, "Máximo 500 caracteres").optional(),
    total: z.coerce.number().gt(0, "El total debe ser mayor a cero"),
    paymentMethod: z.coerce.number().min(0, "Seleccione un método de pago"),
    issueDate: z.coerce.date({ required_error: "La fecha de emisión es obligatoria" }),
    dueDate: z.coerce.date({ required_error: "La fecha de vencimiento es obligatoria" }),
    status: z.string().min(1, "Seleccione un estado"),
    journalEntryId: z.coerce.number().min(1, "El ID del asiento contable es obligatorio"),
})

export default function ExpenseInvoice() {
    const [vendors, setVendors] = useState([])
    const [invoices, setInvoices] = useState([])
    const [search, setSearch] = useState("")
    const [filtered, setFiltered] = useState([])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            vendorId: "",
            invoiceNumber: "",
            description: "",
            total: "",
            paymentMethod: "select",
            issueDate: "",
            dueDate: "",
            status: "select",
            journalEntryId: "",
        },
    })

    useEffect(() => {
        async function load() {
            const [v, inv] = await Promise.all([getAllVendors(), getAllExpenseInvoices()])
            setVendors(v)
            setInvoices(inv)
            setFiltered(inv)
        }
        load()
    }, [])

    const handleSearch = (e) => {
        const value = e.target.value
        setSearch(value)
        if (value) {
            setFiltered(invoices.filter((i) =>
                i.invoiceNumber?.toLowerCase().includes(value.toLowerCase()) ||
                i.vendor?.name?.toLowerCase().includes(value.toLowerCase())
            ))
        } else {
            setFiltered(invoices)
        }
    }

    function onSubmit(data) {
        async function save() {
            try {
                const payload = {
                    ...data,
                    issueDate: dayjs(data.issueDate).toISOString(),
                    dueDate: dayjs(data.dueDate).toISOString(),
                }
                const ok = await createExpenseInvoice(payload)
                if (ok) {
                    form.reset()
                    const updated = await getAllExpenseInvoices()
                    setInvoices(updated)
                    setFiltered(updated)
                }
            } catch (error) {
                console.log("Error al guardar factura --->> " + error)
            }
        }
        save()
    }

    const columns = [
        {
            name: "# Factura",
            selector: (row) => row.invoiceNumber,
            sortable: true,
        },
        {
            name: "Proveedor",
            selector: (row) => row.vendor?.name ?? row.vendorId,
            sortable: true,
        },
        {
            name: "Total",
            selector: (row) => `$${Number(row.total).toFixed(2)}`,
            sortable: true,
            right: true,
        },
        {
            name: "Emisión",
            selector: (row) => dayjs(row.issueDate).format("DD/MM/YYYY"),
            sortable: true,
        },
        {
            name: "Vencimiento",
            selector: (row) => dayjs(row.dueDate).format("DD/MM/YYYY"),
            sortable: true,
        },
        {
            name: "Estado",
            cell: (row) => (
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[row.status] ?? "bg-gray-100 text-gray-700"}`}>
                    {statusLabels[row.status] ?? row.status}
                </span>
            ),
        },
    ]

    return (
        <>
            {/* Formulario */}
            <Card className="w-full mx-auto sm:max-w-2xl xl:max-w-6xl">
                <CardHeader>
                    <CardTitle>Factura de Gasto</CardTitle>
                    <CardDescription>
                        Registra una nueva factura de gasto asociada a un proveedor
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form id="form-expense-invoice" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <div className="flex flex-wrap gap-6 xl:p-4">

                                {/* Columna izquierda */}
                                <div className="flex flex-col gap-6 flex-1 min-w-[200px]">

                                    {/* Proveedor */}
                                    <Controller
                                        name="vendorId"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                                <FieldContent>
                                                    <FieldLabel htmlFor="ei-vendorId">Proveedor</FieldLabel>
                                                    <FieldDescription>Selecciona el proveedor</FieldDescription>
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </FieldContent>
                                                <Select name={field.name} value={String(field.value)} onValueChange={field.onChange}>
                                                    <SelectTrigger id="ei-vendorId" aria-invalid={fieldState.invalid} className="min-w-[160px]">
                                                        <SelectValue placeholder="Seleccionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="select">Seleccionar</SelectItem>
                                                        <SelectSeparator />
                                                        {vendors.map((v) => (
                                                            <SelectItem key={v.vendorId} value={String(v.vendorId)}>
                                                                {v.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        )}
                                    />

                                    {/* Número de factura */}
                                    <Controller
                                        name="invoiceNumber"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="ei-invoiceNumber">Número de Factura</FieldLabel>
                                                <Input {...field} id="ei-invoiceNumber" placeholder="Ej: FAC-0001" aria-invalid={fieldState.invalid} />
                                                <FieldDescription>Número único de la factura</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />

                                    {/* Total */}
                                    <Controller
                                        name="total"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="ei-total">Total</FieldLabel>
                                                <Input {...field} id="ei-total" type="number" step="0.01" placeholder="0.00" aria-invalid={fieldState.invalid} />
                                                <FieldDescription>Monto total de la factura</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />

                                    {/* ID Asiento contable */}
                                    <Controller
                                        name="journalEntryId"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="ei-journalEntryId">ID Asiento Contable</FieldLabel>
                                                <Input {...field} id="ei-journalEntryId" type="number" placeholder="ID del asiento" aria-invalid={fieldState.invalid} />
                                                <FieldDescription>Asiento contable relacionado</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />
                                </div>

                                {/* Columna central */}
                                <div className="flex flex-col gap-6 flex-1 min-w-[200px]">

                                    {/* Fecha de emisión */}
                                    <Controller
                                        name="issueDate"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="ei-issueDate">Fecha de Emisión</FieldLabel>
                                                <Input {...field} id="ei-issueDate" type="date" aria-invalid={fieldState.invalid} />
                                                <FieldDescription>Fecha en que se emitió la factura</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />

                                    {/* Fecha de vencimiento */}
                                    <Controller
                                        name="dueDate"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="ei-dueDate">Fecha de Vencimiento</FieldLabel>
                                                <Input {...field} id="ei-dueDate" type="date" aria-invalid={fieldState.invalid} />
                                                <FieldDescription>Fecha límite de pago</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />

                                    {/* Método de pago */}
                                    <Controller
                                        name="paymentMethod"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                                <FieldContent>
                                                    <FieldLabel htmlFor="ei-paymentMethod">Método de Pago</FieldLabel>
                                                    <FieldDescription>Forma en que se realizó el pago</FieldDescription>
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </FieldContent>
                                                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger id="ei-paymentMethod" aria-invalid={fieldState.invalid} className="min-w-[160px]">
                                                        <SelectValue placeholder="Seleccionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="select">Seleccionar</SelectItem>
                                                        <SelectSeparator />
                                                        {paymentMethods.map((m) => (
                                                            <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        )}
                                    />

                                    {/* Estado */}
                                    <Controller
                                        name="status"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field orientation="responsive" data-invalid={fieldState.invalid}>
                                                <FieldContent>
                                                    <FieldLabel htmlFor="ei-status">Estado</FieldLabel>
                                                    <FieldDescription>Estado actual de la factura</FieldDescription>
                                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                </FieldContent>
                                                <Select name={field.name} value={field.value} onValueChange={field.onChange}>
                                                    <SelectTrigger id="ei-status" aria-invalid={fieldState.invalid} className="min-w-[160px]">
                                                        <SelectValue placeholder="Seleccionar" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="select">Seleccionar</SelectItem>
                                                        <SelectSeparator />
                                                        {statusOptions.map((s) => (
                                                            <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        )}
                                    />
                                </div>

                                {/* Descripción - ancho completo */}
                                <div className="w-full">
                                    <Controller
                                        name="description"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="ei-description">Descripción</FieldLabel>
                                                <InputGroup className="w-full">
                                                    <InputGroupTextarea
                                                        {...field}
                                                        id="ei-description"
                                                        placeholder="Descripción del gasto..."
                                                        rows={3}
                                                        className="min-h-20 w-full resize-none"
                                                        aria-invalid={fieldState.invalid}
                                                    />
                                                    <InputGroupAddon align="block-end">
                                                        <InputGroupText className="tabular-nums">
                                                            {(field.value ?? "").length}/500 caracteres
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                <FieldDescription>Detalle opcional del gasto</FieldDescription>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                        <Button type="button" variant="outline" onClick={() => form.reset()} className="cursor-pointer">
                            Restablecer
                        </Button>
                        <Button type="submit" form="form-expense-invoice" className="cursor-pointer">
                            Guardar
                        </Button>
                    </Field>
                </CardFooter>
            </Card>

            {/* Tabla de facturas */}
            <Card className="w-full mx-auto sm:max-w-2xl xl:max-w-6xl mt-6 p-4">
                <CardHeader>
                    <CardTitle>Facturas Registradas</CardTitle>
                </CardHeader>
                <CardContent>
                    <Input
                        type="search"
                        placeholder="Buscar por # factura o proveedor..."
                        className="mb-4 sm:w-[40%]"
                        value={search}
                        onChange={handleSearch}
                    />
                    <DataTable
                        columns={columns}
                        data={filtered}
                        customStyles={dataTableStyles}
                        pagination
                        paginationPerPage={5}
                        paginationRowsPerPageOptions={[5, 10, 20]}
                        paginationComponentOptions={paginationOptions}
                        highlightOnHover
                        noDataComponent={<p className="py-6 text-sm text-gray-500">No hay facturas registradas</p>}
                    />
                </CardContent>
            </Card>
        </>
    )
}
