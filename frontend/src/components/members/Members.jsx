import { useEffect, useState } from "react"
import React from "react";
import dayjs from "dayjs";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import getAllMembers from "../../apiServices/members/getAllMembers";
import FormRhfInput from "./form/Form"
import DataTable from "react-data-table-component";
import deleteMember from "@/apiServices/members/deleteMember";
import { data } from "react-router-dom";
import { promise } from "zod";
export default function FullFeaturedCridGrid() {
    const [rows, setRows] = useState([]);
    const [formMember, setformMember] = useState(false);
    const [selectRow, setSelectRow] = useState(true);
    const [handleRows, setHandleRows] = useState();
    const [toggleCleared, setToggleCleared] = useState(false);
    useEffect(() => {
        //Database
        async function allMembers() {
            const rows = await getAllMembers();
            setRows(rows);
            console.log(rows)
        }
        allMembers();
    }, []);



    const columns = [
        {
            name: "ID",
            selector: row => row.id,
            sortable: true,
        },
        {
            name: "name",
            selector: row => row.name,
            sortable: true,
        },
        {
            name: "Last Name",
            selector: row => row.lastName,
        },
        {
            name: "email",
            selector: row => row.email,
        },
        {
            name: "phone",
            selector: row => row.phoneNumber,
        },
        {
            name: "photoUrl",
            selector: row => row.photoUrl,
        },
        {
            name: "birth",
            selector: row => row.birth
        }

    ];
    const customStyles = {
        header: {
            style: {
                minHeight: '56px',
            },
        },
        headRow: {
            style: {
                borderTopStyle: 'solid',
                borderTopWidth: '1px',
                borderTopColor: '#e5e7eb',
                backgroundColor: '#f9fafb',
            },
        },
        headCells: {
            style: {
                fontWeight: 'bold',
                fontSize: '14px',
                color: '#374151',
            },
        },
        cells: {
            style: {
                fontSize: '14px',
                paddingLeft: '16px',
                paddingRight: '16px',
            },
        },
        rows: {
            style: {
                minHeight: '64px', // Filas más altas para que respiren
                '&:not(:last-of-type)': {
                    borderBottomStyle: 'solid',
                    borderBottomWidth: '1px',
                    borderBottomColor: '#e5e7eb',
                },
            },
        },
    };
    const handleSelectRows = (data) => {
        setSelectRow(data.selectedCount === 0);
        setHandleRows(data);
        console.log(data)
    }
    //delete rows
    const handleDelete = async () => {

        try {
            const members = handleRows.selectedCount;
            const deletePromises = handleRows.selectedRows.map(async (element) => await deleteMember(element.id));
            await Promise.all(deletePromises);

            setRows(await getAllMembers());
            alert(`${members} members have been delete`)
            setToggleCleared(!toggleCleared);
            setSelectRow(true);

        } catch (error) {
            console.log("Error en memberjsx --> " + error);
        }

    }

    return (
        <>
            <div className="mt-[100px] mb-[50px]">
                <h1 className="text-black text-[28px] text-center lg:text-[48px]">Members</h1>
                <div className="w-[90%] mx-auto xl:w-[60%]">

                    <div className="flex justify-between">
                        <div>
                            <Button className="bg-black cursor-pointer" onClick={() => setformMember(true)}>Add</Button>

                        </div>
                        <div>
                            <Button className="bg-gray-600 cursor-pointer" disabled={selectRow}>Update</Button>
                            <Button className="bg-red-600 cursor-pointer" disabled={selectRow} onClick={handleDelete} >Eliminate</Button>

                        </div>

                    </div>


                    <DataTable columns={columns} data={rows} customStyles={customStyles} pagination selectableRows clearSelectedRows={toggleCleared} onSelectedRowsChange={(data) => handleSelectRows(data)} />

                    {formMember && <FormRhfInput setformMember={setformMember} setRows={setRows}></FormRhfInput>}
                </div>

            </div>


        </>
    )
}