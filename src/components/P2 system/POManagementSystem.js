import React, { useState, useEffect } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Box, Typography } from "@mui/material";
import {
  DateRangePicker,
  LocalizationProvider,
  SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { API_URL } from "../../redux/constants/Constants";
import { Link } from "react-router-dom";
import { Card, Tab, Tabs } from "react-bootstrap";
import DataTable from "../DataTable";
import Swal from "sweetalert2";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import { PomSystemProductsDetails } from "../../redux/actions/P2SystemActions";
import Loader from "../../utils/Loader";

function POManagementSystem() {
  const dispatch = useDispatch();
  const POStatusFilter = ["Open", "Checking with factory", "Closed"];
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [selectedFactory, setSelectedFactory] = useState("");
  const [factories, setFactories] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [orderList, setOrderList] = useState([]);

  const [PoStatus, setPoStatus] = useState("");
  const [poType, setPOType] = useState("po");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );

  const pomSystemProductDetailsLoader = useSelector(
    (state) => state?.orderNotAvailable?.isPomSystemProductDetails
  );

  useEffect(() => {
    dispatch(AllFactoryActions());
    setFactories(allFactoryDatas);
  }, [dispatch, allFactoryDatas]);

  const POM_system_products = async () => {
    try {
      let apiUrl;
      if (poType == "po") {
        apiUrl = `${API_URL}wp-json/custom-po-management/v1/po-generated-order/?&per_page=${pageSize}&page=${page}
                `;
      } else if (poType == "mpo") {
        apiUrl = `${API_URL}wp-json/custom-mo-management/v1/generated-mo-order/?&per_page=${pageSize}&page=${page}`;
      } else if (poType == "spo") {
        apiUrl = `${API_URL}wp-json/custom-so-management/v1/generated-so-order/?&per_page=${pageSize}&page=${page}`;
      }

      if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
      if (selectedFactory) apiUrl += `?&factory_id=${selectedFactory}`;
      if (PoStatus) apiUrl += `?&status=${PoStatus}`;

      await dispatch(PomSystemProductsDetails({ apiUrl })).then((response) => {
        let data = response.data.pre_orders.map((v, i) => ({ ...v, id: i }));
        console.log(data,'data====');
        setOrderList(data);
        setTotalPages(response.data.total_pages);
      });
    } catch (error) {
      console.error("Error Products:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: 'Records not available with this filter',
      });
    }
  };

  useEffect(() => {
    handleTabChange(poType);
  }, []);

  useEffect(() => {
    POM_system_products();
  }, [page, endDate, selectedFactory, PoStatus, poType]);

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

  const handlePOStatus = (e) => {
    setPoStatus(e.target.value);
  };

  const columns = [
    {
      field: "po_id",
      headerName: "PO No.",
      flex: 1.5,
    },
    { field: "po_date", headerName: "Date", flex: 1.5 },
    { field: "total_quantity", headerName: "Quantity", flex: 1.5 },
    { field: "", headerName: "RMB Price", flex: 1.5 },
    { field: "estimated_cost_aed", headerName: "AED Price", flex: 1.5 },
    { field: "po_status", headerName: "Status", flex: 1.5 },
    { field: "payment_status", headerName: "Status", flex: 1.5 },
    {
      field: "factory_id",
      headerName: "Factory",
      flex: 1.5,
      type: "html",
      renderCell: (value, row) => {
        return factories.find((factory) => factory.id == value.row.factory_id)
          ?.factory_name;
      },
    },
    {
      field: "view_item",
      headerName: "View Item",
      flex: 2,
      type: "html",
      renderCell: (value, row) => {
        return (
          <div className="d-flex  align-items-center  justify-content-around">
            <Link to={`/PO_details/${value.row.po_id}`}>
              <Button
                className="m-2 d-flex align-items-center justify-content-center"
                style={{ padding: "5px 5px", fontSize: "16px" }}
              >
                <VisibilityIcon fontSize="inherit" />
              </Button>
            </Link>
            <Button
              className="btn btn-danger m-2 d-flex align-items-center justify-content-center"
              style={{ padding: "5px 5px", fontSize: "16px" }}
              onClick={() => handleDeletePO(value.row.po_id)}
            >
              <DeleteIcon fontSize="inherit" />
            </Button>
          </div>
        );
      },
    },
  ];

  const handleDeletePO = async (id) => {
    Swal.fire({
      icon: "error",
      title: "Are you sure you want to delete this order?",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      try {
        if (result.isConfirmed) {
          const response = await axios.post(
            `${API_URL}wp-json/delete-record/v1/delete-po-record/`,
            {
              po_id: id,
            }
          );
        }
      } catch (error) {
        console.log(error);
      }
    });
  };

  const handleTabChange = (e) => {
    setPOType(e);
    setPage(1);
    setStartDate("");
    setEndDate("");
    setSelectedDateRange([null,null])
    setSelectedFactory('');
    setPoStatus('');
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container
      fluid
      className="p-5"
      style={{ height: "98vh", maxHeight: "100%", minHeight: "100vh" }}
    >
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          PO Order Management System
        </Typography>
      </Box>
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
            <Col xs="auto" lg="4">
              <Form.Group className="fw-semibold mb-0">
                <Form.Label>PO Status Filter:</Form.Label>
                <Form.Control
                  as="select"
                  className="mr-sm-2"
                  // value={selectedFactory}
                  onChange={handlePOStatus}
                >
                  <option value="">All </option>
                  {POStatusFilter.map((po) => (
                    <option key={po} value={po}>
                      {po}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Row>

      <Row>
        <Card>
          <Card.Body>
            <Tabs
              defaultActiveKey="po"
              id="fill-tab-example"
              className="mb-3"
              fill
              onSelect={(key) => handleTabChange(key)}
            >
              {/* po */}
              <Tab
                eventKey="po"
                title={
                  <span
                    style={{
                      backgroundColor: poType === "po" ? "blue" : "inherit",
                      color: poType === "po" ? "white" : "inherit",
                      display: "block",
                      borderRadius: "5px",
                    }}
                  >
                    Order against PO
                  </span>
                }
              >
                {pomSystemProductDetailsLoader ? (
                  <Loader />
                ) : (
                  <DataTable
                    columns={columns}
                    rows={orderList}
                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    handleChange={handleChange}
                  />
                )}
              </Tab>
              {/* MPO */}
              <Tab
                eventKey="mpo"
                title={
                  <span
                    style={{
                      backgroundColor: poType === "mpo" ? "blue" : "inherit",
                      color: poType === "mpo" ? "white" : "inherit",
                      display: "block",
                      borderRadius: "5px",
                    }}
                  >
                    Manual PO
                  </span>
                }
              >
                {pomSystemProductDetailsLoader ? (
                  <Loader />
                ) : (
                  <DataTable
                    columns={columns}
                    rows={orderList}
                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    handleChange={handleChange}
                  />
                )}
              </Tab>
              {/* SPO */}
              <Tab
                eventKey="spo"
                title={
                  <span
                    style={{
                      backgroundColor: poType === "spo" ? "blue" : "inherit",
                      color: poType === "spo" ? "white" : "inherit",
                      display: "block",
                      borderRadius: "5px",
                    }}
                  >
                    Scheduled PO
                  </span>
                }
              >
                {pomSystemProductDetailsLoader ? (
                  <Loader />
                ) : (
                  <DataTable
                    columns={columns}
                    rows={orderList}
                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    handleChange={handleChange}
                  />
                )}
              </Tab>
            </Tabs>
          </Card.Body>
        </Card>
      </Row>
    </Container>
  );
}

export default POManagementSystem;
