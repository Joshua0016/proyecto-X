import { useEffect, useState } from "react"
import React from "react";

import Box from '@mui/material/Box';//contenedor de estilos
import Tooltip from '@mui/material/Tooltip';//Componente que muestra un texto flotante al pasar el cursor sobre un elemento
//Iconos
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/DeleteOutlined';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Close';
import {
    randomCreatedDate,
    randomTraderName,
    randomId,
    randomArrayItem,
} from '@mui/x-data-grid-generator';
//Tabla
import {
    GridRowModes, //Enum para definir los modos de una fila (viwe o edit)
    DataGrid,//Componente principal de tabla con paginacion, filtros, edicin
    GridRowEditStopReasons,//Enum que idica por que se detuvo la edicion de una fila (el. perdida de foco, tecla Enter etc).
    Toolbar,//Barra superior 
    ToolbarButton,//Boton dentro de la barra de herramientas (superior)
    gridEditRowsStateSelector,//Selector para obetner el estado de las filas que estan en edicion
    useGridSelector,//Hook para acceder a partes especificas del estado interno del DataGrid
    useGridApiContext,//Hook que da acceso al API del DataGrid (ej. para actualizar filas, cambiar modos, etc.)
    GridActionsCell,//Celda especial que contiene acciones (botones) dentro de la tabla
    GridActionsCellItem,//Cada accion individual dentro de la celda de acciones(ej. boton de editar, borrar, guardar)
} from '@mui/x-data-grid';


const roles = ['admin', 'user'];

function EditToolbar(props) {
    const { setRows, setRowModelsModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [
            ...oldRows,
            { id, name: '', lastName: '', age: '', isnew: true }
        ]);
        setRowModelsModel((oldModel) => ({
            ...oldModel,
            //[id] propiedad computada, permite usar el valor de la variable id como nombre de la propiedad dentro del objeto.
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "firstName" }
        }));
    };

    return (
        <Toolbar>
            <Tooltip title="Add member">
                <ToolbarButton onClick={handleClick}>
                    <AddIcon fontSize="small"></AddIcon>
                </ToolbarButton>
            </Tooltip>
        </Toolbar>
    );
}

//React crea un espacio en memoria para que  todas las funciones esten disponibles para cualquier Componente sin pasar props
const ActionHandlersContext = React.createContext({
    handleCancelClick: () => { },
    handleDeleteClick: () => { },
    handleEditClick: () => { },
    handleSaveClick: () => { },
});
//Botones de las celdas
function ActionsCell(props) {
    const apiRef = useGridApiContext();
    const rowModesModel = useGridSelector(apiRef, gridEditRowsStateSelector);//objeto que guarda el estado de la tabla (members, y funciones internas de MUI) y devuelve el resultado de gridRowSelector
    const isInEditMode = typeof rowModesModel[props.id] != 'undefined';

    const { handleSaveClick, handleCancelClick, handleEditClick, handleDeleteClick } = React.useContext(ActionHandlersContext);

    return (
        <GridActionsCell {...props}>
            {isInEditMode ? (
                <React.Fragment>
                    <GridActionsCellItem icon={<SaveIcon />} label="Save" material={{ sx: { color: "primary.main" } }} onClick={() => handleSaveClick(props.id)} />
                    <GridActionsCellItem icon={<CancelIcon />} label="Cancel" className="textPrimary" onClick={() => handleCancelClick(props.id)} color="inherit" />
                </React.Fragment>

            ) : (
                <React.Fragment>
                    <GridActionsCellItem icon={<EditIcon />} label="Edit" className="textPrimary" onClick={() => handleEditClick(props.id)} color="inherit" />
                    <GridActionsCellItem icon={<DeleteIcon />} label="Delete" onClick={() => handleDeleteClick(props.id)} color="inherit" />
                </React.Fragment>
            )}

        </GridActionsCell>
    )
}

export default function FullFeaturedCridGrid() {
    const [rows, setRows] = useState([]);
    const [rowModesModel, setRowModelsModel] = useState({});
    useEffect(() => {
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
        setRows(rows);
    }, []);

    const handleRowEditStop = (params, event) => {
        if (params.reason === GridRowEditStopReasons.rowFocusOut) {
            event.defaultMuiPrevented = true;
        }
    };
    const actionHandlers = React.useMemo(
        () => ({
            handleEditClick: (id) => {
                setRowModelsModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: { mode: GridRowModes.Edit },
                }));
            },
            handleSaveClick: (id) => {
                setRowModelsModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: { mode: GridRowModes.View },
                }));
            },

            handleDeleteClick: (id) => {
                setRows((prevRows) => prevRows.filter((row) => row.id !== id));
            },
            handleCancelClick: (id) => {
                setRowModelsModel((prevRowModesModel) => ({
                    ...prevRowModesModel,
                    [id]: { mode: GridRowModes.View, ignoreModifications: true },
                }));

                setRows((prevRows) => {
                    const editedRow = prevRows.find((row) => row.id === id);
                    if (editedRow?.isnew) {
                        return prevRows.filter((row) => row.id !== id);
                    }
                    return prevRows;
                });
            }
        }),
        [rowModesModel] //  pasando las dependencias para que las funciones vean el estado actualizado
    );
    const processRowUpdate = (newRow) => {
        const updateRow = { ...newRow, isnew: false };
        setRows((PREVrOWS) =>
            PREVrOWS.map((row) => (row.id === newRow.id ? updateRow : row))
        );
        return updateRow;
    }

    //Definimos las columnas del dataGrid. cada valor del campo debe coincidir con el nombre de la propiedad row a la que se mapeara
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        { field: "firstName", headerName: "First name", editable: true, width: 130 },
        { field: "lastName", headerName: "Last name", editable: true, width: 130 },
        {
            field: "age",
            headerName: "Age",
            width: 90,
            editable: true,
        },
        {
            field: "fullName",
            headerName: "Full name",
            description: "This column has a value getter and is not sortable.",

            width: 160,
            valueGetter: (value, row) => `${row.firstName || ``} ${row.lastName || ``}`,
        },
        {
            field: 'actions',
            type: 'actions',
            headerName: 'Actions',
            width: 100,
            cellClassName: 'actions',
            renderCell: (params) => <ActionsCell {...params} />,
        },

    ];

    return (
        <>
            <div className="mt-[100px] mb-[50px]">
                <h1 className="text-white text-[28px] text-center lg:text-[48px]">Members</h1>
                <div className="w-[40%] mx-auto">


                    <Box
                        sx={{
                            height: 500,
                            width: '100%',
                            '& .actions': {
                                color: 'text.secondary',
                            },
                            '& .textPrimary': {
                                color: 'text.primary',
                            },
                        }}
                    >
                        <ActionHandlersContext.Provider value={actionHandlers}>
                            <DataGrid
                                rows={rows}
                                columns={columns}
                                editMode="row"
                                rowModesModel={rowModesModel}
                                onRowModesModelChange={setRowModelsModel}
                                onRowEditStop={handleRowEditStop}
                                processRowUpdate={processRowUpdate}
                                showToolbar
                                slots={{ toolbar: EditToolbar }}
                                slotProps={{
                                    toolbar: { setRows, setRowModelsModel },
                                }}
                            />
                        </ActionHandlersContext.Provider>
                    </Box>

                </div>

            </div>


        </>
    )
}