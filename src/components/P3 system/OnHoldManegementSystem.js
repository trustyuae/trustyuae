import React, { useEffect, useRef, useState } from 'react';
import { MDBRow } from 'mdb-react-ui-kit';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
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
        console.log(params.row, 'params======');
        const variationArray = Object.entries(params.row.variation_values).map(([key, value]) => ({ [key]: value }));
        // const variationArray = params.row.variation_values
        console.log(variationArray, 'variationArray');
        // const { color, size } = params.row.variation_values;
        // const { attribute_color, attribute_size } = params.row.variation_values;
        const noVariation = params.row.variation_values.length === 0;
        // const colorAvailable = color?.length > 0;
        // const sizeAvailable = size?.length > 0;

        return (
            <Box className='d-flex justify-content-around align-items-center w-100'>
                {noVariation ? (
                    <Box>No any variation</Box>
                ) : (
                    <>
                        {
                            variationArray && (
                                <Box className='d-flex flex-column align-items-center w-50'>
                                    {variationArray.map((item, index) => {
                                        const attributeName = Object.keys(item)[0];
                                        const attributeValue = Object.values(item)[0];
                                        console.log(attributeValue, 'attributeValue');
                                        console.log(typeof (attributeValue), 'attributeValue===');
                                        return (
                                            <React.Fragment key={index} >
                                                <InputLabel id={`customer-color-${params.row.id}-label`}>{attributeName}</InputLabel>
                                                {typeof (attributeValue) === "string" ? (
                                                    <div style={{ width: '100%' }}>{attributeValue}</div>
                                                ) : (
                                                    <MuiSelect
                                                        labelId={`customer-color-${params.row.id}-label`}
                                                        id={`customer-color-${params.row.id}`}
                                                        onChange={(event) => handleAttributeChange(event, params.row, attributeName)}
                                                        fullWidth
                                                        style={{ height: "40px", width: "100%" }}
                                                        value={params.row[attributeName]} // Assuming the value of each attribute is stored in params.row
                                                    >
                                                        {attributeValue?.map((value) => (
                                                            <MenuItem key={value} value={value}>{value}</MenuItem>
                                                        ))}
                                                    </MuiSelect>
                                                )}
                                            </React.Fragment>
                                        );
                                    })}
                                </Box>
                            )


                        }
                        {/* {colorAvailable && (
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
                        )} */}
                    </>
                )}
            </Box>
        );
    };

    const columns = [
        { field: "product_name", headerName: "product name", flex: 1, className: " d-flex justify-content-center align-items-center" },
        {
            field: "product_image", headerName: "product image", flex: 1,
            type: "html",
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

    function handleAttributeChange(event, rowIndex, attributeName) {
        const newValue = event.target.value;
        // const attributeNames = attributeName
        // console.log(attributeName,'attributeName');
        console.log(rowIndex, 'rowIndex');
        console.log(tableData, 'tableData');
        console.log(rowIndex.variation_values[attributeName] = newValue, 'rowIndex');
        console.log(rowIndex, 'rowIndex');
        const updatedData = tableData.map(item =>
            item.id === rowIndex.id ? { ...item, ...rowIndex } : item
        );
        console.log(updatedData, 'updatedData');
        setTableData(updatedData);
        validateForm(updatedData)
    }



    const handleFieldChange = (id, field, value) => {
        const updatedData = tableData.map(item => {
            if (item.id === value.id) {
                return {
                    ...item, [field]: id,
                    ...(field === 'variationColor' &&
                    {
                        variation_values: {
                            attribute_color: id,
                            ...(value.variation_values.size === undefined
                                ? { attribute_size: value.variationSize }
                                : { size: value.variation_values.size }
                            ),
                        }
                    }
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
        if (value >= 0) {
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
                console.log(response, 'response');
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
        let data = [...tableData, ...singleProductD]
        let Updatedata = data.map((v, i) => ({ ...v, id: i, Quantity: v.Quantity !== "" ? v.Quantity : 1, variationColor: v.variation_values.attribute_color !== undefined ? v.variation_values.attribute_color : '', variationSize: v.variation_values.attribute_size !== undefined ? v.variation_values.attribute_size : '' }));
        console.log(Updatedata, 'Updatedata');
        validateForm(Updatedata);
        // const newData = Updatedata.reduce((acc, obj) => {
        //     const existingIndex = acc.findIndex(item =>
        //         item.product_name === obj.product_name &&
        //         (item.variationColor === obj.variationColor || (!item.variationColor && !obj.variationColor)) &&
        //         (item.variationSize === obj.variationSize || (!item.variationSize && !obj.variationSize))
        //     );
        //     if (existingIndex !== -1) {
        //         acc[existingIndex].Quantity = String(Number(acc[existingIndex].Quantity) + 1);
        //         const originalArray = [acc[existingIndex]];
        //         const filteredComparedArray = acc.filter(comparedItem => {
        //             return !originalArray.some(originalItem => {
        //                 return (
        //                     originalItem.product_name === comparedItem.product_name &&
        //                     (originalItem.variationColor === comparedItem.variationColor || (!originalItem.variationColor && !comparedItem.variationColor)) &&
        //                     (originalItem.variationSize === comparedItem.variationSize || (!originalItem.variationSize && !comparedItem.variationSize))
        //                 );
        //             });
        //         });
        //         const outputArray = [...originalArray, ...filteredComparedArray];
        //         acc = outputArray
        //     } else {
        //         // acc.push(obj);
        //         // acc.unshift(obj);
        //         const originalArray = [obj];
        //         const filteredComparedArray = acc.filter(comparedItem => {
        //             return !originalArray.some(originalItem => {
        //                 return (
        //                     originalItem.product_name === comparedItem.product_name &&
        //                     (originalItem.variationColor === comparedItem.variationColor || (!originalItem.variationColor && !comparedItem.variationColor)) &&
        //                     (originalItem.variationSize === comparedItem.variationSize || (!originalItem.variationSize && !comparedItem.variationSize))
        //                 );
        //             });
        //         });
        //         const outputArray = [...originalArray, ...filteredComparedArray];
        //         // acc.push(obj);
        //         acc = outputArray
        //     }
        //     return acc;
        // }, []);

        // const mergedData = Object.values(Updatedata.reduce((acc, item) => {
        //     // Create a unique key based on name and data
        //     const key = JSON.stringify({ product_name: item.product_name, variation_values: item.variation_values });

        //     // If the key is not in the accumulator, add it
        //     if (!acc[key]) {
        //         acc[key] = { ...item, Quantity: item.Quantity };
        //     } else {
        //         // If the key exists, increase the marks by 1
        //         acc[key].Quantity = String(Number(acc[key].Quantity) + 1);
        //     }

        //     return acc;
        // }, {}));

        // // Sort the merged data to place the updated object at the top
        // mergedData.sort((a, b) => {
        //     // You can customize the sorting logic here
        //     // For example, placing items with higher Quantity at the top
        //     return b.Quantity - a.Quantity;
        // });

        // console.log(mergedData);


        const mergedData = Updatedata.reduce((acc, item) => {
            // Create a unique key based on product_name and variation_values
            const key = JSON.stringify({ product_name: item.product_name, variation_values: item.variation_values });

            // Check if the key is in the accumulator
            const existingIndex = acc.findIndex(entry => JSON.stringify({ product_name: entry.product_name, variation_values: entry.variation_values }) === key);

            if (existingIndex === -1) {
                // If the key is not in the accumulator, add it to the start of the array
                acc.unshift({ ...item, Quantity: item.Quantity });
            } else {
                // If the key exists, increase the Quantity by 1 and move the item to the start of the array
                acc[existingIndex].Quantity = String(Number(acc[existingIndex].Quantity) + 1);
                const updatedItem = acc.splice(existingIndex, 1)[0];
                acc.unshift(updatedItem);
            }

            return acc;
        }, []);

        console.log(mergedData);


        setTableData(mergedData)
        setProductName('')
        setProductID('')
    }

    const handalonChangeProductId = (e) => {
        if (e.key === 'Enter') {
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
        //     let dataa = data.filter(o => (Object.keys(o.variation_values).length > 0))
        //     console.log(dataa,'dataa=====');
        //    const variationArray= dataa.map(d=>
        //         Object.entries(d.variation_values).map(([key, value]) => ({ [key]: value }))
        //     )
        //     console.log(variationArray,'variationArray');
        //    const value= variationArray?.every(([key,value])=>(
        //         typeof(Object.values(key)[0]) !== 'object',
        //         typeof(Object.values(value)[0]) !== 'object'
        //     ))

        let dataa = data.filter(o => o.variation_values && Object.keys(o.variation_values).length > 0);
        console.log(dataa, 'dataa=====');

        // const result = dataa.map(item => {
        //     const keys = Object.keys(item.variation_values);
        //     const values = Object.values(item.variation_values);
        //     const isAllString = values.every(value => typeof value === 'string');

        //     return {
        //         ...item,
        //         isVariationStringOnly: isAllString && keys.every(key => typeof key === 'string')
        //     };
        // });

        // console.log(result);
        const isAllVariationsString = data.every(item => {
            const values = Object.values(item.variation_values);
            return values.every(value => typeof value === 'string');
        });
        console.log(isAllVariationsString);

        // const variationArray = dataa.map(d =>
        //     Object.entries(d.variation_values).map(([key, value]) => ({ [key]: value }))
        // );
        // console.log(variationArray, 'variationArray');

        // const value = variationArray?.every(variation => (
        //     typeof Object.values(variation)[0] !== 'object',
        //     console.log(variation, 'variation'),
        //     variation.map((item, index) => {
        //         const attributeName = Object.keys(item)[0];
        //         const attributeValue = Object.values(item)[0];
        //         console.log(attributeValue, 'attributeValue');
        //         typeof (attributeValue) !== 'object'
        //     })
        //     // console.log(typeof Object.values(variation)[0] !== 'object'),
        //     // console.log(typeof Object.values(variation)[0]),
        //     // console.log( Object.values(variation)[0]),
        //     // console.log( Object.keys(variation))

        // ));

        // const value = variationArray?.every(variation => {
        //     console.log(variation, 'variation');

        //     // Iterate over each item in the variation array
        //  let a=   variation.map((item, index) => {
        //         const attributeName = Object.keys(item)[0];
        //         const attributeValue = Object.values(item)[0];
        //         console.log(attributeValue, 'attributeValue');
        //         return typeof attributeValue !== 'object'; // Check if the attributeValue is not an object
        //     });

        //     return typeof Object.values(variation)[0] !== 'object';
        // });
        // console.log(value, 'value=======');

        const isQuantityAvailable = data.every(item => item.Quantity !== '')
        setIsValid(isAllVariationsString && isQuantityAvailable);
        // const isValid = dataa.every(item => item.variationColor !== '');
        // const isValidSize = dataa.every(item => item.variationSize !== '');
        // setIsValid((isValid || isValidSize) && isQuantityAvailable);
    };

    // Function to transform data
    // const transformData = (data) => {
    //     console.log(data, 'data');
    //     if (!data || !data.variation_details || !data.variation_values) {
    //         return [];
    //     }

    //     const { variation_details, variation_values } = data;
    //     console.log(variation_details);
    //     console.log(variation_values);
    //     const matchingKey = Object.keys(variation_details).find(key => {
    //         const detail = variation_details[key];
    //         return detail.color === variation_values.color && detail.size === variation_values.size;
    //     });
    //     console.log(parseInt(matchingKey, 10), 'parseInt(matchingKey, 10)')
    //     data.variation_details = [parseInt(matchingKey, 10)]

    //     return matchingKey ? data : [];
    // };


    const handleSubmit = async () => {
        const currentDate = new Date().toISOString().split('T')[0];
         
        tableData.forEach(data => {
            if (data.variation_details && data.variation_values) {
                const { variation_details, variation_values } = data;
                const matchingKeys = Object.keys(variation_details).filter(key => {
                    const detail = variation_details[key];
                    // Check if all properties in variation_values match with detail
                    return Object.keys(variation_values).every(prop => {
                        return detail[prop] === variation_values[prop];
                    });
                });
                if (matchingKeys.length > 0) {
                    data.variation_id = Number(matchingKeys[0]);
                }
            }
        });
        
        console.log(tableData, 'tableData')


        const convertedData = tableData.map(item => ({
            product_id: parseInt(item.product_id),
            product_name: item.product_name,
            product_image: item.product_image,
            variation_id: item.variation_id ? item.variation_id : 0,
            // variations: item.variationColor !== "" && item.variationSize !== "" ? { color: item.variationColor, size: item.variationSize } : [],
            variations: item.variation_values,
            qty_received: parseInt(item.Quantity),
            qty_remain: parseInt(item.Quantity),
            updated_date: currentDate,
        }));
        // const convertedData = tableData
        const payload = {
            "created_date": date,
            "verified_by": userName,
            "boxes_received": receivedBoxes,
            "attachment_bill_image": selectFile,
            "status": "Pending for process",
            products: convertedData
        };
        console.log(payload, 'payload=====');
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
                                    if (value >= 0) {
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
                                <Form.Control type="text" placeholder="Enter Product ID" ref={inputRef} onKeyDown={(e) => handalonChangeProductId(e)} />
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
                                        // rowHeight={'auto'}
                                        // page={page}
                                        // pageSize={pageSize}
                                        // totalPages={totalPages}
                                        // handleChange={handleChange}
                                        rowHeight='auto'
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
