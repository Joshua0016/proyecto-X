/**
 * Estilos compartidos para react-data-table-component
 * Estilo Google Drive: limpio, minimalista, con paginación moderna
 */
export const dataTableStyles = {
  header: {
    style: {
      minHeight: "56px",
    },
  },
  headRow: {
    style: {
      borderTopStyle: "none",
      borderBottomStyle: "solid",
      borderBottomWidth: "1px",
      borderBottomColor: "#E2E8F0",
      backgroundColor: "transparent",
    },
  },
  headCells: {
    style: {
      fontWeight: "500",
      fontSize: "0.75rem",
      color: "#6B7280",
      textTransform: "uppercase",
      letterSpacing: "0.05em",
      paddingLeft: "16px",
      paddingRight: "16px",
    },
  },
  cells: {
    style: {
      fontSize: "14px",
      paddingLeft: "16px",
      paddingRight: "16px",
      color: "#1F2937",
    },
  },
  rows: {
    style: {
      minHeight: "56px",
      borderRadius: "0.75rem",
      marginBottom: "4px",
      border: "none",
      "&:not(:last-of-type)": {
        borderBottom: "none",
      },
      "&:hover": {
        backgroundColor: "#F0F3F9",
        boxShadow: "0 2px 8px rgba(45, 108, 223, 0.06)",
        cursor: "pointer",
      },
      transition: "all 0.2s ease",
    },
  },
  pagination: {
    style: {
      borderTop: "1px solid #E2E8F0",
      marginTop: "8px",
      paddingTop: "12px",
      fontSize: "13px",
      color: "#6B7280",
      minHeight: "48px",
    },
    pageButtonsStyle: {
      borderRadius: "8px",
      height: "32px",
      minWidth: "32px",
      padding: "4px 8px",
      margin: "0 2px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      color: "#2D6CDF",
      fill: "#2D6CDF",
      "&:disabled": {
        cursor: "not-allowed",
        color: "#CBD5E1",
        fill: "#CBD5E1",
      },
      "&:hover:not(:disabled)": {
        backgroundColor: "#EBF0FA",
      },
      "&:focus": {
        outline: "none",
        backgroundColor: "#EBF0FA",
      },
    },
  },
};

export const paginationOptions = {
  rowsPerPageText: "Filas por página:",
  rangeSeparatorText: "de",
  noRowsPerPage: false,
  selectAllRowsItem: false,
};
