import { useEffect, useState } from "react";
import React from "react";
import DataTable from "react-data-table-component";
//shadcn components
import { Button } from "@/components/ui/button";
import { LucidePencil, LucidePlus, LucideTrash } from "lucide-react";
import FormRhfInput from "./formCreate/Form";
import { Input } from "@/components/ui/input";
import { dataTableStyles, paginationOptions } from "@/components/shared/dataTableStyles";

//apiService
import getAllMembers from "../../../apiServices/members/getAllMembers";
import CardActions from "./cardActions/CardActions";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";





export default function FullFeaturedCridGrid() {
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [formMember, setformMember] = useState(false);
  const [rowMember, setRowMember] = useState({});
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState([])

  const [viewCardAction, setViewCardAction] = useState(false)
  useEffect(() => {
    //Database
    async function allMembers() {
      const rows = await getAllMembers();
      setRows(rows);
      setFilters(rows);


    }
    allMembers();
  }, []);

  const columns = [
    {
      name: "Nombre",
      selector: (row) => `${row.firstName} ${row.lastName}`,
      sortable: true,
    },

    {
      name: "Direccón",
      selector: (row) => row.address,
    },
    {
      name: "Género",
      selector: (row) => row.gender,
    },
    {
      name: "Estado civil",
      selector: (row) => row.maritalStatus,
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
          <Button className="cursor-pointer bg-primary hover:bg-primary/90" onClick={() => { setformMember(true); setRowMember({ ...row, isUpdate: true }) }}>
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
  const customStyles = dataTableStyles;
  const handleSearch = async (e) => {

    const value = e.target.value;

    setSearch(value);

    if (value != "") {
      const newRows = rows.filter((data) => data.firstName.toLowerCase().includes(value.toLowerCase()));
      setFilters(newRows);



    } else {
      setFilters(rows);
    }
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex justify-between w-full">
          <Input type="search" id="search" placeholder="Buscar" className="sm:max-w-sm" value={search} onChange={(e) => handleSearch(e)} />
          {/*add member*/}
          <Button
            className="bg-primary hover:bg-primary/90 cursor-pointer"
            onClick={() => { setformMember(true); setRowMember(null) }}
          >
            <LucidePlus></LucidePlus>
          </Button>

        </div>

        <div>

          <DataTable
            columns={columns}
            data={filters}
            customStyles={customStyles}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 50]}
            paginationComponentOptions={paginationOptions}
            noDataComponent={
              <div className="py-12 text-center text-muted-foreground text-sm">
                No hay miembros registrados.
              </div>
            }
            highlightOnHover
            pointerOnHover
            onRowClicked={(row) => navigate(`/home/member/${row.id}`, { state: { member: row } })}
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
              rowMember={rowMember}
              setFilters={setFilters}
              setSearch={setSearch}>

            </CardActions>
          )}
        </div>


      </div >
    </>
  );
}
