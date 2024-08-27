import * as React from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Pagination } from '@mui/material';

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
  hidePagination = false
}) {
  const actualPageSize = showAllRows ? 100 : pageSize;
  const rowCount = rows.length;
  
  // Calculate height based on row count, row height, and a maximum height
  const dataGridHeight = Math.min(rowCount * rowHeight + 50, 400); // Adjust as needed

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
      }}
    >
      <Box
        sx={{
          flex: 1,
          overflow: 'auto',
          height: showAllRows ? 'auto' : dataGridHeight,
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
          sx={{
            '& .MuiTablePagination-selectLabel': {
              marginBottom: '0px',
            },
            '& .MuiTablePagination-displayedRows': {
              marginBottom: '0px',
            },
            '& .MuiDataGrid-footerContainer': {
              display: 'none',
            },
            '& .MuiDataGrid-cell': {
              textAlign: 'center',
              borderLeft: '1px solid rgba(224, 224, 224, 1)',
              borderRight: '1px solid rgba(224, 224, 224, 1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            },
            '& .MuiDataGrid-columnHeader': {
              textAlign: 'center',
              borderLeft: '1px solid rgba(224, 224, 224, 1)',
              borderRight: '1px solid rgba(224, 224, 224, 1)',
            },
            '& .MuiDataGrid-columnHeaderTitleContainerContent': {
              width: '100%',
            },
            '& .MuiDataGrid-columnHeaderTitle': {
              width: '100%',
              fontWeight: 700,
              fontSize: 16,
            },
          }}
          checkboxSelection={checkboxSelection}
          onCellEditStart={onCellEditStart}
          processRowUpdate={processRowUpdate}
        />
      </Box>
      {!hidePagination && (
        <Box
          sx={{
            marginTop: 'auto',
            display: 'flex',
            justifyContent: 'flex-end',
            padding: '8px 0',
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
