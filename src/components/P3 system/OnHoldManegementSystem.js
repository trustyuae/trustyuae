import React, { useEffect, useState } from 'react';
import {
    MDBCol,
    MDBRow
}
    from 'mdb-react-ui-kit';
import Container from 'react-bootstrap/Container';
import Form from "react-bootstrap/Form";
import { Badge, Button, Card, Col, FormControl, Row } from 'react-bootstrap';
import { Autocomplete, Box, InputLabel, MenuItem, Select, TextField, Typography } from '@mui/material';
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DataTable from '../DataTable';
import { API_URL } from '../../redux/constants/Constants';
import { useDispatch } from 'react-redux';
import { GetProductManual } from '../../redux/actions/P3SystemActions';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FaEye } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';


function OnHoldManegementSystem() {
    const getTodayDate = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = (today.getMonth() + 1).toString().padStart(2, '0');
        const day = today.getDate().toString().padStart(2, '0');
        return `${year}-${month}-${day}`;
    };


    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedOperator, setSelectedOperator] = useState("");
    const [receivedBoxes, setReceivedBoxes] = useState(0);
    const [searchedProduct, setSearchedProduct] = useState("");
    const [manualProducts, setManualProducts] = useState([]);
    const [productNameF, setProductName] = useState('')
    const [productIDF, setProductID] = useState('')
    const [singleProductD, setSingleProductD] = useState([])
    const [tableData, setTableData] = useState([])
    const [date, setDate] = useState(getTodayDate())
    const [selectFile, setFile] = useState(null);
    const [userName, setuserName] = useState('')



    const [pageSize, setPageSize] = useState(10);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const dispatch = useDispatch();

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
    };

    const handleDateChange = async (newDateRange) => {
        if (newDateRange[0]?.$d && newDateRange[1]?.$d) {
            setSelectedDateRange(newDateRange);
            const startDateString = newDateRange[0].$d.toDateString();
            const endDateString = newDateRange[1].$d.toDateString();

            const formattedStartDate = formatDate(startDateString);
            const formattedEndDate = formatDate(endDateString);

            const isoStartDate = new Date(formattedStartDate)
                ?.toISOString()
                .split("T")[0];
            const isoEndDate = new Date(formattedEndDate)
                ?.toISOString()
                .split("T")[0];

            setStartDate(isoStartDate);
            setEndDate(isoEndDate);
        } else {
            console.error("Invalid date range");
        }
    };
    const columns = [
        { field: "product_name", headerName: "product name", flex: 1 },
        {
            field: "product_image", headerName: "product image", flex: 1,
            type: "html",
            renderCell: (value, row) => {
                return (
                    <>
                        <img
                            src={value.row.product_image}
                            alt={value.row.product_name}
                            className="img-fluid"
                            width={100}
                        />
                    </>
                );
            },

        },
        {
            field: "Quantity", headerName: "Quantity", flex: 1,
            renderCell: (params) => {
                return (
                    <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">

                        <Form.Control style={{ justifyContent: "center" }} type="number" value={params.row.Quantity} placeholder="0" onChange={(e) => handleQtyChange(e, params.row)} />
                    </Form.Group>
                )
            }

        },
        {
            field: "variation_values",
            headerName: "Variation values",
            flex: 3,
            renderCell: (params) => {
                const { color, size } = params.row.variation_values;
                const noVariation = params.row.variation_values.length == 0;
                const colorAvailable = color?.length > 0;
                const sizeAvailable = size?.length > 0;

                return (
                    <div className='d-flex justify-content-between align-items-center'>
                        {noVariation ? (
                            <div>No any variation</div>
                        ) : (
                            <>
                                {colorAvailable && (
                                    <div className='w-100 me-3 d-flex flex-column'>
                                        <InputLabel id={`customer-color-${params.row.id}-label`}>Color</InputLabel>
                                        <Select
                                            labelId={`customer-color-${params.row.id}-label`}
                                            id={`customer-color-${params.row.id}`}
                                            // value={params.row.availability_status}
                                            onChange={(event) => handleColorChange(event, params.row)}
                                            fullWidth
                                            style={{ height: "40%", width: "100%" }}
                                        >
                                            {color?.map(
                                                (status) => (
                                                    <MenuItem key={status} value={status}>
                                                        {status}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </div>
                                )}

                                {sizeAvailable && (
                                    <div className='w-100 d-flex flex-column'>
                                        <InputLabel id={`customer-size-${params.row.id}-label`}>Size</InputLabel>
                                        <Select
                                            labelId={`customer-size-${params.row.id}-label`}
                                            id={`customer-size-${params.row.id}`}
                                            // value={params.row.availability_status}
                                            onChange={(event) => handleSizeChange(event, params.row)}
                                            fullWidth
                                            style={{ height: "40%", width: "100%" }}
                                        >
                                            {size.map(
                                                (status) => (
                                                    <MenuItem key={status} value={status}>
                                                        {status}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                );
            },
        },

        {
            field: '', headerName: "Action", flex: 1,
            type: "html",
            renderCell: (params) => {
                return (
                    <Button type="button" className="w-auto w-auto bg-transparent border-0 text-secondary fs-5" onClick={() => handleDelete(params.row.id)}>
                        <MdDelete className="mb-1" />
                    </Button>
                );
            },
        }
    ];

    const handleColorChange = (index, event) => {

        console.log(index.target, event);
        const updatedData = tableData.map(item => {
            if (item.id === event.id) {
                return { ...item, variationColor: index.target.value };
            }
            // if (item.product_id === event.product_id) {
            //     return { ...item, Quantity: index.target.value };
            // }
            return item;
        });
        console.log(updatedData, 'updatedData====');
        setTableData(updatedData)

    }
    const handleSizeChange = (index, event) => {

        console.log(index.target, event);
        const updatedData = tableData.map(item => {
            if (item.id === event.id) {
                return { ...item, variationSize: index.target.value };
            }
            // if (item.product_id === event.product_id) {
            //     return { ...item, Quantity: index.target.value };
            // }
            return item;
        });
        console.log(updatedData, 'updatedData====');
        setTableData(updatedData)

    }
    const handleDelete = (id) => {
        console.log(id, 'id====');
        const updatedData = tableData.filter(item => item.id !== id);
        setTableData(updatedData);
    };

    const handleQtyChange = (index, event) => {
        console.log(index.target, event);
        const updatedData = tableData.map(item => {
            if (item.id === event.id) {
                return { ...item, Quantity: index.target.value };
            }
            // if (item.product_id === event.product_id) {
            //     return { ...item, Quantity: index.target.value };
            // }
            return item;
        });
        console.log(updatedData, 'updatedData====');
        setTableData(updatedData)

    };

    const handleChange = (event, value) => {
        setPage(value);
    };

    const getAllProducts = async () => {
        let apiUrl
        if (productNameF) {
            apiUrl = `${API_URL}wp-json/custom-manual-po/v1/get-product-manual/?&product_name=${productNameF}`;
        }
        if (productIDF) {
            apiUrl = `${API_URL}wp-json/custom-manual-po/v1/get-product-manual/?&product_id=${productIDF}`;
        }
        // https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-manual-po/v1/get-product-manual/?&product_name=h10
        await dispatch(
            GetProductManual({
                apiUrl: apiUrl,
            })
        )
            .then((response) => {
                console.log(response, 'response')
                let data = response.data.products.map((v, i) => ({ ...v, id: i }));
                console.log(data, 'data=====')
                const modifiedData = data.map(item => {
                    if (item.variation_values.length === 0) {
                        // If variation_values is an empty array, return the item as it is
                        return item;
                    } else {
                        // If variation_values is not an empty array, add variationColor and variationSize properties
                        return {
                            ...item,
                            variationColor: '',
                            variationSize: ''
                        };
                    }
                });
                console.log(modifiedData[0], 'data[0]=====')
                setManualProducts(modifiedData);
                setSingleProductD([modifiedData[0]])
                console.log(manualProducts, 'manualProducts');
                console.log(singleProductD, 'singleProductD');
                console.log(productNameF, 'productNameF');
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {

        getAllProducts()

    }, [productNameF, productIDF])

    useEffect(() => {
        let info = JSON.parse(localStorage.getItem('user_data'))

        console.log(
            info.first_name, info.last_name
        );

        setuserName(info.first_name + ' ' + info.last_name)
    }, [])

    // const handalonChangeProductName = (e)=>{
    //     console.log(e,'eeee');
    //     setProductName(e)
    //     getAllProducts()
    // }

    const handalADDProduct = () => {
        console.log(singleProductD, 'singleProductD======');

        // // Check if variation_values contains data
        // if (singleProductD.variationValues.color.length > 0 || singleProductD.variationValues.size.length > 0) {
        //     console.log('variation_values contains data');
        // } else {
        //     console.log('variation_values is an empty array');
        // }
        // if (singleProductD[0].variation_values.length === 0) {
        //     console.log('variation_values is an empty array');
        // } else {
        //     console.log('variation_values contains data');

        //     let data = singleProductD.map((v,i)=>({
        //         ...v,variation_size:'',variation_color:''
        //     }))

        //     console.log(data,'data');
        // }
        console.log(singleProductD, 'singleProductD');
        let data = [
            ...tableData, ...singleProductD
        ]
        console.log(data, 'data===');
        let Updatedata = data.map((v, i) => ({ ...v, id: i }));

        setTableData(Updatedata)
        console.log(tableData, 'tableData===');
        setProductName('')
        setProductID('')
    }

    const handalonChangeProductId = (e) => {
        setProductName('')
        console.log(e, 'e');
        setProductID(e)
    }
    const handalonChangeProductName = (e) => {
        setProductID('')
        console.log(e, 'e');
        setProductName(e)
    }
    const handleFileChange = (e) => {
        console.log(e.target.files[0]);
        setFile(e.target.files[0]);
        // setFile({ ...selectFile, factoryImage: e.target.files[0] });

    };

    const handleSubmit = async () => {
        console.log(date, 'date');
        console.log(userName, 'userName');
        console.log(receivedBoxes, 'receivedBoxes');
        console.log(selectFile, 'selectFile');
        console.log(tableData, 'tableData');

        const currentDate = new Date().toISOString().split('T')[0];

        const convertedData = tableData.map(item => ({
            product_id: parseInt(item.product_id),
            product_name: item.product_name,
            product_image: item.product_image,
            variation_id: 1, // Assuming a default variation ID
            // variation_value: item.variation_values={color:[item.variation_color],size:[item.variation_size]},

            variations: item.variationColor !== undefined && item.variationSize !== undefined ? { color: item.variationColor, size: item.variationSize } : [],
            qty_received: parseInt(item.Quantity),
            qty_remain: parseInt(item.Quantity),
            updated_date: currentDate, // Assuming a default updated date
            allocated_order: [789, 790] // Assuming a default allocated order
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
            "attachment_bill_image": "",
            "status": "Pending for process",
            products: convertedData
        }

        console.log(convertedData, 'convertedData');
        console.log(payload, 'payload');
        console.log(formData.values, 'formData');

        tableData.map(async (item) => {
            if (item.Quantity === "") {
                Swal.fire({
                    icon: 'error',
                    title: 'Missing Quantity',
                    text: 'The quantity for this item is missing.'
                });
            } else {
                if (item.variation_values.length !== 0) {
                    if (item.variationSize === '' && item.variationColor === '') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Missing Size and Color',
                            text: 'This item has variations but both size and color are missing.'
                        });
                    } else if (item.variationSize === '') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Missing Size',
                            text: 'This item has variations but size is missing.'
                        });
                    } else if (item.variationColor === '') {
                        Swal.fire({
                            icon: 'error',
                            title: 'Missing Color',
                            text: 'This item has variations but color is missing.'
                        });
                    } else {
                        console.log('hiii');
                        try {
                            let url = `${API_URL}wp-json/custom-api/v1/add-grn`
                            const response = await axios.post(url, payload);
                            // const response = await axios.post(url, formData);

                            console.log(response, 'response');
                            if (response) {
                                Swal.fire({
                                    icon: "success",
                                    title: response.data,
                                    showConfirmButton: true,
                                })
                            }

                        } catch (error) {
                            console.log(error);
                        }
                    }
                }
            }

        });





    }
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
                                                    <img className="w-100 h-100" style={{ objectFit: 'cover' }} src={d.product_image} />
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
                                    <Button variant="primary" style={{ width: '100px' }} onClick={handleSubmit}>
                                        submit
                                    </Button>
                                </MDBRow>
                            </>
                        )
                    }

                </Card>
            </MDBRow>

        </Container >
    )
}

export default OnHoldManegementSystem
