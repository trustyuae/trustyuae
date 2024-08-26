import * as React from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box, Pagination } from '@mui/material';

export default function DataTable({ columns, rows, page = 1, totalPages = 1, handleChange = () => { }, pageSize = 10, checkboxSelection = false, onCellEditStart = () => { }, processRowUpdate = () => { }, rowHeight,showAllRows = false,hidePagination = false }) {
  const actualPageSize = showAllRows ? 100 : pageSize;
  return (
    <Box style={{
      width: '100%',
      height: showAllRows ? 'auto' : 400, // Set height or 'auto' if all rows should be visible
      [`.${gridClasses.cell}.hot`]: {
        backgroundColor: '#ff943975',
        color: '#1a3e72',
      }
    }}>
      <DataGrid
        rows={rows}
        getRowHeight={() => rowHeight || '50'}
        columns={columns}
        rowLength={totalPages}
        rowHeight={rowHeight}
        disableColumnSorting
        disableColumnMenu
        initialState={{
          pagination: { paginationModel: { pageSize: actualPageSize } },
        }}
        sx={{
          marginBottom: 3,
          '& .MuiTablePagination-selectLabel': {
            marginBottom: '0px',
          },
          '& .MuiTablePagination-displayedRows ': {
            marginBottom: '0px',
          },
          '& .MuiDataGrid-footerContainer ': {
            display: 'none',
          },
          '& .MuiDataGrid-cell': {
            textAlign: 'center',
            borderLeft: '1px solid rgba(224, 224, 224, 1)',
            borderRight: '1px solid rgba(224, 224, 224, 1)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          },
          '& .MuiDataGrid-columnHeader': {
            textAlign: 'center',
            borderLeft: '1px solid rgba(224, 224, 224, 1)',
            borderRight: '1px solid rgba(224, 224, 224, 1)'
          },
          "& .MuiDataGrid-columnHeaderTitleContainerContent": {
            width: '100%'
          },
          '& .MuiDataGrid-columnHeaderTitle': {
            width: '100%',
            fontWeight: 700,
            fontSize: 16
          },
        }}
        getCellClassName={(params) => {
          if (params.colDef.className == "order-not-available") {
            if (!params.row.customer_status) {
              return '';
            }
            return params.row.customer_status == 'Confirmed' ? 'bg-green' : params.row.customer_status == 'Exchange' ? 'bg-yellow' : params.row.customer_status == 'Refund' ? 'bg-danger' : params.row.customer_status == 'NotConfirmed' ? 'bg-secondary' : '';
          }
          if (params.colDef.className == "order-system") {
            if (!params.row.order_status) {
              return '';
            }
            if (params.row.order_status=="P1 Reserve") {
              return 'bg-yellow';
            }
            return params.row.order_status == 'Dispatch' ? 'bg-green' : params.row.order_status == 'Reserve' ? 'bg-yellow' : '';
          }
          
        }}
        checkboxSelection={checkboxSelection}
        onCellEditStart={onCellEditStart}
        processRowUpdate={processRowUpdate}
      />
     {!hidePagination && (
        <Pagination sx={{
          marginBottom: 3,
          '& .MuiPagination-ul ': {
            justifyContent: 'end'
          }
        }} count={totalPages} page={page} variant="outlined" onChange={handleChange} />
      )}
    </Box>
  );
}
