import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { Alert, Box, Typography } from "@mui/material";
import DataTable from "../DataTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getCountryName } from "../../utils/GetCountryName";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import { MissingOrderSystemGet } from "../../Redux2/slices/OrderSystemSlice";

function MissingOrderSystem() {
  const inputRef = useRef(null);
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
  const [overAllData, setOverAllData] = useState({
    total_count: 0,
    total_dispatch_orders: 0,
    total_reserve_orders: 0,
  });
  const loader = useSelector((state) => state?.orderSystemData?.isOrders);

  const dispatch = useDispatch();

  async function fetchOrders() {
    let apiUrl = `wp-json/custom-missing-orders/v1/missing-orders/?`;
    if (searchOrderID) apiUrl += `&orderid=${searchOrderID}`;
    if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
    await dispatch(
      MissingOrderSystemGet({
        apiUrl: `${apiUrl}&page=${page}&per_page=${pageSize}&status=${dispatchType}`,
      })
    )
      .then(({ payload }) => {
        let data = payload.orders.map((v, i) => ({ ...v, id: i }));
        setOrders(data);
        setOverAllData({
          total_count: payload.total_count,
          total_dispatch_orders: payload.total_dispatch_orders,
          total_reserve_orders: payload.total_reserve_orders,
        });
        setTotalPages(payload.total_pages);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleReset = () => {
    inputRef.current.value = "";
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
        return (
          <Link
            to={`/missing_order_details/${value?.row?.order_id}`}
            className=" d-flex "
          >
            <Button
              type="button"
              className="w-auto w-auto bg-transparent border-0 text-secondary fs-5"
            >
              <FaEye className="mb-1" />
            </Button>
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
      const isoStartDate = dayjs(newDateRange[0].$d.toDateString()).format(
        "YYYY-MM-DD"
      );
      const isoEndDate = dayjs(newDateRange[1].$d.toDateString()).format(
        "YYYY-MM-DD"
      );
      setStartDate(isoStartDate);
      setEndDate(isoEndDate);
    } else {
      console.error("Invalid date range");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchOrderID(inputRef.current.value);
    }
  };

  const handleSearchFilter = (e) => {
    setSearchOrderID(inputRef.current.value);
    setPage(1);
    fetchOrders();
  };

  const searchDispatchTypeFilter = (e) => {
    setDispatchType(e);
    setPage(1);
  };

  const clearDateRange = () => {
    setSelectedDateRange([null, null]);
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, searchOrderID, page, dispatchType, isReset, setSearchOrderID]);

  return (
    <Container fluid className="py-3">
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          Missing Order System
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
                  ref={inputRef}
                  // value={searchOrderID}
                  onKeyDown={handleKeyDown}
                  className="mr-sm-2 py-2"
                />
              </Form.Group>
            </Col>
            <Col xs="auto" lg="4">
              <Form.Group style={{ position: "relative" }}>
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
                {selectedDateRange[0] && selectedDateRange[1] && (
                  <CancelIcon
                    style={{ position: "absolute", right: "0", top: "39px" }}
                    onClick={clearDateRange}
                  />
                )}
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
          <Box className="d-flex justify-content-between">
            <Box className="d-flex">
              <Form.Group className="d-flex mx-1 align-items-center">
                <Form.Label className="fw-semibold mb-0 me-2">
                  Total Orders:
                </Form.Label>
                <Form.Control
                  as="input"
                  type="number"
                  className="color-black"
                  style={{ width: "100px", textAlign: "center" }} // Add a custom width style here
                  value={overAllData.total_count}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="d-flex mx-1 align-items-center">
                <Form.Label className="fw-semibold mb-0 me-2">
                  Dispatch Orders:
                </Form.Label>
                <Form.Control
                  as="input"
                  type="number"
                  className="color-black"
                  style={{ width: "100px", textAlign: "center" }} // Add a custom width style here
                  value={overAllData.total_dispatch_orders}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="d-flex mx-1 align-items-center">
                <Form.Label className="fw-semibold mb-0 me-2">
                  Reserve Orders:
                </Form.Label>
                <Form.Control
                  as="input"
                  type="number"
                  className="color-black"
                  style={{ width: "100px", textAlign: "center" }} // Add a custom width style here
                  value={overAllData.total_reserve_orders}
                  readOnly
                />
              </Form.Group>
            </Box>
            <Box className="d-flex">
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
          </Box>
        </Form>
      </Row>
      {loader ? (
        <Loader />
      ) : (
        <>
          {orders && orders.length !== 0 ? (
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
          ) : (
            <Alert
              severity="warning"
              sx={{ fontFamily: "monospace", fontSize: "18px" }}
            >
              Records is not Available for above filter
            </Alert>
          )}
        </>
      )}
    </Container>
  );
}

export default MissingOrderSystem;
