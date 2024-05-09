import * as React from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box, Pagination } from '@mui/material';

export default function DataTable({ columns, rows, page, totalPages, handleChange }) {

  return (
    <Box style={{
      height: 400, width: '100%',
      [`.${gridClasses.cell}.hot`]: {
        backgroundColor: '#ff943975',
        color: '#1a3e72',
      }
    }}>
      <DataGrid
        rows={rows}
        columns={columns}
        rowLength={totalPages}
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
          }
        }}
        getCellClassName={(params) => {
          if (!params.row.order_status) {
            return '';
          }
          return params.row.order_status == 'Dispatch' ? 'bg-green' : params.row.order_status == 'Reserve' ? 'bg-yellow' : '';
        }}
        checkboxSelection={false}
      />
      <Pagination sx={{
        marginBottom: 3,
        '& .MuiPagination-ul ': {
          justifyContent: 'end'
        }
      }} count={totalPages} page={page} variant="outlined" onChange={handleChange} />
    </Box>
  );
}
