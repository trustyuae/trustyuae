import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import axios from 'axios';
import { Link } from 'react-router-dom'; // Import Link
function OrderSystem() {
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [searchOrderID, setSearchOrderID] = useState('');
    const [startDate, setStartDate] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Default page size
    const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' }); // Sort configuration
    const pageSizeOptions = [5, 10, 20, 50]; // Options for page size

    const username = 'ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a';
    const password = 'cs_8dcdba11377e29282bd2b898d4a517cddd6726fe';

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get('https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/wc/v3/orders', {
                    auth: {
                        username: username,
                        password: password
                    }
                });
                setOrders(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchOrders();
    }, []);

    useEffect(() => {
        setFilteredOrders(orders);
    }, [orders]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString();
    };

    const handleSearch = () => {
        let filtered = orders;

        if (searchOrderID) {
            filtered = filtered.filter(order => order.id.toString() === searchOrderID);
        }

        if (startDate) {
            // Extract day, month, and year from startDate
            const startDateObj = new Date(startDate);
            const startDay = startDateObj.getDate();
            const startMonth = startDateObj.getMonth();
            const startYear = startDateObj.getFullYear();

            // Filter orders based on date comparison
            filtered = filtered.filter(order => {
                // Extract day, month, and year from order date
                const orderDateObj = new Date(order.date_created);
                const orderDay = orderDateObj.getDate();
                const orderMonth = orderDateObj.getMonth();
                const orderYear = orderDateObj.getFullYear();

                // Compare day, month, and year
                return startDay === orderDay && startMonth === orderMonth && startYear === orderYear;
            });
        }

        setFilteredOrders(filtered);
        setCurrentPage(1); // Reset current page to 1 after filtering
    };

    const handleReset = () => {
        setSearchOrderID('');
        setStartDate('');
        setFilteredOrders(orders);
        setCurrentPage(1); // Reset current page to 1 after resetting filters
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
                    aValue = `${a.billing.first_name} ${a.billing.last_name}`;
                    bValue = `${b.billing.first_name} ${b.billing.last_name}`;
                }

                // For 'shipping_country' key, access country under shipping object
                if (sortConfig.key === 'shipping.country') {
                    aValue = a.shipping.country;
                    bValue = b.shipping.country;
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
                                <Form.Select className="mr-sm-2">
                                    <option value="Standard">Dispatch</option>
                                    <option value="Express">Reserve</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs="auto" lg="3" className=' d-flex  align-items-end'>
                            <Button type="button" className='mr-2 mx-3 w-50' onClick={handleSearch}>Search</Button>
                            <Button type="button" className='mr-2 mx-3 w-50' onClick={handleReset}>Reset filter</Button>
                        </Col>
                        <Col xs="auto" lg="1">
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
                            <th className='text-center' onClick={() => requestSort('date_created')}>
                                Date{' '}
                                <span className={getClassNamesFor('date_created')}></span>
                            </th>
                            <th className='text-center' onClick={() => requestSort('id')}>
                                Order ID{' '}
                                <span className={getClassNamesFor('id')}></span>
                            </th>
                            <th className='text-center' onClick={() => requestSort('billing.first_name')}>
                                Customer Name{' '}
                                <span className={getClassNamesFor('billing.first_name')}></span>
                            </th>
                            <th className='text-center' onClick={() => requestSort('shipping.country')}>
                                Shipping Country{' '}
                                <span className={getClassNamesFor('shipping.country')}></span>
                            </th>
                            <th className='text-center' onClick={() => requestSort('dispatch_type')}>
                                Dispatch Type{' '}
                                <span className={getClassNamesFor('dispatch_type')}></span>
                            </th>
                            <th className='text-center'>View Items</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map(order => (
                            <tr key={order.id}>
                                <td className='text-center'>{formatDate(order.date_created)}</td>
                                <td className='text-center'>{order.id}</td>
                                <td className='text-center'>{order.billing.first_name} {order.billing.last_name}</td>
                                <td className='text-center'>{order.shipping.country}</td>
                                <td className='text-center'>Dispatch</td>
                                <td className='text-center'>
                                    <Link to={`/order_details/${order.id}`}>
                                        <Button type="button" className='w-auto'>View</Button>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Pagination className="mt-3 justify-content-center">
                    <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                    <Pagination.Prev onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} />
                    {[...Array(Math.ceil(filteredOrders.length / pageSize)).keys()].map(number => (
                        <Pagination.Item key={number + 1} active={number + 1 === currentPage} onClick={() => setCurrentPage(number + 1)}>
                            {number + 1}
                        </Pagination.Item>
                    ))}
                    <Pagination.Next onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === Math.ceil(filteredOrders.length / pageSize)} />
                    <Pagination.Last onClick={() => setCurrentPage(Math.ceil(filteredOrders.length / pageSize))} disabled={currentPage === Math.ceil(filteredOrders.length / pageSize)} />
                </Pagination>
            </div>
        </Container>
    )
}

export default OrderSystem
