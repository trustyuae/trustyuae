import React, { useEffect, useState } from 'react';
import { MDBRow } from 'mdb-react-ui-kit';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import { Badge, Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Box, InputLabel, MenuItem, Select, Typography } from '@mui/material';
import DataTable from '../DataTable';
import { API_URL } from '../../redux/constants/Constants';
import { useDispatch } from 'react-redux';
import { AddGrn, GetProductManual } from '../../redux/actions/P3SystemActions';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

function OnHoldManegementSystem() {
    const dispatch = useDispatch()
    const navigate = useNavigate()
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
    const [isValid, setIsValid] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [imageURL, setImageURL] = useState("");


    const renderVariationValues = (params) => {
        console.log(params,'params');
        const { color, size } = params.row.variation_values;
        const { attribute_color, attribute_size } = params.row.variation_values;
        console.log(attribute_size,attribute_color,'---------------');
        const noVariation = params.row.variation_values.length === 0;
        const colorAvailable = color?.length > 0;
        const sizeAvailable = size?.length > 0;

        const singleColorAvailable = color

        return (
            <Box className='d-flex justify-content-around align-items-center'>
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

                        {attribute_color&&(
                            <Box className="fw-bold fs-5">Color:{attribute_color}</Box>
                        )}
                        {attribute_size&&(
                            <Box className="fw-bold fs-5">Size:{attribute_size}</Box>
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
            console.log(response, 'data');
            console.log(modifiedData, 'modifiedData');
            setSingleProductD([modifiedData[0]]);


        } catch (error) {
            console.error(error);
            // setSingleProductD([]);
        }
    }

    useEffect(() => {
        getAllProducts()
    }, [productNameF, productIDF, tableData])

    useEffect(() => {
        let info = JSON.parse(localStorage.getItem('user_data'))
        setuserName(info.first_name + ' ' + info.last_name)
    }, [])

    const handalADDProduct = () => {
        let data = [...tableData, ...singleProductD]
        let Updatedata = data.map((v, i) => ({ ...v, id: i ,variationColor:v.variation_values.attribute_color!==undefined?v.variation_values.attribute_color:'',variationSize:v.variation_values.attribute_size!==undefined?v.variation_values.attribute_size:''}));
        console.log(Updatedata,'Updatedata====');
        validateForm(Updatedata);
        setTableData(Updatedata)
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

    const validateForm = (data) => {
        let dataa = data.filter(o => (Object.keys(o.variation_values).length > 0))
        console.log(dataa,'dataa');
        const isValid = dataa.every(item => item.variationColor !== '');
        const isValidSize = dataa.every(item => item.variationSize !== '');
        const isQuantityAvailable = data.every(item => item.Quantity !== '')
        setIsValid(isValid && isValidSize && isQuantityAvailable);
    };


    const handleSubmit = async () => {
        const currentDate = new Date().toISOString().split('T')[0];
        console.log(tableData,'tableData');
        const convertedData = tableData.map(item => ({
            product_id: parseInt(item.product_id),
            product_name: item.product_name,
            product_image: item.product_image,
            variation_id: 1,
            variations: item.variationColor !== "" && item.variationSize !== "" ? { color: item.variationColor, size: item.variationSize } : [],
            qty_received: parseInt(item.Quantity),
            qty_remain: parseInt(item.Quantity),
            updated_date: currentDate,
        }));

        const payload = {
            "created_date": date,
            "verified_by": userName,
            "boxes_received": receivedBoxes,
            "attachment_bill_image": selectFile,
            "status": "Pending for process",
            products: convertedData
        };
        console.log(payload,'payload');
        try {
            dispatch(AddGrn(payload, navigate))
        } catch (error) {
            console.error(error);
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
                        <Button variant="primary" className='w-auto' disabled={(productNameF == '' && productIDF == '')} onClick={handalADDProduct}>
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
                        )}
                </Card>
            </MDBRow>

            <Modal
                show={showEditModal}
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
