import { Card, CardTitle } from "@/components/ui/card"

export default function Profile() {

    return (
        <>
            <h1>Comenzamos</h1>
            <Card className="sm:max-w-lg mx-auto p-4">
                <CardTitle>
                    <h1 className="font-semibold text-lg sm:text-2xl">Detalles del usuario</h1>
                </CardTitle>
            </Card>
        </>
    )
}