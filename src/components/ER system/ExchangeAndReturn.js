import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { Avatar, Box, Checkbox, FormControlLabel, FormGroup, MenuItem, Select, Typography } from "@mui/material";
import DataTable from "../DataTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Badge, Card, Modal } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { API_URL } from "../../redux/constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import { OrderSystemGet } from "../../redux/actions/OrderSystemActions";
import { getCountryName } from "../../utils/GetCountryName";
import Loader from "../../utils/Loader";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import { MDBRow } from "mdb-react-ui-kit";
import axios from "axios";

function ExchangeAndReturn() {

    const [orders, setOrders] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const pageSizeOptions = [5, 10, 20, 50, 100];
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFactory, setSelectedFactory] = useState("");
    const [selectedPOType, setSelectedPOType] = useState("");
    const [factories, setFactories] = useState([]);
    const [allPoTypes, setAllPoTypes] = useState([]);
    const [selectedOrderIds, setSelectedOrderIds] = useState([]);
    const [selectPOId, setSelectPOId] = useState('');
    const [imageURL, setImageURL] = useState("");
    const [showEditModal, setShowEditModal] = useState(false);

    const loader = useSelector((state) => state?.orderSystemData?.isOrders);
    const dispatch = useDispatch();

    const handlePageSizeChange = (e) => {
        setPageSize(parseInt(e.target.value));
        setPage(1);
    };
    const ReturnType = [
        "Exchange",
        "Return ",
    ];
    const columns = [
        {
            field: "product_name", headerName: "Product Name",
            flex: 1
        },
        {
            field: "image",
            headerName: "Image",
            flex: 1,
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
            field: "quantity",
            headerName: "Qty Ordered",
            flex: 1,
        },
        {
            field: "return_qty",
            headerName: "Return Qty",
            type: "string",
            flex: 1,
            renderCell: (params) => {
                const isDisabled = !selectedOrderIds.includes(params.row.id);
                return (
                    <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
                        <Form.Control
                            style={{ justifyContent: "center" }}
                            type="number"
                            value={params.row.return_qty}
                            placeholder="0"
                            disabled={isDisabled}
                            onChange={(e) => handleAvailableQtyChange(e, params.row)}
                        />
                    </Form.Group>
                );
            },
        },
        {
            field: "return_type",
            headerName: "Return Type",
            flex: 1,
            renderCell: (params) => {
                const isDisabled = !selectedOrderIds.includes(params.row.id);

                return (
                    <Select
                        labelId={`customer-status-${params.row.id}-label`}
                        id={`customer-status-${params.row.id}`}
                        value={params.row.return_type}
                        onChange={(event) => handleStatusChange(event, params.row)}
                        disabled={isDisabled}
                        fullWidth
                        style={{ height: "70%", width: "100%" }}
                    >
                        {ReturnType.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status}
                            </MenuItem>
                        ))}
                    </Select>
                );
            },
        },
        {
            field: "expected_delivery_date",
            headerName: "Expected Delivery Date",
            flex: 1,
            type: "html",
            renderCell: (params) => {
                const isDisabled = !selectedOrderIds.includes(params.row.id);
                return (
                    <input type="date" value={params.row.expected_delivery_date} disabled={isDisabled} onChange={(event) => handleDateChange(event, params.row)} style={{ height: "70%", width: "100%" }} />
                );
            },
        },
        {
            field: "select",
            headerName: "Select",
            flex: 1,
            renderCell: (params) => {
                return (
                    <FormGroup>
                        <FormControlLabel
                            className="mx-auto"
                            control={<Checkbox />}
                            style={{ justifyContent: "center" }}
                            checked={selectedOrderIds.includes(params.row.id)}
                            onChange={(event) =>
                                handleOrderManualSelection(params.row.id)
                            }
                        />
                    </FormGroup>
                );
            },
        }
    ];

    const handleOrderManualSelection = (orderId) => {
        const selectedIndex = selectedOrderIds.indexOf(orderId);
        let newSelected = [];

        if (selectedIndex === -1) {
            newSelected = [...selectedOrderIds, orderId];
        } else {
            newSelected = selectedOrderIds.filter((id) => id !== orderId);
        }

        setSelectedOrderIds(newSelected);
    };


    const handleDateChange = (index, event) => {
        console.log(index, event, '======');
        console.log(index.target.value, '======');
        const updatedData = orders.map((item) => {
            if (item.id === event.id) {
                return { ...item, expected_delivery_date: index.target.value };
            }
            return item;
        });
        console.log(updatedData, 'updatedData');
        setOrders(updatedData);

    }
    const handleAvailableQtyChange = (index, event) => {
        console.log(index, event, '======');
        const updatedData = orders.map((item) => {
            if (item.id === event.id) {
                return { ...item, return_qty: index.target.value };
            }
            return item;
        });
        console.log(updatedData, 'updatedData');
        setOrders(updatedData);
    };

    const handleStatusChange = (index, event) => {
        const updatedData = orders.map((item) => {
            if (item.id === event.id) {
                return { ...item, return_type: index.target.value };
            }
            return item;
        });
        setOrders(updatedData);
    };

    const handleChange = (event, value) => {
        setPage(value);
    };
    // ======
    const handleFactoryChange = (e) => {
        setSelectedFactory(e.target.value);
    };
    const allFactoryDatas = useSelector(
        (state) => state?.allFactoryData?.factory
    );
    useEffect(() => {
        dispatch(AllFactoryActions());
        setFactories(allFactoryDatas);
    }, [dispatch, allFactoryDatas]);

    // useEffect(() => {
    //     fetchOrders();
    // }, [pageSize, page]);

    const selectPOType = async () => {
        try {
            const response = await axios.get(`${API_URL}wp-json/custom-er-api/v1/fetch-products-po/`, {
                params: {
                    factory_id: selectedFactory,
                    po_type: selectedPOType
                }
            })
            console.log(response.data, 'response');
            setAllPoTypes(response.data)
            selectPO(response.data[0])
            if (response.data.length === 0) {
                setOrders([])
            }
        } catch (error) {
            console.error(error);
        }

    };

    const selectPO = async (id) => {
        console.log(id, 'e');
        try {
            setSelectPOId(id)
            const response = await axios.get(`${API_URL}wp-json/custom-er-po/v1/fetch-orders-po/${id}`)
            console.log(response, 'response');
            let data = response.data.map((v, i) => ({ ...v, id: i }));
            console.log(data, 'data');
            setOrders(data);
        } catch (error) {
            console.error(error);
        }
    }

    const submit = async () => {
        console.log(selectedOrderIds, 'selectedOrderIds');
        const selectedOrders = orders.filter((order) =>
            selectedOrderIds.includes(order.id)
        );
        console.log(selectedOrders.map(d => d.return_type));
        const payload = {
            "factory_id": Number(selectedFactory),
            "po_id": selectPOId,
            "product_id": selectedOrders.map(d => d.product_id),
            "return_qty": selectedOrders.map(d => d.return_qty),
            "return_type": selectedOrders.map(d => d.return_type),
            "expected_date": selectedOrders.map(d => d.expected_delivery_date)
        }
        console.log(payload, 'payload');
        try {
            const response = await axios.post(`${API_URL}wp-json/custom-er-generate/v1/create-er/`, payload)
            console.log(response, 'response');
        } catch (error) {
            console.error(error);
        }

        console.log(payload, 'payload');
    }

    const ImageModule = (url) => {
        setImageURL(url);
        setShowEditModal(true);
    };


    useEffect(() => {
        if (selectedPOType) {
            selectPOType()
        }
    }, [selectedPOType, selectedFactory])

    return (
        <Container fluid className="py-3" >
            <Box className="mb-4">
                <Typography variant="h4" className="fw-semibold">
                    Exchange and Return
                </Typography>
            </Box>
            <Row className="mb-4 mt-4">
                <Form inline>
                    <Row className="mb-4 align-items-center">
                        <Col xs="auto" lg="4">
                            <Form.Group className="fw-semibold mb-0">
                                <Form.Label>Factory Filter:</Form.Label>
                                <Form.Select

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
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="4">
                            <Form.Group>
                                <Form.Label className="fw-semibold">PO type:</Form.Label>
                                <Form.Select
                                    className="mr-sm-2 py-2"
                                    value={selectedPOType}
                                    onChange={(e) => setSelectedPOType(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    <option value="General PO">General PO</option>
                                    <option value="Manual PO">Manual PO</option>
                                    <option value="Schedule PO">Scheduled PO</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="4">
                            <Form.Group>
                                <Form.Label className="fw-semibold">Select PO:</Form.Label>
                                <Form.Select
                                    className="mr-sm-2 py-2"
                                    disabled={!allPoTypes || allPoTypes.length === 0}
                                    // value={selectedPOType}
                                    onChange={(e) => selectPO(e.target.value)}
                                >
                                    {allPoTypes?.map((po) => (
                                        <option key={po} value={po}>
                                            {po}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>

                    </Row>
                    <Row>
                        <Col xs="auto" lg="12">
                            <Box className="d-flex justify-content-end">
                                <Form.Group className="d-flex mx-1 align-items-center">
                                    <Form.Label className="fw-semibold mb-0 me-2">
                                        Page Size:
                                    </Form.Label>
                                    <Form.Control
                                        as="select"
                                        className="w-auto"
                                        value={pageSize}
                                        onChange={handlePageSizeChange}
                                    >
                                        {pageSizeOptions.map((size) => (
                                            <option key={size} value={size}>
                                                {size}
                                            </option>
                                        ))}
                                    </Form.Control>
                                </Form.Group>
                            </Box>
                        </Col>
                    </Row>
                </Form>
            </Row>
            {loader ? (
                <Loader />
            ) : (
                orders.length !== 0 ? (
                    <div className="mt-2">
                        <DataTable
                            columns={columns}
                            rows={orders}
                        // page={page}
                        // pageSize={pageSize}
                        // totalPages={totalPages}
                        // handleChange={handleChange}
                        />
                    </div>
                ) : (
                    <div>No orders available</div>
                )
            )}
            <MDBRow className='justify-content-end px-3'>
                <Button variant="primary" style={{ width: '100px' }} disabled={selectedOrderIds.length === 0} onClick={submit}>
                    submit
                </Button>
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
                        <img
                            src={imageURL || `${require("../../assets/default.png")}`}
                            alt="Product"
                        />
                    </Card>
                </Modal.Body>
            </Modal>
        </Container>
    );
}
export default ExchangeAndReturn;
