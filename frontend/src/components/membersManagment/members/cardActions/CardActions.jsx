import deleteMember from "@/apiServices/members/deleteMember"
import getAllMembers from "@/apiServices/members/getAllMembers";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function CardActions({ setRows, setViewCardAction, rowMember, setFilters, setSearch }) {
    const handleDelete = async (row) => {

        try {

            const response = await deleteMember(row.memberId);
            if (response) {
                let membersUpdate = await getAllMembers();
                if (membersUpdate) {
                    setRows(membersUpdate);
                    setViewCardAction(false);
                    setFilters(membersUpdate);
                    setSearch("");
                }

            }
        } catch (error) {
            console.log("Error en CardDelete.jsx try cath al intentar eliminar --->  " + error);
            setViewCardAction(false);
        }



    }
    return (
        <>
            <div className="fixed z-50 inset-0 bg-black/70 backdrop-blur-[5px] flex">

                <Card size="sm" className="mx-auto w-[100%] max-w-sm my-auto">
                    <CardHeader>
                        <CardTitle>Eliminacion de miembro</CardTitle>
                        <CardDescription>
                            Confirmación
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>
                            ¿Estás seguro que deseas ralizar esta acción?
                        </p>
                    </CardContent>
                    <CardFooter className="flex flex-col">
                        <Button variant="outline" size="sm" className="w-full cursor-pointer " onClick={() => handleDelete(rowMember)}>
                            Aceptar
                        </Button>
                        <Button variant="destructive" size="sm" className="w-full cursor-pointer" onClick={() => setViewCardAction(false)}>
                            Cancelar
                        </Button>
                    </CardFooter>
                </Card>



            </div>
        </>

    )
}
