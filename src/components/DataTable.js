import * as React from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box } from '@mui/material';

export default function DataTable({ columns, rows, pageNo, pageSize, totalCount }) {

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
        rowLength={totalCount}
        initialState={{
          pagination: {
            paginationModel: { page: pageNo, pageSize: pageSize },
          },
        }}
        sx={{
          '& .MuiTablePagination-selectLabel': {
            marginBottom: '0px',
          },
          '& .MuiTablePagination-displayedRows ': {
            marginBottom: '0px',
          }
        }}
        getCellClassName={(params) => {
          if (!params.row.order_status) {
            return '';
          }
          return params.row.order_status == 'Dispatch' ? 'bg-green' : params.row.order_status == 'Reserve' ? 'bg-yellow' : '';
        }}
        pageSizeOptions={[5, 10, 20, 50, 90]}
        checkboxSelection={false}
      />
    </Box>
  );
}
