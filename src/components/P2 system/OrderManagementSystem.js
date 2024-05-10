import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { Link, useNavigate } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Swal from "sweetalert2";
import DataTable from '../DataTable';

function OrderManagementSystem() {
    const [orders, setOrders] = useState([]);
    const [orders2, setOrders2] = useState([]);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(10);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
    const [factories, setFactories] = useState([]);
    const [selectedFactory, setSelectedFactory] = useState('');
    const [selectedProductIds, setSelectedProductIds] = useState('');
    const [alertMessage, setAlertMessage] = useState('');
    const navigate = useNavigate();

    const columns = [
        { field: "product_names", headerName: "product names", flex: 1 },
        { field: "variation_values", headerName: "variation values", flex: 1 },
        { field: "product_images", headerName: "product images", flex: 1 ,
        type: "html",
        renderCell: (value, row) => {
          return (
            // <Link to={`/order_details/${value?.row?.order_id}`}>
            //   <Button type="button" className="w-auto">
            //     View
            //   </Button>
            // </Link>
            <>
                <img src={value.row.product_images} alt={value.row.product_names} className="img-fluid" width={90} />
            </>
          );
        },
        },
        { field: "total_quantity", headerName: "total quantity", flex: 1 },
        { field: "factory_id", headerName: "factory id", flex: 1 },
        { field: "po_number", headerName: "po number", flex: 1 },
    ];

    useEffect(() => {
        fetchOrders();
        fetchFactories();
    }, [page, pageSize, endDate, selectedFactory]);

    const fetchOrders = async () => {
        try {
            let apiUrl = `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-preorder-products/v1/pre-order/?`;
            if (endDate) apiUrl += `start_date=${startDate}&end_date=${endDate}`;
            if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
            const response = await axios.get(apiUrl);
            let data = response.data.map((v, i) => ({ ...v, id: i }));
            setOrders(response.data);
            setOrders2(data);
            const totalPagesHeader = response.headers.get('X-WP-TotalPages');
            setTotalPages(totalPagesHeader ? parseInt(totalPagesHeader) : 1);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const fetchFactories = async () => {
        try {
            const response = await axios.get(
                "https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-factory/v1/fetch-factories"
            );
            setFactories(response.data);
        } catch (error) {
            console.error("Error fetching factories:", error);
        }
    };

    const handleOrderSelection = (orderId) => {
        const selectedIndex = selectedOrderIds.indexOf(orderId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedOrderIds, orderId];
        } else {
            newSelected = selectedOrderIds.filter((id) => id !== orderId);
        }

        setSelectedOrderIds(newSelected);
    };

    const handleSelectAll = () => {
        const allOrderIds = orders.map((order) => order.order_id);
        setSelectedOrderIds(selectedOrderIds.length === allOrderIds.length ? [] : allOrderIds);
    };

    const handleDateChange = async (newDateRange) => {
        if (newDateRange[0]?.$d && newDateRange[1]?.$d) {
            setSelectedDateRange(newDateRange);
            const startDateString = newDateRange[0].$d.toDateString();
            const endDateString = newDateRange[1].$d.toDateString();

            const formattedStartDate = formatDate(startDateString);
            const formattedEndDate = formatDate(endDateString);

            const isoStartDate = new Date(formattedStartDate)?.toISOString().split("T")[0];
            const isoEndDate = new Date(formattedEndDate)?.toISOString().split("T")[0];

            setStartDate(isoStartDate);
            setEndDate(isoEndDate);
        } else {
            console.error("Invalid date range");
            setStartDate('');
            setEndDate('');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getDate().toString().padStart(2, "0")}/${date.getFullYear()}`;
    };

    const handleFactoryChange = (e) => {
        setSelectedFactory(e.target.value);
    };

    // const handleGenerateJson = () => {
    //     const selectedOrders = orders.filter((order) => selectedOrderIds.includes(order.order_id));
    //     const factoryIds = new Set(selectedOrders.map((order) => order.factory_id));
    //     if (factoryIds.size === 1) {
    //         const selectedProductIds = selectedOrders.map((order) => order.item_ids).join(',');
    //         const selectedOrderIdsStr = selectedOrderIds.join(',');
    //         setSelectedProductIds(JSON.stringify({ product_ids: selectedProductIds, order_ids: selectedOrderIdsStr }));
    //         setAlertMessage('');
    //     } else {
    //         setAlertMessage('Selected orders belong to different factories. Please select orders from the same factory.');
    //     }
    // };

    const handleGeneratePO = async () => {
        const selectedOrders = orders.filter((order) => selectedOrderIds.includes(order.order_id));
        const factoryIds = new Set(selectedOrders.map((order) => order.factory_id));
        if (factoryIds.size === 1) {
            const selectedProductIds = selectedOrders.map((order) => order.item_ids).join(',');
            const selectedOrderIdsStr = selectedOrderIds.join(',');
            setSelectedProductIds(JSON.stringify({ product_ids: selectedProductIds, order_ids: selectedOrderIdsStr }));
            setAlertMessage('');
            try {
                const response = await axios.post('https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-po-number/v1/po-id-generate/', {
                    product_ids: selectedProductIds,
                    order_ids: selectedOrderIdsStr
                });
                console.log(response.data);
                if (response.data) {
                    Swal.fire({
                        text: response.data
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/PO_ManagementSystem");
                        }
                    });
                }
            } catch (error) {
                console.error('Error generating PO IDs:', error);
            }
        } else {
            setAlertMessage('Selected orders belong to different factories. Please select orders from the same factory.');
            Swal.fire({
                text: 'Selected orders belong to different factories. Please select orders from the same factory.'
            });
        }
    };

    // const handleGenerateJson = () => {
    //     const selectedOrders = orders.filter((order) => selectedOrderIds.includes(order.order_id));
    //     const factoryIds = new Set(selectedOrders.map((order) => order.factory_id));

    //     if (factoryIds.size === 1) {
    //         const selectedProductIds = selectedOrders.map((order) => order.item_ids).join(',');
    //         const selectedOrderIdsStr = selectedOrderIds.join(',');
    //         setSelectedProductIds(JSON.stringify({ product_ids: selectedProductIds, order_ids: selectedOrderIdsStr }));
    //         setAlertMessage('');
    //     } else {
    //         const productsByFactory = {};
    //         selectedOrders.forEach((order) => {
    //             const factoryName = factories.find((factory) => factory.id === order.factory_id)?.factory_name;
    //             if (factoryName in productsByFactory) {
    //                 productsByFactory[factoryName].push(order.product_names);
    //             } else {
    //                 productsByFactory[factoryName] = [order.product_names];
    //             }
    //         });

    //         let errorMessage = 'Selected orders belong to different factories. Please select orders from the same factory.\n';
    //         for (const factoryName in productsByFactory) {
    //             errorMessage += `Factory: ${factoryName}, Products: ${productsByFactory[factoryName].join(', ')}\n`;
    //         }

    //         setAlertMessage(errorMessage);
    //     }
    // };

    const variant = (e) => {
        const matches = e.match(/"display_key";s:\d+:"([^"]+)";s:\d+:"display_value";s:\d+:"([^"]+)";/);
        if (matches) {
            const key = matches[1];
            const value = matches[2].replace(/<[^>]*>/g, ''); // Remove HTML tags
            return `${key}: ${value}`;
        } else {
            return "Variant data not available";
        }
    }

    return (
        <Container fluid className="p-5" style={{ maxHeight: "100%", minHeight: "100vh" }}>
            <div className="mb-9">
                <div className="row g-3 mb-4 justify-content-center ">
                    <div className="col-auto">
                        <h2 className="mb-0">Order Management System</h2>
                    </div>
                </div>
            </div>
            {/* {alertMessage && (
                <Row className="mb-4 mt-4">
                    <Col>
                        <div className="alert alert-danger" role="alert">
                            {alertMessage}
                        </div>
                    </Col>
                </Row>
            )} */}
            <Row className="mb-4 mt-4">
                <Form inline>
                    <Row>
                        <Col xs="auto" lg="5">
                            <Form.Group>
                                <Form.Label>Date filter:</Form.Label>
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer components={["SingleInputDateRangeField"]}>
                                        <DateRangePicker
                                            sx={{
                                                '& .MuiInputBase-root': {
                                                    paddingRight: 0
                                                },
                                                '& .MuiInputBase-input': {
                                                    padding: '.5rem .75rem .5rem .75rem',
                                                    '&:hover': {
                                                        borderColor: '#dee2e6'
                                                    }
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
                                <Form.Label>Factory Filter:</Form.Label>
                                <Form.Control
                                    as="select"
                                    className="mr-sm-2"
                                    value={selectedFactory}
                                    onChange={handleFactoryChange}
                                >
                                    <option value="">All Factory</option>
                                    {factories.map((factory) => (
                                        <option key={factory.id} value={factory.id}>{factory.factory_name}</option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Row>
            <Row className="mb-4 mt-4 ">
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
                            <th>Variant</th>
                            <th>Image</th>
                            <th>Quantity</th>
                            <th>PO Number</th>
                            <th>Factory Name</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.order_id}>
                                <td>
                                    <Form.Check
                                        type="checkbox"
                                        checked={selectedOrderIds.includes(order.order_id)}
                                        onChange={() => handleOrderSelection(order.order_id)}
                                    />
                                </td>
                                <td className="text-center">{order.product_names}</td>
                                <td className="text-center">{variant(order.variation_values)}</td>
                                <td className="text-center">
                                    <img src={order.product_images} alt={order.product_names} className="img-fluid" width={90} />
                                </td>
                                <td className="text-center">{order.total_quantity}</td>
                                <td className="text-center">{order.po_number}</td>
                                <td className="text-center">
                                    {factories.find(factory => factory.id === order.factory_id)?.factory_name}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
            <Row className="mb-4 mt-4">
                <Form inline>
                    <Row className="mt-4">
                        <Col xs="auto" lg="6" className="d-flex  align-items-end">
                            <Button type="button" className="mr-2 mx-3 " onClick={handleSelectAll}>Select All Orders</Button>
                            <Button type="button" className="mr-2 mx-3 " onClick={handleGeneratePO}>Create PO</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
            {/* <div className="mt-2">
                {selectedProductIds && (
                    <Card>
                        <Card.Body>
                            <Card.Title>Generated JSON</Card.Title>
                            <Card.Text>{selectedProductIds}</Card.Text>
                        </Card.Body>
                    </Card>
                )}
            </div> */}
            {/* <div className="mt-2">
                <DataTable
                    columns={columns}
                    rows={orders2}
                    checkboxSelection={true}
                    // page={page}
                    // pageSize={pageSize}
                    // totalPages={totalPages}
                    // handleChange={handleChange}
                />
            </div> */}
        </Container>
    );
}

export default OrderManagementSystem;
