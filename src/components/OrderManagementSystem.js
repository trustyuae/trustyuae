import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
function OrderManagementSystem() {
    const [orders, setOrders] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [pageSize, setPageSize] = useState(5); // Number of orders per page
    const [selectAll, setSelectAll] = useState(false); // Track whether all checkboxes are selected
    const pageSizes = [5, 10, 15, 20]; // Available page sizes
    const username = 'ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a';
    const password = 'cs_8dcdba11377e29282bd2b898d4a517cddd6726fe';
    useEffect(() => {
        fetchOrders(currentPage, pageSize);
    }, [currentPage, pageSize]);
    const fetchOrders = async (page, size) => {
        try {
            const response = await axios.get(`https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/wc/v3/orders?status=processing&page=${page}&per_page=${size}`, {
                auth: {
                    username: username,
                    password: password
                }
            });
            console.log(response, 'response');
            let a = response.data.map(order => order.line_items)
            console.log([].concat(...a), '[].concat(...a)');
            setOrders([].concat(...a));
            setTotalPages(response.headers['x-wp-totalpages']);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };
    const handlePageChange = (page) => {
        setCurrentPage(page);
    };
    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setCurrentPage(1); // Reset to first page when page size changes
    };
    const handleSelectAll = () => {
        setSelectAll(!selectAll); // Toggle select all state
    };
    return (
        <Container fluid className='p-5' style={{ maxHeight: "100%", minHeight: "100vh" }}>
            <div className="mb-9">
                <div className="row g-3 mb-4 justify-content-center ">
                    <div className="col-auto">
                        <h2 className="mb-0">Order Management  System</h2>
                    </div>
                </div>
            </div>
            <Row className='mb-4 mt-4'>
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
                                <Form.Label>Dispatch type:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Dispatch Type"
                                    className="mr-sm-2"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="2">
                            <Form.Group>
                                <Form.Label>Page Size:</Form.Label>
                                <Form.Select value={pageSize} onChange={handlePageSizeChange}>
                                    {pageSizes.map(size => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Row>
            <Row className='mb-4 mt-4 '>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <Form.Check
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectAll}
                                />
                            </th>
                            <th>Product Name</th>
                            <th>Image</th>
                            <th>Quantity</th>
                            <th>Order Status</th>
                            <th>PO Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectAll}
                                        onChange={() => {/* handle individual checkbox change if needed */}}
                                    />
                                </td>
                                <td className='text-center'>{order.name}</td>
                                <td className='text-center'>
                                    <img src={order.image.src} alt={order.name} className='img-fluid' width={90} />
                                </td>
                                <td className='text-center'>{order.quantity}</td>
                                <td className='text-center'>{order.quantity}</td>
                                <td className='text-center'>{order.quantity}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
            <Row className='mb-4 mt-4'>
                <Form inline>
                    <Row className='mt-4'>
                        <Col xs="auto" lg="3" className=' d-flex  align-items-end'>
                            <Button type="button" className='mr-2 mx-3 w-50' onClick={handleSelectAll}>Select All Orders</Button>
                            <Button type="button" className='mr-2 mx-3 w-50' >Create PO</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
            <Pagination className="mt-3 justify-content-center">
                <Pagination.Prev onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} />
                {[...Array(totalPages).keys()].map(number => (
                    <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => handlePageChange(number + 1)}>
                        {number + 1}
                    </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} />
            </Pagination>
        </Container>
    );
}
export default OrderManagementSystem;