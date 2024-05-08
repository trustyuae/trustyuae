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

function OrderSystem() {
    const [dispatchType, setDispatchType] = useState('all');
    const [orders, setOrders] = useState([]);
    const [searchOrderID, setSearchOrderID] = useState('');
    const [startDate, setStartDate] = useState('');
    const [pageSize, setPageSize] = useState(10); // Default page size
    const pageSizeOptions = [5, 10, 20, 50, 100]; // Options for page size
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const username = 'ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a';
    const password = 'cs_8dcdba11377e29282bd2b898d4a517cddd6726fe';




    const fetchOrders = async () => {
        try {
            const response = await axios.get(`https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-orders-new/v1/orders?page=${page}&per_page=${pageSize}&status=${dispatchType}`, {
                auth: {
                    username: username,
                    password: password
                }
            });
            setOrders(response.data.orders);
            console.log(response.data.orders, 'dispatchType===>>>>');
            const totalPagesHeader = response.data.total_pages;
            console.log(totalPagesHeader, 'totalPagesHeader');
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    useEffect((page, pageSize) => {
        fetchOrders();
    }, [page, pageSize, dispatchType]);

    

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
            setOrders(response.data.orders);
            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error('Error fetching filtered data:', error);
        }
    };

    const handleReset = () => {
        setSearchOrderID('');
        setStartDate('');
        fetchOrders()
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

    const handleDispatchTypeChange = (event) => {
        const type = event.target.value;
        setDispatchType(type);
        fetchOrders();
    };

    return (
        <Container fluid className='py-3' style={{ maxHeight: "100%", minHeight: "100vh" }}>
            <div className="mb-9">
                <div className="row g-3 mb-4">
                    <div className="col-auto">
                        <h2 className="mb-0">Order Fulfillment System</h2>
                    </div>
                </div>
            </div>
            <Row className='mb-4 mt-4'>
                <Form inline>
                    <Row >
                        <Col xs="auto" lg="4">
                            <Form.Group>
                                <Form.Label>Order Id:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Order ID"
                                    value={searchOrderID}
                                    onChange={e => setSearchOrderID(e.target.value)}
                                    className="mr-sm-2"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="4">
                            <Form.Group>
                                <Form.Label>Date filter:</Form.Label>
                                <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="mr-sm-2"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="4">
                            <Form.Group>
                                <Form.Label>Dispatch type:</Form.Label>
                                <Form.Select className="mr-sm-2" value={dispatchType} onChange={handleDispatchTypeChange}>
                                    <option value="all">All</option>
                                    <option value="dispatch">Dispatch</option>
                                    <option value="reserve">Reserve</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="auto" className=' d-flex  align-items-end'>
                            <Button type="button" className='mr-2 mx-3 ' onClick={handleSearch}>Search</Button>
                            <Button type="button" className='mr-2 mx-3 ' onClick={handleReset}>Reset filter</Button>
                        </Col>
                        <Col xs="auto" >
                            <Form.Group>
                                <Form.Label>Page Size:</Form.Label>
                                <Form.Control as="select" value={pageSize} onChange={handlePageSizeChange}>
                                    {pageSizeOptions.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Row>
            <div className='mt-2'>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th className='text-center'
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}>
                                Date

                            </th>
                            <th className='text-center'
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}>
                                Order ID

                            </th>
                            <th className='text-center'
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                                Customer Name
                            </th>
                            <th className='text-center'
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                                Shipping Country
                            </th>
                            <th className='text-center'
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center", 
                                }} >
                                Dispatch Type
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

                            const backgroundColor = order.order_status === "Reserve" ? '#ffff00' : '#8ceb8c'

                            return (
                                <tr key={index} style={{ backgroundColor }}>
                                    <td className='text-center ' style={{ backgroundColor }}>{order.date}</td>
                                    <td className='text-center ' style={{ backgroundColor }}>{order.order_id}</td>
                                    <td className='text-center ' style={{ backgroundColor }}>{order.customer_name}</td>
                                    <td className='text-center ' style={{ backgroundColor }}>{getCountryName(order.shipping_country)}</td>
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
                </Table>
                <div>
                    <Row>
                        <Col className='d-flex justify-content-end align-items-center' >
                            <Button type="button" className='mr-2 mx-3 ' onClick={() => goToPage(page - 1)} disabled={page === 1}>Previous</Button>
                            <span>{page} of {totalPages}</span>
                            <Button type="button" className='mr-2 mx-3 ' onClick={() => goToPage(page + 1)} disabled={page === totalPages}>Next</Button>
                        </Col>
                    </Row>
                </div>
            </div>
        </Container>
    )
}

export default OrderSystem