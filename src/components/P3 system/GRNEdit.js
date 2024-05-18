import React, { useEffect, useState } from 'react';
import {
    MDBCol,
    MDBRow
}
    from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { API_URL } from '../../redux/constants/Constants';
import axios from 'axios';
import { Card, Col } from 'react-bootstrap';
import DataTable from '../DataTable';
import { Box, MenuItem, Select, Typography } from '@mui/material';
import ArrowBackIcon from "@mui/icons-material/ArrowBack";



const GRNEdit = () => {
    const { id } = useParams();
    const [PO_OrderList, setPO_OrderList] = useState([])
    const [data, setData] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState('Paid')
    const paymentS = ['Paid', 'Unpaid', 'Hold', 'Cancelled']
    const POStatusFilter = ['Open', 'Checking with factory', 'Closed'];
    const [PoStatus, setPoStatus] = useState("open");
    const navigate = useNavigate();

    const fetchOrder = async () => {
        let apiUrl = `${API_URL}wp-json/custom-api/v1/view-grn-details/${id}`
        const response = await axios.get(apiUrl);
        // console.log(response.data, 'response');
        let data = response.data.map((v, i) => ({ ...v, id: i }));
        //  data = data.map((v, i) => ({ ...v, dispatch_status : 'Dispatched' }));
        console.log(data, 'data======');
        // const row = [
        //     ...data,
        //     // { id: 'SUBTOTAL', label: 'Subtotal', subtotal: 624 },
        //     { id: 'TAX', label: 'Total:', taxRate: response.data.total_count, taxTotal: 8100,totals:response.data.total_cost },
        //     // { id: 'TOTAL', label: 'Total', total: 686.4 },
        // ]
        // console.log(row, 'data======');

        setPO_OrderList(data)
        setData(response.data.line_items)
    }

    useEffect(() => {
        fetchOrder()
    }, [])
    const tableHeaders = [
        "Product Name",
        "Image",
        "Qty Ordered",
        "Estimated Cost(RMB)",
        "Estimated Cost(AED)",
        "Available Qty",
        "Availability Status",
        "Dispatch Status"
    ];
    const PODetails = [{
        productName: "Product A",
        image: "product_a.jpg",
        qtyOrdered: 10,
        estimatedCostRMB: 100,
        estimatedCostAED: 50,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product B",
        image: "product_b.jpg",
        qtyOrdered: 5,
        estimatedCostRMB: 200,
        estimatedCostAED: 100,
        availabilityStatus: "Out of Stock"
    },
    {
        productName: "Product C",
        image: "product_c.jpg",
        qtyOrdered: 8,
        estimatedCostRMB: 150,
        estimatedCostAED: 75,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product D",
        image: "product_d.jpg",
        qtyOrdered: 3,
        estimatedCostRMB: 120,
        estimatedCostAED: 60,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product E",
        image: "product_e.jpg",
        qtyOrdered: 6,
        estimatedCostRMB: 180,
        estimatedCostAED: 90,
        availabilityStatus: "Out of Stock"
    },
    {
        productName: "Product F",
        image: "product_f.jpg",
        qtyOrdered: 12,
        estimatedCostRMB: 250,
        estimatedCostAED: 125,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product G",
        image: "product_g.jpg",
        qtyOrdered: 4,
        estimatedCostRMB: 90,
        estimatedCostAED: 45,
        availabilityStatus: "Out of Stock"
    }];
    let PONumber = '001';
    const totalQty = PODetails.reduce((acc, cur) => acc + cur.qtyOrdered, 0);
    const totalEstdCostRMB = PODetails.reduce((acc, cur) => acc + (cur.qtyOrdered * cur.estimatedCostRMB), 0);
    const totalEstdCostAED = PODetails.reduce((acc, cur) => acc + (cur.qtyOrdered * cur.estimatedCostAED), 0);
    const availabilityStatus = ['Confirmed', '1 week', '2 week', '3 weeks', '1 month', 'Out of Stock'];
    const dispatchedStatus = ['Dispatched', 'Not Dispatched'];

    // const handleStatusChange = (index, event) => {
    //     const newAvailabilityStatus = [...PO_OrderList.availability_status];
    //     console.log(newAvailabilityStatus,'newAvailabilityStatus');
    //     // newAvailabilityStatus[index] = event.target.value; // Update the availability status for the corresponding product
    //     // setPO_OrderList(prevState => ({
    //     //     ...prevState,
    //     //     availability_status: newAvailabilityStatus
    //     // }));
    // };

    const handleStatusChange = (index, event) => {
        console.log(index.target, event);
        const updatedData = PO_OrderList.map(item => {
            if (item.product_id === event.product_id) {
                return { ...item, availability_status: index.target.value };
            }
            return item;
        });
        console.log(updatedData, 'updatedData====');
        setPO_OrderList(updatedData)
        // console.log(PO_OrderList.line_items[index].availability_status = event.target.value, 'PO_OrderList');
        // console.log(PO_OrderList, 'PO_OrderList========');
        // PO_OrderList?.availability_status[index]
        // Check if PO_OrderList and availability_status are defined and is an array
        // if (PO_OrderList && Array.isArray(PO_OrderList.availability_status)) {
        //     const newAvailabilityStatus = [...PO_OrderList.availability_status];
        //     newAvailabilityStatus[index] = event.target.value;
        //     setPO_OrderList(prevState => ({
        //         ...prevState,
        //         availability_status: newAvailabilityStatus
        //     }));
        // } else {
        //     console.error("PO_OrderList or availability_status is not defined or not an array");
        // }
    };
    const handleDispatchStatusChange = (index, event) => {
        console.log(index.target, event);
        const updatedData = PO_OrderList.map(item => {
            if (item.product_id === event.product_id) {
                return { ...item, dispatch_status: index.target.value };
            }
            return item;
        });
        console.log(updatedData, 'updatedData====');
        setPO_OrderList(updatedData)
       
    };

    const handleUpdate = async () => {
        console.log(PO_OrderList, 'PO_OrderList======');
        console.log(PO_OrderList.line_items.map(item => item.product_id), 'PO_OrderList.line_items.map(item => item.product_id)');
        const updatedData = {
            availability_status: PO_OrderList.line_items.map(item => item.availability_status),
            availability_quantity: PO_OrderList.line_items.map(item => item.available_quantity),
            product_ids: PO_OrderList.line_items.map(item => item.product_id),
            order_ids: PO_OrderList.line_items.map(item => item.order_id),
            payment_status: paymentStatus,
            po_status: PoStatus
        };

        let apiUrl = `${API_URL}wp-json/custom-available-status/v1/estimated-status/${id}`
        const response = await axios.post(apiUrl, updatedData
            //     {
            //   availability_status: PO_OrderList.line_items.map(item => item.availability_status),
            //   product_ids: PO_OrderList.line_items.map(item => item.product_id),
            //   order_ids: PO_OrderList.line_items.map(item => item.order_id),
            //   payment_status: paymentStatus
            // }
        );
        console.log(response, 'response');
        console.log(updatedData, 'updatedData');
    }

    const handlepayMentStatus = (e) => {
        setPaymentStatus(e.target.value)
    }
    const handlePOStatus = (e) => {
        setPoStatus(e.target.value)
    }
    // const handleAvailableQtyChange = (index, event) => {
    //     console.log(index.row, event.target.value);
    //     console.log(PO_OrderList[index.row.id].available_quantity = event.target.value, 'PO_OrderList');
    //     // console.log(PO_OrderList, 'PO_OrderList========');
    //     // PO_OrderList?.availability_status[index]
    //     // Check if PO_OrderList and availability_status are defined and is an array
    //     // if (PO_OrderList && Array.isArray(PO_OrderList.availability_status)) {
    //     //     const newAvailabilityStatus = [...PO_OrderList.availability_status];
    //     //     newAvailabilityStatus[index] = event.target.value;
    //     //     setPO_OrderList(prevState => ({
    //     //         ...prevState,
    //     //         availability_status: newAvailabilityStatus
    //     //     }));
    //     // } else {
    //     //     console.error("PO_OrderList or availability_status is not defined or not an array");

    // }

    const handleAvailableQtyChange = (index, event) => {
        console.log(index.target, event);
        const updatedData = PO_OrderList.map(item => {
            if (item.product_id === event.product_id) {
                return { ...item, available_quantity: index.target.value };
            }
            return item;
        });
        console.log(updatedData, 'updatedData====');
        setPO_OrderList(updatedData)
       
    };

    const columns = [
        {
            field: "product_name",
            headerName: "Product Name", flex: 2,
            
        },
        {
            field: "product_image",
            headerName: "Product images",
            flex: 2,
            type: "html",
            renderCell: (value, row) => {
                return (
                    <>
                        <img
                            src={value.row.product_image}
                            alt={value.row.product_name}
                            className="img-fluid"
                            width={100}
                        />
                    </>
                );
            },
        },
        { field: "variation_value", headerName: "Variation", flex: 2 ,
        },
        { field: "qty_received", headerName: "Qty Received", flex: 2 ,
        },
        { field: "qty_remain", headerName: "Qty Renain", flex: 2 ,
        },
        // { field: "", headerName: "Estimated Cost(RMB)", flex: 3 ,
        // valueGetter: (value, row) => {
        //     // if (row.id === 'SUBTOTAL') {
        //     //   return row.subtotal;
        //     // }
        //     if (row.id === 'TAX') {
        //       return row.taxTotal;
        //     }
        //     // if (row.id === 'TOTAL') {
        //     //   return row.total;
        //     // }
        //     return value;
        //   },
      
        // },
        // { field: "total_price", headerName: "Estimated Cost(AED)", flex: 3 ,
        // colSpan: (value, row) => {
            
        //     if (row.id === 'TAX') {
        //       return 4;
        //     }
        //     return undefined;
        //   },
        // valueGetter: (value, row) => {
        //     if (row.id === 'TAX') {
        //       return `${row.totals}`;
        //     }
        //     return value;
        //   },
        // },
        // {
        //     field: "available_quantity", headerName: "Available Qty", flex: 3,
        //     renderCell: (params) => {
        //         return (
        //             <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
                        
        //                 <Form.Control style={{ justifyContent: "center" }} type="number" value={params.row.available_quantity} placeholder="0" onChange={(e) => handleAvailableQtyChange(e,params.row)} />
        //             </Form.Group>
        //         )
        //     }
        // },

        // {
        //     field: "availability_status",
        //     headerName: "Availability Status",
        //     flex: 3,
        //     renderCell: (params) => {
        //         return (
        //             <Select
        //                 labelId={`customer-status-${params.row.id}-label`}
        //                 id={`customer-status-${params.row.id}`}
        //                 value={params.row.availability_status}
        //                 onChange={(event) => handleStatusChange(event, params.row)}
        //                 fullWidth
        //                 style={{ height: "40%", width: "100%" }}
        //             // className="fw-semibold d-flex align-items-center justify-content-center h-100"
        //             >
        //                 {availabilityStatus.map(
        //                     (status) => (
        //                         <MenuItem key={status} value={status}>
        //                             {status}
        //                         </MenuItem>
        //                     )
        //                 )}
        //             </Select>
        //         );
        //     },
        // },
        // // { field: "---", headerName: "Dispatch Status", flex: 3 },
        
        // {
        //     field: "dispatch_status",
        //     headerName: "Dispatch Status",
        //     flex: 3,
        //     renderCell: (params) => {
        //         return (
        //             <Select
        //                 labelId={`customer-status-${params.row.id}-label`}
        //                 id={`customer-status-${params.row.id}`}
        //                 value={params.row.dispatch_status}
        //                 onChange={(event) => handleDispatchStatusChange(event, params.row)}
        //                 fullWidth
        //                 style={{ height: "40%", width: "100%" }}
        //             // className="fw-semibold d-flex align-items-center justify-content-center h-100"
        //             >
        //                 {dispatchedStatus.map(
        //                     (status) => (
        //                         <MenuItem key={status} value={status}>
        //                             {status}
        //                         </MenuItem>
        //                     )
        //                 )}
        //             </Select>
        //         );
        //     },
        // },
    ];
    const handalBackButton = () => {
        navigate("/GRN_Management");
    };
    return (
        <Container fluid className='px-5' style={{ height: '100vh' }}>
            <MDBRow className="my-3">
                <MDBCol
                    md="5"
                    className="d-flex justify-content-start align-items-center"
                >
                    <Button
                        variant="outline-secondary"
                        className="p-1 me-2 bg-transparent text-secondary"
                        onClick={handalBackButton}
                    >
                        <ArrowBackIcon className="me-1" />
                    </Button>
                    <Box></Box>
                </MDBCol>
            </MDBRow>
            <Card className="p-3 mb-3">
                <Box className="d-flex align-items-center justify-content-between">
                    <Box>
                        <Typography variant="h6" className="fw-bold mb-3">
                            GRN View
                        </Typography>
                    </Box>
                </Box>
            </Card>
           
            <Card className="p-3 mb-3">

                
                <MDBRow className='d-flex justify-content-center align-items-center'>
                    <MDBCol col='10' md='12' sm='12'></MDBCol>
                    <div className="mt-2">
                        <DataTable
                            columns={columns}
                            rows={PO_OrderList}
                            // page={pageSO}
                            // pageSize={pageSizeSO}
                            // totalPages={totalPagesSO}
                            rowHeight={100}
                        // handleChange={handleChangeSO}
                        // // onCellEditStart={handleCellEditStart}
                        // processRowUpdate={processRowUpdateSPO}
                        />

                    </div>
                    {/* </div> */}
                    <Row>
                        <Button type="button" className='w-auto' onClick={handleUpdate}>Update</Button>
                    </Row>
                </MDBRow>
            </Card>
        </Container>
    )
}
export default GRNEdit;