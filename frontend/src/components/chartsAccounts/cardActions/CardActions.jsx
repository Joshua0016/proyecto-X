
import deleteAccount from "@/apiServices/ledgerAccount/deleteAccount"
import getAllAccounts from "@/apiServices/ledgerAccount/getAllAccount";
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export default function CardActions({ setRows, setViewCardAction, rowAccount }) {
    const handleDelete = async (row) => {

        try {
            let response = await deleteAccount(row.accountCode);
            if (response) {
                setRows(await getAllAccounts());
                setViewCardAction(false);
            }

        } catch (error) {
            console.log("Error trycatch CardActions ---> " + error);
        }


    }
    return (
        <>
            <div className="fixed z-50 inset-0 bg-black/70 backdrop-blur-[5px] flex">

                <Card size="sm" className="mx-auto w-[100%] max-w-sm my-auto">
                    <CardHeader>
                        <CardTitle>Eliminacion de cuenta</CardTitle>
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
                        <Button variant="outline" size="sm" className="w-full cursor-pointer " onClick={() => handleDelete(rowAccount)}>
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
