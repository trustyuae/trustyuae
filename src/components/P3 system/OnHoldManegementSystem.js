import React, { useEffect, useRef, useState } from 'react';
import { MDBRow } from 'mdb-react-ui-kit';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import {Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { Avatar, Box, InputLabel, MenuItem, Select as MuiSelect, Typography } from '@mui/material';
import DataTable from '../DataTable';
import { API_URL } from '../../redux/constants/Constants';
import { useDispatch } from 'react-redux';
import { AddGrn, GetProductManual } from '../../redux/actions/P3SystemActions';
import { MdDelete } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';
import { CompressImage } from '../../utils/CompressImage';
import axios from 'axios';

import Select from 'react-select';

function OnHoldManegementSystem() {
const inputRef = useRef(null);

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
    const [productIDF2, setProductID2] = useState('')
    const [singleProductD, setSingleProductD] = useState([])
    const [tableData, setTableData] = useState([])
    const [date, setDate] = useState(getTodayDate())
    const [selectFile, setFile] = useState(null);
    const [userName, setuserName] = useState('')
    const [isValid, setIsValid] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [imageURL, setImageURL] = useState("");

    const [selectedOption, setSelectedOption] = useState(null);
    const [optionsArray, setoptionsArray] = useState([])

    const getall = async () => {
        let url = `${API_URL}wp-json/custom-api-product/v1/get-product/?`
        const response = await axios.get(url);
        setoptionsArray(response.data.products.map(user => ({ label: user.product_name, value: user.product_id })))
    }

    useEffect(() => {
        getall()
    }, [])

    useEffect(() => {
        if (selectedOption) {
            setProductName(selectedOption.label)
            setProductID(selectedOption.value)
        }
    }, [selectedOption])


    const renderVariationValues = (params) => {
        const { color, size } = params.row.variation_values;
        const { attribute_color, attribute_size } = params.row.variation_values;
        const noVariation = params.row.variation_values.length === 0;
        const colorAvailable = color?.length > 0;
        const sizeAvailable = size?.length > 0;

        return (
            <Box className='d-flex justify-content-around align-items-center'>
                {noVariation ? (
                    <Box>No any variation</Box>
                ) : (
                    <>
                        {colorAvailable && (
                            <Box className=' d-flex align-items-center' >
                                <InputLabel style={{width:'87px'}} id={`customer-color-${params.row.id}-label`}>Color</InputLabel>
                                <MuiSelect
                                    labelId={`customer-color-${params.row.id}-label`}
                                    id={`customer-color-${params.row.id}`}
                                    onChange={(event) => handleColorChange(event, params.row)}
                                    fullWidth
                                    style={{ height: "40px", width: "100%" }}
                                >
                                    {color?.map((status) => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                    ))}
                                </MuiSelect>
                            </Box>
                        )}
                        {attribute_color && (
                            <Box >Color:{attribute_color}</Box>
                        )}

                        {sizeAvailable && (
                            <Box className=' d-flex align-items-center'>
                                <InputLabel style={{width:'200px'}} id={`customer-size-${params.row.id}-label`}>Size</InputLabel>
                                <MuiSelect
                                    labelId={`customer-size-${params.row.id}-label`}
                                    id={`customer-size-${params.row.id}`}
                                    onChange={(event) => handleSizeChange(event, params.row)}
                                    fullWidth
                                    style={{ height: "40px", width: "100%" }}
                                >
                                    {size.map((status) => (
                                        <MenuItem key={status} value={status}>{status}</MenuItem>
                                    ))}
                                </MuiSelect>
                            </Box>
                        )}

                        
                        {attribute_size && (
                            <Box >Size:{attribute_size}</Box> //className="fw-bold fs-5"
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
            // renderCell: (value, row) =>
            //     <img
            //         src={value.row.product_image || `${require("../../assets/default.png")}`}
            //         alt={value.row.product_name}
            //         onClick={() => ImageModule(value.row.product_image)}
            //         className="img-fluid"
            //         width={100}
            //     />
            renderCell: (params) => (
                <Box
                  className="h-100 w-100 d-flex align-items-center"
                  onClick={() => ImageModule(params.value)}
                >
                  <Avatar 
                    src={params.value || require("../../assets/default.png")}
                    alt="Product Image"
                    sx={{
                      height: "45px",
                      width: "45px",
                      borderRadius: "2px",
                      margin: "0 auto",
                      "& .MuiAvatar-img": {
                        height: "100%",
                        width: "100%",
                        borderRadius: "2px",
                      },
                    }}
                  />
                </Box>
              ),
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
                return { ...item, [field]: id ,
                    ...(field === 'variationColor' && 
                    { variation_values:{attribute_color :id,
                        ...(value.variation_values.size === undefined
                            ?{attribute_size:value.variationSize}
                        :{size:value.variation_values.size}
                        ),
                        } }
                ),
                ...(field === 'variationSize' && {
                    variation_values: {
                        attribute_size: id,
                        ...(value.variation_values.color === undefined 
                            ? { attribute_color: value.variationColor } 
                            : { color: value.variation_values.color })
                    }
                })
                };
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
        const value = id.target.value
        if(value>=0){
            handleFieldChange(id.target.value, 'Quantity', event);
        }
    };

    const handleDelete = (id) => {
        const updatedData = tableData.filter(item => item.id !== id);
        setTableData(updatedData);
    };

    const getAllProducts = async () => {
        let apiUrl = `${API_URL}wp-json/custom-api-product/v1/get-product/?`;
        if (productNameF && productIDF) {
            apiUrl += `product_name=${productNameF}&product_id=${productIDF}`;
        } else if (productNameF) {
            apiUrl += `product_name=${productNameF}`;
        } else if (productIDF) {
            apiUrl += `product_id=${productIDF}`;
        }
        try {
            if (productIDF) {
                setSelectedOption(null)
                const response = await dispatch(GetProductManual({ apiUrl }));
                const data = response.data.products.map((v, i) => ({ ...v, id: i }));
                const modifiedData = data.map(item => ({
                    ...item,
                    variationColor: item.variation_values.length === 0 ? '' : '',
                    variationSize: item.variation_values.length === 0 ? '' : ''
                }));
                setSingleProductD(modifiedData);
                inputRef.current.value = ''; 
            } else if (productNameF && productIDF) {
                const response = await dispatch(GetProductManual({ apiUrl }));
                if (response.data.products) {
                    setSelectedOption(null)
                }
                const data = response.data.products.map((v, i) => ({ ...v, id: i }));
                const modifiedData = data.map(item => ({
                    ...item,
                    variationColor: item.variation_values.length === 0 ? '' : '',
                    variationSize: item.variation_values.length === 0 ? '' : ''
                }));
                setSingleProductD(modifiedData);
                inputRef.current.value = ''; 
            }
        } catch (error) {
            console.error(error);
            // setSingleProductD([]);
        }
    }

    useEffect(() => {
        handalADDProduct()
    }, [singleProductD])

    useEffect(() => {
        getAllProducts()
    }, [productNameF, productIDF, tableData])

    useEffect(() => {
        let info = JSON.parse(localStorage.getItem('user_data'))
        setuserName(info.first_name + ' ' + info.last_name)
    }, [])

    const handalADDProduct = () => {
        let data = [...tableData,...singleProductD ]
        let Updatedata = data.map((v, i) => ({ ...v, id: i, Quantity: v.Quantity !== "" ? v.Quantity : 1, variationColor: v.variation_values.attribute_color !== undefined ? v.variation_values.attribute_color : '', variationSize: v.variation_values.attribute_size !== undefined ? v.variation_values.attribute_size : '' }));
        validateForm(Updatedata);
        const newData = Updatedata.reduce((acc, obj) => {
            const existingIndex = acc.findIndex(item =>
                item.product_name === obj.product_name &&
                (item.variationColor === obj.variationColor || (!item.variationColor && !obj.variationColor)) &&
                (item.variationSize === obj.variationSize || (!item.variationSize && !obj.variationSize))
            );
            if (existingIndex !== -1) {
                acc[existingIndex].Quantity = String(Number(acc[existingIndex].Quantity) + 1);
                const originalArray = [acc[existingIndex]];
                const filteredComparedArray = acc.filter(comparedItem => {
                    return !originalArray.some(originalItem => {
                        return (
                            originalItem.product_name === comparedItem.product_name &&
                            (originalItem.variationColor === comparedItem.variationColor || (!originalItem.variationColor && !comparedItem.variationColor)) &&
                            (originalItem.variationSize === comparedItem.variationSize || (!originalItem.variationSize && !comparedItem.variationSize))
                        );
                    });
                });
                const outputArray = [...originalArray, ...filteredComparedArray];
                acc = outputArray
            } else {
                // acc.push(obj);
                // acc.unshift(obj);
                const originalArray = [obj];
                const filteredComparedArray = acc.filter(comparedItem => {
                    return !originalArray.some(originalItem => {
                        return (
                            originalItem.product_name === comparedItem.product_name &&
                            (originalItem.variationColor === comparedItem.variationColor || (!originalItem.variationColor && !comparedItem.variationColor)) &&
                            (originalItem.variationSize === comparedItem.variationSize || (!originalItem.variationSize && !comparedItem.variationSize))
                        );
                    });
                });
                const outputArray = [...originalArray, ...filteredComparedArray];
                // acc.push(obj);
                acc = outputArray
            }
            return acc;
        }, []);
        setTableData(newData)
        setProductName('')
        setProductID('')
    }

    const handalonChangeProductId = (e) => {
        if(e.key === 'Enter') {
            setProductName('')
            setProductID(e.target.value)
        }

    }
   
    const handleFileChange = async (e) => {
        if (e.target.files[0]) {
            const file = await CompressImage(e?.target?.files[0])
            setFile(file);
        }
    };

    const validateForm = (data) => {
        let dataa = data.filter(o => (Object.keys(o.variation_values).length > 0))
        const isValid = dataa.every(item => item.variationColor !== '');
        const isValidSize = dataa.every(item => item.variationSize !== '');
        const isQuantityAvailable = data.every(item => item.Quantity !== '')
        setIsValid((isValid || isValidSize) && isQuantityAvailable);
    };

    const handleSubmit = async () => {
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
        }));

        const payload = {
            "created_date": date,
            "verified_by": userName,
            "boxes_received": receivedBoxes,
            "attachment_bill_image": selectFile,
            "status": "Pending for process",
            products: convertedData
        };
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
                            <Form.Label className="fw-semibold">Date filter:</Form.Label>
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
                                onChange={(e) => {
                                    const value = e.target.value
                                    if(value>=0){
                                        setReceivedBoxes(e.target.value)
                                    }
                                }}
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
                                <Select
                                    value={selectedOption}
                                    onChange={(option) => setSelectedOption(option)}
                                    options={optionsArray}
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="4">
                            <Form.Group className="fw-semibold mb-0">
                                <Form.Label>Product ID:</Form.Label>
                                <Form.Control type="text" placeholder="Enter Product ID"  ref={inputRef} onKeyDown={(e) => handalonChangeProductId(e)} />
                                {/* <Form.Control type="text" placeholder="Enter Product ID" onKeyDown={(e) => handalonChangeProductId2(e)} /> */}
                            </Form.Group>
                        </Col>
                    </Row>
                    {
                        tableData.length > 0 && (
                            <>
                                <div className="mt-2">
                                    <DataTable
                                        columns={columns}
                                        rows={tableData}
                                        // rowHeight={100}
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
