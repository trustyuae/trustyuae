import * as React from 'react';
import { DataGrid, gridClasses } from '@mui/x-data-grid';
import { Box } from '@mui/material';

export default function DataTable({ columns, rows }) {
  const getRowClassName = (params) => {
    console.log(params, 'params')
    return params.row.order_status === 'Shipped' ? 'specialRow' : '';
  };
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
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        // sx={{
        //   '& .MuiDataGrid-row': {
        //     backgroundColor: 'rgb(140, 235, 140)',
        //     '&:hover': {
        //       backgroundColor: 'rgb(140, 235, 140)',
        //     },
        //     '& .specialRow': {
        //       backgroundColor: 'lightblue',
        //     }
        //   }
        // }}
        getCellClassName={(params) => {
          console.log(params, 'params')
          console.log(!params.row.order_status, 'params.row.order_status')
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
