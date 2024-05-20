import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Link, useNavigate } from "react-router-dom";
import { Card } from "react-bootstrap";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import Swal from "sweetalert2";
import DataTable from "../DataTable";
import { Box, ButtonBase, Checkbox, FormControlLabel, FormGroup, Tab, Typography } from "@mui/material";
import { API_URL } from "../../redux/constants/Constants";
import styled from "styled-components";

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
});

// import Box from '@mui/material/Box';
// import Tab from '@mui/material/Tab';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
const EstimatedTime = [
    '1 week', '2 week', '3 week', '1 month', 'Out of stock'
]

function OrderManagementSystem() {
    const [orders, setOrders] = useState([]);
    const [manualPOorders, setManualPoOrders] = useState([]);
    const [scheduledPOorders, setScheduleOrders] = useState([]);

    const [orders2, setOrders2] = useState([]);

    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [selectedOrderIdss, setSelectedOrderIdss] = useState([]);
    const [selectedManualOrderIds, setSelectedManualOrderIds] = useState([]);
    const [selectedScheduleOrderIds, setSelectedScheduleOrderIds] = useState([]);

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(5);

    const [pageMO, setPageMO] = useState(1);
    const [totalPagesMO, setTotalPagesMO] = useState(1);
    const [pageSizeMO, setPageSizeMO] = useState(5);

    const [pageSO, setPageSO] = useState(1);
    const [totalPagesSO, setTotalPagesSO] = useState(1);
    const [pageSizeSO, setPageSizeSO] = useState(5);

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
    const [factories, setFactories] = useState([]);

    //selected  factory filter
    const [selectedFactory, setSelectedFactory] = useState("");
    const [selectedManualFactory, setSelectedManualFactory] = useState("");
    const [selectedShedulFactory, setSelectedSheduleFactory] = useState("");

    const [selectedProductIds, setSelectedProductIds] = useState("");
    const [alertMessage, setAlertMessage] = useState("");

    //selected Product filter
    const [manualProductF, setManualProductF] = useState('')
    const [scheduledProductF, setScheduledProductF] = useState('')

    const [manualNote, setManualNote] = useState('')

    const [scheduledNote, setScheduledNote] = useState('')
    const [estimatedTime, setEstimatedTime] = useState('')
    const [remainderDate, setRemainderDate] = useState('')



    const navigate = useNavigate();

    // po ogainst order colum
    const columns1 = [
        {
            field: "select",
            headerName: "Select",
            flex: 1,
            renderCell: (params) => {
                return (
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox />}
                            style={{ justifyContent: "center" }}
                            checked={selectedOrderIds.includes(params.row.product_name)}
                            // onChange={(event) => handleCheckboxChange(event, params.row)}
                            onChange={(event) => handleOrderSelection(params.row.product_name)}
                        />
                    </FormGroup>
                );
            },
        },
        { field: "product_name", headerName: "product names", flex: 1 },
        {
            field: "variation_value", headerName: "variation values", flex: 1,
            renderCell: (params) => {
                // console.log(params,'params');
                return (

                    variant(params.row.variation_value)

                )
            }
        },
        {
            field: "product_images",
            headerName: "product images",
            flex: 1,
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
        { field: "total_quantity", headerName: "total quantity", flex: 1 },
        {
            field: "factory_id", headerName: "factory Name", flex: 1,
            renderCell: (prams) => {
                return (

                    factories.find((factory) => factory.id === prams.row.factory_id)
                        ?.factory_name

                )
            }
        },
    ];
    //MPO
    const columnsMPO = [
        {
            field: "select",
            headerName: "Select",
            flex: 1,
            renderCell: (params) => {
                return (
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox />}
                            style={{ justifyContent: "center" }}
                            checked={selectedManualOrderIds.includes(params.row.product_id)}
                            onChange={() => handleOrderManualSelection(params.row.product_id)}
                        />
                    </FormGroup>
                );
            },
        },
        {
            field: "factory_id", headerName: "factory Name", flex: 1,
            renderCell: (prams) => {
                return (
                    factories.find((factory) => factory.id === prams.row.factory_id)
                        ?.factory_name

                )
            }
        },
        { field: "product_name", headerName: "product names", flex: 1 },
        {
            field: "product_image",
            headerName: "product images",
            flex: 1,
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
                        {/* <ButtonBase sx={{ width: 128, height: 128 }}>
                            <Img alt={value.row.product_name} src={value.row.product_image} />
                        </ButtonBase> */}
                    </>
                );
            },
        },
        {
            field: "variation_values", headerName: "variation values", flex: 1,
            renderCell: (params) => {
                if (params.row.variation_value == '') {
                    return variant(params.row.variation_value)
                } else {
                    return ''
                }
            }
        },
        {
            field: "Quantity", headerName: "Quantity", flex: 1, 
            // editable: true, type: 'number',
            renderCell: (params) => {
                return (
                    <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
                        
                        <Form.Control style={{ justifyContent: "center" }} type="number" value={params.row.Quantity} placeholder="0" onChange={(e) => handleMOQtyChange(e,params.row)} />
                    </Form.Group>
                )
            }
        }
    ]
    const columnsSPO = [
        {
            field: "select",
            headerName: "Select",
            flex: 1,
            renderCell: (params) => {
                return (
                    <FormGroup>
                        <FormControlLabel
                            control={<Checkbox />}
                            style={{ justifyContent: "center" }}
                            checked={selectedScheduleOrderIds.includes(params.row.product_id)}
                            onChange={() => handleOrderScheduleSelection(params.row.product_id)}
                        />
                    </FormGroup>
                );
            },
        },
        {
            field: "factory_id", headerName: "factory Name", flex: 1,
            renderCell: (prams) => {
                return (
                    factories.find((factory) => factory.id === prams.row.factory_id)
                        ?.factory_name

                )
            }
        },
        { field: "product_name", headerName: "product names", flex: 1 },
        {
            field: "product_image",
            headerName: "product images",
            flex: 1,
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
            field: "variation_values", headerName: "variation values", flex: 1,
            renderCell: (params) => {
                if (params.row.variation_value == '') {
                    return variant(params.row.variation_value)
                } else {
                    return ''
                }
            }
        },
        {
            field: "Quantity", headerName: "Quantity", flex: 1,
            //  editable: true, type: 'number',
            renderCell: (params) => {
                return (
                    <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
                        
                        <Form.Control style={{ justifyContent: "center" }} type="number" value={params.row.Quantity} placeholder="0" onChange={(e) => handleSOQtyChange(e,params.row)} />
                    </Form.Group>
                )
            }

        }
    ]
    const handleMOQtyChange = (index, event) => {
        console.log(index.target, event);
        const updatedData = manualPOorders.map(item => {
            if (item.product_id === event.product_id) {
                return { ...item, Quantity: index.target.value };
            }
            return item;
        });
        console.log(updatedData, 'updatedData====');
        setManualPoOrders(updatedData)
       
    };
    const handleSOQtyChange = (index, event) => {
        console.log(index.target, event);
        const updatedData = scheduledPOorders.map(item => {
            if (item.product_id === event.product_id) {
                return { ...item, Quantity: index.target.value };
            }
            return item;
        });
        console.log(updatedData, 'updatedData====');
        setScheduleOrders(updatedData)
       
    };

    // const processRowUpdate = (newRow, i) => {
    //     console.log(newRow, 'newRow====');
    //     console.log(i, 'i====');
    //     const updatedData = manualPOorders.map(item => {
    //         if (item.product_id === newRow.product_id) {
    //             return { ...item, Quantity: newRow.Quantity };
    //         }
    //         return item;
    //     });
    //     console.log(updatedData, 'updatedData====');
    //     setManualPoOrders(updatedData)
    // };
    // const processRowUpdateSPO = (newRow, i) => {
    //     console.log(newRow, 'newRow====');
    //     console.log(i, 'i====');
    //     const updatedData = scheduledPOorders.map(item => {
    //         if (item.product_id === newRow.product_id) {
    //             return { ...item, Quantity: newRow.Quantity };
    //         }
    //         return item;
    //     });
    //     console.log(updatedData, 'updatedData====');
    //     setScheduleOrders(updatedData)
    // };

    useEffect(() => {
        fetchOrders();
        fetchFactories();
    }, [page, pageSize, endDate, selectedFactory]);

    const fetchOrders = async () => {
        try {
            let apiUrl = `${API_URL}wp-json/custom-preorder-products/v1/pre-order/?&per_page=${pageSize}&page=${page}`;
            if (endDate) apiUrl += `start_date=${startDate}&end_date=${endDate}`;
            if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
            const response = await axios.get(apiUrl);
            console.log(response, 'response.data');
            let data = response.data.pre_orders.map((v, i) => ({ ...v, id: i }));
            setOrders(data);
            setOrders2(data);
            setTotalPages(response.data.total_pages);

        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };
    const manualPO = async () => {
        try {
            let apiUrl = `${API_URL}wp-json/custom-manual-po/v1/get-product-manual/?&per_page=${pageSizeMO}&page=${pageMO}`;
            if (selectedManualFactory) apiUrl += `&factory_id=${selectedManualFactory}`;
            if (manualProductF) apiUrl += `&product_name=${manualProductF}`;

            const response = await axios.get(apiUrl);
            console.log(response.data, 'response.data===manual PO');
            let data = response.data.products.map((v, i) => ({ ...v, id: i }));
            setManualPoOrders(data)
            setTotalPagesMO(response.data.total_pages);

            if (response.data.products) {

            } else {
                setManualPoOrders(data)
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    const scheduledPO = async () => {
        try {
            let apiUrl = `${API_URL}wp-json/custom-manual-po/v1/get-product-manual/?&per_page=${pageSizeSO}&page=${pageSO}`;
            if (selectedShedulFactory) apiUrl += `&factory_id=${selectedShedulFactory}`;
            if (scheduledProductF) apiUrl += `&product_name=${scheduledProductF}`;

            const response = await axios.get(apiUrl);
            console.log(response.data, 'response.data===manual PO');
            let data = response.data.products.map((v, i) => ({ ...v, id: i }));

            if (response.data.products) {
                setScheduleOrders(data)
                setTotalPagesSO(response.data.total_pages)
            } else {
                setScheduleOrders([])
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    }
    const fetchFactories = async () => {
        try {
            const response = await axios.get(
                `${API_URL}wp-json/custom-factory/v1/fetch-factories`
            );
            setFactories(response.data);
        } catch (error) {
            console.error("Error fetching factories:", error);
        }
    };

    useEffect(() => {
        manualPO()
    }, [selectedManualFactory, manualProductF, pageMO, pageSizeMO])

    useEffect(() => {
        scheduledPO()
    }, [selectedShedulFactory, scheduledProductF, pageSO, pageSizeSO])


    // single select
    const handleOrderSelection = (orderId) => {
        // let id = orders.map((name)=>name.)
        const filteredOrders = orders.filter(order => order.product_name === orderId);

        // Map through the filtered orders to extract the order_ids
        const orderIds = filteredOrders.map(order => order.order_ids);
        console.log(orderIds);

        const selectedIndex = selectedOrderIds.indexOf(orderId);
        const selectedIndexs = selectedOrderIdss.indexOf(...orderIds);
        console.log(selectedOrderIdss, 'selectedOrderIds');
        console.log(selectedIndexs, 'selectedIndexs');
        let newSelected = [];
        let newSelected2 = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedOrderIds, orderId];
            newSelected2 = [...selectedOrderIdss, ...orderIds];
        } else {
            newSelected = selectedOrderIds.filter((id) => id !== orderId);
            // newSelected = selectedOrderIds.filter((id) => id !== orderId);
        }
        console.log(newSelected2, 'newSelected2');
        const flattenedData = newSelected2.flatMap(str => str.split(','));
        console.log(flattenedData, 'flattenedData');

        setSelectedOrderIds(newSelected);
        setSelectedOrderIdss(flattenedData);
    };
    const handleOrderManualSelection = (orderId) => {
        const selectedIndex = selectedManualOrderIds.indexOf(orderId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedManualOrderIds, orderId];
        } else {
            newSelected = selectedManualOrderIds.filter((id) => id !== orderId);
        }

        setSelectedManualOrderIds(newSelected);
    };
    const handleOrderScheduleSelection = (orderId) => {
        const selectedIndex = selectedScheduleOrderIds.indexOf(orderId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedScheduleOrderIds, orderId];
        } else {
            newSelected = selectedScheduleOrderIds.filter((id) => id !== orderId);
        }

        setSelectedScheduleOrderIds(newSelected);
    };

    // select all
    const handleSelectAll = () => {
        const allOrderIds = orders.map((order) => order.product_name);
        console.log(allOrderIds, 'allOrderIds');
        const allOrderIdss = [];
        allOrderIds.forEach(productName => {
            const orderIds = getOrderIdsByProductName(orders, productName);
            allOrderIdss.push(...orderIds);
        });
        console.log(allOrderIdss, 'allOrderIds');
        const flattenedData = allOrderIdss.flatMap(str => str.split(','));
        console.log(flattenedData, 'flattenedData');
        setSelectedOrderIds(
            selectedOrderIds.length === allOrderIds.length ? [] : allOrderIds
        );
        setSelectedOrderIdss(
            selectedOrderIdss.length === flattenedData.length ? [] : flattenedData
        );
    };
    const handleSelectAllManual = () => {
        const allOrderIds = manualPOorders.map((order) => order.product_id);
        console.log(allOrderIds);
        setSelectedManualOrderIds(
            selectedManualOrderIds.length === allOrderIds.length ? [] : allOrderIds
        );
    };
    const handleSelectAllSchedule = () => {
        const allOrderIds = scheduledPOorders.map((order) => order.product_id);
        console.log(allOrderIds);
        setSelectedScheduleOrderIds(
            selectedScheduleOrderIds.length === allOrderIds.length ? [] : allOrderIds
        );
    };

    function getOrderIdsByProductName(data, productName) {
        // Filter the data based on the product name
        const filteredOrders = data.filter(order => order.product_name === productName);

        // Map through the filtered orders to extract the order_ids
        const orderIds = filteredOrders.map(order => order.order_ids);

        return orderIds;
    }

    // filters
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
            setStartDate("");
            setEndDate("");
        }
    };
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        date.setDate(date.getDate() + 1);
        return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
            .getDate()
            .toString()
            .padStart(2, "0")}/${date.getFullYear()}`;
    };
    const handleFactoryChange = (e) => {
        setSelectedFactory(e.target.value);
    };


    // PO Generate
    const handleGeneratePO = async () => {
        const selectedOrders = orders.filter((order) =>
            selectedOrderIds.includes(order.product_name)
        );
        console.log(selectedOrders, 'selectedOrders');
        // Extract unique factory IDs from selected orders
        const factoryIds = [...new Set(selectedOrders.map((order) => order.factory_id))];

        if (factoryIds.length === 1) {
            // Concatenate selected product IDs and order IDs
            const selectedProductIds = selectedOrders.map((order) => order.item_id).join(",");
            const selectedOrderIdsStr = selectedOrderIdss.join(",");

            // Construct the payload object
            const payload = {
                product_ids: selectedProductIds,
                factory_ids: factoryIds.join(","), // Convert array to comma-separated string
                order_ids: selectedOrderIdsStr,
            };

            console.log(payload, 'payload');
            setSelectedProductIds(JSON.stringify(payload));
            setAlertMessage("");

            try {
                const response = await axios.post(
                    `${API_URL}wp-json/custom-po-number/v1/po-id-generate/`,
                    payload // Send the payload object
                );
                console.log(response.data);
                if (response.data) {
                    Swal.fire({
                        text: response.data,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/PO_ManagementSystem");
                        }
                    });
                }
            } catch (error) {
                console.error("Error generating PO IDs:", error);
            }
        } else {
            setAlertMessage(
                "Selected orders belong to different factories. Please select orders from the same factory."
            );
            Swal.fire({
                text: "Selected orders belong to different factories. Please select orders from the same factory.",
            });
        }
    };
    const handleGenerateManualPO = async () => {
        const selectedOrders = manualPOorders.filter((order) =>
            selectedManualOrderIds.includes(order.product_id)
        );
        console.log(selectedOrders, 'selectedOrders');
        // Extract unique factory IDs from selected orders
        const factoryIds = [...new Set(selectedOrders.map((order) => order.factory_id))];

        if (factoryIds.length === 1) {
            // Concatenate selected product IDs and order IDs
            // const selectedProductIds = selectedOrders.map((order) => order.product_id).join(",");
            const selectedquantities = selectedOrders.map((order) => order.Quantity);
            const selectedOrderIdsStr = selectedManualOrderIds;

            // Construct the payload object
            const payload = {
                quantities: selectedquantities,
                // factory_ids: factoryIds.join(","), // Convert array to comma-separated string
                product_ids: selectedOrderIdsStr,
                note: manualNote
            };
            console.log(payload, 'payload');
            setSelectedProductIds(JSON.stringify(payload));
            setAlertMessage("");

            try {
                const response = await axios.post(
                    `${API_URL}wp-json/custom-manual-order/v1/post-order-manual/`,
                    payload // Send the payload object
                );
                console.log(response.data);
                if (response.data) {
                    Swal.fire({
                        text: response.data,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/PO_ManagementSystem");
                        }
                    });
                }
            } catch (error) {
                console.error("Error generating PO IDs:", error);
            }
        } else {
            setAlertMessage(
                "Selected orders belong to different factories. Please select orders from the same factory."
            );
            Swal.fire({
                text: "Selected orders belong to different factories. Please select orders from the same factory.",
            });
        }
    };
    const handleGenerateScheduledPO = async () => {
        const selectedOrders = scheduledPOorders.filter((order) =>
            selectedScheduleOrderIds.includes(order.product_id)
        );

        // Extract unique factory IDs from selected orders
        const factoryIds = [...new Set(selectedOrders.map((order) => order.factory_id))];
        if (factoryIds.length === 1) {
            // Concatenate selected product IDs and order IDs
            // const selectedProductIds = selectedOrders.map((order) => order.product_id).join(",");
            const selectedquantities = selectedOrders.map((order) => order.Quantity);
            const selectedOrderIdsStr = selectedScheduleOrderIds;

            // Construct the payload object
            const payload = {
                quantities: selectedquantities,
                // factory_ids: factoryIds.join(","), // Convert array to comma-separated string
                product_ids: selectedOrderIdsStr,
                note: scheduledNote,
                estimated_time: estimatedTime,
                reminder_date: remainderDate
            };
            // setSelectedProductIds(JSON.stringify(payload));
            // setAlertMessage("");

            try {
                const response = await axios.post(
                    `${API_URL}wp-json/custom-schedule-order/v1/post-order-schedule/`,
                    payload // Send the payload object
                );
                console.log(response.data);
                if (response.data) {
                    Swal.fire({
                        text: response.data,
                    }).then((result) => {
                        if (result.isConfirmed) {
                            navigate("/PO_ManagementSystem");
                        }
                    });
                }
            } catch (error) {
                console.error("Error generating PO IDs:", error);
            }
        } else {
            setAlertMessage(
                "Selected orders belong to different factories. Please select orders from the same factory."
            );
            Swal.fire({
                text: "Selected orders belong to different factories. Please select orders from the same factory.",
            });
        }
    };



    // variant
    const variant = (e) => {
        const matches = e.match(/"display_key";s:\d+:"([^"]+)";s:\d+:"display_value";s:\d+:"([^"]+)";/g);
        let size = null;
        let color = null;

        if (matches) {
            matches.forEach(match => {
                const keyValueMatches = match.match(/"display_key";s:\d+:"([^"]+)";s:\d+:"display_value";s:\d+:"([^"]+)";/);
                if (keyValueMatches) {
                    const key = keyValueMatches[1];
                    const value = keyValueMatches[2].replace(/<[^>]*>/g, ""); // Remove HTML tags
                    if (key === "size") {
                        size = value;
                    } else if (key === "color") {
                        color = value;
                    }
                }
            });
        }

        if (size && color) {
            return `Size: ${size}, Color: ${color}`;
        } if (size) {
            return `Size:${size}`
        } if (color) {
            return `Color:${color}`
        } else {
            return "Variant data not available";
        }
    };

    // onchange quantity
    const handleQuantityMO = (index, event) => {
        console.log(index, event);
        manualPOorders[index].Quantity = event.target.value;
        console.log(manualPOorders, 'manualPOorders');
    }
    const handleQuantitySO = (index, event) => {
        console.log(index, event);
        scheduledPOorders[index].Quantity = event.target.value;
        console.log(scheduledPOorders, 'manualPOorders');
    }

    const handleChange = (event, value) => {
        setPage(value);
    };
    const handleChangeMO = (event, value) => {
        setPageMO(value);
    };
    const handleChangeSO = (event, value) => {
        setPageSO(value);
    };

    return (
        <Container
            fluid
            className="py-3"
            style={{ maxHeight: "100%", minHeight: "100vh" }}
        >
            <Box className="mb-4">
                <Typography variant="h4" className="fw-semibold">
                    Order Management System
                </Typography>
            </Box>
            <div className="card">
                <div className="card-body">
                    <ul className="nav nav-tabs nav-tabs-bordered d-flex" id="borderedTabJustified" role="tablist">
                        <li className="nav-item flex-fill" role="presentation">
                            <button className="nav-link w-100 active" id="home-tab" data-bs-toggle="tab" data-bs-target="#bordered-justified-home" type="button" role="tab" aria-controls="home" aria-selected="true" fdprocessedid="x9r6tp">Order against PO</button>
                        </li>
                        <li className="nav-item flex-fill" role="presentation">
                            <button className="nav-link w-100" id="profile-tab" data-bs-toggle="tab" data-bs-target="#bordered-justified-profile" type="button" role="tab" aria-controls="profile" aria-selected="false" tabindex="-1">Manual PO</button>
                        </li>
                        <li className="nav-item flex-fill" role="presentation">
                            <button className="nav-link w-100" id="contact-tab" data-bs-toggle="tab" data-bs-target="#bordered-justified-contact" type="button" role="tab" aria-controls="contact" aria-selected="false" tabindex="-1">Scheduled PO</button>
                        </li>
                    </ul>
                    <div className="tab-content pt-2" id="borderedTabJustifiedContent">
                        {/* order against PO Table */}
                        <div className="tab-pane fade active show" id="bordered-justified-home" role="tabpanel" aria-labelledby="home-tab">
                            <Row className="mb-4 mt-4">
                                <Form inline>
                                    <Row>
                                        <Col xs="auto" lg="4">
                                            <Form.Group>
                                                <Form.Label className="fw-semibold mb-0">
                                                    Date filter:
                                                </Form.Label>
                                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                    <DemoContainer components={["SingleInputDateRangeField"]}>
                                                        <DateRangePicker
                                                            sx={{
                                                                "& .MuiInputBase-root": {
                                                                    paddingRight: 0,
                                                                },
                                                                "& .MuiInputBase-input": {
                                                                    padding: ".5rem .75rem .5rem .75rem",
                                                                    "&:hover": {
                                                                        borderColor: "#dee2e6",
                                                                    },
                                                                },
                                                            }}
                                                            value={selectedDateRange}
                                                            onChange={handleDateChange}
                                                            slots={{ field: SingleInputDateRangeField }}
                                                        />
                                                    </DemoContainer>
                                                </LocalizationProvider>
                                            </Form.Group>
                                        </Col>
                                        <Col xs="auto" lg="4">
                                            <Form.Group className="fw-semibold mb-0">
                                                <Form.Label>Factory Filter:</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    className="mr-sm-2"
                                                    value={selectedFactory}
                                                    onChange={handleFactoryChange}
                                                >
                                                    <option value="">All Factory</option>
                                                    {factories.map((factory) => (
                                                        <option key={factory.id} value={factory.id}>
                                                            {factory.factory_name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Row>
                            {/* <Row className="mb-4 mt-4 ">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={handleSelectAll}
                                                    checked={selectedOrderIds.length === orders.length}
                                                />
                                            </th>
                                            <th>Product Name</th>
                                            <th>Variant</th>
                                            <th>Image</th>
                                            <th>Quantity</th>
                                            <th>Factory Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orders.map((order) => (
                                            <tr key={order.order_id}>
                                                <td>
                                                    <Form.Check
                                                        type="checkbox"
                                                        checked={selectedOrderIds.includes(order.product_name)}
                                                        onChange={() => handleOrderSelection(order.product_name)}
                                                    />
                                                </td>
                                                <td className="text-center">{order.product_name}</td>
                                                <td className="text-center">
                                                    {variant(order.variation_value)}
                                                </td>
                                                <td className="text-center">
                                                    <img
                                                        src={order.product_image}
                                                        alt={order.product_name}
                                                        className="img-fluid"
                                                        width={90}
                                                    />
                                                </td>
                                                <td className="text-center">{order.total_quantity}</td>
                                                <td className="text-center">
                                                    {
                                                        factories.find((factory) => factory.id === order.factory_id)
                                                            ?.factory_name
                                                    }
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Row> */}
                            <div className="mt-2">
                                <DataTable
                                    columns={columns1}
                                    rows={orders}
                                    page={page}
                                    pageSize={pageSize}
                                    totalPages={totalPages}
                                    rowHeight={100}
                                    handleChange={handleChange}
                                />
                            </div>
                            <Row className="mb-4 mt-4">
                                <Form inline>
                                    <Row className="mt-4">
                                        <Col xs="auto" lg="6" className="d-flex  align-items-end">
                                            <Button
                                                type="button"
                                                className="mr-2 mx-3 "
                                                onClick={handleSelectAll}
                                            >
                                                Select All Orders
                                            </Button>
                                            <Button
                                                type="button"
                                                className="mr-2 mx-3 "
                                                onClick={handleGeneratePO}
                                            >
                                                Create PO
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Row>

                        </div>

                        {/* manual PO Table */}
                        <div className="tab-pane fade" id="bordered-justified-profile" role="tabpanel" aria-labelledby="profile-tab">
                            <Row className="mb-4 mt-4">
                                <Form inline>
                                    <Row>
                                        <Col xs="auto" lg="4">
                                            <Form.Group className="fw-semibold mb-0">
                                                <Form.Label>Factory Filter:</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    className="mr-sm-2"
                                                    value={selectedManualFactory}
                                                    onChange={(e) => setSelectedManualFactory(e.target.value)}
                                                >
                                                    <option value="">All Factory</option>
                                                    {factories.map((factory) => (
                                                        <option key={factory.id} value={factory.id}>
                                                            {factory.factory_name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xs="auto" lg="4">
                                            <Form.Group className="fw-semibold mb-0">
                                                <Form.Label>Product Filter:</Form.Label>
                                                <Form.Control type="text" placeholder="Enter Product" value={manualProductF} onChange={(e) => setManualProductF(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Row>
                            <Row className="mb-4 mt-4 ">
                                {/* <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={handleSelectAllManual}
                                                    checked={selectedManualOrderIds.length === manualPOorders.length}
                                                />
                                            </th>
                                            <th>Factory Name</th>
                                            <th>Product Name</th>
                                            <th>Product Image</th>
                                            <th>Product Variant</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {manualPOorders && manualPOorders?.length > 0 ? (
                                            manualPOorders.map((order, rowIndex) => (
                                                <tr key={order.product_id}>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={selectedManualOrderIds.includes(order.product_id)}
                                                            onChange={() => handleOrderManualSelection(order.product_id)}
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        {factories.find((factory) => factory.id === order.factory_id)?.factory_name}
                                                    </td>
                                                    <td className="text-center">{order.product_name}</td>
                                                    <td className="text-center">
                                                        <img src={order.product_image} alt={order.product_name} className="img-fluid" width={90} />
                                                    </td>
                                                    <td className="text-center">
                                                        {order.variation_values}
                                                    </td>
                                                    <td className="text-center">
                                                        <Form.Group className="mb-3" controlId="quantity">
                                                            <Form.Control type="text" placeholder="Enter Quantity" onChange={(event) => handleQuantityMO(rowIndex, event)} />
                                                        </Form.Group>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">No products found</td>
                                            </tr>
                                        )}

                                    </tbody>
                                </Table> */}
                                <div className="mt-2">
                                    <DataTable
                                        columns={columnsMPO}
                                        rows={manualPOorders}
                                        page={pageMO}
                                        pageSize={pageSizeMO}
                                        totalPages={totalPagesMO}
                                        handleChange={handleChangeMO}
                                        rowHeight={100}
                                        // onCellEditStart={handleCellEditStart}
                                        // processRowUpdate={processRowUpdate}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Add Note</Form.Label>
                                    <Form.Control as="textarea" rows={2} onChange={(e) => setManualNote(e.target.value)} />
                                </Form.Group>
                            </Row>
                            <Row className="mb-4 mt-4">
                                <Form inline>
                                    <Row className="mt-4">
                                        <Col xs="auto" lg="6" className="d-flex  align-items-end">
                                            <Button
                                                type="button"
                                                className="mr-2 mx-3 "
                                                onClick={handleSelectAllManual}
                                            >
                                                Select All Orders
                                            </Button>
                                            <Button
                                                type="button"
                                                className="mr-2 mx-3 "
                                                onClick={handleGenerateManualPO}
                                            >
                                                Create Manual PO
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Row>
                        </div>
                        {/* scheduled PO Table */}
                        <div className="tab-pane fade" id="bordered-justified-contact" role="tabpanel" aria-labelledby="contact-tab">
                            <Row className="mb-4 mt-4">
                                <Form inline>
                                    <Row>
                                        <Col xs="auto" lg="4">
                                            <Form.Group className="fw-semibold mb-0">
                                                <Form.Label>Factory Filter:</Form.Label>
                                                <Form.Control
                                                    as="select"
                                                    className="mr-sm-2"
                                                    value={selectedShedulFactory}
                                                    onChange={(e) => setSelectedSheduleFactory(e.target.value)}
                                                >
                                                    <option value="">All Factory</option>
                                                    {factories.map((factory) => (
                                                        <option key={factory.id} value={factory.id}>
                                                            {factory.factory_name}
                                                        </option>
                                                    ))}
                                                </Form.Control>
                                            </Form.Group>
                                        </Col>
                                        <Col xs="auto" lg="4">
                                            <Form.Group className="fw-semibold mb-0">
                                                <Form.Label>Product Filter:</Form.Label>
                                                <Form.Control type="text" placeholder="Enter Product" value={scheduledProductF} onChange={(e) => setScheduledProductF(e.target.value)} />
                                            </Form.Group>
                                        </Col>
                                    </Row>
                                </Form>
                            </Row>
                            <Row className="mb-4 mt-4 ">
                                {/* <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>
                                                <Form.Check
                                                    type="checkbox"
                                                    onChange={handleSelectAllSchedule}
                                                    checked={selectedScheduleOrderIds.length === scheduledPOorders.length}
                                                />
                                            </th>
                                            <th>Factory Name</th>
                                            <th>Product Name</th>
                                            <th>Product Image</th>
                                            <th>Product Variant</th>
                                            <th>Quantity</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {scheduledPOorders && scheduledPOorders?.length > 0 ? (
                                            scheduledPOorders?.map((order, rowIndex) => (
                                                <tr key={order.product_id}>
                                                    <td>
                                                        <Form.Check
                                                            type="checkbox"
                                                            checked={selectedScheduleOrderIds.includes(order.product_id)}
                                                            onChange={() => handleOrderScheduleSelection(order.product_id)}
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        {
                                                            factories.find((factory) => factory.id === order.factory_id)
                                                                ?.factory_name
                                                        }
                                                    </td>
                                                    <td className="text-center">{order.product_name}</td>
                                                    <td className="text-center">
                                                        <img
                                                            src={order.product_image}
                                                            alt={order.product_name}
                                                            className="img-fluid"
                                                            width={90}
                                                        />
                                                    </td>
                                                    <td className="text-center">
                                                        {order.variation_id}
                                                    </td>
                                                    <td className="text-center">
                                                        <Form.Group className="mb-3" controlId="quantity">
                                                            <Form.Control type="text" placeholder="Enter Quantity" onChange={(event) => handleQuantitySO(rowIndex, event)} />
                                                        </Form.Group>
                                                    </td>

                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="6" className="text-center">No products found</td>
                                            </tr>
                                        )

                                        }
                                    </tbody>
                                </Table> */}
                                <div className="mt-2">
                                    <DataTable
                                        columns={columnsSPO}
                                        rows={scheduledPOorders}
                                        page={pageSO}
                                        pageSize={pageSizeSO}
                                        totalPages={totalPagesSO}
                                        rowHeight={100}
                                        handleChange={handleChangeSO}
                                        // onCellEditStart={handleCellEditStart}
                                        // processRowUpdate={processRowUpdateSPO}
                                    />
                                </div>
                            </Row>
                            <Row>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label>Add Note</Form.Label>
                                    <Form.Control as="textarea" rows={2} onChange={(e) => setScheduledNote(e.target.value)} />
                                </Form.Group>
                            </Row>
                            <Row>
                                <Col xs="auto" lg="4">
                                    <Form.Group controlId="duedate">
                                        <Form.Label>Estimated time</Form.Label>
                                        <Form.Control
                                            as="select"
                                            className="mr-sm-2"
                                            value={estimatedTime}
                                            onChange={(e) => setEstimatedTime(e.target.value)}
                                        >
                                            <option value="">select time</option>
                                            {EstimatedTime.map((time) => (
                                                <option key={time} value={time}>
                                                    {time}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                                <Col xs="auto" lg="4">
                                    <Form.Group controlId="duedate">
                                        <Form.Label>Remainder date</Form.Label>
                                        <Form.Control type="date" name="duedate" placeholder="Due date" onChange={(e) => setRemainderDate(e.target.value)} />
                                    </Form.Group>
                                </Col>

                            </Row>
                            <Row className="mb-4 mt-4">
                                <Form inline>
                                    <Row className="mt-4">
                                        <Col xs="auto" lg="6" className="d-flex  align-items-end">
                                            <Button
                                                type="button"
                                                className="mr-2 mx-3 "
                                                onClick={handleSelectAllSchedule}
                                            >
                                                Select All Orders
                                            </Button>
                                            <Button
                                                type="button"
                                                className="mr-2 mx-3 "
                                                onClick={handleGenerateScheduledPO}
                                            >
                                                Create Scheduled PO
                                            </Button>
                                        </Col>
                                    </Row>
                                </Form>
                            </Row>

                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}

export default OrderManagementSystem;
