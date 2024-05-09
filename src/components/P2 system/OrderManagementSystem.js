import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Card } from "react-bootstrap";
import { Link } from 'react-router-dom';
import DataTable from '../DataTable';

function OrderManagementSystem() {
    const [orders, setOrders] = useState([]);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const username = 'ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a';
    const password = 'cs_8dcdba11377e29282bd2b898d4a517cddd6726fe';
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const pageSizes = [5, 10, 15, 20];
    const [startDate, setStartDate] = useState('');

    const columns = [
        { field: "product_names", headerName: "product names", flex: 1 },
        { field: "variation_values", headerName: "variation values", flex: 1 },
        // { field: "product_images", headerName: "product images", flex: 1 },
        { field: "total_quantity", headerName: "total quantity", flex: 1 },
        { field: "factory_id", headerName: "factory id", flex: 1 },
        { field: "po_number", headerName: "po number", flex: 1 },
      ];

    useEffect(() => {
        fetchOrders(page, pageSize);
    }, [page, pageSize, startDate]);

    const fetchOrders = async (page, pageSize) => {
        try {
            let apiUrl = `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/wc/v3/orders?status=processing&page=${page}&per_page=${pageSize}`;
            // let apiUrl = `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-preorder-products/v1/pre-order/?start_date=2024-05-08&end_date=2024-05-09&factory_id=3`;
            // let apiUrl = `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-preorder-products/v1/pre-order`;

            if (startDate) {
                apiUrl += `&after=${startDate}T00:00:00&before=${startDate}T23:59:59`;
            }

            const response = await axios.get(apiUrl, {
                auth: {
                    username: username,
                    password: password
                }
            });
            console.log(response, 'response');
            let a = response.data.map(order => order.line_items)
            console.log([].concat(...a), '[].concat(...a)');
            setOrders([].concat(...a));
            const totalPagesHeader = response.headers.get('X-WP-TotalPages');
            setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const goToPage = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
    };

    const handleSelectAll = () => {
        const allOrderIds = orders.map(order => order.id);
        setSelectedOrderIds(selectedOrderIds.length === allOrderIds.length ? [] : allOrderIds);
    };

    const handleOrderSelection = (orderId) => {
        const selectedIndex = selectedOrderIds.indexOf(orderId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedOrderIds, orderId];
        } else if (selectedIndex === 0) {
            newSelected = selectedOrderIds.slice(1);
        } else if (selectedIndex === selectedOrderIds.length - 1) {
            newSelected = selectedOrderIds.slice(0, -1);
        } else if (selectedIndex > 0) {
            newSelected = [
                ...selectedOrderIds.slice(0, selectedIndex),
                ...selectedOrderIds.slice(selectedIndex + 1),
            ];
        }

        setSelectedOrderIds(newSelected);
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
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
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
                                    checked={selectedOrderIds.length === orders.length}
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
                                        checked={selectedOrderIds.includes(order.id)}
                                        onChange={() => handleOrderSelection(order.id)}
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
                        <Col xs="auto" lg="6" className=' d-flex  align-items-end'>
                            <Button type="button" className='mr-2 mx-3 ' onClick={handleSelectAll}>Select All Orders</Button>
                            <Link to={`/PO_ManagementSystem`}>
                                <Button type="button" className='mr-2 mx-3 ' >Create PO</Button>
                            </Link>
                        </Col>
                        <Col xs="auto" lg="6" className=' d-flex  align-items-end justify-content-end m-0'>
                            <Pagination className="mt-3 m-0 justify-content-center">
                                <Pagination.Prev onClick={() => goToPage(page - 1)} disabled={page === 1} />
                                <Pagination.Item >
                                    <span>{page} of {totalPages}</span>
                                </Pagination.Item>
                                <Pagination.Next onClick={() => goToPage(page + 1)} disabled={page === totalPages} />
                            </Pagination>
                        </Col>
                    </Row>
                </Form>
            </Row>
            <div className="mt-2">
        {/* <DataTable
          columns={columns}
          rows={orders}
          
          
        /> */}
      </div>
        </Container>
    );
}

export default OrderManagementSystem;
