"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"

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
import getAllMembers from "@/apiServices/members/getAllMembers"

import { useEffect, useState } from "react"
import DataTable from "react-data-table-component";
import dayjs from "dayjs"

import createDonation from "@/apiServices/donations/createDonations"
import { dataTableStyles, paginationOptions } from "@/components/shared/dataTableStyles"

const type = [

    { label: "Diezmo", value: "0" },
    { label: "Ofrenda", value: "1" },
    { label: "Campaña", value: "2" },
    { label: "Especial", value: "4" },
];
const paymentMethod = [
    { label: "Efectivo", value: "0" },
    { label: "Transferencia", value: "1" },
    { label: "Cheque", value: "2" },
    { label: "Tarjeta de crédito", value: "3" },
    { lavel: "Tajerta de débito", value: "4" }
];
const status = [
    { label: "Completado", value: "0" },
    { label: "Pendiente", value: "1" },
    { label: "Cancelado", value: "3" },
]


const formSchema = z.object({
    date: z.coerce
        .date("Fecha requerida"),

    amount: z
        .coerce.number()
        .gt(0, "Debe ingresar un monto mayor que cero")
    ,

    type: z
        .coerce.number("Seleccionar las opciones requeridas")
        .min(0, "Por favor seleccione el tipo")

    ,

    paymentMethod: z
        .coerce.number("Seleccionar las opciones requeridas")

    ,
    status: z
        .coerce.number("Seleccioanar las opciones requeridas")



})


