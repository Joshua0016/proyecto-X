"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, Controller } from "react-hook-form"
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
    FieldError,
    FieldLabel,
    FieldSet,
    FieldLegend,
} from "@/components/ui/field"
import {
    InputGroup,
    InputGroupTextarea,
    InputGroupAddon,
    InputGroupText
} from "@/components/ui/input-group"

import {
    Popover,
    PopoverTrigger,
    PopoverContent,
} from "@/components/ui/popover"
import {
    Command,
    CommandInput,
    CommandList,
    CommandEmpty,
    CommandGroup,
    CommandItem,
} from "@/components/ui/command"
import {
    RadioGroup,
    RadioGroupItem,
} from "@/components/ui/radio-group"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { useEffect, useState } from "react"

import getAllMembers from "@/apiServices/members/getAllMembers"
import getAllEvents from "@/apiServices/events/getAllEvents"
import getAllDonationType from "@/apiServices/donations/getAllDonationType"
import createDonation from "@/apiServices/donations/createDonations"
import dayjs from "dayjs"

// --- ESQUEMA DE VALIDACIÓN ---
const formSchema = z.object({
    observation: z
        .string()
        .max(250, "Solo puede contener 250 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/, "La descripción solo puede contener letras"),

    donationItemTypeId: z.coerce.number().min(1, "Debes seleccionar un tipo de donación"),


    amount: z
        .union([
            z
                .coerce
                .number()


            ,
            z
                .number()
                .nullable()
            ,
        ])

    ,
    quantity: z
        .union([
            z
                .coerce
                .number("Debes ingresar un número mayor a cero")

            ,
            z
                .number()
                .nullable()
            ,
        ])
    ,
    unitOfMeasure: z.string().optional(),
    paymentMethod: z.string().optional(),
    donationStatus: z.string().default("Confirmado"),
})

export default function Donations() {
    const [members, setMembers] = useState([])
    const [events, setEvents] = useState([])
    const [donationType, setDonationType] = useState([])

    const [selectMember, setSelectMember] = useState(0)
    const [selectEvent, setSelectEvent] = useState(1)

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            observation: "",
            donationItemTypeId: "",
            amount: 0,
            quantity: 0,
            unitOfMeasure: "libras",
            paymentMethod: "Efectivo",
            donationStatus: "Confirmado",
        },
    })

    // Observar el tipo de donación seleccionado para determinar la categoría
    const selectedTypeId = form.watch("donationItemTypeId")
    const selectedCategory = donationType.find(
        (t) => String(t.donationItemTypeId) === String(selectedTypeId)
    )?.category

    useEffect(() => {
        async function getData() {
            try {
                const [m, e, t] = await Promise.all([
                    getAllMembers(),
                    getAllEvents(),
                    getAllDonationType()
                ])
                if (m) setMembers(m)
                if (e) setEvents(e)
                if (t) setDonationType(t)
            } catch (error) {
                console.log("Error al traer los datos ---> " + error)
            }
        }
        getData()
    }, [])

    function onSubmit(data) {
        async function Save() {
            try {
                if (selectMember || selectEvent) {
                    console.log(data)
                    const newData = {

                        memberId: selectMember,
                        eventId: selectEvent,
                        date: dayjs().format(),
                        items: [
                            {
                                donationItemTypeId: data.donationItemTypeId,
                                quantity: data.quantity,
                                unitOfMeasure: data.unitOfMeasure,
                                amount: data.amount,
                                paymentMethod: data.paymentMethod,
                                status: data.donationStatus

                            }
                        ]
                    };
                    console.log(newData)
                    let response = await createDonation(newData);
                    if (response) {
                        form.reset();
                    }
                } else {
                    alert("Por favor selecciona un miembro o un evento")
                }
            } catch (error) {

            }
        }
        Save();

    }

    return (
        <div className="w-full flex flex-col items-center gap-6 p-4 md:p-10 bg-zinc-50 min-h-screen">
            <Card className="w-full max-w-6xl shadow-xl border-zinc-200">
                <CardHeader className="border-b border-zinc-100 pb-6">
                    <CardTitle className="text-3xl font-extrabold text-zinc-900">Registro de Donaciones</CardTitle>
                    <CardDescription className="text-zinc-500 text-base">
                        Gestiona las aportaciones de los miembros y asígnalas a eventos específicos.
                    </CardDescription>
                </CardHeader>

                <CardContent className="pt-8">
                    <form id="form-donations" onSubmit={form.handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                            {/* COLUMNA IZQUIERDA: Selectores y Campos Dinámicos */}
                            <div className="lg:col-span-5 space-y-8">
                                <div className="space-y-6">
                                    {/* Miembros */}
                                    <div className="flex flex-col gap-2">
                                        <FieldLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Seleccionar Miembro</FieldLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between h-11 border-zinc-200 hover:bg-zinc-50 font-normal">
                                                    {selectMember ? members.find((m) => m.memberId === selectMember)?.firstName : "Buscar miembro..."}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Filtrar por nombre..." />
                                                    <CommandList>
                                                        <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                                                        <CommandGroup>
                                                            {members.map((member) => (
                                                                <CommandItem key={member.memberId} onSelect={() => setSelectMember(member.memberId === selectMember ? 0 : member.memberId)}>
                                                                    {member.firstName} {member.lastName}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>

                                    {/* Eventos */}
                                    <div className="flex flex-col gap-2">
                                        <FieldLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Asignar a Evento</FieldLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between h-11 border-zinc-200 hover:bg-zinc-50 font-normal">
                                                    {selectEvent ? events.find((e) => e.eventId === selectEvent)?.title : "Buscar evento..."}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-[300px] p-0" align="start">
                                                <Command>
                                                    <CommandInput placeholder="Buscar evento..." />
                                                    <CommandList>
                                                        <CommandEmpty>No se encontró el evento.</CommandEmpty>
                                                        <CommandGroup>
                                                            {events.map((event) => (
                                                                <CommandItem key={event.eventId} onSelect={() => setSelectEvent(event.eventId === selectEvent ? 0 : event.eventId)}>
                                                                    {event.title}
                                                                </CommandItem>
                                                            ))}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                </div>

                                {/* --- RENDERIZADO CONDICIONAL --- */}
                                <div className="space-y-6 animate-in fade-in duration-500">

                                    {/* CASO: DINERO */}
                                    {selectedCategory === "Dinero" && (
                                        <div className="space-y-4 p-4 bg-blue-50/50 rounded-lg border border-blue-100">
                                            <Controller
                                                name="amount"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid}>
                                                        <FieldLabel className="text-[11px] font-bold uppercase text-zinc-500">Monto</FieldLabel>
                                                        <InputGroup className="mt-1">
                                                            <InputGroupAddon><InputGroupText>$</InputGroupText></InputGroupAddon>
                                                            <input
                                                                {...field}
                                                                type="number"
                                                                className={`flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm focus:outline-none focus:ring-1 ${fieldState.invalid ? "border-red-500 focus:ring-red-500" : "border-zinc-200 focus:ring-zinc-400"
                                                                    }`}
                                                                placeholder="0.00"
                                                            />
                                                        </InputGroup>

                                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                name="paymentMethod"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Field>
                                                        <FieldLabel className="text-[11px] font-bold uppercase text-zinc-500">Método de Pago</FieldLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <SelectTrigger className="mt-1 bg-white">
                                                                <SelectValue placeholder="Seleccionar método" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {["Efectivo", "Transferencia", "Cheque", "Deposito"].map(m => (
                                                                    <SelectItem key={m} value={m}>{m}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* CASO: COMBUSTIBLE O COMIDA */}
                                    {(selectedCategory === "Combustible" || selectedCategory === "Comida") && (
                                        <div className="grid grid-cols-2 gap-4 p-4 bg-orange-50/50 rounded-lg border border-orange-100">
                                            <Controller
                                                name="quantity"
                                                control={form.control}
                                                render={({ field, fieldState }) => (
                                                    <Field data-invalid={fieldState.invalid} className="w-full">
                                                        <FieldLabel className="text-[11px] font-bold uppercase text-zinc-500">
                                                            Cantidad
                                                        </FieldLabel>
                                                        <input
                                                            {...field}
                                                            type="number"
                                                            className={`mt-1 flex h-10 w-full rounded-md border bg-white px-3 py-2 text-sm transition-all focus:outline-none focus:ring-1 ${fieldState.invalid
                                                                ? "border-red-500 focus:ring-red-500"
                                                                : "border-zinc-200 focus:ring-zinc-400"
                                                                }`}
                                                        />
                                                        {/* Renderizado del error de Zod */}
                                                        {fieldState.invalid && (
                                                            <FieldError errors={[fieldState.error]} className="mt-1" />
                                                        )}
                                                    </Field>
                                                )}
                                            />
                                            <Controller
                                                name="unitOfMeasure"
                                                control={form.control}
                                                render={({ field }) => (
                                                    <Field>
                                                        <FieldLabel className="text-[11px] font-bold uppercase text-zinc-500">Unidad</FieldLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                            <SelectTrigger className="mt-1 bg-white">
                                                                <SelectValue placeholder="Medida" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {["libras", "galones", "unidades", "litros", "kilogramos", "otros"].map(u => (
                                                                    <SelectItem key={u} value={u}>{u}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </Field>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Donation Status (Siempre visible) */}
                                    <Controller
                                        name="donationStatus"
                                        control={form.control}
                                        render={({ field }) => (
                                            <Field>
                                                <FieldLabel className="text-[11px] font-bold uppercase text-zinc-400">Estado Inicial</FieldLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                                    <SelectTrigger className="mt-2"><SelectValue /></SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Confirmado">Confirmado</SelectItem>
                                                        <SelectItem value="Pendiente">Pendiente</SelectItem>
                                                        <SelectItem value="Rechazado">Rechazado</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </Field>
                                        )}
                                    />

                                    {/* Observaciones */}
                                    <Controller
                                        name="observation"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid} className="w-full">
                                                <FieldLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Descripción / Notas</FieldLabel>
                                                <InputGroup className="w-full mt-2">
                                                    <InputGroupTextarea
                                                        {...field}
                                                        placeholder="Detalles adicionales..."
                                                        className="min-h-[100px] w-full resize-none border-zinc-200 focus:border-zinc-900"
                                                    />
                                                    <InputGroupAddon align="block-end">
                                                        <InputGroupText className="text-[10px] text-zinc-400">
                                                            {field.value.length}/250
                                                        </InputGroupText>
                                                    </InputGroupAddon>
                                                </InputGroup>
                                                {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                                            </Field>
                                        )}
                                    />
                                </div>
                            </div>

                            {/* COLUMNA DERECHA: Tipo de Donación (Radio Group) */}
                            <div className="lg:col-span-7 bg-zinc-50/50 p-6 rounded-xl border border-zinc-100">
                                <Controller
                                    name="donationItemTypeId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <FieldSet>
                                            <FieldLegend className="text-lg font-bold text-zinc-800 mb-1">Tipo de Donación</FieldLegend>
                                            <p className="text-sm text-zinc-500 mb-6">Selecciona la categoría que corresponde a esta entrega.</p>

                                            <RadioGroup
                                                value={String(field.value)}
                                                onValueChange={field.onChange}
                                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                            >
                                                {donationType.map((plan) => (
                                                    <div key={plan.donationItemTypeId}>
                                                        <label
                                                            htmlFor={String(plan.donationItemTypeId)}
                                                            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${String(field.value) === String(plan.donationItemTypeId)
                                                                ? "border-zinc-900 bg-white shadow-md ring-1 ring-zinc-900"
                                                                : "border-zinc-200 bg-white hover:border-zinc-300"
                                                                }`}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-zinc-900 capitalize">{plan.name}</span>
                                                                <span className="text-xs text-zinc-500">Categoría: {plan.category}</span>
                                                            </div>
                                                            <RadioGroupItem value={String(plan.donationItemTypeId)} id={String(plan.donationItemTypeId)} />
                                                        </label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            {fieldState.invalid && <FieldError className="mt-4" errors={[fieldState.error]} />}
                                        </FieldSet>
                                    )}
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 pt-6 mt-4">
                    <Button type="button" variant="ghost" onClick={() => { form.reset(); setSelectMember(null); setSelectEvent(null); }} className="text-zinc-500 hover:text-zinc-900">
                        Limpiar Formulario
                    </Button>
                    <Button type="submit" form="form-donations" className="px-8 bg-zinc-900 hover:bg-zinc-800 text-white shadow-md transition-all">
                        Registrar Donación
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}