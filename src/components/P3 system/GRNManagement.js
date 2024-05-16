import React, { useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Box, Typography } from "@mui/material";
import { Button, Card, Col, Row } from "react-bootstrap";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { FaEye } from "react-icons/fa";
import DataTable from "../DataTable";

const product = [
    {
        grnNO: 'GRN001',
        CDate: '2024-4-26',
        CBy: 'demo',
        TItem: 60,
        status: 'All Processed',
    },
    {
        grnNO: 'GRN002',
        CDate: '2024-4-30',
        CBy: 'demo2',
        TItem: 60,
        status: 'Partially Processed ',
    }
];

function GRNManagement() {
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    // const handleDateChange = (e) => {
    //     setDateFilter(e.target.value);
    // };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const filteredProducts = product.filter((item, index) => {
        item.id = index
        return item.CDate.includes(dateFilter) &&
            item.status.toLowerCase().includes(statusFilter.toLowerCase())
    }
    );

    console.log(filteredProducts, 'filteredProducts')

    const availabilityStatus = ['All Processed', 'Partially Processed'];

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
    };

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
        }
    };

    const columns = [
        { field: "grnNO", headerName: "GRN NO", flex: 1 },
        { field: "CDate", headerName: "Date Created", flex: 1 },
        { field: "CDate", headerName: "Created By", flex: 1 },
        {
            field: "TItem",
            headerName: "Total Items",
            type: "string",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            type: "string",
        },
        {
            field: "view_item",
            headerName: "Action",
            flex: 1,
            type: "html",
            renderCell: (value, row) => {
                return (
                    // <Link to={`/order_details/${value?.row?.order_id}`}>
                    <Button type="button" className="w-auto bg-transparent border-0 text-secondary fs-5">
                        <FaEye className="mb-1" />
                    </Button>
                    // </Link>
                );
            },
        },
    ];

    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
            <Box className="mb-4">
                <Typography variant="h4" className="fw-semibold">
                    GRN Management
                </Typography>
            </Box>
            <Form inline className='mb-4'>
                <Row className="align-items-center">
                    <Col xs="auto" lg="3">
                        <Form.Group>
                            <Form.Label className="fw-semibold mb-0">
                                Date filter:
                            </Form.Label>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DemoContainer sx={{
                                    "& .MuiFormControl-root": {
                                        minWidth: 'unset !important'
                                    },
                                }} components={["SingleInputDateRangeField"]}>
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
                    <Col xs="auto" lg="3">
                        <Form.Group>
                            <Form.Label className="fw-semibold">Filter by Status:</Form.Label>
                            <Form.Select
                                className="mr-sm-2 py-2"
                                onChange={handleStatusChange} value={statusFilter}
                            >
                                <option disabled value="">Select Status</option>
                                {availabilityStatus.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </Form.Select>
                        </Form.Group>
                    </Col>
                </Row>
            </Form>

            <MDBRow className="px-3">
                <Card className='py-3'>
                    <div className="mt-2">
                        <DataTable
                            columns={columns}
                            rows={filteredProducts}
                            page={page}
                            pageSize={pageSize}
                            totalPages={totalPages}
                            handleChange={handleChange}
                        />
                    </div>
                </Card>
            </MDBRow>
        </Container>
    )
}

export default GRNManagement;
