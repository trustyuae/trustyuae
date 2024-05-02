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

function OrderDetails() {
    const { id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const apiUrl = `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/wc/v3/orders/${id}`;
    const username = "ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a";
    const password = "cs_8dcdba11377e29282bd2b898d4a517cddd6726fe";
    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const response = await axios.get(apiUrl,
                    {
                        auth: {
                            username: username,
                            password: password,
                        },
                    }
                );
                console.log([response.data], 'response');
                setOrderData([response.data]);
            } catch (error) {
                console.error('Error fetching order data:', error);
            }
        };

        fetchOrder();
    }, [apiUrl]);
    return (
        <Container
            fluid
            className="px-5"
            style={{ backgroundColor: "#F6F1EB", height: "98vh" }}
        >
            <h3 className="fw-bold text-center py-3 ">Order ID -{id}</h3>
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
            <MDBRow>
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
                                Address
                            </th>
                            <th
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                                City
                            </th>
                            <th
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                                Country
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        {/* <tr>
                            <td className="text-center">123 Main st</td>
                            <td className="text-center">CityVille</td>
                            <td className="text-center">Countryland</td>
                        </tr> */}
                        {
                            orderData?.map((order, index) => (
                                <tr key={index}>
                                    <td className="text-center">{order.billing?.address_1}</td>
                                    <td className="text-center">{order.billing?.city}</td>
                                    <td className="text-center">{order.billing?.country}</td>
                                </tr>
                            ))
                        }
                    </tbody>

                </Table>
            </MDBRow>
            <MDBRow>
                <MDBCol md="4">
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
                                Name
                            </th>
                            <th
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                                Variant Details
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
                            <th
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                                Qty
                            </th>

                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="text-center">Product A</td>
                            <td className="text-center">Color:Blue,Size:Large</td>
                            <td className="text-center">
                                <img
                                    src=''
                                    alt='product A'
                                    style={{ maxWidth: "100px" }}
                                />
                            </td>
                            <td className="text-center">2</td>
                        </tr>
                        <tr>
                            <td className="text-center">Product A</td>
                            <td className="text-center">Color:Blue,Size:Large</td>
                            <td className="text-center">
                                <img
                                    src=''
                                    alt='product A'
                                    style={{ maxWidth: "100px" }}
                                />
                            </td>
                            <td className="text-center">2</td>
                        </tr>
                        <tr>
                            <td className="text-center">Product A</td>
                            <td className="text-center">Color:Blue,Size:Large</td>
                            <td className="text-center">
                                <img
                                    src=''
                                    alt='product A'
                                    style={{ maxWidth: "100px" }}
                                />
                            </td>
                            <td className="text-center">2</td>
                        </tr>
                        {
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
                        }
                    </tbody>

                </Table>
            </MDBRow>
            <MDBRow>
                <MDBCol md="12" className="d-flex justify-content-end">
                    <Button variant="primary" className="  me-3">
                        Attach
                    </Button>
                    <Button variant="danger" >
                        Finish
                    </Button>
                </MDBCol>
            </MDBRow>

        </Container>
    )
}



export default OrderDetails
