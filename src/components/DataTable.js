import * as React from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box, Pagination } from "@mui/material";

export default function DataTable({
  columns,
  rows,
  page = 1,
  totalPages = 1,
  handleChange = () => {},
  pageSize = 10,
  checkboxSelection = false,
  onCellEditStart = () => {},
  processRowUpdate = () => {},
  rowHeight,
  showAllRows = false,
  hidePagination = false,
  paginationPosition = "bottom",
}) {
  const actualPageSize = showAllRows ? 100 : pageSize;
  const rowCount = rows.length;

  // Calculate height based on row count, row height, and a maximum height
  const dataGridHeight = Math.min(rowCount * rowHeight + 50, 400); // Adjust as needed

  return (
    <Box
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
       {!hidePagination && (paginationPosition === "top" || paginationPosition === "both") && (
        <Box
          sx={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "flex-end",
            padding: "8px 0",
          }}
        >
          <Pagination
            sx={{
              marginBottom: 0,
            }}
            count={totalPages}
            page={page}
            variant="outlined"
            onChange={handleChange}
          />
        </Box>
      )}
      <Box
        sx={{
          flex: 1,
          overflow: "auto",
          height: showAllRows ? "auto" : dataGridHeight,
          minHeight: 125, // Minimum height to handle very few rows gracefully
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          rowHeight={rowHeight}
          disableColumnSorting
          disableColumnMenu
          pagination
          pageSize={actualPageSize}
          autoHeight={true}
          sx={{
            "& .MuiTablePagination-selectLabel": {
              marginBottom: "0px",
            },
            "& .MuiTablePagination-displayedRows": {
              marginBottom: "0px",
            },
            "& .MuiDataGrid-footerContainer": {
              display: "none",
            },
            "& .MuiDataGrid-cell": {
              textAlign: "center",
              borderLeft: "1px solid rgba(224, 224, 224, 1)",
              borderRight: "1px solid rgba(224, 224, 224, 1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            "& .MuiDataGrid-columnHeader": {
              textAlign: "center",
              borderLeft: "1px solid rgba(224, 224, 224, 1)",
              borderRight: "1px solid rgba(224, 224, 224, 1)",
            },
            "& .MuiDataGrid-columnHeaderTitleContainerContent": {
              width: "100%",
            },
            "& .MuiDataGrid-columnHeaderTitle": {
              width: "100%",
              fontWeight: 700,
              fontSize: 16,
            },
          }}
          getCellClassName={(params) => {
            if (params.colDef.className == "order-not-available") {
              if (!params.row.customer_status) {
                return "";
              }
              return params.row.customer_status == "Confirmed"
                ? "bg-green"
                : params.row.customer_status == "Exchange"
                ? "bg-yellow"
                : params.row.customer_status == "Refund"
                ? "bg-danger"
                : params.row.customer_status == "NotConfirmed"
                ? "bg-secondary"
                : "";
            }
            if (params.colDef.className == "order-system") {
              if (!params.row.order_status) {
                return "";
              }
              if (params.row.order_status == "P1 Reserve") {
                return "bg-yellow";
              }
              return params.row.order_status == "Dispatch"
                ? "bg-green"
                : params.row.order_status == "Reserve"
                ? "bg-yellow"
                : "";
            }
            if (params.colDef.className == "order-system-track") {
              if (!params.row.exist_item) {
                return "";
              }
              if (params.row.exist_item == "1") {
                return "bg-yellow";
              }
              if (params.row.exist_item == "0") {
                return "bg-green";
              }
            }
            if (params.colDef.className == "complete-order-system-china") {
              if (!params.row.items.map((item) => item.in_china == 1)) {
                return "";
              }
              if (params.row.items.some((item) => item.in_china == 1)) {
                return "bg-yellow";
              }
              if (params.row.items.some((item) => item.in_china == 0)) {
                return "";
              }
            }
            if (params.colDef.className == "completed-order-system") {
              if (!params.row.items.map((item) => item.in_china == 1)) {
                return "";
              }
              if (params.row.items.some((item) => item.in_china == 1)) {
                return "bg-yellow";
              }
              if (params.row.items.some((item) => item.in_china == 0)) {
                return "";
              }
            }
            if (params.colDef.className == "factory-status") {
              console.log(params.row.inactive,"params.row.inactive")
              if (!params.row.inactive) {
                return "";
              }
              if (params.row.inactive === "1") {
                return "bg-grey";
              }
            }
          }}
          checkboxSelection={checkboxSelection}
          onCellEditStart={onCellEditStart}
          processRowUpdate={processRowUpdate}
        />
      </Box>
      {!hidePagination && (paginationPosition !== "top" || paginationPosition === "both") && (
        <Box
          sx={{
            marginTop: "auto",
            display: "flex",
            justifyContent: "flex-end",
            padding: "8px 0",
          }}
        >
          <Pagination
            sx={{
              marginBottom: 0,
            }}
            count={totalPages}
            page={page}
            variant="outlined"
            onChange={handleChange}
          />
        </Box>
      )}
    </Box>
  );
}
