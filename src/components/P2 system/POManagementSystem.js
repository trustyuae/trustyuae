import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { Box, Typography } from '@mui/material';
import { DateRangePicker, LocalizationProvider, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { API_URL } from '../../redux/constants/Constants';
import { Link } from 'react-router-dom';
import { Badge, Card, Tab, Tabs } from 'react-bootstrap';
import DataTable from '../DataTable';
import Swal from 'sweetalert2';

const tableHeaders = [
    "PO Number",
    "Date created",
    "Total Quantity",
    "Estimated Cost(RMB)",
    "Estimated Cost(AED)",
    "Status",
    "Payment Status",
    "Factory",
    "Action"
];

const orders = [
    {
        PONumber: 'PO001',
        DateCreated: '2024-4-24',
        TotalQuantity: '100',
        RMB: '500',
        AED: '150',
        status: 'Open',
        P_status: 'Paid',
        Factory: 'factory A'
    },
    {
        PONumber: 'PO002',
        DateCreated: '2024-4-25',
        TotalQuantity: '200',
        RMB: '1000',
        AED: '300',
        status: 'Checking with factory',
        P_status: 'Not Paid',
        Factory: 'factory B'
    },
    {
        PONumber: 'PO003',
        DateCreated: '2024-4-26',
        TotalQuantity: '150',
        RMB: '750',
        AED: '200',
        status: 'Closed',
        P_status: 'Not Paid',
        Factory: 'factory C'
    }
]
function POManagementSystem() {
    const POStatusFilter = ['Open', 'Checking with factory', 'Closed'];
    const factoryFilter = ['Factory A', 'Factory B', 'Factory c'];
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
    const [selectedFactory, setSelectedFactory] = useState("");
    const [factories, setFactories] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [orderList, setOrderList] = useState([]);
    const [manualorderList, setManualOrderList] = useState([]);
    const [scheduleorderList, setScheduleOrderList] = useState([]);

    const [PoStatus, setPoStatus] = useState("");
    const [poType, setPOType] = useState('po')

    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(1);


    const fetchFactories = async () => {
        try {
            const response = await axios.get(
                `${API_URL}wp-json/custom-factory/v1/fetch-factories`
            );
            setFactories(response.data);
        } catch (error) {
            console.error("Error fetching factories:", error);
        }
    };

    const POM_system_products = async () => {
        console.log(poType, 'poStatus');
        try {
            // let apiUrl = `${API_URL}wp-json/custom-po-management/v1/po-generated-order/?`
            let apiUrl
            if (poType == 'po') {
                apiUrl = `${API_URL}wp-json/custom-po-management/v1/po-generated-order/?&per_page=${pageSize}&page=${page}
                `
            } else if (poType == 'mpo') {
                apiUrl = `${API_URL}wp-json/custom-mo-management/v1/generated-mo-order/?&per_page=${pageSize}&page=${page}`
            } else if (poType == 'spo') {
                apiUrl = `${API_URL}wp-json/custom-so-management/v1/generated-so-order/?&per_page=${pageSize}&page=${page}`
            }

            if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
            if (selectedFactory) apiUrl += `?&factory_id=${selectedFactory}`;
            if (PoStatus) apiUrl += `?&status=${PoStatus}`;
            const response = await axios.get(apiUrl);

            console.log(response.data, 'res===>>>>');
            let data = response.data.pre_orders.map((v, i) => ({ ...v, id: i }));

            // setOrderList(response.data.pre_orders)
            setOrderList(data)
            setTotalPages(response.data.total_pages);

        } catch (error) {
            console.error("Error Products:", error);
        }
    }

    useEffect(() => {
        fetchFactories();
        handleTabChange(poType)
    }, [])

    useEffect(() => {
        POM_system_products();
    }, [page, endDate, selectedFactory, PoStatus, poType])

    const handleDateChange = async (newDateRange) => {
        if (newDateRange[0]?.$d && newDateRange[1]?.$d) {
            setSelectedDateRange(newDateRange);
            const startDateString = newDateRange[0].$d.toDateString();
            const endDateString = newDateRange[1].$d.toDateString();

            const formattedStartDate = formatDate(startDateString);
            const formattedEndDate = formatDate(endDateString);

            const isoStartDate = new Date(formattedStartDate)
                ?.toISOString()
                .split("T")[0];
            const isoEndDate = new Date(formattedEndDate)
                ?.toISOString()
                .split("T")[0];

            setStartDate(isoStartDate);
            setEndDate(isoEndDate);
        } else {
            console.error("Invalid date range");
            setStartDate("");
            setEndDate("");
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
    };

    const handleFactoryChange = (e) => {
        setSelectedFactory(e.target.value);
    };

    const handlePOStatus = (e) => {
        setPoStatus(e.target.value)
    }

    const columns = [
        { field: "po_id", 
        headerName: "PO \n Number", flex: 2 },
        { field: "po_date", headerName: "Date created", flex: 2 },
        { field: "total_quantity", headerName: "Total Quantity", flex: 3 },
        { field: "", headerName: "Estimated Cost(RMB)", flex: 3 },
        { field: "estimated_cost_aed", headerName: "Estimated Cost(AED)", flex: 3 },
        { field: "po_status", headerName: "Status", flex: 1 },
        { field: "payment_status", headerName: "Payment Status", flex: 1 },
        {
            field: "factory_id", headerName: "Factory", flex: 1,
            type: "html",
            renderCell: (value, row) => {
                return factories.find((factory) => factory.id == value.row.factory_id)?.factory_name
            }
        },
        // { field: "customer_name", headerName: "Action", flex: 1 },
        // {
        //   field: "shipping_country",
        //   headerName: "Shipping Country",
        //   type: "string",
        //   flex: 1,
        //   valueGetter: (value, row) => getCountryName(row.shipping_country),
        // },
        // {
        //   field: "order_status",
        //   headerName: "Order Status",
        //   flex: 1,
        //   type: "string",
        // },
        {
            field: "view_item",
            headerName: "View Item",
            flex: 2,
            type: "html",
            renderCell: (value, row) => {
                return (
                    // <Link to={`/order_details/${value?.row?.order_id}`}>
                    //     <Button type="button" className="w-auto">
                    //         <FaEye />
                    //     </Button>
                    //     <Typography
                    //         variant="label"
                    //         className="fw-semibold text-secondary"
                    //         sx={{
                    //             fontSize: 14,
                    //             textTransform: "capitalize",
                    //         }}
                    //     >
                    //         {/* {"  "} */}
                    //         <Badge bg="success" className="m-2">
                    //             {value?.row?.order_process == 'started' ? (value?.row?.order_process) : null}
                    //         </Badge>
                    //     </Typography>
                    // </Link>
                    < div className='d-flex  align-items-center  justify-content-around'>
                        <Link to={`/PO_details/${value.row.po_id}`}>
                            <Button className='m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                <FaEye />
                            </Button>
                        </Link>
                        <Button className='btn btn-danger m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }} onClick={()=>handleDeletePO(value.row.po_id)}>
                            <MdDelete />
                        </Button>
                    </div>
                );
            },
        },
    ];

    const handleDeletePO = async (id) => {
        Swal.fire({
            icon: "error",
            title: 'Are you sure you want to delete this order?',
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "No"
        }).then(async (result) => {
            try {
                if (result.isConfirmed) {
                    console.log('yes');
                    // Handle deletion logic if user clicks "Yes"
                    const response = await axios.post(`${API_URL}wp-json/delete-record/v1/delete-po-record/`, {
                        po_id: id
                    });
                    console.log(response, 'res====');
                } else {
                    // Handle cancellation logic if user clicks "No" or outside the dialog
                    console.log('no');
                }
            } catch (error) {
                console.log(error);
            }
        });
    
        console.log(id, 'id delete');
    };
    

    const handleTabChange = (e) => {
        console.log(e);
        setPOType(e)
        setPage(1);
    }

    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <Container fluid className='p-5' style={{ height: '98vh', maxHeight: "100%", minHeight: "100vh" }}>

            <Box className="mb-4">
                <Typography variant="h4" className="fw-semibold">
                    PO Order Management System
                </Typography>
            </Box>
            <Row className="mb-4 mt-4">
                <Form inline>
                    <Row>
                        <Col xs="auto" lg="4">
                            <Form.Group>
                                <Form.Label className="fw-semibold mb-0">
                                    Date filter:
                                </Form.Label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={["SingleInputDateRangeField"]}>
                                        <DateRangePicker
                                            sx={{
                                                "& .MuiInputBase-root": {
                                                    paddingRight: 0,
                                                },
                                                "& .MuiInputBase-input": {
                                                    padding: ".5rem .75rem .5rem .75rem",
                                                    "&:hover": {
                                                        borderColor: "#dee2e6",
                                                    },
                                                },
                                            }}
                                            value={selectedDateRange}
                                            onChange={handleDateChange}
                                            slots={{ field: SingleInputDateRangeField }}
                                        />
                                    </DemoContainer>
                                </LocalizationProvider>
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="4">
                            <Form.Group className="fw-semibold mb-0">
                                <Form.Label>Factory Filter:</Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    value={selectedFactory}
                                    onChange={handleFactoryChange}
                                >
                                    <option value="">All Factory</option>
                                    {factories.map((factory) => (
                                        <option key={factory.id} value={factory.id}>
                                            {factory.factory_name}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="4">
                            <Form.Group className="fw-semibold mb-0">
                                <Form.Label>PO Status Filter:</Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    // value={selectedFactory}
                                    onChange={handlePOStatus}
                                >
                                    <option value="">All </option>
                                    {POStatusFilter.map((po) => (
                                        <option key={po} value={po}>
                                            {po}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Row>

            <Row className='mb-4 mt-4 '>
                {/* <div style={{ overflow: 'auto', height: '320px' }}>
                    <Table striped bordered hover style={{ overflow: 'auto', height: '320px', boxShadow: '4px 4px 11px 0rem rgb(0 0 0 / 25%)' }}>
                        <thead>
                            <tr className='table-headers'>
                                {tableHeaders.map((header, index) => (
                                    <th style={{ backgroundColor: '#dee2e6', padding: '8px', textAlign: 'center' }} key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>

                            {
                                // console.log(orderList,'orderrrr')
                                orderList?.map((order) => (
                                    <tr >
                                        <td>{order.po_id}</td>
                                        <td>{order.po_date}</td>
                                        <td>{order.total_quantity}</td>
                                        <td>--</td>
                                        <td>--</td>
                                        <td>{order.po_status}</td>
                                        <td>{order.payment_status}</td>
                                        <td>{
                                            factories.find((factory) => factory.id === order.factory_id)
                                                ?.factory_name
                                        }</td>
                                        <td className='text-center d-flex  align-items-center  justify-content-around '>
                                            <Link to={`/PO_details/${order.po_id}`}>
                                                <Button className='m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                    <FaEye />
                                                </Button>
                                            </Link>
                                            <Button className='btn btn-success m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                <MdEdit />
                                            </Button>
                                            <Button className='btn btn-danger m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                <MdDelete />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </Table>
                </div> */}
            </Row>

            <Row>
                <Card >
                    <Card.Body>
                        <Tabs
                            defaultActiveKey="po"
                            id="fill-tab-example"
                            className="mb-3"
                            fill
                            onSelect={(key) => handleTabChange(key)}
                        >
                            {/* po */}
                            <Tab eventKey="po" title="Order against PO" >
                                {/* <div style={{ overflow: 'auto', height: '320px' }}>
                                    <Table striped bordered hover style={{ overflow: 'auto', height: '320px', boxShadow: '4px 4px 11px 0rem rgb(0 0 0 / 25%)' }}>
                                        <thead>
                                            <tr className='table-headers'>
                                                {tableHeaders.map((header, index) => (
                                                    <th style={{ backgroundColor: '#dee2e6', padding: '8px', textAlign: 'center' }} key={index}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                // console.log(orderList,'orderrrr')
                                                orderList?.map((order) => (
                                                    <tr >
                                                        <td>{order.po_id}</td>
                                                        <td>{order.po_date}</td>
                                                        <td>{order.total_quantity}</td>
                                                        <td>--</td>
                                                        <td>--</td>
                                                        <td>{order.po_status}</td>
                                                        <td>{order.payment_status}</td>
                                                        <td>{
                                                            factories.find((factory) => factory.id === order.factory_id)
                                                                ?.factory_name
                                                        }</td>
                                                        <td className='text-center d-flex  align-items-center  justify-content-around '>
                                                            <Link to={`/PO_details/${order.po_id}`}>
                                                                <Button className='m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                                    <FaEye />
                                                                </Button>
                                                            </Link>
                                                            <Button className='btn btn-success m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                                <MdEdit />
                                                            </Button>
                                                            <Button className='btn btn-danger m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                                <MdDelete />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div> */}

                                <DataTable
                                    columns={columns}
                                    rows={orderList}
                                    page={page}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    handleChange={handleChange}
                                />
                            </Tab>
                            {/* MPO */}
                            <Tab eventKey="mpo" title="Manual PO" >
                                {/* <div style={{ overflow: 'auto', height: '320px' }}>
                                    <Table striped bordered hover style={{ overflow: 'auto', height: '320px', boxShadow: '4px 4px 11px 0rem rgb(0 0 0 / 25%)' }}>
                                        <thead>
                                            <tr className='table-headers'>
                                                {tableHeaders.map((header, index) => (
                                                    <th style={{ backgroundColor: '#dee2e6', padding: '8px', textAlign: 'center' }} key={index}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                // console.log(orderList,'orderrrr')
                                                orderList?.map((order) => (
                                                    <tr >
                                                        <td>{order.po_id}</td>
                                                        <td>{order.po_date}</td>
                                                        <td>{order.total_quantity}</td>
                                                        <td>--</td>
                                                        <td>--</td>
                                                        <td>{order.po_status}</td>
                                                        <td>{order.payment_status}</td>
                                                        <td>{
                                                            factories.find((factory) => factory.id === order.factory_id)
                                                                ?.factory_name
                                                        }</td>
                                                        <td className='text-center d-flex  align-items-center  justify-content-around '>
                                                            <Link to={`/PO_details/${order.po_id}`}>
                                                                <Button className='m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                                    <FaEye />
                                                                </Button>
                                                            </Link>
                                                            <Button className='btn btn-success m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                                <MdEdit />
                                                            </Button>
                                                            <Button className='btn btn-danger m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                                <MdDelete />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div> */}
                                <DataTable
                                    columns={columns}
                                    rows={orderList}
                                    page={page}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    handleChange={handleChange}
                                />
                            </Tab>
                            {/* SPO */}
                            <Tab eventKey="spo" title="Scheduled PO">
                                {/* <div style={{ overflow: 'auto', height: '320px' }}>
                                    <Table striped bordered hover style={{ overflow: 'auto', height: '320px', boxShadow: '4px 4px 11px 0rem rgb(0 0 0 / 25%)' }}>
                                        <thead>
                                            <tr className='table-headers'>
                                                {tableHeaders.map((header, index) => (
                                                    <th style={{ backgroundColor: '#dee2e6', padding: '8px', textAlign: 'center' }} key={index}>{header}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>

                                            {
                                                // console.log(orderList,'orderrrr')
                                                orderList?.map((order) => (
                                                    <tr >
                                                        <td>{order.po_id}</td>
                                                        <td>{order.po_date}</td>
                                                        <td>{order.total_quantity}</td>
                                                        <td>--</td>
                                                        <td>--</td>
                                                        <td>{order.po_status}</td>
                                                        <td>{order.payment_status}</td>
                                                        <td>{
                                                            factories.find((factory) => factory.id === order.factory_id)
                                                                ?.factory_name
                                                        }</td>
                                                        <td className='text-center d-flex  align-items-center  justify-content-around '>
                                                            <Link to={`/PO_details/${order.po_id}`}>
                                                                <Button className='m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                                    <FaEye />
                                                                </Button>
                                                            </Link>
                                                            <Button className='btn btn-success m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                                <MdEdit />
                                                            </Button>
                                                            <Button className='btn btn-danger m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                                                <MdDelete />
                                                            </Button>
                                                        </td>
                                                    </tr>
                                                ))
                                            }
                                        </tbody>
                                    </Table>
                                </div> */}
                                <DataTable
                                    columns={columns}
                                    rows={orderList}
                                    page={page}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    handleChange={handleChange}
                                />
                            </Tab>
                        </Tabs>
                    </Card.Body>
                </Card>
            </Row>
        </Container>
    )
}

export default POManagementSystem
