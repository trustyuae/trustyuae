import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { Alert, Box, TextField, Typography } from "@mui/material";
import DataTable from "../DataTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { FaEye } from "react-icons/fa";
import { API_URL } from "../../redux/constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/Loader";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers-pro";
import { GetErManagementData } from "../../redux/actions/ErManagementActions";

function ERManagement() {
  const dispatch = useDispatch();
  const [dueDate, setDueDate] = useState("");
  const [selectedDueType, setSelectedDueType] = useState("");
  const [erDate, setErDate] = useState(dayjs());
  const [selectedDate, setSelectedDate] = useState("");
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState("");
  const [orders, setOrders] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const loader = useSelector(
    (state) => state?.exchange_And_return_Data?.isErmanagementData
  );
  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );

  useEffect(() => {
    dispatch(AllFactoryActions());
  }, [dispatch]);

  useEffect(() => {
    setFactories(allFactoryDatas);
  }, [allFactoryDatas]);

  async function fetchOrders() {
    let apiUrl = `${API_URL}wp-json/custom-er-fetch/v1/fetch-all-er/?per_page=${pageSize}&page=${page}`;
    if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
    if (dueDate) apiUrl += `&due_date=${dueDate}`;
    if (selectedDate) apiUrl += `&date=${selectedDate}`;
    await dispatch(GetErManagementData({ apiUrl }))
      .then((response) => {
        console.log(response, "response");
        let data = response.data.er_details.map((v, i) => ({ ...v, id: i }));
        setOrders(data);
        setTotalPages(response.data.total_pages);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleReset = () => {
    setSelectedDate("");
    setSelectedDueType("");
    setSelectedFactory("");
    setDueDate("");
    // setErDate("");
    setTotalPages(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(e.target.value);
  };

  const handleFactoryChange = (e) => {
    setSelectedFactory(e.target.value);
  };

  const columns = [
    {
      field: "er_no",
      headerName: "ER No.",
      className: "order-system",
      flex: 1,
    },
    {
      field: "er_total_qty",
      headerName: "Total Qty",
      className: "order-system",
      flex: 1,
    },
    {
      field: "er_status",
      headerName: "Status",
      className: "order-system",
      flex: 1,
    },
    {
      field: "received_qty",
      headerName: "Received Status",
      type: "string",
      className: "order-system",
      flex: 1,
      valueGetter: (value, row) => {
        return `${row.received_qty} / ${row.returned_qty}`;
      },
    },
    {
      field: "view_item",
      headerName: "Action",
      flex: 0.5,
      className: "order-system",
      type: "html",
      renderCell: (value, row) => {
        console.log(value, "row from button");
        return (
          <Link
            to={`/ER_details/${value.row.er_no}`}
            className=" d-flex justify-content-center"
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
    setDueDate("");
    if (newDateRange?.$d) {
      console.log(dayjs(newDateRange.$d.toDateString()).format("YYYY-MM-DD"));
      const isoDate = dayjs(newDateRange.$d.toDateString()).format(
        "YYYY-MM-DD"
      );
      console.log(isoDate, "isodate");
      setSelectedDate(isoDate);
      setErDate(isoDate);
    } else {
      console.error("Invalid date range");
    }
  };

  const handleSearchFilter = () => {
    setPage(1);
    fetchOrders();
  };

  const searchDueByFilter = (value) => {
    setSelectedDate("");
    setSelectedDueType(value);
    value === "today"
      ? setDueDate(dayjs().format("YYYY-MM-DD"))
      : setDueDate(dayjs().add(1, "day").format("YYYY-MM-DD"));
    setPage(1);
  };

  useEffect(() => {
    fetchOrders();
  }, [pageSize, page, dueDate, selectedFactory, selectedDate]);
  return (
    <Container fluid className="py-3">
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          ER Management
        </Typography>
      </Box>
      <Row className="mb-4 mt-4">
        <Form inline>
          <Row className="mb-4 align-items-center">
            <Col xs="auto" lg="4">
              <Form.Group className="fw-semibold mb-0">
                <Form.Label>Date filter:</Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    value={erDate}
                    format="YYYY-MM-DD"
                    onChange={(e) => handleDateChange(e)}
                    sx={{
                      display: "block",
                      verticalAlign: "unset",
                      "& .MuiInputBase-input": {
                        padding: ".5rem .75rem .5rem .75rem",
                        "&:hover": {
                          borderColor: "#dee2e6",
                        },
                      },
                    }}
                    renderInput={(props) => (
                      <TextField {...props} helperText="valid mask" />
                    )}
                  />
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
                  <option disabled selected value="">
                    All Factory
                  </option>
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
                <Form.Label className="fw-semibold">Due by Filter:</Form.Label>
                <Form.Select
                  className="mr-sm-2 py-2"
                  value={selectedDueType}
                  onChange={(e) => searchDueByFilter(e.target.value)}
                >
                  <option disabled selected value="">
                    Select...
                  </option>
                  <option value="today">Today</option>
                  <option value="tomorrow">Tomorrow</option>
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
          {orders && orders.length ? (
            <DataTable
              columns={columns}
              rows={orders}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              handleChange={handleChange}
            />
          ) : (
            <Alert
              severity="warning"
              sx={{ fontFamily: "monospace", fontSize: "18px" }}
            >
              No Exachange and Return Management Data Available!
            </Alert>
          )}
        </div>
      )}
    </Container>
  );
}

export default ERManagement;