export default function Donations() {
    const [members, setMembers] = useState([]);
    const [selectMember, setSelectMember] = useState(null);
    const [filters, setFilters] = useState([])
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function getMembers() {
            try {
                const members = await getAllMembers();
                if (members) {

                    setMembers(members);
                    setFilters(members);
                }
            } catch (error) {
                console.log("Error al traer los miembros ---> " + error);
            }

        }
        getMembers();

    }, []);

    const handleSearch = async (e) => {
        let value = e.target.value;
        setSearch(value);

        if (value != "") {
            const filter = members.filter((data) => data.firstName.includes(value));
            setFilters(filter);
        }
        else {
            setFilters(members);
        }
    }

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            date: "",
            amount: "",
            type: "select",
            paymentMethod: "select",
            status: "select"
        },
    })

    const columns = [
        {
            name: "Nombre",
            selector: (row) => `${row.firstName} ${row.lastName}`,
            sortable: true,
        },

    ]
    //styles
    const customStyles = dataTableStyles;
    function onSubmit(data) {
        async function Save() {
            if (selectMember) {
                try {
                    const newData = { ...data, date: dayjs(data.date).toISOString(), memberId: selectMember[0].memberId }
                    let response = await createDonation(newData);
                    if (response) {
                        form.reset();
                    }

                } catch (error) {
                    console.log("Error al enviar los datos --->> " + error)
                }
            }
            else {
                alert("Seleccionar miemrbo");
            }
        }
        Save();

    }
    return (
        <>

            <Card className="w-full mx-auto sm:max-w-2xl xl:max-w-6xl flex">
                <CardHeader>
                    <CardTitle>Configuración de cuenta</CardTitle>
                    <CardDescription>
                        Ingresa la información de tu cuenta a continuación
                    </CardDescription>
                </CardHeader>
                <CardContent className="">
                    <form id="form-rhf-input" onSubmit={form.handleSubmit(onSubmit)}>
                        <FieldGroup>
                            <div className="md:w-full  xl:w-[80%] mx-auto flex justify-between gap-7 p-8 ">
                                <div className="w-[30%] flex flex-col gap-8 ">
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
                                                    placeholder="Fecha"
                                                    autoComplete="fecha"

                                                />
                                                <FieldDescription>
                                                    Selección de fecha
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="amount"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field data-invalid={fieldState.invalid}>
                                                <FieldLabel htmlFor="form-rhf-input-amount">
                                                    Monto
                                                </FieldLabel>
                                                <Input
                                                    {...field}
                                                    id="form-rhf-input-date"
                                                    type="number"
                                                    aria-invalid={fieldState.invalid}
                                                    placeholder="0"
                                                    autoComplete="Monto"
                                                />
                                                <FieldDescription>
                                                    Monto total
                                                </FieldDescription>
                                                {fieldState.invalid && (
                                                    <FieldError errors={[fieldState.error]} />
                                                )}
                                            </Field>
                                        )}

                                    />
                                </div>

                                {/*Select form*/}
                                <div className="w-[45%] flex flex-col gap-8">
                                    <Controller
                                        name="type"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                orientation="responsive"
                                                data-invalid={fieldState.invalid}
                                            >
                                                <FieldContent>
                                                    <FieldLabel htmlFor="form-rhf-select-type">
                                                        Tipo
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
                                                        id="form-rhf-select-type"
                                                        aria-invalid={fieldState.invalid}
                                                        className="min-w-[80px]"
                                                    >
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent position="item-aligned">
                                                        <SelectItem value="select">Select</SelectItem>
                                                        <SelectSeparator />
                                                        {type.map((element) => (
                                                            <SelectItem key={element.value} value={element.value}>
                                                                {element.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>


                                            </Field>
                                        )}
                                    />
                                    <Controller
                                        name="paymentMethod"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                orientation="responsive"
                                                data-invalid={fieldState.invalid}
                                            >
                                                <FieldContent>
                                                    <FieldLabel htmlFor="form-rhf-select-paymentMethod">
                                                        Método
                                                    </FieldLabel>
                                                    <FieldDescription>
                                                        Selecciona el método de categoria
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
                                                        id="form-rhf-select-paymentMethod"
                                                        aria-invalid={fieldState.invalid}
                                                        className="min-w-[80px]"
                                                    >
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="select">Select</SelectItem>
                                                        <SelectSeparator />
                                                        {paymentMethod.map((element) => (
                                                            <SelectItem key={element.value} value={element.value}>
                                                                {element.label}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>


                                            </Field>
                                        )}
                                    />
                                </div>
                                <div>
                                    <Controller
                                        name="status"
                                        control={form.control}
                                        render={({ field, fieldState }) => (
                                            <Field
                                                orientation="responsive"
                                                data-invalid={fieldState.invalid}
                                            >
                                                <FieldContent>
                                                    <FieldLabel htmlFor="form-rhf-select-status">
                                                        Estado
                                                    </FieldLabel>
                                                    <FieldDescription>
                                                        Selecciona el estado de categoria
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
                                                        id="form-rhf-select-status"
                                                        aria-invalid={fieldState.invalid}
                                                        className="min-w-[80px]"
                                                    >
                                                        <SelectValue placeholder="Select" />
                                                    </SelectTrigger>
                                                    <SelectContent position="popper">
                                                        <SelectItem value="select">Select</SelectItem>
                                                        <SelectSeparator />
                                                        {status.map((element) => (
                                                            <SelectItem key={element.value} value={element.value}>
                                                                {element.label}
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
                        <Button type="button" variant="outline" onClick={() => form.reset()} className="cursor-pointer">
                            Restablecer
                        </Button>
                        <Button type="submit" form="form-rhf-input" className="cursor-pointer">
                            Guardar
                        </Button>
                    </Field>

                </CardFooter>
            </Card>


            <Card className="p-4 lg:w-[20%] mx-auto mt-5">
                <CardTitle>
                    Seleccion de miembros
                </CardTitle>
                <Input type="search" className="sm:w-[40%]" placeholder="Buscar" value={search} onChange={(e) => handleSearch(e)}></Input>
                <DataTable
                    customStyles={customStyles}
                    columns={columns}
                    data={filters}
                    pagination
                    paginationPerPage={3}
                    selectableRows
                    selectableRowsSingle
                    paginationRowsPerPageOptions={[3, 5, 10]}
                    paginationComponentOptions={paginationOptions}
                    onSelectedRowsChange={({ selectedRows }) => setSelectMember(selectedRows)}
                    highlightOnHover
                />

            </Card>

        </>
    )
}