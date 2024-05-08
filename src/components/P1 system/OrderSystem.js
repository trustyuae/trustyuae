import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import axios from 'axios';
import { Link } from 'react-router-dom';
import countries from 'iso-3166-1-alpha-2';
import { Box, Typography } from '@mui/material';
import DataTable from '../DataTable';

function OrderSystem() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchOrderID, setSearchOrderID] = useState('');
    const [startDate, setStartDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Default page size
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // Sort configuration
    const pageSizeOptions = [5, 10, 20, 50, 900]; // Options for page size

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const username = 'ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a';
    const password = 'cs_8dcdba11377e29282bd2b898d4a517cddd6726fe';

    const [dispatchType, setdispatchType] = useState([]);

    useEffect(() => {
        fetch('https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-api/dispatch-status/')
            .then(response => response.json())
            .then(data => setdispatchType(data))
            .catch(error => console.error('Error fetching orders:', error));
    }, []);

    const fetchOrders = async () => {
        try {
            const response = await axios.get(`https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-orders-new/v1/orders?page=${page}&per_page=${pageSize}`, {
                auth: {
                    username: username,
                    password: password
                }
            });
            let data = response.data.orders.map((v, i) => ({ ...v, id: i }))
            console.log(data, '<===== data')
            setOrders(data);
            console.log(response.data.orders, 'dispatchType===>>>>');
            const totalPagesHeader = response.data.total_count;
            console.log(totalPagesHeader, 'totalPagesHeader');
            setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect((page, pageSize) => {
        fetchOrders();
    }, [page, pageSize]);

    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };
    const handleSearch = async () => {
        let apiUrl = `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-orders-new/v1/orders`;

        if (searchOrderID) {
            apiUrl += `?orderid=${searchOrderID}`;
        }

        if (startDate) {
            // apiUrl += `?after=${startDate}T00:00:00&before=${startDate}T23:59:59`;
            apiUrl += `?date=${startDate}`;
        }

        try {
            const response = await axios.get(`${apiUrl}?page=${page}&per_page=10`, {
                auth: {
                    username: username,
                    password: password
                }
            });
            // setFilteredOrders(response.data);
            setOrders(response);
            const totalPagesHeader = response.data.total_count;
            setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 1);
            setCurrentPage(1); // Reset current page to 1 after filtering
        } catch (error) {
            console.error('Error fetching filtered data:', error);
        }
    };

    const handleReset = () => {
        setSearchOrderID('');
        setStartDate('');
        setFilteredOrders(orders);
        setCurrentPage(1); // Reset current page to 1 after resetting filters
        fetchOrders()
    };

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setCurrentPage(1); // Reset current page to 1 after changing page size
    };

    const requestSort = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const sortedOrders = () => {
        const sorted = [...filteredOrders];
        if (sortConfig.key) {
            sorted.sort((a, b) => {
                let aValue = a[sortConfig.key];
                let bValue = b[sortConfig.key];

                // For 'billing_full_name' key, concatenate first and last name
                if (sortConfig.key === 'billing.first_name') {
                    aValue = `${a.billing?.first_name} ${a.billing?.last_name}`;
                    bValue = `${b.billing?.first_name} ${b.billing?.last_name}`;
                }

                // For 'shipping_country' key, access country under shipping object
                if (sortConfig.key === 'shipping.country') {
                    aValue = a.shipping?.country;
                    bValue = b.shipping?.country;
                }

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }
        return sorted;
    };
    const getClassNamesFor = (name) => {
        if (!sortConfig) {
            return;
        }
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    // Logic to get current orders for pagination
    const indexOfLastOrder = currentPage * pageSize;
    const indexOfFirstOrder = indexOfLastOrder - pageSize;
    const currentOrders = sortedOrders().slice(indexOfFirstOrder, indexOfLastOrder);

    const goToPage = (newPage) => {
        setPage(newPage);
    };

    // const getDispatchStatus = (order) => {
    //     console.log(order, 'order');
    //     console.log(dispatchType,'dispatchType');
    //     console.log(dispatchType.find(type=>type.order_id===order));
    //     // dispatchType.map(type=>{
    //     //     if(type.order_id==order){
    //     //         return type?.dispatch_status
    //     //     }
    //     // })
    //     // Assuming the API returns the dispatch status as a property named 'dispatchStatus'
    //     // return dispatchType.dispatchStatus || 'Not available'; // You can change the fallback text as needed
    // };

    const getCountryName = code => {
        const country = countries.getCountry(code);
        return country ? country : 'Unknown';
    };

    const getRowClassName = (params) => {
        console.log(params, 'params')
        return params.row.order_status === 'Dispatch' ? 'test-class' : '';
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
                console.log(row)
                return <Link to={`/order_details/${row?.order_id}`}>
                    <Button type="button" className='w-auto'>View</Button>
                </Link>
            },
        },
    ];

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
                                <Form.Select className="mr-sm-2 py-2">
                                    <option value="All">All</option>
                                    <option value="Dispatch">Dispatch</option>
                                    <option value="Reserve">Reserve</option>
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
                        <Button type="button" className='mr-2 mx-1 w-auto' onClick={handleSearch}>Search</Button>
                        <Button type="button" className='mr-2 mx-1 w-auto' onClick={handleReset}>Reset filter</Button>
                    </Box>
                </Form>
            </Row>
            <Box className='mt-2'>
                <DataTable columns={columns} rows={orders} getRowClassName={'test-class'} />
                {/* <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className='text-center'
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }} onClick={() => requestSort('date_created')}>
                                Date{' '}
                                <span className={getClassNamesFor('date_created')}></span>
                            </th>
                            <th className='text-center'
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }} onClick={() => requestSort('id')}>
                                Order ID{' '}
                                <span className={getClassNamesFor('id')}></span>
                            </th>
                            <th className='text-center'
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                                onClick={() => requestSort('billing.first_name')}>
                                Customer Name{' '}
                                <span className={getClassNamesFor('billing.first_name')}></span>
                            </th>
                            <th className='text-center'
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                                onClick={() => requestSort('shipping.country')}>
                                Shipping Country{' '}
                                <span className={getClassNamesFor('shipping.country')}></span>
                            </th>
                            <th className='text-center'
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }} onClick={() => requestSort('dispatch_type')}>
                                Dispatch Type{' '}
                                <span className={getClassNamesFor('dispatch_type')}></span>
                            </th>
                            <th className='text-center'
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}>View Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order, index) => {
                            // const subItem = dispatchType.find(sub=>sub.order_id==order.id)
                            const backgroundColor = order.order_status === "Reserve" ? '#ffff00' : '#8ceb8c'
                            // const backgroundColor=''
                            // console.log(subItem,'subItem');
                            return (
                                <tr key={order.id} style={{ backgroundColor }}>
                                    <td className='text-center ' style={{backgroundColor}}>{formatDate(order.date)}</td>
                                    <td className='text-center ' style={{ backgroundColor }}>{order.date}</td>
                                    <td className='text-center ' style={{ backgroundColor }}>{order.order_id}</td>
                                    <td className='text-center ' style={{ backgroundColor }}>{order.customer_name}</td>
                                    <td className='text-center ' style={{ backgroundColor }}>{getCountryName(order.shipping_country)}</td>
                                    <td className='text-center ' style={{backgroundColor}}>{order.billing.first_name} {order.billing.last_name}</td>
                                    <td className='text-center ' style={{backgroundColor}}>{order.shipping_country}</td>
                                    <td className='text-center ' style={{ backgroundColor }}>{order.order_status}</td>
                                    <td className='text-center ' style={{ backgroundColor }}>
                                        <Link to={`/order_details/${order.order_id}`}>
                                            <Button type="button" className='w-auto'>View</Button>
                                        </Link>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table> */}
                {/* <div>
                    <Row>
                        <Col className='d-flex justify-content-end align-items-center' >
                            <Button type="button" className='mr-2 mx-3 ' onClick={() => goToPage(page - 1)} disabled={page === 1}>Previous</Button>
                            <span>{page} of {totalPages}</span>
                            <Button type="button" className='mr-2 mx-3 ' onClick={() => goToPage(page + 1)} disabled={page === totalPages}>Next</Button>
                        </Col>
                    </Row>
                </div> */}
            </Box>
        </Container>
    )
}

export default OrderSystem
