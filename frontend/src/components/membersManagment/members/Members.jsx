import { useEffect, useState } from "react";
import React from "react";
import DataTable from "react-data-table-component";
//shadcn components
import { Button } from "@/components/ui/button";
import { LucidePencil, LucidePlus, LucideTrash } from "lucide-react";
import FormRhfInput from "./formCreate/Form";

//apiService
import getAllMembers from "../../../apiServices/members/getAllMembers";
import CardActions from "./cardActions/CardActions";
import dayjs from "dayjs";





export default function FullFeaturedCridGrid() {
  const [rows, setRows] = useState([]);
  const [formMember, setformMember] = useState(false);
  const [rowMember, setRowMember] = useState({});

  const [viewCardAction, setViewCardAction] = useState(false)
  useEffect(() => {
    //Database
    async function allMembers() {
      const rows = await getAllMembers();
      setRows(rows);

    }
    allMembers();
  }, []);

  const columns = [
    {
      name: "Nombre",
      selector: (row) => row.firstName,
      sortable: true,
    },
    {
      name: "Apellido",
      selector: (row) => row.lastName,
    },
    {
      name: "Correo",
      selector: (row) => row.email,
    },
    {
      name: "Telefono",
      selector: (row) => row.phoneNumber,
    },
    // {
    //   name: "Foto",
    //   selector: (row) => row.photoUrl,
    // },
    {
      name: "Cumpleaños",
      selector: (row) => dayjs(row.birthDate).format("YYYY-MM-DDDD"),
    },
    {
      name: "Acciones",
      cell: (row) => (
        <div className="flex gap-2">
          {/*Update*/}
          <Button className="cursor-pointer bg-gray-600" onClick={() => { setformMember(true); setRowMember({ ...row, isUpdate: true }) }}>
            <LucidePencil></LucidePencil>
          </Button>
          {/*Eliminate*/}
          <Button className="cursor-pointer bg-red-600" onClick={() => { setViewCardAction(true); setRowMember(row); }}>
            <LucideTrash>

            </LucideTrash>
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
      <div className="flex flex-col gap-4">
        <div className="flex justify-end w-full">
          {/*add member*/}
          <Button
            className="bg-black cursor-pointer right-0"
            onClick={() => { setformMember(true); setRowMember(null) }}
          >
            <LucidePlus></LucidePlus>
          </Button>

        </div>

        <div>

          <DataTable
            columns={columns}
            data={rows}
            customStyles={customStyles}
            pagination
          />

          {formMember && (
            <FormRhfInput
              setformMember={setformMember}
              setRows={setRows}
              rowMember={rowMember}
            ></FormRhfInput>
          )}

          {viewCardAction && (
            <CardActions
              setRows={setRows}
              setViewCardAction={setViewCardAction}
              rowMember={rowMember}>
            </CardActions>
          )}
        </div>
      </div>
    </>
  );
}
