import { useEffect, useState } from "react";
import FormAccount from "./formAccount/FormAccount";
import DataTable from "react-data-table-component";
import getAllAccounts from "@/apiServices/ledgerAccount/getAllAccount";
import { consumeSlots } from "@mui/x-charts/internals";
import { Button } from "../ui/button";
import { LucideTrash } from "lucide-react";
import CardActions from "./cardActions/CardActions";
import { Card, CardTitle } from "../ui/card";
import { dataTableStyles, paginationOptions } from "@/components/shared/dataTableStyles";
export default function LedgerAccount() {
    const [rows, setRows] = useState();
    const [rowAccount, setRowAccount] = useState();
    const [viewCardAction, setViewCardAction] = useState();
    useEffect(() => {
        async function getAccount() {
            try {
                let rows = await getAllAccounts();
                setRows(rows);
                console.log(rows)
            } catch (error) {
                console.log("error try catch ledgerAccount ----> " + error);
            }
        }
        getAccount()
    }, [])

    const columns = [
        {
            name: "Código de cuenta",
            selector: (row) => row.accountCode,
            sortable: true
        },
        {
            name: "Descripción",
            selector: (row) => row.name,
        },
        {
            name: "Acciones",
            cell: (row) => (
                <div>
                    <Button className="bg-red-600 cursor-pointer" onClick={() => { setViewCardAction(true); setRowAccount(row) }}>
                        <LucideTrash></LucideTrash>
                    </Button>
                </div>
            )
        }
    ];

    const customStyles = dataTableStyles;
    return (
        <>
            <FormAccount setRows={setRows}></FormAccount>

            <Card className="mt-[25px] w-[80%] mx-auto p-8">
                <CardTitle>
                    Cuentas
                </CardTitle>
                <DataTable columns={columns} data={rows} customStyles={customStyles} pagination paginationComponentOptions={paginationOptions} highlightOnHover />
            </Card>

            {viewCardAction && (
                <CardActions setRows={setRows} setViewCardAction={setViewCardAction} rowAccount={rowAccount}></CardActions>
            )}


        </>
    )
}