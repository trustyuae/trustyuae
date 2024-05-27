import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import DataTable from "../DataTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { Badge } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { API_URL } from "../../redux/constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import { OrderSystemGet } from "../../redux/actions/OrderSystemActions";
import { getCountryName } from "../../utils/GetCountryName";
import Loader from "../../utils/Loader";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import { MDBRow } from "mdb-react-ui-kit";

function ExchangeAndReturn() {

    const [orders, setOrders] = useState([]);
    const [pageSize, setPageSize] = useState(10);
    const pageSizeOptions = [5, 10, 20, 50, 100];
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [selectedFactory, setSelectedFactory] = useState("");
    const [factories, setFactories] = useState([]);

    const loader = useSelector((state) => state?.orderSystemData?.isOrders);
    const dispatch = useDispatch();

    async function fetchOrders() {
        let apiUrl = `${API_URL}wp-json/custom-orders-new/v1/orders/?`;
        await dispatch(
            OrderSystemGet({
                apiUrl: `${apiUrl}&page=${page}&per_page=${pageSize}`,
            })
        )
            .then((response) => {
                let data = response.data.orders.map((v, i) => ({ ...v, id: i }));
                setOrders(data);
                setTotalPages(response.data.total_pages);
            })
            .catch((error) => {
                console.error(error);
            });
    }
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
            field: "date", headerName: "Product Name",
            // className: "order-system", 
            flex: 1
        },
        {
            field: "order_id",
            headerName: "Image",
            // className: "order-system",
            flex: 1,
        },
        {
            field: "customer_name",
            headerName: "Qty Ordered",
            // className: "order-system",
            flex: 1,
        },
        {
            field: "shipping_country",
            headerName: "Return Qty",
            type: "string",
            // className: "order-system",
            flex: 1,
            // valueGetter: (value, row) => getCountryName(row.shipping_country),
            renderCell: (params) => {
                return (
                    <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
                        <Form.Control
                            style={{ justifyContent: "center" }}
                            type="number"
                            value={params.row.available_quantity}
                            placeholder="0"
                            onChange={(e) => handleAvailableQtyChange(e, params.row)}
                        />
                    </Form.Group>
                );
            },
        },
        {
            field: "order_status",
            headerName: "Return Type",
            flex: 1,
            // className: "order-system",
            // type: "string",
            renderCell: (params) => {
                return (
                    <Select
                        labelId={`customer-status-${params.row.id}-label`}
                        id={`customer-status-${params.row.id}`}
                        value={params.row.availability_status}
                        onChange={(event) => handleStatusChange(event, params.row)}
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
            field: "view_item",
            headerName: "Expected Delivery Date",
            flex: 1,
            // className: "order-system",
            type: "html",
            renderCell: (value, row) => {
                return (
                    <input type="date" style={{ height: "70%", width: "100%" }} />
                );
            },
        },
    ];
    const handleAvailableQtyChange = (index, event) => {
        // const updatedData = PO_OrderList.map((item) => {
        //   if (item.product_id === event.product_id) {
        //     return { ...item, available_quantity: index.target.value };
        //   }
        //   return item;
        // });
        // setPO_OrderList(updatedData);
    };

    const handleStatusChange = (index, event) => {
        // const updatedData = PO_OrderList.map((item) => {
        //   if (item.product_id === event.product_id) {
        //     return { ...item, availability_status: index.target.value };
        //   }
        //   return item;
        // });
        // setPO_OrderList(updatedData);
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

    useEffect(() => {
        fetchOrders();
    }, [pageSize, page]);

    const selectPOType = (e) => {

    };

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
                        <Col xs="auto" lg="4">
                            <Form.Group>
                                <Form.Label className="fw-semibold">PO type:</Form.Label>
                                <Form.Select
                                    className="mr-sm-2 py-2"
                                    onChange={(e) => selectPOType(e.target.value)}
                                >
                                    <option value="all">All</option>
                                    <option value="dispatch">Order Against PO</option>
                                    <option value="reserve">Manual PO</option>
                                    <option value="reserve">Scheduled PO</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="4">
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
                <div className="mt-2">
                    <DataTable
                        columns={columns}
                        rows={orders}
                        page={page}
                        pageSize={pageSize}
                        totalPages={totalPages}
                        handleChange={handleChange}
                    />
                </div>
            )}
            <MDBRow className='justify-content-end px-3'>
                <Button variant="primary"  style={{ width: '100px' }} >
                    submit
                </Button>
            </MDBRow>
        </Container>
    );
}
export default ExchangeAndReturn;
