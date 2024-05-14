import React, { useEffect, useState } from 'react';
import {
    MDBCol,
    MDBRow
}
    from 'mdb-react-ui-kit';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
// import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import { useParams } from 'react-router-dom';
import { API_URL } from '../../redux/constants/Constants';
import axios from 'axios';



const PoDetails = () => {
    const { id } = useParams();
    const [PO_OrderList, setPO_OrderList] = useState([])
    const [data, setData] = useState(null);
    const [paymentStatus,setPaymentStatus]=useState('')

    const fetchOrder = async () => {
        let apiUrl = `${API_URL}wp-json/custom-po-details/v1/po-order-details/${id}`
        const response = await axios.get(apiUrl);
        // console.log(response.data, 'response');
        setPO_OrderList(response.data)
        setData(response.data.line_items)
    }

    useEffect(() => {
        console.log('PO_OrderList:', PO_OrderList);
        fetchOrder()
    }, [])
    const tableHeaders = [
        "Product Name",
        "Image",
        "Qty Ordered",
        "Estimated Cost(RMB)",
        "Estimated Cost(AED)",
        "Availability Status"
    ];
    const PODetails = [{
        productName: "Product A",
        image: "product_a.jpg",
        qtyOrdered: 10,
        estimatedCostRMB: 100,
        estimatedCostAED: 50,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product B",
        image: "product_b.jpg",
        qtyOrdered: 5,
        estimatedCostRMB: 200,
        estimatedCostAED: 100,
        availabilityStatus: "Out of Stock"
    },
    {
        productName: "Product C",
        image: "product_c.jpg",
        qtyOrdered: 8,
        estimatedCostRMB: 150,
        estimatedCostAED: 75,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product D",
        image: "product_d.jpg",
        qtyOrdered: 3,
        estimatedCostRMB: 120,
        estimatedCostAED: 60,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product E",
        image: "product_e.jpg",
        qtyOrdered: 6,
        estimatedCostRMB: 180,
        estimatedCostAED: 90,
        availabilityStatus: "Out of Stock"
    },
    {
        productName: "Product F",
        image: "product_f.jpg",
        qtyOrdered: 12,
        estimatedCostRMB: 250,
        estimatedCostAED: 125,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product G",
        image: "product_g.jpg",
        qtyOrdered: 4,
        estimatedCostRMB: 90,
        estimatedCostAED: 45,
        availabilityStatus: "Out of Stock"
    }];
    let PONumber = '001';
    const totalQty = PODetails.reduce((acc, cur) => acc + cur.qtyOrdered, 0);
    const totalEstdCostRMB = PODetails.reduce((acc, cur) => acc + (cur.qtyOrdered * cur.estimatedCostRMB), 0);
    const totalEstdCostAED = PODetails.reduce((acc, cur) => acc + (cur.qtyOrdered * cur.estimatedCostAED), 0);
    const availabilityStatus = ['Confirmed', '1 week', '2 week', '3 weeks', '1 month', 'Out of Stock'];

    // const handleStatusChange = (index, event) => {
    //     const newAvailabilityStatus = [...PO_OrderList.availability_status];
    //     console.log(newAvailabilityStatus,'newAvailabilityStatus');
    //     // newAvailabilityStatus[index] = event.target.value; // Update the availability status for the corresponding product
    //     // setPO_OrderList(prevState => ({
    //     //     ...prevState,
    //     //     availability_status: newAvailabilityStatus
    //     // }));
    // };

    const handleStatusChange = (index, event) => {
        console.log(index, event);
        console.log(PO_OrderList.line_items[index].availability_status=event.target.value,'PO_OrderList');
        console.log(PO_OrderList,'PO_OrderList========');
        // PO_OrderList?.availability_status[index]
        // Check if PO_OrderList and availability_status are defined and is an array
        // if (PO_OrderList && Array.isArray(PO_OrderList.availability_status)) {
        //     const newAvailabilityStatus = [...PO_OrderList.availability_status];
        //     newAvailabilityStatus[index] = event.target.value;
        //     setPO_OrderList(prevState => ({
        //         ...prevState,
        //         availability_status: newAvailabilityStatus
        //     }));
        // } else {
        //     console.error("PO_OrderList or availability_status is not defined or not an array");
        // }
    };

    const handleUpdate = async() => {
        console.log(PO_OrderList,'PO_OrderList======');
        console.log(PO_OrderList.line_items.map(item => item.product_id),'PO_OrderList.line_items.map(item => item.product_id)');
        const updatedData = {
          availability_status: PO_OrderList.line_items.map(item => item.availability_status),
          product_ids: PO_OrderList.line_items.map(item => item.product_id),
          order_ids: PO_OrderList.line_items.map(item => item.order_id),
          payment_status: paymentStatus
        };

        let apiUrl=`${API_URL}wp-json/custom-available-status/v1/estimated-status/${id}`
        const response = await axios.post(apiUrl,updatedData
        //     {
        //   availability_status: PO_OrderList.line_items.map(item => item.availability_status),
        //   product_ids: PO_OrderList.line_items.map(item => item.product_id),
        //   order_ids: PO_OrderList.line_items.map(item => item.order_id),
        //   payment_status: paymentStatus
        // }
    );
        console.log(response,'response');
        console.log(updatedData,'updatedData');
    }

    const handlepayMentStatus=(e)=>{
        setPaymentStatus(e.target.value)
    }

    return (
        <Container fluid className='px-5' style={{ height: '100vh' }}>
            <h3 className='fw-bold text-center my-3'>PO Details</h3>
            <h6 className='fw-bold text-center'>XYZ Guangzhon</h6>
            <p className='text-center my-3'>PO Number: {PO_OrderList.po_id}</p>
            <div className="d-flex justify-content-start align-items-center my-3">
                <h6 className=''>Payment Status:</h6>
                <select className="form-select w-25 ms-3" name="" id="" onChange={(e)=>handlepayMentStatus(e)}>
                    <option value='Paid'>Paid</option>
                    <option value='Unpaid'>Unpaid</option>
                    <option value='Hold'>Hold</option>
                    <option value='Cancelled'>Cancelled</option>
                </select>
            </div>
            <MDBRow className='d-flex justify-content-center align-items-center'>
                <MDBCol col='10' md='12' sm='12'></MDBCol>
                <div style={{ overflow: 'auto', height: '350px' }}>
                    <Table striped bordered hover style={{ boxShadow: '4px 4px 11px 0rem rgb(0 0 0 / 25%)' }}>
                        <thead>
                            <tr className='table-headers'>
                                {tableHeaders.map((header, index) => (
                                    <th style={{ backgroundColor: '#DEE2E6', padding: '8px', textAlign: 'center' }} key={index}>{header}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {PO_OrderList?.line_items?.map((rowData, rowIndex) => (
                                <tr key={rowIndex}>
                                    <td className='text-center'>{rowData.product_name}</td>
                                    <td className='text-center'><img src={rowData.image} style={{ width: '100px', height: '100px' }} alt={rowData.product_name} /></td>
                                    <td className='text-center'>{rowData.quantity}</td>
                                    <td className='text-center'>--</td>
                                    <td className='text-center'>--</td>
                                    <td>
                                        <Form.Group>
                                            <Form.Select style={{ height: '32px', padding: '0 10px' }}
                                                onChange={(event) => handleStatusChange(rowIndex, event)}
                                                // value={ PO_OrderList?.availability_status[rowIndex] }
                                            >
                                                {availabilityStatus.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        {/* <Form.Group>
                                            <Form.Select
                                                style={{ height: '32px', padding: '0 10px' }}
                                                // onChange={(event) => handleStatusChange(rowIndex, event)} // Pass the index of the product and the event object
                                                value={PO_OrderList.availability_status[rowIndex]} // Set the value of the select dropdown to the current availability status
                                            >
                                                {availabilityStatus.map(status => (
                                                    <option key={status} value={status}>{status}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group> */}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                {/* <td colSpan={1}></td> */}
                                <td colspan="2" className=' text-end'><strong>Total:</strong></td>
                                <td className='text-center'>{totalQty}</td>
                                <td className='text-center'>{totalEstdCostRMB}</td>
                                <td colspan="2">{totalEstdCostAED}</td>
                            </tr>
                        </tfoot>
                    </Table>
                </div>
                <Row>
                    <Button type="button" className='w-auto' onClick={handleUpdate}>Update</Button>
                </Row>
            </MDBRow>
        </Container>
    )
}
export default PoDetails;