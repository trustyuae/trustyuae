import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { useNavigate, useParams } from 'react-router-dom';
import { Card } from "react-bootstrap";
import ReactImageMagnify from 'react-image-magnify';
import zIndex from "@mui/material/styles/zIndex";
// var product = 'https://images.unsplash.com/photo-1526887520775-4b14b8aed897?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=634&q=80'
var product = 'https://images.rawpixel.com/image_800/cHJpdmF0ZS9sci9pbWFnZXMvd2Vic2l0ZS8yMDIyLTExL3JtMzYyLTAxYS1tb2NrdXAuanBn.jpg'


function OrderDetails() {
    const navigate = useNavigate();
    const imageProps = {
        smallImage: {
            alt: 'Phasellus laoreet',
            isFluidWidth: true,
            src: product,
            sizes: '(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px'
        },
        largeImage: {
            src: product,
            width: 1200,
            height: 1800,
        },
        enlargedImageContainerDimensions: {
            width: '500%',
            height: '500%',
        },
        enlargedImageContainerStyle: {
            position: 'absolute',
            top: `${window.innerHeight}px`, // Set the top position based on window height
            left: `${window.innerWidth}px`, // Set the left position based on window width
            transform: 'translate(-170%, -200%)', // Adjust positioning to center the image
        }
    };

    const { id } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [imageURL, setImageURL] = useState('')

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

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const ImageModule = (url) => {
        console.log(url, 'url');
        setImageURL(url)
        setShowEditModal(true);
    }
    return (
        <Container
            fluid
            className="px-5"
            style={{ height: "98vh" }}
        >
            <h3 className="fw-bold text-center py-3 ">Order ID -{id}</h3>

            <MDBRow>
                <MDBCol md="6" className="d-flex justify-content-start">
                    <Button variant="primary" className="me-3" onClick={() => navigate(-1)}>
                        back
                    </Button>
                </MDBCol>
                <MDBCol md="6" className="d-flex justify-content-end">
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
                                Image
                            </th>
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
                                Qty
                            </th>
                            <th
                                style={{
                                    backgroundColor: "#DEE2E6",
                                    padding: "8px",
                                    textAlign: "center",
                                }}
                            >
                                Dispatch type
                            </th>


                        </tr>
                    </thead>
                    <tbody>
                        {
                            orderData?.map((order, index) => (
                                order.line_items?.map((item, subIndex) => {
                                    const sizeObject = item.meta_data.find(meta => meta.key === 'pa_size');
                                    const size = sizeObject ? sizeObject.value : 'N/A';
                                    const colorObject = item.meta_data.find(meta => meta.key === 'pa_color');
                                    const color = colorObject ? colorObject.value : 'N/A';
                                    const reducedStockObject = item.meta_data.find(meta => meta.key === '_reduced_stock');
                                    const reducedStock = reducedStockObject ? reducedStockObject.value : 'N/A';
                                    const productId = item.product_id;
                                    console.log(productId, 'productId');

                                    const imageProps = {
                                        smallImage: {
                                            alt: item.name,
                                            isFluidWidth: true,
                                            src: item.image.src,
                                            sizes: '(max-width: 480px) 100vw, (max-width: 1200px) 30vw, 360px'
                                        },
                                        largeImage: {
                                            src: item.image.src,
                                            width: 1200,
                                            height: 1800,
                                        },
                                        enlargedImageContainerDimensions: {
                                            width: '500%',
                                            height: '400%',
                                        },
                                        enlargedImageContainerStyle: {
                                            position: 'absolute',
                                            top: `${window.innerHeight}px`, // Set the top position based on window height
                                            left: `${window.innerWidth}px`, // Set the left position based on window width
                                            transform: 'translate(-170%, -180%)', // Adjust positioning to center the image
                                            zIndex:100
                                        }
                                    };

                                    return (
                                        <tr key={`${index}-${subIndex}`}>
                                            <td className="text-center">
                                                <div style={{ width: '200px' }}>
                                                    <ReactImageMagnify {...imageProps} />
                                                </div>
                                            </td>
                                            <td className="text-center">{item.name}</td>
                                            <td className="text-center">Size: {size}, Color: {color}</td>
                                            <td className="text-center">{item.quantity}</td>
                                            <td className="text-center"></td>
                                        </tr>
                                    );
                                })
                            ))
                        }

                    </tbody>

                </Table>
            </MDBRow>
            <MDBRow>
                <MDBCol md="12" className="d-flex ">
                    {/* <label>Customer Note:-</label>
                    <p>Customer Note</p> */}
                    <div className="alert alert-primary z-0" role="alert" >
                    <label>Customer Note:-</label>
                        "There is a customer note!"
                    </div>
                </MDBCol>
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
