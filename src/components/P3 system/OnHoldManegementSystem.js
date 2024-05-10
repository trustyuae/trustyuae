import React from 'react';
import {
    MDBCol,
    MDBRow
}
    from 'mdb-react-ui-kit';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import { Button } from 'react-bootstrap';


function OnHoldManegementSystem() {
    const tableHeaders = [
        "Name",
        "Image",
        "Qty Ordered",
    ];
    const ProductDetails = [{
        name: "Product A",
        image: "product_a.jpg",
        qtyOrdered: 10
    },
    {
        name: "Product B",
        image: "product_b.jpg",
        qtyOrdered: 5
    },
    {
        name: "Product C",
        image: "product_c.jpg",
        qtyOrdered: 8
    },
    {
        name: "Product D",
        image: "product_d.jpg",
        qtyOrdered: 3
    },
    {
        name: "Product E",
        image: "product_e.jpg",
        qtyOrdered: 6
    },
    {
        name: "Product F",
        image: "product_f.jpg",
        qtyOrdered: 12
    },
    {
        name: "Product G",
        image: "product_g.jpg",
        qtyOrdered: 4
    }];
    const totalQty = ProductDetails.reduce((acc, cur) => acc + cur.qtyOrdered, 0);
    const availabilityStatus = ['Confirmed', '1 week', '2 week', '3 weeks', '1 month', 'Out of Stock'];
    return (
        <Container fluid className='px-5' style={{ height: '98vh' }}>
            <h3 className='fw-bold text-center py-3'>On-hold Management System</h3>
            <div className="col-lg-12 col-md-12 col-sm-12 mb-3">
                <div className='row'>
                    <div className="col-lg-3">
                        <h6 className=''>Date:</h6>
                        <input type="date" className='form-control' name="date" id="date" />
                    </div>
                    <div className="col-lg-3">
                        <h6 className=''>Verified By:</h6>
                        <select className="form-select" name="" id="">
                            <option selected disabled>Select Operator</option>
                            <option value=''>Test1</option>
                            <option value=''>Test2</option>
                            <option value=''>Test3</option>
                            <option value=''>Test4</option>
                        </select>
                    </div>
                    <div className="col-lg-3">
                        <h6 className=''>Boxes Received:</h6>
                        <input type="number" className='form-control' name="boxes" id="boxes" />
                    </div>
                    <div className="col-lg-3">
                        <h6 className=''>Attach the Delivery Bill:</h6>
                        <input type="file" className="form-control" name="bill" id="bill" placeholder="" />
                    </div>
                </div>
            </div>
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
                        {ProductDetails.map((rowData, rowIndex) => (
                            <tr key={rowIndex}>
                                <td className='text-center'>{rowData.name}</td>
                                <td className='text-center'><img src={rowData.image} alt={rowData.name} /></td>
                                <td className='text-center'>
                                    <Form.Control
                                        type="number"
                                        value={rowData.qtyOrdered}
                                    />
                                </td>
                                {/* <td>
                            <Form.Group>
                                <Form.Select  style={{height:'32px',padding:'0 10px'}}>
                                    {availabilityStatus.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                            </td> */}
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            {/* <td colSpan={1}></td> */}
                            <td colspan="2" className=' text-end'><strong>Total:</strong></td>
                            <td className='text-center'>{totalQty}</td>
                        </tr>
                    </tfoot>
                </Table>
            </MDBRow>
            <MDBRow className=' justify-content-start'>
            <Button variant="primary" style={{width:'100px'}}>
            submit
          </Button>      
            </MDBRow>
        </Container>
    )
}

export default OnHoldManegementSystem
