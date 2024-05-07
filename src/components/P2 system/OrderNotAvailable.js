import React, { useState } from 'react';
import { MDBCol, MDBRow } from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';

function OrderNotAvailable() {
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

    const OrderNotA = [
        {
            orderID: 1,
            itemName: 'demo',
            image: "product_a.jpg",
            qtyOrdered: 10,
            contactNo: 111111111,
            estimatedProductionTime: '1 week',
            customerStatus: "Not Confirmed"
        },
        {
            orderID: 2,
            itemName: 'demo',
            image: "product_a.jpg",
            qtyOrdered: 10,
            contactNo: 1222222221,
            estimatedProductionTime: '2 week',
            customerStatus: "Not Confirmed"
        },
        // Add more product details as needed
    ];

    const [checkedItems, setCheckedItems] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState("");
    const [selectProduct, setDetails] = useState(OrderNotA); // PODetailsInitial is the initial array of details
    const [selectedDetails, setselectedDetails] = useState([]); // PODetailsInitial is the initial array of details

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

    const handleStatusChange = (orderID, status) => {
        const updatedPODetails = OrderNotA.map(item => {
            if (item.orderID === orderID) {
                return { ...item, customerStatus: status }; // Update the customer status for the specific item
            }
            return item;
        });
        setDetails(updatedPODetails); // Update the state with the updated details
        setselectedDetails(updatedPODetails)
        setSelectedStatus(status);
    }

    // const selectedDetails = selectProduct

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
                        {OrderNotA.map((rowData, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className='text-center'>{rowData.orderID}</td>
                                <td className='text-center'>{rowData.itemName}</td>
                                <td className='text-center'><img src={rowData.image} alt={rowData.itemName} /></td>
                                <td className='text-center'>{rowData.qtyOrdered}</td>
                                <td className='text-center'>{rowData.contactNo}</td>
                                <td className='text-center'>{rowData.estimatedProductionTime}</td>
                                <td className='text-center'>
                                    <Form.Group>
                                        <Form.Select style={{ height: '32px', padding: '0 10px' }}  onChange={(e) => handleStatusChange(rowData.orderID, e.target.value)}>
                                            {customerStatus.map((status, index) => (
                                                <option key={index} value={status}>{status}</option>
                                            ))}
                                        </Form.Select>
                                    </Form.Group>
                                </td>
                                <td className='text-center'>
                                    <Form.Check type="checkbox" onChange={() => handleCheckboxChange(rowData.orderID)} />
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
                            {selectedDetails.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.orderID}</td>
                                    <td>{item.itemName}</td>
                                    <td>{item.qtyOrdered}</td>
                                    <td>{item.customerStatus}</td>
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