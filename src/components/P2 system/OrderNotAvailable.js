import React, { useEffect, useState } from 'react';
import { MDBCol, MDBRow } from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import { useDispatch, useSelector } from 'react-redux';
import { OrderNotAvailableData } from '../../redux/actions/P2SystemActions';

function OrderNotAvailable() {
    const dispatch = useDispatch();
    const tableHeaders = [
        "Order ID",
        "Item Name",
        "Image",
        "Qty",
        "Customer contact no",
        "Estimated Production Timing",
        "Customer Status",
        "Select"
    ];

    const customerStatus = [
        "Select Status",
        "Confirmed",
        "Exchange",
        "Refund"
    ];

    const [checkedItems, setCheckedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [orderStatusMap, setOrderStatusMap] = useState({}); // Map to store status of each order

    const handleCheckboxChange = (orderID) => {
        const newCheckedItems = checkedItems.includes(orderID)
            ? checkedItems.filter(item => item !== orderID)
            : [...checkedItems, orderID];
        setCheckedItems(newCheckedItems);
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
    };

    useEffect(() => {
        dispatch(OrderNotAvailableData());
    }, [dispatch]);

    const OrderNotAvailabledata = useSelector(
        (state) => state?.orderNotAvailable?.ordersNotAvailable?.orders
        
    );

    useEffect(() => {
        // Initialize orderStatusMap when OrderNotAvailabledata changes
        const statusMap = {};
        OrderNotAvailabledata.forEach(item => {
            statusMap[item.order_id] = item.customerStatus;
        });
        setOrderStatusMap(statusMap);
        console.log()
    }, [OrderNotAvailabledata]);

    const handleStatusChange = (order_id, status) => {
        // Update the status map with the new status
        setOrderStatusMap(prevMap => ({
            ...prevMap,
            [order_id]: status
        }));
    }

    return (
        <Container fluid className='px-5' style={{ height: '98vh' }}>
            <h3 className='fw-bold text-center py-3'>Order Not Available</h3>
            <MDBRow className='d-flex justify-content-start align-items-center my-3'>
                <Button variant="primary w-25" onClick={handleShowModal}>
                    Release Scheduled PO
                </Button>
            </MDBRow>
            <MDBRow className='d-flex justify-content-center align-items-center'>
                <MDBCol col='10' md='12' sm='12'></MDBCol>
                <Table striped bordered hover style={{ boxShadow: '4px 4px 11px 0rem rgb(0 0 0 / 25%)' }}>
                    <thead>
                        <tr className='table-headers'>
                            {tableHeaders.map((header, index) => (
                                <th style={{ backgroundColor: '#DEE2E6', padding: '8px', textAlign: 'center' }} key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {OrderNotAvailabledata?.map((order) => (
                            <tr key={order.order_id}>
                                <td className='text-center'>{order.order_id}</td>
                                <td className='text-center'>{order.product_name}</td>
                                <td className='text-center'><img src={order.product_image} alt={order.product_name} className="img-fluid" width={90} /></td>
                                <td className='text-center'>{order.quantity}</td>
                                <td className='text-center'>{order.custom_number}</td>
                                <td className='text-center'>{order.estimated_production_time}</td>
                                <td className='text-center'>
                                    <Form.Group>
                                        <Form.Select style={{ height: '32px', padding: '0 10px' }} value={orderStatusMap[order.order_id]} onChange={(e) => handleStatusChange(order.order_id, e.target.value)}>
                                            {customerStatus.map((status, index) => (
                                                <option key={index} value={status}>{status}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </td>
                                <td className='text-center'>
                                    <Form.Check type="checkbox" onChange={() => handleCheckboxChange(order.orderID)} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <Row>
                    <Button type="button" className='w-auto'>Upload</Button>
                </Row>
            </MDBRow>

            {/* Modal */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Selected Products</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Item Name</th>
                                <th>Qty </th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {OrderNotAvailabledata.filter(order => checkedItems.includes(order.order_id)).map((item, index) => (
                                <tr key={index}>
                                    <td>{item.order_id}</td>
                                    <td>{item.product_name}</td>
                                    <td>{item.quantity}</td>
                                    <td>{orderStatusMap[item.order_id]}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    )
}

export default OrderNotAvailable;
