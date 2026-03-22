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
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import dayjs from "dayjs";
import createMember from "@/apiServices/members/createMember";
import { useState } from "react";
import getAllMembers from "@/apiServices/members/getAllMembers";
const formSchema = z.object({
    FirstName: z
        .string()
        .min(3, "name must be at least 3 characters.")
        .max(20, "Username must be at most 10 characters.")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "Only letters and spaces are allowed."
        ),
    LastName: z
        .string()
        .min(3, "Last Name must be at least 3 characters.")
        .max(20, "Last name must be at most 10 characters.")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "Only letters and spaces are allowed."
        ),
    Email: z
        .string()
        .min(5, "email must be at least 5 characters.")
        .max(150, "Email must be at most 150 characters."),

    PhoneNumber: z
        .string()
        .min(10, "phone number must be at least 10 digits")
        .max(10, "Phone number must be at most 10 digits.")
        .regex(
            /^(809|829|849)\d{7}$/,
            "phone number can ony 829/809/849 with 7 digits"
        ),
    BirthDate: z.coerce
        .date("Date is required")

})

export default function FormRhfInput({ setformMember, setRows }) {


    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            FirstName: "",
            LastName: "",
            Email: "",
            PhoneNumber: "",
            BirthDate: "",
        },
    })

    function onSubmit(data) {
        const create = async () => {
            data.BirthDate = dayjs(data.birth).toISOString();
            console.log(data)

            const newdata = { ...data, PhotoUrl: "text" };
            try {
                const response = await createMember(newdata);
                if (response) {
                    setRows(await getAllMembers());
                    setformMember(false);
                }

            } catch (error) {
                console.log("error al crear el miembro" + error)
            }
        }
        create();
    }



    return (
        <>
            <div className="fixed z-50 inset-0 bg-black/70 backdrop-blur-[5px] flex p-2">
                <Card className="w-[90%] h-[85%] md:h-[70%] lg:w-[90%] lg:h-[90%] xl:w-[20%] xl:h-[58%] mx-auto my-[auto] overflow-auto">
                    <CardHeader>
                        <CardTitle>Member Settings</CardTitle>
                        <CardDescription>
                            Update your member information below.
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
                                                Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-input-name"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="name"
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
                                                Last Name
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-input-lastName"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="last name"
                                                autoComplete="Last name"
                                            />
                                            {fieldState.invalid && (
                                                <FieldError errors={[fieldState.error]} />
                                            )}
                                        </Field>
                                    )}


                                />
                                <FieldDescription>
                                    This is your public display name and last name. Must be between 3 and 10
                                    characters. Must only contain letters
                                </FieldDescription>
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
                                    This is your public display email address. Must be between 3 and 150
                                    characters.
                                </FieldDescription>
                                <Controller
                                    name="PhoneNumber"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-html-input-phoneNumber">
                                                Phone
                                            </FieldLabel>
                                            <Input
                                                {...field}
                                                id="form-rhf-input-phoneNumber"
                                                aria-invalid={fieldState.invalid}
                                                placeholder="80930000000"
                                                type="tel"
                                                autoComplete="phone"
                                            />
                                            {fieldState.invalid &&
                                                (<FieldError errors={[fieldState.error]} />)
                                            }

                                        </Field>
                                    )}
                                />
                                <FieldDescription>
                                    This is your public display phone number. Must be 10 digits.
                                </FieldDescription>
                                <Controller
                                    name="BirthDate"
                                    control={form.control}
                                    render={({ field, fieldState }) => (
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="form-html-input-birth">
                                                Birth
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
                                        Reset
                                    </Button>
                                    <Button type="submit" form="form-rhf-input" className="cursor-pointer">
                                        Save
                                    </Button>

                                </div>
                                <Button onClick={() => setformMember(false)} className="bg-red-600 cursor-pointer">Cancel</Button>
                            </div>

                        </Field>
                    </CardFooter>
                </Card>
            </div>

        </>

    )
}
