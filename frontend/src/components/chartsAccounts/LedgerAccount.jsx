import { useEffect, useState } from "react";
import FormAccount from "./formAccount/FormAccount";
import DataTable from "react-data-table-component";
import getAllAccounts from "@/apiServices/ledgerAccount/getAllAccount";
import { consumeSlots } from "@mui/x-charts/internals";
import { Button } from "../ui/button";
import { LucideTrash } from "lucide-react";
import CardActions from "./cardActions/CardActions";
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

    const customStyles = {
        header: {
            style: {
                minHeight: "56px",
            },
        },
        headRow: {
            style: {
                borderTopStyle: "solid",
                borderTopWidth: "1px",
                borderTopColor: "#e5e7eb",
                backgroundColor: "#f9fafb",
            },
        },
        headCells: {
            style: {
                fontWeight: "bold",
                fontSize: "14px",
                color: "#374151",
            },
        },
        cells: {
            style: {
                fontSize: "14px",
                paddingLeft: "16px",
                paddingRight: "16px",
            },
        },
        rows: {
            style: {
                minHeight: "64px", // Filas más altas para que respiren
                "&:not(:last-of-type)": {
                    borderBottomStyle: "solid",
                    borderBottomWidth: "1px",
                    borderBottomColor: "#e5e7eb",
                },
            },
        },
    };
    return (
        <>
            <FormAccount setRows={setRows}></FormAccount>

            <div className="mt-[25px] w-[80%] mx-auto">
                <DataTable columns={columns} data={rows} customStyles={customStyles} pagination />
            </div>

            {viewCardAction && (
                <CardActions setRows={setRows} setViewCardAction={setViewCardAction} rowAccount={rowAccount}></CardActions>
            )}


        </>
    )
}