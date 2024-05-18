import React, { useEffect, useState } from "react";
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
import axios from "axios";
import { API_URL } from "../../redux/constants/Constants";
import { Link } from "react-router-dom";

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
    const [statusFilter, setStatusFilter] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [pageSize, setPageSize] = useState(5);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [grnList, setGrnList] = useState([])

    // const handleDateChange = (e) => {
    //     setDateFilter(e.target.value);
    // };

    const handleStatusChange = (e) => {
        console.log(e.target.value, 'e.target.value');
        setStatusFilter(e.target.value);
    };

    const filteredProducts = product.filter((item, index) => {
        item.id = index
        return item.CDate.includes(dateFilter) &&
            item.status.toLowerCase().includes(statusFilter.toLowerCase())
    }
    );

    console.log(filteredProducts, 'filteredProducts')

    const availabilityStatus = ['All Processed', 'Partially Processed', 'Pending for Process'];

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
            setStartDate("");
            setEndDate("");
        }
    };

    const columns = [
        { field: "grn_no", headerName: "GRN NO", flex: 1 },
        { field: "created_date", headerName: "Date Created", flex: 1 },
        { field: "verified_by", headerName: "Created By", flex: 1 },
        {
            field: "total_qty",
            headerName: "Total Items",
            // type: "string",
            flex: 1,
        },
        {
            field: "status",
            headerName: "Status",
            flex: 1,
            type: "string",
        },
        {
            field: "",
            headerName: "Action",
            flex: 1,
            type: "html",
            renderCell: (value, row) => {
                return (
                    <Link to={`/GRN_Edit/${value?.row?.grn_no}`}>
                        <Button type="button" className="w-auto bg-transparent border-0 text-secondary fs-5">
                            <FaEye className="mb-1" />
                        </Button>
                    </Link>
                );
            },
        },
    ];

    const handlGetGRNList = async () => {
        try {
            let apiUrl
            apiUrl = `${API_URL}wp-json/custom-api/v1/get-grns/?&per_page=${pageSize}&page=${page}`
            if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
            if (statusFilter) apiUrl += `&status=${statusFilter}`;

            const response = await axios.get(apiUrl)

            console.log(response, 'response');
            let data = response.data.data.map((v, i) => ({ ...v, id: i }));
            console.log(data, 'data');
            setGrnList(data)
            console.log(response.data.total_pages,'response.data.data.total_pages');
            setTotalPages(response.data.total_pages);

        } catch (error) {
            console.log(error);
        }
    }

    const handleChange = (event, value) => {
        setPage(value);
    };

    useEffect(() => {
        handlGetGRNList()
    }, [endDate, selectedDateRange, statusFilter,page])

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
                                <option value="">Select Status</option>
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
                            rows={grnList}
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
