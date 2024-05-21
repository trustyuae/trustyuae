import React, { useEffect, useState } from 'react';
import { MDBRow } from 'mdb-react-ui-kit';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import { Badge, Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Box, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import DataTable from '../DataTable';
import { API_URL } from '../../redux/constants/Constants';
import { useDispatch } from 'react-redux';
import { GetProductManual } from '../../redux/actions/P3SystemActions';
import axios from 'axios';
import Swal from 'sweetalert2';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';


function OnHoldManegementSystem() {
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    const [receivedBoxes, setReceivedBoxes] = useState(0);
    const [productNameF, setProductName] = useState('')
    const [productIDF, setProductID] = useState('')
    const [singleProductD, setSingleProductD] = useState([])
    const [tableData, setTableData] = useState([])
    const [date, setDate] = useState(getTodayDate())
    const [selectFile, setFile] = useState(null);
    const [userName, setuserName] = useState('')
    const dispatch = useDispatch();
    const [isValid, setIsValid] = useState(false);
    const navigate = useNavigate();
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageURL, setImageURL] = useState("");


    const renderVariationValues = (params) => {
        const { color, size } = params.row.variation_values;
        const noVariation = params.row.variation_values.length === 0;
        const colorAvailable = color?.length > 0;
        const sizeAvailable = size?.length > 0;

        return (
            <Box className='d-flex justify-content-between align-items-center'>
                {noVariation ? (
                    <Box>No any variation</Box>
                ) : (
                    <>
                        {colorAvailable && (
                            <Box className='w-100 me-3 d-flex flex-column'>
                                <InputLabel id={`customer-color-${params.row.id}-label`}>Color</InputLabel>
                                <Select
                                    labelId={`customer-color-${params.row.id}-label`}
                                    id={`customer-color-${params.row.id}`}
                                    onChange={(event) => handleColorChange(event, params.row)}
                                    fullWidth
                                    style={{ height: "40%", width: "100%" }}
                                >
                                    {color?.map((status) => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        )}

                        {sizeAvailable && (
                            <Box className='w-100 d-flex flex-column'>
                                <InputLabel id={`customer-size-${params.row.id}-label`}>Size</InputLabel>
                                <Select
                                    labelId={`customer-size-${params.row.id}-label`}
                                    id={`customer-size-${params.row.id}`}
                                    onChange={(event) => handleSizeChange(event, params.row)}
                                    fullWidth
                                    style={{ height: "40%", width: "100%" }}
                                >
                                    {size.map((status) => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        )}
                    </>
                )}
            </Box>
        );
    };

    const columns = [
        { field: "product_name", headerName: "product name", flex: 1 },
        {
            field: "product_image", headerName: "product image", flex: 1,
            type: "html",
            renderCell: (value, row) =>
                <img
                    src={value.row.product_image || `${require("../../assets/default.png")}`}
                    alt={value.row.product_name}
                    onClick={() => ImageModule(value.row.product_image)}
                    className="img-fluid"
                    width={100}
                />
        },
        {
            field: "Quantity", headerName: "Quantity", flex: 1,
            renderCell: (params) =>
                <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
                    <Form.Control style={{ justifyContent: "center" }} type="number" value={params.row.Quantity} placeholder="0" onChange={(e) => handleQtyChange(e, params.row)} />
                </Form.Group>
        },
        { field: "variation_values", headerName: "Variation Values", flex: 3, renderCell: renderVariationValues },

        {
            field: '', headerName: "Action", flex: 1,
            type: "html",
            renderCell: (params) =>
                <Button type="button" className="w-auto w-auto bg-transparent border-0 text-secondary fs-5" onClick={() => handleDelete(params.row.id)}>
                    <MdDelete className="mb-1" />
                </Button>

        }
    ];

    const handleFieldChange = (id, field, value) => {
        const updatedData = tableData.map(item => {
            if (item.id === value.id) {
                return { ...item, [field]: id };
            }
            return item;
        });
        setTableData(updatedData);
        validateForm(updatedData);

    };

    const handleColorChange = (id, event) => {
        handleFieldChange(id.target.value, 'variationColor', event);
    };

    const handleSizeChange = (id, event) => {
        handleFieldChange(id.target.value, 'variationSize', event);
    };

    const handleQtyChange = (id, event) => {

        handleFieldChange(id.target.value, 'Quantity', event);
    };

    const handleDelete = (id) => {
        const updatedData = tableData.filter(item => item.id !== id);
        setTableData(updatedData);
    };

    const getAllProducts = async () => {
        let apiUrl = `${API_URL}wp-json/custom-manual-po/v1/get-product-manual/?`;

        if (productNameF) {
            apiUrl += `product_name=${productNameF}`;
        } else if (productIDF) {
            apiUrl += `product_id=${productIDF}`;
        }

        try {
            const response = await dispatch(GetProductManual({ apiUrl }));
            const data = response.data.products.map((v, i) => ({ ...v, id: i }));
            const modifiedData = data.map(item => ({
                ...item,
                variationColor: item.variation_values.length === 0 ? '' : '',
                variationSize: item.variation_values.length === 0 ? '' : ''
            }));

            setSingleProductD([modifiedData[0]]);
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [productNameF, productIDF])

    useEffect(() => {
        let info = JSON.parse(localStorage.getItem('user_data'))
        setuserName(info.first_name + ' ' + info.last_name)
    }, [])

    const handalADDProduct = () => {
        let data = [...tableData, ...singleProductD]
        let Updatedata = data.map((v, i) => ({ ...v, id: i }));
        setTableData(Updatedata)
        validateForm(Updatedata);

        setProductName('')
        setProductID('')
    }

    const handalonChangeProductId = (e) => {
        setProductName('')
        setProductID(e)
    }
    const handalonChangeProductName = (e) => {
        setProductID('')
        setProductName(e)
    }
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSwalError = (title, text) => {
        Swal.fire({
            icon: 'error',
            title,
            text
        });
    };

    const validateForm = (data) => {
        const isValid = data.every(item => item.Quantity);
        const isValidSize = data.every(item => item.variationSize);
        setIsValid(isValid);
    };


    const handleSubmit = async () => {
        // console.log(tableData,'tableData');
        // console.log(tableData.find(d=>d.variation_values.length!==0));
        const currentDate = new Date().toISOString().split('T')[0];
        const convertedData = tableData.map(item => ({
            product_id: parseInt(item.product_id),
            product_name: item.product_name,
            product_image: item.product_image,
            variation_id: 1,
            variations: item.variationColor !== "" && item.variationSize !== "" ? { color: item.variationColor, size: item.variationSize } : [],
            qty_received: parseInt(item.Quantity),
            qty_remain: parseInt(item.Quantity),
            updated_date: currentDate,
            // allocated_order: [789, 790]
        }));

        const formData = new FormData();
        formData.append("created_date", date);
        formData.append("verified_by", userName);
        formData.append("boxes_received", receivedBoxes);
        formData.append("attachment_bill_image", selectFile);
        formData.append("status", "Pending for process");
        formData.append("products", JSON.stringify(convertedData));

        const payload = {
            "created_date": date,
            "verified_by": userName,
            "boxes_received": receivedBoxes,
            "attachment_bill_image": selectFile,
            "status": "Pending for process",
            products: convertedData
        };

        console.log(convertedData, 'convertedData');
        console.log(payload, 'payload');



        try {
            let url = `${API_URL}wp-json/custom-api/v1/add-grn`
            const response = await axios.post(url, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // const response = await axios.post(url, formData);

            console.log(response, 'response');
            if (response) {
                Swal.fire({
                    icon: "success",
                    title: response.data,
                    showConfirmButton: true,
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate("/GRN_Management");
                    }
                });
            }

        } catch (error) {
            console.log(error);
        }
    }

    const ImageModule = (url) => {
        setImageURL(url);
        setShowEditModal(true);
      };

    return (
        <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
            <Box className="mb-4">
                <Typography variant="h4" className="fw-semibold">
                    On-hold Management System
                </Typography>
            </Box>
            <Form inline className='mb-4'>
                <Row className="align-items-center px-1">
                    <Col xs="auto" lg="3">

                        <Form.Group controlId="duedate">
                            <Form.Label>Date filter:</Form.Label>
                            <Form.Control type="date" name="duedate" placeholder="Due date" value={date} onChange={(e) => setDate(e.target.value)} />
                        </Form.Group>
                    </Col>
                    <Col xs="auto" lg="3">
                        <Form.Group>
                            <Form.Label className="fw-semibold">Verified By:</Form.Label>

                            <Form.Control
                                type="text"
                                placeholder="Enter No of received boxes"
                                value={userName}
                                // onChange={(e) => setReceivedBoxes(e.target.value)}
                                readOnly
                                disabled
                                className="mr-sm-2 py-2"
                            />
                        </Form.Group>
                    </Col>
                    <Col xs="auto" lg="3">
                        <Form.Group>
                            <Form.Label className="fw-semibold">Boxes Received:</Form.Label>
                            <Form.Control
                                type="number"
                                placeholder="Enter No of received boxes"
                                value={receivedBoxes}
                                onChange={(e) => setReceivedBoxes(e.target.value)}
                                className="mr-sm-2 py-2"
                            />
                        </Form.Group>
                    </Col>
                    <Col xs="auto" lg="3">
                        <Form.Group>
                            <Form.Label className="fw-semibold">Attach the Delivery Bill:</Form.Label>
                            <Form.Control
                                type="file"
                                className="mr-sm-2 py-2"
                                onChange={handleFileChange}
                            />
                        </Form.Group>
                    </Col>
                </Row>
            </Form>
            <MDBRow className='px-3'>
                <Card className='py-3'>
                    <Row className=' justify-content-start'>

                        <Col xs="auto" lg="4">
                            <Form.Group className="fw-semibold mb-0">
                                <Form.Label>Product Name:</Form.Label>
                                <Form.Control type="text" placeholder="Enter Product" value={productNameF} onChange={(e) => handalonChangeProductName(e.target.value)} />
                            </Form.Group>
                        </Col>


                        <Col xs="auto" lg="4">
                            <Form.Group className="fw-semibold mb-0">
                                <Form.Label>Product ID:</Form.Label>
                                <Form.Control type="text" placeholder="Enter Product ID" value={productIDF} onChange={(e) => handalonChangeProductId(e.target.value)} />
                            </Form.Group>
                        </Col>

                    </Row>
                    <MDBRow className="px-3 mt-3">
                        <Card className="p-3 mb-3">
                            <Typography variant="h6" className="fw-bold mb-3">
                                Product Details
                            </Typography>
                            <Box>
                                {
                                    (productNameF != '' || productIDF != '') && singleProductD?.map((d) => (
                                        <Row className="justify-content-center">
                                            <Col md="6">
                                                <Box className="d-flex justify-content-center align-items-center h-100">
                                                    <Box>
                                                        <Typography variant="h5" className="fw-bold">{d.product_name}</Typography>
                                                        <Typography
                                                            className=""
                                                            sx={{
                                                                fontSize: 14,
                                                            }}
                                                        >
                                                            <Badge bg="success">{d.product_id}</Badge>
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </Col>
                                            <Col md="6">
                                                <Box className="w-100" sx={{ height: '200px' }}>
                                                    {/* <img className="w-100 h-100" style={{ objectFit: 'cover' }} src={require('../../assets/default.png')} /> */}
                                                    <img className="" style={{ objectFit: 'cover', height: '150px' }} src={d.product_image || `${require("../../assets/default.png")}`} alt={d.product_image} />
                                                </Box>
                                            </Col>
                                        </Row>
                                    ))
                                }

                            </Box>
                        </Card>
                    </MDBRow>
                    <MDBRow className='justify-content-end px-3'>
                        <Button variant="primary" style={{ width: '100px' }} disabled={(productNameF == '' && productIDF == '')} onClick={handalADDProduct}>
                            Add Product
                        </Button>
                    </MDBRow>
                    {
                        tableData.length > 0 && (
                            <>
                                <div className="mt-2">
                                    <DataTable
                                        columns={columns}
                                        rows={tableData}
                                        rowHeight={100}
                                    // page={page}
                                    // pageSize={pageSize}
                                    // totalPages={totalPages}
                                    // handleChange={handleChange}
                                    />
                                </div>
                                <MDBRow className='justify-content-end px-3'>
                                    <Button variant="primary" disabled={!isValid} style={{ width: '100px' }} onClick={handleSubmit}>
                                        submit
                                    </Button>
                                </MDBRow>
                            </>
                        )
                    }

                </Card>
            </MDBRow>

            <Modal
                show={showEditModal}
                // onHide={handleCloseEditModal}
                onHide={() => setShowEditModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title>Product Image</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Card className="factory-card">
                        <img src={imageURL || `${require("../../assets/default.png")}`} alt="Product" />
                    </Card>
                </Modal.Body>
            </Modal>

        </Container >
    )
}

export default OnHoldManegementSystem
