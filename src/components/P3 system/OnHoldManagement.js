import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { useParams } from 'react-router-dom';
import { Box, Typography } from "@mui/material";
import { Badge, Card, Col, Row } from "react-bootstrap";
import DataTable from "../DataTable";

function OnHoldManagement() {

    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const data = [
        {
            id: 1,
            order_id: 86700,
            shipping_country: 'Saudia Arabia',
            item_received: 1,
            ouantity_ordered: 1
        },
        {
            id: 2,
            order_id: 88802,
            shipping_country: 'Kuwait',
            item_received: 1,
            ouantity_ordered: 2
        },
        {
            id: 3,
            order_id: 89065,
            shipping_country: 'UAE',
            item_received: 1,
            ouantity_ordered: 3
        },
    ]

    const columns = [
        { field: "order_id", headerName: "Order ID", flex: 1 },
        { field: "shipping_country", headerName: "Shipping Country", flex: 1, },
        { field: "item_received", headerName: "Item Received", flex: 1 },
        {
            field: "qtyOrdered", headerName: "Select All", flex: 1,
            valueGetter: (value, row) => `${row.item_received} / ${row.ouantity_ordered}`
        },
    ];

    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <Container
            fluid className="py-3" style={{ maxHeight: "100%" }}
        >
            <Box className="mb-4">
                <Typography variant="h4" className="fw-semibold">
                    On-hold Management
                </Typography>
            </Box>
            <MDBRow className="px-3">
                <Card className="p-3 mb-3">
                    <Typography variant="h6" className="fw-bold mb-3">
                        Product Details
                    </Typography>
                    <Box>
                        <Row className="justify-content-center">
                            <Col md="6">
                                <Box className="d-flex justify-content-center align-items-center h-100">
                                    <Box>
                                        <Typography variant="h5" className="fw-bold">Product - Chanel Double Flap</Typography>
                                        <Typography
                                            className=""
                                            sx={{
                                                fontSize: 14,
                                            }}
                                        >
                                            <Badge bg="success">{'Order ID'}</Badge>
                                        </Typography>
                                    </Box>
                                </Box>
                            </Col>
                            <Col md="6">
                                <Box className="w-100" sx={{ height: '200px' }}>
                                    <img className="w-100 h-100" style={{ objectFit: 'cover' }} src={require('../../assets/default.png')} />
                                </Box>
                            </Col>
                        </Row>
                    </Box>
                </Card>
            </MDBRow>

            <MDBRow className="px-3">
                <MDBCol col="10" md="12" sm="12"></MDBCol>
                <Card className='py-3'>
                    <Typography variant="h6" className="fw-bold mb-3">
                        Order Details
                    </Typography>
                    <div className="mt-2">
                        <DataTable
                            columns={columns}
                            rows={data}
                            page={page}
                            pageSize={pageSize}
                            totalPages={totalPages}
                            handleChange={handleChange}
                        />
                    </div>
                </Card>
            </MDBRow>
            <MDBRow>
                <MDBCol md="12" className="d-flex justify-content-end">
                    <Button variant="success">
                        Send for Preparation
                    </Button>

                </MDBCol>
            </MDBRow>

        </Container>
    )
}

export default OnHoldManagement
