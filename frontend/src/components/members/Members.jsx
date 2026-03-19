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
export default function FullFeaturedCridGrid() {
    const [rows, setRows] = useState([]);
    const [formMember, setformMember] = useState(false);
    useEffect(() => {
        //Database
        async function allMembers() {
            const rows = await getAllMembers();
            setRows(rows);
            console.log(rows)
        }
        allMembers();
    }, []);

    const handleButton = () => {
        setformMember(true);
    }

    return (
        <>
            <div className="mt-[100px] mb-[50px]">
                <h1 className="text-black text-[28px] text-center lg:text-[48px]">Members</h1>
                <div className="w-[90%] mx-auto xl:w-[60%]">

                    <Button className="bg-black cursor-pointer" onClick={handleButton}>Add</Button>

                    <Table className="bg-white rounded-2xl">
                        <TableCaption>A list of your recent members.</TableCaption>
                        <TableHeader className="">

                            <TableRow className="p-2">
                                <TableHead className="w-[100px]">Id</TableHead>
                                <TableHead>Name</TableHead>
                                <TableHead>Last Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Phone Number</TableHead>
                                <TableHead>Photo</TableHead>
                                <TableHead className="text-right">Birth</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            <TableRow className="text-black">

                                <TableCell className="font-medium">{rows.map((element) => element.id)}</TableCell>
                                <TableCell>{rows.map((element) => element.name)}</TableCell>
                                <TableCell>{rows.map((element) => element.lastName)}</TableCell>
                                <TableCell>{rows.map((element) => element.email)}</TableCell>
                                <TableCell>{rows.map((element) => element.phoneNumber)}</TableCell>
                                <TableCell>{rows.map((element) => element.photoUrl)}</TableCell>
                                <TableCell className="text-right">{rows.map((element) => element.birth)}</TableCell>
                            </TableRow>
                        </TableBody>
                    </Table>
                    {formMember && <FormRhfInput setformMember={setformMember}></FormRhfInput>}
                </div>

            </div>


        </>
    )
}