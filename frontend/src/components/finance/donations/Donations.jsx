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
    FieldDescription,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldContent,
    FieldSet,
    FieldLegend,
    FieldTitle
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



import dayjs from "dayjs"
import { useEffect, useState } from "react"

import getAllMembers from "@/apiServices/members/getAllMembers"
import getAllEvents from "@/apiServices/events/getAllEvents"
import createDonation from "@/apiServices/donations/createDonations"
import getAllDonationType from "@/apiServices/donations/getAllDonationType"


const formSchema = z.object({
    observation: z
        .string()
        .max(250, "Solo puede contener 250 caracteres")
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/, "La descripcion solo puede contener letra")
    ,
    donationItemTypeId: z
        .number("Debes ingresar una donación")

    ,

})

export default function Donations() {
    const [members, setMembers] = useState([])
    const [events, setEvents] = useState([])

    const [selectMember, setSelectMember] = useState(null)
    const [selectEvent, setSelectEvent] = useState(null)

    const [donationType, setDonationType] = useState([]);

    useEffect(() => {
        async function getData() {
            try {
                const membersData = await getAllMembers();
                if (membersData) setMembers(membersData);

                const eventsData = await getAllEvents();
                if (eventsData) setEvents(eventsData);

                const donatioTypeData = await getAllDonationType();
                if (donatioTypeData) {
                    setDonationType(donatioTypeData);
                }



            } catch (error) {
                console.log("Error al traer los datos ---> " + error)
            }
        }
        getData();

    }, [])



    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            observation: "",
            donationItemTypeId: "",
        },
    })

    function onSubmit(data) {
        async function Save() {
            if (selectMember && selectEvent) {
                console.log(data)
            }

        }
        Save()
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
                    <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
                        {/* Contenedor Principal en Grid */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">

                            {/* COLUMNA IZQUIERDA: Selección y Texto (Ocupa 5/12) */}
                            <div className="lg:col-span-5 space-y-8">
                                <div className="space-y-6">
                                    {/* Miembros */}
                                    <div className="flex flex-col gap-2">
                                        <FieldLabel className="text-[11px] font-bold uppercase tracking-widest text-zinc-400">Seleccionar Miembro</FieldLabel>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-between h-11 border-zinc-200 hover:bg-zinc-50">
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
                                                                <CommandItem key={member.memberId} onSelect={() => {
                                                                    // Si el ID es igual al seleccionado, pongo null. Si no, pongo el nuevo ID.
                                                                    setSelectMember(selectMember === member.memberId ? null : member.memberId);
                                                                }}>
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
                                                <Button variant="outline" className="w-full justify-between h-11 border-zinc-200 hover:bg-zinc-50">
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
                                                                <CommandItem key={event.eventId} onSelect={() => setSelectEvent(event.eventId === selectEvent ? null : event.eventId)}>
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
                                                    placeholder="Detalles adicionales de la donación..."
                                                    className="min-h-[140px] w-full resize-none border-zinc-200 focus:border-zinc-900 transition-all"
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

                            {/* COLUMNA DERECHA: Tipo de Donación (Ocupa 7/12) */}
                            <div className="lg:col-span-7 bg-zinc-50/50 p-6 rounded-xl border border-zinc-100">
                                <Controller
                                    name="donationItemTypeId"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <FieldSet>
                                            <FieldLegend className="text-lg font-bold text-zinc-800 mb-1">Tipo de Donación</FieldLegend>
                                            <p className="text-sm text-zinc-500 mb-6">Selecciona la categoría que corresponde a esta entrega.</p>

                                            <RadioGroup
                                                value={field.value}
                                                onValueChange={field.onChange}
                                                className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                            >
                                                {donationType.map((plan) => (
                                                    <div key={plan.donationItemTypeId}>
                                                        <label
                                                            htmlFor={plan.donationItemTypeId}
                                                            className={`flex items-center justify-between p-4 rounded-lg border-2 transition-all cursor-pointer ${field.value === plan.id
                                                                ? "border-blue-600 bg-blue-50/30"
                                                                : "border-zinc-200 bg-white hover:border-zinc-300"
                                                                }`}
                                                        >
                                                            <div className="flex flex-col">
                                                                <span className="font-bold text-zinc-900 capitalize">{plan.name}</span>
                                                                <span className="text-xs text-zinc-500">Categoría {plan.category}</span>
                                                            </div>
                                                            <RadioGroupItem value={plan.donationItemTypeId} id={plan.donationItemTypeId} />
                                                        </label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                            {fieldState.invalid && <FieldError className="mt-4" errors={[fieldState.error]} />}
                                        </FieldSet>
                                    )}
                                />
                            </div>
                            {console.log(donationType)}
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-end gap-3 border-t border-zinc-100 pt-6 mt-4">
                    <Button type="button" variant="ghost" onClick={() => form.reset()} className="text-zinc-500 hover:text-zinc-900">
                        Limpiar Formulario
                    </Button>
                    <Button type="submit" form="form-rhf-input" className="px-8 bg-zinc-900 hover:bg-zinc-800 text-white shadow-md transition-all">
                        Registrar Donación
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
}