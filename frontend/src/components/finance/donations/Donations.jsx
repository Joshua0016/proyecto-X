"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
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
import { FieldLabel } from "@/components/ui/field"

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

import dayjs from "dayjs"
import { useEffect, useState } from "react"

import getAllMembers from "@/apiServices/members/getAllMembers"
import getAllEvents from "@/apiServices/events/getAllEvents"
import createDonation from "@/apiServices/donations/createDonations"
import getAllDonationType from "@/apiServices/donations/getAllDonationType"

const formSchema = z.object({
    observation: z
        .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ-\s]*$/, "La descripcion solo puede contener letra"),
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
                if (donatioTypeData) setDonationType(donatioTypeData);



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
        },
    })

    function onSubmit(data) {
        async function Save() {
            if (selectMember && selectEvent) {
                try {
                    const newData = {
                        ...data,
                        date: dayjs().format(),
                        memberId: selectMember,
                        eventId: selectEvent,
                    }
                    let response = await createDonation(newData)
                    if (response) form.reset()
                } catch (error) {
                    console.log("Error al enviar los datos --->> " + error)
                }
            } else {
                alert("Seleccionar miembro y evento")
            }
        }
        Save()
    }

    return (
        <div className="w-full flex flex-col items-center gap-6 p-6 bg-gray-50 min-h-screen">
            <Card className="w-full lg:w-[90%] shadow-lg rounded-lg">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-800">Donaciones</CardTitle>
                    <CardDescription className="text-gray-600">
                        Ingresa la información requerida a continuación
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-[50%]">

                            {/* Miembros */}
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <FieldLabel className="font-semibold text-gray-700 mb-2">Seleccionar miembro</FieldLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                        >
                                            {selectMember
                                                ? members.find((m) => m.memberId === selectMember)?.firstName
                                                : "Buscar miembro..."}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar miembro..." />
                                            <CommandList>
                                                <CommandEmpty>No se encontró</CommandEmpty>
                                                <CommandGroup>
                                                    {members.map((member) => (
                                                        <CommandItem
                                                            key={member.memberId}
                                                            onSelect={() => setSelectMember(member.memberId)}
                                                        >
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
                            <div className="bg-white p-4 rounded-lg shadow-md">
                                <FieldLabel className="font-semibold text-gray-700 mb-2">Seleccionar evento</FieldLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className="w-full justify-between"
                                        >
                                            {selectEvent
                                                ? events.find((e) => e.eventId === selectEvent)?.title
                                                : "Buscar evento..."}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-full p-0">
                                        <Command>
                                            <CommandInput placeholder="Buscar evento..." />
                                            <CommandList>
                                                <CommandEmpty>No se encontró</CommandEmpty>
                                                <CommandGroup>
                                                    {events.map((event) => (
                                                        <CommandItem
                                                            key={event.eventId}
                                                            onSelect={() => setSelectEvent(event.eventId)}
                                                        >
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
                    </form>
                </CardContent>
                <CardFooter className="flex justify-end gap-4">
                    <Button type="button" variant="outline" onClick={() => form.reset()} className="cursor-pointer">
                        Restablecer
                    </Button>
                    <Button type="submit" form="form-rhf-input" className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white">
                        Guardar
                    </Button>
                </CardFooter>
            </Card>
            {console.log(donationType)}
        </div>

    )
}
