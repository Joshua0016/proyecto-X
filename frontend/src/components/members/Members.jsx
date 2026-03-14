import { useEffect, useState } from "react"
import React from "react";
import dayjs from "dayjs";
import getAllMembers from "../../apiServices/members/getAllMembers";
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
    randomEmail,
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
import updateMember from "../../apiServices/members/updateMember";
import createMember from "../../apiServices/members/createMember";
import deleteMember from "../../apiServices/members/deleteMember";


const roles = ['admin', 'user'];



function EditToolbar(props) {
    const { setRows, setRowModelsModel } = props;

    const handleClick = () => {
        const id = randomId();
        setRows((oldRows) => [
            ...oldRows,
            { id, name: '', lastName: '', phoneNumber: '', email: "", photoUrl: "text", birth: "", isnew: true }
        ]);
        setRowModelsModel((oldModel) => ({
            ...oldModel,
            //[id] propiedad computada, permite usar el valor de la variable id como nombre de la propiedad dentro del objeto.
            [id]: { mode: GridRowModes.Edit, fieldToFocus: "name" }
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
        async function allMembers() {
            const rows = await getAllMembers();
            setRows(rows);
            console.log(rows)
        }
        allMembers();
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

            handleDeleteClick: async (id) => {
                const success = await deleteMember(id);
                if (success) {

                    setRows((prevRows) => prevRows.filter((row) => row.id != id));

                }
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
    const processRowUpdate = async (newRow) => {
        try {

            const wasNew = newRow.isnew;
            const updateRow = { ...newRow, isnew: false, birth: dayjs(newRow.birth).format("YYYY-MM-DD"), };

            let success = wasNew ? await createMember(updateRow) : await updateMember(updateRow.id, updateRow);

            if (success) {

                setRows((PREVrOWS) =>
                    PREVrOWS.map((row) => (row.id === newRow.id ? updateRow : row))
                );

                if (wasNew) {
                    setRows(await getAllMembers());
                }

                return updateRow;
            }
            actionHandlers.handleCancelClick(newRow.id);


        } catch (error) {
            alert("Error al actualizar la fila...");
            console.log("Error en el try catch", error);
        }

    }

    //Definimos las columnas del dataGrid. cada valor del campo debe coincidir con el nombre de la propiedad row a la que se mapeara
    const columns = [
        { field: "id", headerName: "ID", width: 70 },
        {
            field: "name",
            headerName: "First name",
            editable: true,
            width: 130,
            preProcessEditCellProps: (params) => {
                const { props } = params;

                const hasNumber = /\d/.test(props.value) || props.value == "";
                return { ...props, error: hasNumber };
            }
        },
        {
            field: "lastName",
            headerName: "Last name",
            editable: true, width: 130,
            preProcessEditCellProps: (params) => {
                const { props } = params;

                const hasNumber = /\d/.test(props.value);

                return {
                    ...props,
                    error: hasNumber,
                }
            }
        },
        {
            field: "phoneNumber",
            headerName: "Phone",
            editable: true,
            width: 130,
            preProcessEditCellProps: (params) => {
                const { props } = params;

                const hasError = /^(809|829|849)\d{7}$/.test(props.value);

                return {
                    ...props,
                    error: !hasError,
                }
            }
        },
        {
            field: "email",
            headerName: "Email",
            width: 130,
            editable: true,
            preProcessEditCellProps: (params) => {
                const { props } = params;
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(props.value);


                return {
                    ...props,
                    error: !emailRegex,
                }
            }
        },
        { field: "photoUrl", headerName: "Photo", editable: false, width: 80 },
        { field: "birth", headerName: "Join date", type: "date", witdh: 180, editable: true, valueGetter: (value) => dayjs(value).toDate() },

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
                <div className="w-[90%] mx-auto xl:w-[60%]">


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
                                sx={{
                                    "& .Mui-error": {
                                        backgroundColor: "rgb(255,0,0,0.1)",
                                        color: "red",
                                        fontWeight: "bold"
                                    }
                                }}
                                editMode="row"
                                rowModesModel={rowModesModel}
                                // getRowId={(row) => row.Id}
                                onRowModesModelChange={setRowModelsModel}
                                onRowEditStop={handleRowEditStop}
                                onProcessRowUpdateError={(Error) => console.log(`Error capturado en el DataGrid ---> ${Error}`)}
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