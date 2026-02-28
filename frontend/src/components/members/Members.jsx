import { useState } from "react"
import CreateMember from "./createMember/CreateMember";
import EditMember from "./editMember/EditMember";
import Button from "@mui/material/Button"
import { DataGrid } from "@mui/x-data-grid";
import Paper from "@mui/material/Paper"
import IconButton from "@mui/material/IconButton";

export default function Members() {
    const [viewCreate, setViewCreate] = useState(true);
    const [viewEdit, setViewEdit] = useState(true);
    const [rowslalo, setRows] = useState();


    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "firstName", headerName: "First name", width: 130 },
        { field: "lastName", headerName: "Last name", width: 130 },
        {
            field: "age",
            headerName: "Age",
            width: 90
        },
        {
            field: "fullName",
            headerName: "Full name",
            description: "This column has a value getter and is not sortable.",
            //sortable: false,
            width: 160,
            valueGetter: (value, row) => `${row.firstName || ``} ${row.lastName || ``}`,
        },

    ];
    //Database
    const rows = [
        { id: 1, lastName: "Snow", firstName: "Jon", age: 60 },
        { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42 },
        { id: 3, lastName: "Joshua", firstName: "Cersei", age: 35 },
        { id: 4, lastName: "Alexander", firstName: "Cersei", age: 45 },
        { id: 5, lastName: "Williams", firstName: "Cersei", age: 28 },
        { id: 6, lastName: "Williams", firstName: "Cersei", age: 17 },
        { id: 7, lastName: "Williams", firstName: "Cersei", age: 22 },
        { id: 8, lastName: "Williams", firstName: "Cersei", age: 19 },
        { id: 9, lastName: "Williams", firstName: "Cersei", age: 14 },
    ];

    const paginationModel = { page: 0, pageSize: 3 };
    let array = []
    return (
        <>
            <div className="mt-[100px] mb-[50px]">
                <h1 className="text-white text-[28px] text-center lg:text-[48px]">Members</h1>

                <div className=" rounded-2xl p-8 sm:text-2xl ">

                    {/* 

                    {(viewCreate && viewEdit) && (
                        <div className="flex flex-col gap-10 w-full h-full justify-around sm:w-[70%] sm:mx-auto 2xl:w-[40%]">
                            <div style={{ backgroundColor: "#007ACC" }} className="w-[80%] mx-auto border-2 border-gray-200 rounded-[10px] ">
                                <button className=" w-[100%] cursor-pointer  xl:h-[35px]" onClick={() => setViewCreate(!viewCreate)}>Create</button>
                            </div>
                            <div style={{ backgroundColor: "#007ACC" }} className=" w-[80%] mx-auto border-2 border-gray-200 rounded-[10px]  border-gray-200 text-center cursor-pointer">
                                <button className="w-[100%] cursor-pointer  xl:h-[35px]" onClick={() => setViewEdit(!viewEdit)}>Edit</button>
                            </div>
                        </div>
                    )}

                    {!viewCreate && <CreateMember setView={setViewCreate}></CreateMember>}
                    {!viewEdit && <EditMember setView={setViewEdit}></EditMember>} */}
                    <Paper className="w-[40%] mx-auto" >

                        <div className="flex justify-between p-2">
                            <h2>Member list</h2>

                            <Button variant="contained" color="error">Delete</Button>
                        </div>

                        <DataGrid
                            rows={rows}
                            columns={columns}
                            initialState={{ pagination: { paginationModel } }}
                            pageSizeOptions={[3, 5]}
                            checkboxSelection onRowSelectionModelChange={((row) => {
                                console.log(row);
                            })}

                        ></DataGrid>

                    </Paper>



                </div>

            </div>


        </>
    )
}