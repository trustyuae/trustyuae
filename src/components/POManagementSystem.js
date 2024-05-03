import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Table from 'react-bootstrap/Table';
import Pagination from 'react-bootstrap/Pagination';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { FaEye } from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const tableHeaders = [
    "PO Number",
    "Date created",
    "Total Quantity",
    "Estimated Cost(RMB)",
    "Estimated Cost(AED)",
    "Status",
    "Payment Status",
    "Factory",
    "Action"
];

const orders = [
    {
        PONumber: 'PO001',
        DateCreated: '2024-4-24',
        TotalQuantity: '100',
        RMB: '500',
        AED: '150',
        status: 'Open',
        P_status: 'Paid',
        Factory: 'factory A'
    },
    {
        PONumber: 'PO002',
        DateCreated: '2024-4-25',
        TotalQuantity: '200',
        RMB: '1000',
        AED: '300',
        status: 'Checking with factory',
        P_status: 'Not Paid',
        Factory: 'factory B'
    },
    {
        PONumber: 'PO003',
        DateCreated: '2024-4-26',
        TotalQuantity: '150',
        RMB: '750',
        AED: '200',
        status: 'Closed',
        P_status: 'Not Paid',
        Factory: 'factory C'
    }
]
function POManagementSystem() {
    const POStatusFilter = ['Open', 'Checking with factory', 'Closed'];
    const factoryFilter = ['Factory A', 'Factory B', 'Factory c'];
    return (
        <Container fluid className='p-5' style={{ height:'98vh',maxHeight: "100%", minHeight: "100vh" }}>
            <div className="mb-9">
                <div className="row g-3 mb-4 justify-content-center ">
                    <div className="col-auto">
                        <h2 className="mb-0">PO Management system</h2>
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
                                <Form.Label>PO Status Filter:</Form.Label>
                                <Form.Select >
                                    {POStatusFilter.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="2">
                            <Form.Group>
                                <Form.Label>Factory Filter:</Form.Label>
                                <Form.Select >
                                    {factoryFilter.map(status => (
                                        <option key={status} value={status}>{status}</option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Row>
            <Row className='mb-4 mt-4 '>
                <Table responsive striped bordered hover style={{boxShadow: '4px 4px 11px 0rem rgb(0 0 0 / 25%)'}}>
                    <thead>
                    <tr className='table-headers'>
                            {tableHeaders.map((header, index) => (
                                <th style={{ backgroundColor: '#dee2e6', padding: '8px', textAlign:'center'}} key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map(order => (
                            <tr key={order.id}>
                                <td className='text-center'>
                                    {order.PONumber}
                                </td>
                                <td className='text-center'>{order.DateCreated}</td>
                                <td className='text-center'>
                                    {order.TotalQuantity}
                                </td>
                                <td className='text-center'>{order.RMB}</td>
                                <td className='text-center'>{order.AED}</td>
                                <td className={`text-center text-${order.status === 'Open' ? 'primary' : order.status === 'Checking with factory' ? 'success' :order.status === 'Closed' ? 'info' : ''}`} >{order.status}</td>
                                <td className={`text-center text-${order.P_status==='Paid'?'success':order.P_status==='Not Paid'?'danger':''}`}>{order.P_status}</td>
                                <td className='text-center'>{order.Factory}</td>
                                <td className='text-center d-flex  align-items-center  justify-content-around '>
                                    <Button className='m-2 d-flex align-items-center justify-content-center' style={{padding:'5px 5px', fontSize:'16px'}}>
                                        <FaEye />
                                    </Button>
                                    <Button className='btn btn-success m-2 d-flex align-items-center justify-content-center' style={{padding:'5px 5px', fontSize:'16px'}}>
                                        <MdEdit />
                                    </Button>
                                    <Button className='btn btn-danger m-2 d-flex align-items-center justify-content-center' style={{padding:'5px 5px', fontSize:'16px'}}>
                                        <MdDelete />
                                    </Button>
                                </td>

                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Row>
        </Container>
    )
}

export default POManagementSystem
