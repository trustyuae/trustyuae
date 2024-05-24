import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { Box, Typography } from "@mui/material";
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

function OrderSystem() {
  const [dispatchType, setDispatchType] = useState("all");
  const [orders, setOrders] = useState([]);
  const [searchOrderID, setSearchOrderID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isReset, setIsReset] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const loader = useSelector((state) => state?.orderSystemData?.isOrders);

  const dispatch = useDispatch();

  async function fetchOrders() {
    let apiUrl = `${API_URL}wp-json/custom-orders-new/v1/orders/?`;
    if (searchOrderID) apiUrl += `&orderid=${searchOrderID}`;
    if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
    await dispatch(
      OrderSystemGet({
        apiUrl: `${apiUrl}&page=${page}&per_page=${pageSize}&status=${dispatchType}`,
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

  const handleReset = () => {
    setSearchOrderID("");
    setStartDate("");
    setEndDate("");
    setSelectedDateRange([null, null]);
    setTotalPages(1);
    if (isReset) {
      setIsReset(false);
    } else {
      setIsReset(true);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  const columns = [
    { field: "date", headerName: "Date", className: "order-system", flex: 1 },
    {
      field: "order_id",
      headerName: "Order ID",
      className: "order-system",
      flex: 1,
    },
    {
      field: "customer_name",
      headerName: "Customer Name",
      className: "order-system",
      flex: 1,
    },
    {
      field: "shipping_country",
      headerName: "Shipping Country",
      type: "string",
      className: "order-system",
      flex: 1,
      valueGetter: (value, row) => getCountryName(row.shipping_country),
    },
    {
      field: "order_status",
      headerName: "Order Status",
      flex: 1,
      className: "order-system",
      type: "string",
    },
    {
      field: "view_item",
      headerName: "View Item",
      flex: 1,
      className: "order-system",
      type: "html",
      renderCell: (value, row) => {
        console.log(value,'value from order systemmmmmm.........')
        return (
          <Link to={`/order_details/${value?.row?.order_id}`}>
            <Button
              type="button"
              className="w-auto w-auto bg-transparent border-0 text-secondary fs-5"
            >
              <FaEye className="mb-1" />
            </Button>
            <Typography
              variant="label"
              className="fw-semibold text-secondary"
              sx={{
                fontSize: 14,
                textTransform: "capitalize",
              }}
            >
              {/* {"  "} */}
              <Badge bg="success" className="m-2">
                {value?.row?.order_process == "started"
                  ? value?.row?.order_process
                  : null}
              </Badge>
            </Typography>
          </Link>
        );
      },
    },
  ];

  const handleChange = (event, value) => {
    setPage(value);
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1);
    return `${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
      .getDate()
      .toString()
      .padStart(2, "0")}/${date.getFullYear()}`;
  };

  const handleSearchFilter = () => {
    setPage(1);
    fetchOrders();
  };

  const searchDispatchTypeFilter = (e) => {
    setDispatchType(e);
    setPage(1);
  };

  useEffect(() => {
    fetchOrders();
  }, [pageSize, page, dispatchType, isReset]);

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          Order Fulfillment System
        </Typography>
      </Box>
      <Row className="mb-4 mt-4">
        <Form inline>
          <Row className="mb-4 align-items-center">
            <Col xs="auto" lg="4">
              <Form.Group>
                <Form.Label className="fw-semibold">Order Id:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Order ID"
                  value={searchOrderID}
                  onChange={(e) => setSearchOrderID(e.target.value)}
                  className="mr-sm-2 py-2"
                />
              </Form.Group>
            </Col>
            <Col xs="auto" lg="4">
              <Form.Group>
                <Form.Label className="fw-semibold mb-0">
                  Date filter:
                </Form.Label>
                {/* <Form.Control
                                    type="date"
                                    value={startDate}
                                    onChange={e => setStartDate(e.target.value)}
                                    className="mr-sm-2 py-2"
                                /> */}
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
              <Form.Group>
                <Form.Label className="fw-semibold">Dispatch type:</Form.Label>
                <Form.Select
                  className="mr-sm-2 py-2"
                  onChange={(e) => searchDispatchTypeFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="dispatch">Dispatch</option>
                  <option value="reserve">Reserve</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
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
            <Button
              type="button"
              className="mr-2 mx-1 w-auto"
              onClick={handleSearchFilter}
            >
              Search
            </Button>
            <Button
              type="button"
              className="mr-2 mx-1 w-auto"
              onClick={handleReset}
            >
              Reset filter
            </Button>
          </Box>
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
    </Container>
  );
}

export default OrderSystem;
