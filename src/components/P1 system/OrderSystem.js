import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import axios from 'axios';
import { Link } from 'react-router-dom';
import countries from 'iso-3166-1-alpha-2';
import { Box, Typography } from '@mui/material';
import DataTable from '../DataTable';

function OrderSystem() {
    const [dispatchType, setDispatchType] = useState('all');
    const [orders, setOrders] = useState([]);
    const [searchOrderID, setSearchOrderID] = useState('');
    const [startDate, setStartDate] = useState('');
    const [pageSize, setPageSize] = useState(10);
    const pageSizeOptions = [5, 10, 20, 50, 100];
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isReset, setIsReset] = useState(false);

    const fetchOrders = async () => {

        let apiUrl = `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-orders-new/v1/orders`

        if (searchOrderID) apiUrl += `?orderid=${searchOrderID}`;
        if (startDate) apiUrl += `?date=${startDate}`;

        try {
            // const response = await axios.get(`https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-orders-new/v1/orders?page=${page}&per_page=${pageSize}&status=${dispatchType}`);
            const response = await axios.get(`${apiUrl}?page=${page}&per_page=${pageSize}&status=${dispatchType}`);
            let data = response.data.orders.map((v, i) => ({ ...v, id: i }))
            setOrders(data);

            const totalPagesHeader = response.data.total_pages;
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, [pageSize, page, dispatchType, isReset]);

    const handleReset = () => {
        setSearchOrderID('');
        setStartDate('');
        setTotalPages(1)
        if (isReset) {
            setIsReset(false)
        } else {
            setIsReset(true)
        }
    };

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
    };

    const goToPage = (newPage) => {
        setPage(newPage);
    };

    const getCountryName = code => {
        const country = countries.getCountry(code);
        return country ? country : 'Unknown';
    };

    const columns = [
        { field: 'date', headerName: 'Date', width: 200 },
        { field: 'order_id', headerName: 'Order ID', width: 130 },
        { field: 'customer_name', headerName: 'Customer Name', width: 250 },
        {
            field: 'shipping_country',
            headerName: 'Shipping Country',
            type: 'string',
            width: 250,
            valueGetter: (value, row) => getCountryName(row.shipping_country)
            ,
        },
        {
            field: 'order_status',
            headerName: 'Order Status',
            width: 160,
            type: 'string',
        },
        {
            field: 'view_item',
            headerName: 'View Item',
            width: 125,
            type: 'html',
            renderCell: (value, row) => {
                return <Link to={`/order_details/${value?.row?.order_id}`}>
                    <Button type="button" className='w-auto'>View</Button>
                </Link>
            },
        },
    ];

    const handleChange = (event, value) => {
        setPage(value);
    };

    return (
        <Container fluid className='py-3' style={{ maxHeight: "100%", minHeight: "100vh" }}>
            <Box className="mb-4">
                <Typography variant='h4' className='fw-semibold'>
                    Order Fulfillment System
                </Typography>
            </Box>
            <Row className='mb-4 mt-4'>
                <Form inline>
                    <Row className='mb-4'>
                        <Col xs="auto" lg="4">
                            <Form.Group>
                                <Form.Label className='fw-semibold'>Order Id:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Order ID"
                                    value={searchOrderID}
                                    onChange={e => setSearchOrderID(e.target.value)}
                                    className="mr-sm-2 py-2"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="4">
                            <Form.Group>
                                <Form.Label className='fw-semibold'>Date filter:</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="mr-sm-2 py-2"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="4">
                            <Form.Group>
                                <Form.Label className='fw-semibold'>Dispatch type:</Form.Label>
                                <Form.Select className="mr-sm-2 py-2" onChange={e => setDispatchType(e.target.value)}>
                                    <option value="all">All</option>
                                    <option value="dispatch">Dispatch</option>
                                    <option value="reserve">Reserve</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Box className='d-flex justify-content-end'>
                        <Form.Group className='d-flex mx-1 align-items-center'>
                            <Form.Label className='fw-semibold mb-0 me-2'>Page Size:</Form.Label>
                            <Form.Control as="select" className='w-auto' value={pageSize} onChange={handlePageSizeChange}>
                                {pageSizeOptions.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </Form.Control>
                        </Form.Group>
                        <Button type="button" className='mr-2 mx-1 w-auto' onClick={fetchOrders}>Search</Button>
                        <Button type="button" className='mr-2 mx-1 w-auto' onClick={handleReset}>Reset filter</Button>
                    </Box>
                </Form>
            </Row>
            <div className='mt-2'>
                <DataTable columns={columns} rows={orders} page={page} pageSize={pageSize} totalPages={totalPages} handleChange={handleChange} />
            </div>
        </Container>
    )
}

export default OrderSystem