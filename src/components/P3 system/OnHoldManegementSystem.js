import React, { useEffect, useState } from 'react';
import {
    MDBCol,
    MDBRow
}
    from 'mdb-react-ui-kit';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Autocomplete, Box, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DataTable from '../DataTable';
import { API_URL } from '../../redux/constants/Constants';
import { useDispatch } from 'react-redux';
import { GetProductManual } from '../../redux/actions/P3SystemActions';


function OnHoldManegementSystem() {
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedOperator, setSelectedOperator] = useState("");
    const [receivedBoxes, setReceivedBoxes] = useState(0);
    const [searchedProduct, setSearchedProduct] = useState("");
    const [manualProducts, setManualProducts] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const dispatch = useDispatch();

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

    const tableHeaders = [
        "Name",
        "Image",
        "Qty Ordered",
    ];
    const ProductDetails = [{
        id: 1,
        name: "Product A",
        image: "product_a.jpg",
        qtyOrdered: 10
    },
    {
        id: 2,
        name: "Product B",
        image: "product_b.jpg",
        qtyOrdered: 5
    },
    {
        id: 3,
        name: "Product C",
        image: "product_c.jpg",
        qtyOrdered: 8
    },
    {
        id: 4,
        name: "Product D",
        image: "product_d.jpg",
        qtyOrdered: 3
    },
    {
        id: 5,
        name: "Product E",
        image: "product_e.jpg",
        qtyOrdered: 6
    },
    {
        id: 6,
        name: "Product F",
        image: "product_f.jpg",
        qtyOrdered: 12
    },
    {
        id: 7,
        name: "Product G",
        image: "product_g.jpg",
        qtyOrdered: 4
    }];
    const totalQty = ProductDetails.reduce((acc, cur) => acc + cur.qtyOrdered, 0);
    const availabilityStatus = ['Confirmed', '1 week', '2 week', '3 weeks', '1 month', 'Out of Stock'];

    const top100Films = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'The Godfather', year: 1972 },
        { label: 'The Godfather: Part II', year: 1974 },
        { label: 'The Dark Knight', year: 2008 },
        { label: '12 Angry Men', year: 1957 },
        { label: "Schindler's List", year: 1993 },
        { label: 'Pulp Fiction', year: 1994 },
    ]

    const columns = [
        { field: "name", headerName: "Name", flex: 1 },
        {
            field: "image", headerName: "Image", flex: 1,
            type: "html",
            renderCell: (value, row) => {
                return (
                    <Box>
                        <img src={value?.row?.image ? value?.row?.image : require('../../assets/default.png')} alt={value?.row?.name} />
                    </Box>
                );
            }

        },
        { field: "qtyOrdered", headerName: "Qty Ordered", flex: 1 },
    ];

    const handleChange = (event, value) => {
        setPage(value);
    };

    const getAllProducts = async () => {
        let apiUrl = `${API_URL}wp-json/custom-manual-po/v1/get-product-manual/`;
        await dispatch(
            GetProductManual({
                apiUrl: apiUrl,
            })
        )
            .then((response) => {
                console.log(response, 'response')
                let data = response.data.products.map((v, i) => ({ ...v, id: i }));
                console.log(data, 'data')
                setManualProducts(data);
                console.log(manualProducts, 'manualProducts');
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        getAllProducts()
    }, [manualProducts])

    return (
        <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
            <Box className="mb-4">
                <Typography variant="h4" className="fw-semibold">
                    On-hold Management System
                </Typography>
            </Box>
            {/* <h3 className='fw-bold text-center py-3'>On-hold Management System</h3> */}
            <Form inline className='mb-4'>
                <Row className="align-items-center px-1">
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
                            <Form.Label className="fw-semibold">Verified By:</Form.Label>
                            <Form.Select
                                className="mr-sm-2 py-2"
                                onChange={(e) => setSelectedOperator(e.target.value)}
                            >
                                <option disabled value="">Select Operator</option>
                                <option value="test1">Test1</option>
                                <option value="test2">Test2</option>
                                <option value="test3">Test3</option>
                            </Form.Select>
                        </Form.Group>
                    </Col>
                    <Col xs="auto" lg="3">
                        <Form.Group>
                            <Form.Label className="fw-semibold">Boxes Received:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter No of received boxes"
                                value={receivedBoxes}
                                onChange={(e) => setReceivedBoxes(e.target.value)}
                                className="mr-sm-2 py-2"
                            />
                        </Form.Group>
                    </Col>
                    <Col xs="auto" lg="3">
                        <Form.Group>
                            <Form.Label className="fw-semibold">Attach the Delivery Bill:</Form.Label>
                            <Form.Control
                                type="file"
                                className="mr-sm-2 py-2"
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <MDBRow className='px-3'>
                <Card className='py-3'>
                    <Col xs="auto" lg="3" className='mb-3'>
                        <Form.Group>
                            <Form.Label className="fw-semibold">Search Products:</Form.Label>
                            {/* <Form.Control
                                type="text"
                                placeholder="Search Product by name"
                                value={searchedProduct}
                                onChange={(e) => setSearchedProduct(e.target.value)}
                                className="mr-sm-2 py-2"
                            /> */}
                            <Autocomplete
                                className="mr-sm-2 py-2"
                                disablePortal
                                id="combo-box-demo"
                                options={top100Films}
                                sx={{
                                    width: 300,
                                    "& .MuiInputBase-root": {
                                        paddingTop: '0px',
                                        paddingBottom: '0px'
                                    },
                                }}
                                renderInput={(params) => <TextField {...params} />}
                            />
                        </Form.Group>
                    </Col>
                    <div className="mt-2">
                        <DataTable
                            columns={columns}
                            rows={ProductDetails}
                            page={page}
                            pageSize={pageSize}
                            totalPages={totalPages}
                            handleChange={handleChange}
                        />
                    </div>
                </Card>
            </MDBRow>
            <MDBRow className='justify-content-end px-3'>
                <Button variant="primary" style={{ width: '100px' }}>
                    submit
                </Button>
            </MDBRow>
        </Container >
    )
}

export default OnHoldManegementSystem
