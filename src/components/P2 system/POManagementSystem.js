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

    useEffect(() => {
        fetchFactories();
    }, [])

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

    return (
        <Container fluid className='p-5' style={{ height: '98vh', maxHeight: "100%", minHeight: "100vh" }}>

            <Box className="mb-4">
                <Typography variant="h4" className="fw-semibold">
                    Order Management System
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
                                // onChange={handleFactoryChange}
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
            {/* <Row className='mb-4 mt-4'>
                <Form inline>
                    <Row >
                        <Col xs="auto" lg="2">
                            <Form.Group>
                                <Form.Label>Date filter:</Form.Label>
                                <Form.Control
                                    type="date"
                                    className="mr-sm-2"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="2">
                            <Form.Group>
                                <Form.Label>PO Status Filter:</Form.Label>
                                <Form.Select >
                                    {POStatusFilter.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="2">
                            <Form.Group>
                                <Form.Label>Factory Filter:</Form.Label>
                                <Form.Select >
                                    {factoryFilter.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Row> */}
            <Row className='mb-4 mt-4 '>
                <Table responsive striped bordered hover style={{ boxShadow: '4px 4px 11px 0rem rgb(0 0 0 / 25%)' }}>
                    <thead>
                        <tr className='table-headers'>
                            {tableHeaders.map((header, index) => (
                                <th style={{ backgroundColor: '#dee2e6', padding: '8px', textAlign: 'center' }} key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className='text-center'>
                                    {order.PONumber}
                                </td>
                                <td className='text-center'>{order.DateCreated}</td>
                                <td className='text-center'>
                                    {order.TotalQuantity}
                                </td>
                                <td className='text-center'>{order.RMB}</td>
                                <td className='text-center'>{order.AED}</td>
                                <td className={`text-center text-${order.status === 'Open' ? 'primary' : order.status === 'Checking with factory' ? 'success' : order.status === 'Closed' ? 'info' : ''}`} >{order.status}</td>
                                <td className={`text-center text-${order.P_status === 'Paid' ? 'success' : order.P_status === 'Not Paid' ? 'danger' : ''}`}>{order.P_status}</td>
                                <td className='text-center'>{order.Factory}</td>
                                <td className='text-center d-flex  align-items-center  justify-content-around '>
                                    <Button className='m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                        <FaEye />
                                    </Button>
                                    <Button className='btn btn-success m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                        <MdEdit />
                                    </Button>
                                    <Button className='btn btn-danger m-2 d-flex align-items-center justify-content-center' style={{ padding: '5px 5px', fontSize: '16px' }}>
                                        <MdDelete />
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}

export default POManagementSystem
