"use client"

import { zodResolver } from "@hookform/resolvers/zod" //libreria de validaciones de esquemas 
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
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
    name: z
        .string()
        .min(3, "name must be at least 3 characters.")
        .max(10, "Username must be at most 10 characters.")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "Only letters and spaces are allowed."
        ),
    lastName: z
        .string()
        .min(3, "Last Name must be at least 3 characters.")
        .max(10, "Last name must be at most 10 characters.")
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            "Only letters and spaces are allowed."
        ),
    email: z
        .string()
        .min(5, "email must be at least 5 characters.")
        .max(150, "Email must be at most 150 characters."),

    phoneNumber: z
        .string()
        .min(10, "phone number must be at least 10 digits")
        .max(10, "Phone number must be at most 10 digits.")
        .regex(
            /^(809|829|849)\d{7}$/,
            "phone number can ony 829/809/849 with 7 digits"
        ),
    birth: z.coerce
        .date("Date is required")

})

export default function FormRhfInput() {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            birth: "",
        },
    })

    function onSubmit(data) {
        console.log(data);
    }

    return (
        <>
            <div className="absolute inset-0 bg-black/70 backdrop-blur-[5px] flex ">
                <Card className="w-full sm:max-w-md top-0 bottom-0 my-auto mx-auto">
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
                                    name="name"
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
                                    name="lastName"
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
                                    name="email"
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
                                    name="phoneNumber"
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
                                    name="birth"
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
            </div>

        </>

    )
}
