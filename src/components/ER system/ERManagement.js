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
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import dayjs from "dayjs";

function ERManagement() {
  const dispatch = useDispatch();
  const [dueDate, setDueDate] = useState("all");
  const [dispatchType, setDispatchType] = useState("all");
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState("");
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

  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );

  useEffect(() => {
    dispatch(AllFactoryActions());
    setFactories(allFactoryDatas);
  }, [dispatch, allFactoryDatas]);


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

  const handleFactoryChange = (e) => {
    setSelectedFactory(e.target.value);
  };

  const columns = [
    { field: "date", headerName: "ER No.", className: "order-system", flex: 1 },
    {
      field: "order_id",
      headerName: "Total Qty",
      className: "order-system",
      flex: 1,
    },
    {
      field: "customer_name",
      headerName: "Status",
      className: "order-system",
      flex: 1,
    },
    {
      field: "shipping_country",
      headerName: "Received Status",
      type: "string",
      className: "order-system",
      flex: 1,
      valueGetter: (value, row) => getCountryName(row.shipping_country),
    },
    {
      field: "view_item",
      headerName: "Action",
      flex: 0.5,
      className: "order-system",
      type: "html",
      renderCell: (value, row) => {
        return (
          <Link to={`/ER_details`} className=" d-flex justify-content-center">
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
    return dayjs(dateString).add(1, 'day').format('MM/DD/YYYY');
  };

  const handleSearchFilter = () => {
    setPage(1);
    fetchOrders();
  };

  const searchDueByFilter = (e) => {
    setDispatchType(e);
    setPage(1);
  };

  useEffect(() => {
    fetchOrders();
  }, [pageSize, page, dueDate, isReset]);

  return (
    <Container fluid className="py-3" >
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          ER Management
        </Typography>
      </Box>
      <Row className="mb-4 mt-4">
        <Form inline>
          <Row className="mb-4 align-items-center">
            <Col xs="auto" lg="3">
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
            <Col xs="auto" lg="3">
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
            <Col xs="auto" lg="3">
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
            <Col xs="auto" lg="3">
              <Form.Group>
                <Form.Label className="fw-semibold">Due by Filter:</Form.Label>
                <Form.Select
                  className="mr-sm-2 py-2"
                  onChange={(e) => searchDueByFilter(e.target.value)}
                >
                  <option value="all">Today</option>
                  <option value="dispatch">Tommorrow</option>
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

export default ERManagement;
