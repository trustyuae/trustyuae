import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { useParams } from 'react-router-dom';
function OnHoldManagement() {
    return (
        <Container
            fluid
            className="px-5"
            style={{height: "98vh" }}
        >
            <h3 className="fw-bold text-center py-3 ">On Hold Management</h3>
            {/* <MDBRow className="d-flex justify-content-start align-items-center mb-3">
                <MDBCol md="2">
                    <Form.Label className="me-2">Product ID:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Search by Product ID"
                        value={searchId}
                        onChange={(e) => setSearchId(e.target.value)}
                    />
                </MDBCol>
                <MDBCol md="2">
                    <Form.Label className="me-2">Product Name:</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Search by Product Name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                    />
                </MDBCol>
                <MDBCol md="1">
                    <Form.Label className="me-2">Page Size:</Form.Label>
                    <Form.Control
                        as="select"
                        value={itemsPerPage}
                        onChange={handlePageSizeChange}
                    >
                        <option value={5}>5</option>
                        <option value={10}>10</option>
                        <option value={20}>20</option>
                    </Form.Control>
                </MDBCol>
            </MDBRow> */}
            {/* <MDBRow>
                <MDBCol md="12" className="d-flex justify-content-end">
                    <Button variant="primary" className="me-3">
                        Print
                    </Button>
                    <Button variant="success" >
                        Start
                    </Button>
                </MDBCol>
            </MDBRow>
            <MDBRow>
                <MDBCol md="12" className="d-flex justify-content-start">
                    <h3 className="fw-bold text-center py-3 ">
                        Shipping Address
                    </h3>
                </MDBCol>
            </MDBRow> */}

            <MDBRow className="d-flex justify-content-center align-items-center">
                <MDBCol col="10" md="12" sm="12"></MDBCol>
                <Table
                    striped
                    bordered
                    hover
                    style={{ boxShadow: "4px 4px 11px 0rem rgb(0 0 0 / 25%)" }}
                >
                    <thead>
                        <tr className="table-headers">
                            <th
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                                Product Name
                            </th>
                            <th
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                               Image
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center">Chanel Double Flap</td>
                            <td className="text-center">
                                <img src="/" style={{ maxWidth: "100px" }}/>
                            </td>
                        </tr>
                        {/* {
                            orderData?.map((order, index) => (
                                <tr key={index}>
                                    <td className="text-center">{order.billing?.address_1}</td>
                                    <td className="text-center">{order.billing?.city}</td>
                                    <td className="text-center">{order.billing?.country}</td>
                                </tr>
                            ))
                        } */}
                    </tbody>

                </Table>
            </MDBRow>
            <MDBRow>
                <MDBCol md="12">
                    <h3 className="fw-bold text-center py-3 ">
                        Order Details
                    </h3>
                </MDBCol>
            </MDBRow>

            <MDBRow className="d-flex justify-content-center align-items-center">
                <MDBCol col="10" md="12" sm="12"></MDBCol>
                <Table
                    striped
                    bordered
                    hover
                    style={{ boxShadow: "4px 4px 11px 0rem rgb(0 0 0 / 25%)" }}
                >
                    <thead>
                        <tr className="table-headers">
                            <th
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                               Order ID
                            </th>
                            <th
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                                Shipping Country
                            </th>
                            <th
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                                Item Received
                            </th>
                            <th
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                    display:'flex',
                                    justifyContent:'center'
                                }}
                            >
                              <Form.Check
                                    type="checkbox"
                                   className="me-2"
                                />  
                                Select All
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center">86700</td>
                            <td className="text-center">Saudia Arabia</td>
                            <td className="text-center">
                                1/1
                            </td>
                            <td className="text-center">
                                <Form.Check
                                    type="checkbox"
                                   className="me-2"
                                />
                                 </td>
                        </tr>
                        <tr>
                            <td className="text-center">88802</td>
                            <td className="text-center">Kuwait</td>
                            <td className="text-center">
                               1/1
                            </td>
                            <td className="text-center">
                            <Form.Check
                                    type="checkbox"
                                   className="me-2"
                                />
                            </td>
                        </tr>
                        <tr>
                            <td className="text-center">89065</td>
                            <td className="text-center">UAE</td>
                            <td className="text-center">
                                1/2
                            </td>
                            <td className="text-center">
                            <Form.Check
                                    type="checkbox"
                                   className="me-2"
                                />
                            </td>
                        </tr>
                        {/* {
                            orderData?.map((order, index) => (
                                order.line_items?.map((item, subIndex) => {
                                    const sizeObject = item.meta_data.find(meta => meta.key === 'pa_size');
                                    const size = sizeObject ? sizeObject.value : 'N/A';
                                    const reducedStockObject = item.meta_data.find(meta => meta.key === '_reduced_stock');
                                    const reducedStock = reducedStockObject ? reducedStockObject.value : 'N/A';
                                    return (
                                        <tr key={`${index}-${subIndex}`}>
                                            <td className="text-center">{item.name}</td>
                                            <td className="text-center">Size:{size} , Reduced Stock:{reducedStock} </td>
                                            <td className="text-center">
                                                <img
                                                    src={item.image.src}
                                                    alt={item.name}
                                                    style={{ maxWidth: "100px" }}
                                                />
                                            </td>
                                            <td className="text-center">{item.quantity}</td>
                                        </tr>
                                    );
                                })
                            ))
                        } */}
                    </tbody>

                </Table>
            </MDBRow>
            <MDBRow>
                <MDBCol md="12" className="d-flex justify-content-center">
                    <Button variant="success" className="  me-3">
                    Send for Preparation
                    </Button>
                    
                </MDBCol>
            </MDBRow>

        </Container>
    )
}

export default OnHoldManagement
