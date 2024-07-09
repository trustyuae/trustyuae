import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Alert, Box, Typography } from "@mui/material";
import {
  DateRangePicker,
  LocalizationProvider,
  SingleInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { API_URL } from "../../redux/constants/Constants";
import { Link } from "react-router-dom";
import { ButtonGroup, Card, Tab, Tabs, ToggleButton } from "react-bootstrap";
import DataTable from "../DataTable";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useDispatch, useSelector } from "react-redux";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import { PomSystemProductsDetails } from "../../redux/actions/P2SystemActions";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import ShowAlert from "../../utils/ShowAlert";
import { useTranslation } from "react-i18next";
import CancelIcon from "@mui/icons-material/Cancel";

function POManagementSystem() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const POStatusFilter = [
    t("POManagement.Open"),
    t("POManagement.Checkingwithfactory"),
    t("POManagement.Closed"),
  ];
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [selectedFactory, setSelectedFactory] = useState("");
  const [factories, setFactories] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [orderList, setOrderList] = useState([]);

  const [PoStatus, setPoStatus] = useState("");
  const [searchPoID, setSearchPoID] = useState("");
  const [poType, setPOType] = useState("po");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [lang, setLang] = useState("En");

  const allFactoryDatas = useSelector((state) => state?.allFactoryData?.factory);

  const pomSystemProductDetailsLoader = useSelector(
    (state) => state?.orderNotAvailable?.isPomSystemProductDetails
  );

  useEffect(() => {
    dispatch(AllFactoryActions());
  }, [dispatch]);

  useEffect(() => {
    if (allFactoryDatas && allFactoryDatas.factories) {
      let data = allFactoryDatas.factories.map((item) => ({ ...item }));
      setFactories(data); 
    }
  }, [allFactoryDatas]);

  const POM_system_products = async () => {
    try {
      let apiUrl;
      if (poType === "po") {
        apiUrl = `${API_URL}wp-json/custom-po-management/v1/po-generated-order/?&per_page=${pageSize}&page=${page}`;
      } else if (poType === "mpo") {
        apiUrl = `${API_URL}wp-json/custom-mo-management/v1/generated-mo-order/?&per_page=${pageSize}&page=${page}`;
      } else if (poType === "spo") {
        apiUrl = `${API_URL}wp-json/custom-so-management/v1/generated-so-order/?&per_page=${pageSize}&page=${page}`;
      }

      // Build query parameters based on selected filters
      const params = {};
      if (searchPoID) params.po_id = searchPoID;
      if (startDate && endDate) {
        params.start_date = startDate;
        params.end_date = endDate;
      }
      if (selectedFactory) params.factory_id = selectedFactory;
      if (PoStatus) params.status = PoStatus;

      // Construct the final API URL with query parameters
      const response = await dispatch(PomSystemProductsDetails({
        apiUrl: `${apiUrl}&${new URLSearchParams(params).toString()}`
      }));

      const data = response.data.pre_orders.map((v, i) => ({ ...v, id: i }));
      setOrderList(data);
      setTotalPages(response.data.total_pages);
    } catch (error) {
      console.error("Error Products:", error);
      setOrderList([]);
    }
  };

  useEffect(() => {
    handleTabChange(poType);
  }, []);

  useEffect(() => {
    POM_system_products();
  }, [page, startDate, endDate, selectedFactory, PoStatus, searchPoID, poType]);

  const handleDateChange = (newDateRange) => {
    setSelectedDateRange(newDateRange);
    if (newDateRange[0] && newDateRange[1]) {
      const isoStartDate = dayjs(newDateRange[0]["$d"].toDateString()).format(
        "YYYY-MM-DD"
      );
      const isoEndDate = dayjs(newDateRange[1]["$d"].toDateString()).format(
        "YYYY-MM-DD"
      );
      setStartDate(isoStartDate);
      setEndDate(isoEndDate);
    } else {
      setStartDate("");
      setEndDate("");
    }
  };

  const handleFactoryChange = (e) => {
    setSelectedFactory(e.target.value);
  };

  const handlePOStatus = (e) => {
    setPoStatus(e.target.value);
  };

  const PoId = (e) => {
    if (e.key === "Enter") {
      setSearchPoID(e.target.value);
      setPage(1); // Reset page to 1 when searching
    }
  };

  const radios = [
    { name: "English", value: "En" },
    { name: "中國人", value: "Zn" },
  ];

  const columns = [
    {
      field: "po_id",
      headerName: t("POManagement.PONo"),
      flex: 1.5,
    },
    { field: "po_date", headerName: t("POManagement.Date"), flex: 1.5 },
    {
      field: "total_quantity",
      headerName: t("POManagement.Quantity"),
      flex: 1.5,
    },
    { field: "", headerName: t("POManagement.RMBPrice"), flex: 1.5,
      type: "html",
      renderCell: (value, row) => {
        // console.log(value,'value');
        // console.log((value.row.estimated_cost_aed*1.92).toFixed(2)        ,'row');
        return (value.row.estimated_cost_aed*1.92).toFixed(2)
      },
     },
    {
      field: "estimated_cost_aed",
      headerName: t("POManagement.AEDPrice"),
      flex: 1.5,
    },
    { field: "po_status", headerName: t("POManagement.POStatus"), flex: 1.5 },
    {
      field: "payment_status",
      headerName: t("POManagement.PaymentStatus"),
      flex: 1.5,
    },
    {
      field: "factory_id",
      headerName: t("POManagement.Factory"),
      flex: 1.5,
      type: "html",
      renderCell: (value, row) => {
        return factories.find((factory) => factory.id == value.row.factory_id)
          ?.factory_name;
      },
    },
    {
      field: "view_item",
      headerName: t("POManagement.ViewItem"),
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
    const result = await ShowAlert(
      "Are you sure you want to delete this order?",
      "",
      "error",
      true,
      true,
      "Yes",
      "No"
    );
    if (result.isConfirmed) {
      try {
        const response = await axios.get(
          `${API_URL}wp-json/delete-record/v1/delete-po-record/${id}`
        );
        if (response) {
          POM_system_products();
        }
      } catch (error) {
        console.error(error);
        POM_system_products();
      }
    }
  };

  const handleTabChange = (tabType) => {
    setPOType(tabType);
    setPage(1);
    setStartDate("");
    setEndDate("");
    setSelectedDateRange([null, null]);
    setSelectedFactory("");
    setPoStatus("");
    setSearchPoID(""); 
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handleLanguageChange = async (language) => {
    setLang(language);
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    // Set the initial language to 'En' when component mounts
    i18n.changeLanguage(lang);
  }, [lang]);

  const clearDateRange = () => {
    setSelectedDateRange([null, null]);
    setStartDate("")
    setEndDate("")
  };
  return (
    <Container fluid className="p-5">
      <Box className="d-flex justify-content-between align-items-center">
        <Typography variant="h4" component="h2">
          {t("POManagement.title")}
        </Typography>
        <ButtonGroup>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant={idx % 2 ? "outline-success" : "outline-danger"}
              name="radio"
              value={radio.value}
              checked={lang === radio.value}
              onClick={() => handleLanguageChange(radio.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Box>
      <Row className="mb-4 mt-4">
        <Form inline>
          <Row>
            <Col xs="auto" lg="3">
              <Form.Group style={{ position: "relative" }}>
                <Form.Label className="fw-semibold mb-0">
                  {t("POManagement.DateFilter")}
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
                  <CancelIcon style={{ position: "absolute", right: "0", top: "39px" }} onClick={clearDateRange} />
                )}
              </Form.Group>
            </Col>
            <Col xs="auto" lg="3">
              <Form.Group className="fw-semibold mb-0">
                <Form.Label>{t("POManagement.FactoryFilter")}</Form.Label>
                <Form.Select
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
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs="auto" lg="3">
              <Form.Group className="fw-semibold mb-0">
                <Form.Label>{t("POManagement.POStatusFilter")}</Form.Label>
                <Form.Select
                  as="select"
                  className="mr-sm-2"
                  value={PoStatus}
                  onChange={handlePOStatus}
                >
                  <option value="">{t("POManagement.All")}</option>
                  {POStatusFilter.map((po) => (
                    <option key={po} value={po}>
                      {po}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs="auto" lg="3">
              <Form.Group>
                <Form.Label className="fw-semibold">{t("POManagement.PoNo")}</Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("POManagement.EnterPoNumber")}
                  onKeyDown={(e)=>PoId(e)}
                  className="mr-sm-2 py-2"
                />
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
                    {t("POManagement.OrderAgainstPO")}
                  </span>
                }
              >
                {pomSystemProductDetailsLoader ? (
                  <Loader />
                ) : orderList && orderList.length !== 0 ? (
                  <DataTable
                    columns={columns}
                    rows={orderList}
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
                    {t("POManagement.RecordsIsNotAvailableForAboveFilter")}
                  </Alert>
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
                    {t("POManagement.ManualPO")}
                  </span>
                }
              >
                {pomSystemProductDetailsLoader ? (
                  <Loader />
                ) : orderList && orderList.length !== 0 ? (
                  <DataTable
                    columns={columns}
                    rows={orderList}
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
                    {t("POManagement.RecordsIsNotAvailableForAboveFilter")}
                  </Alert>
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
                    {t("POManagement.ScheduledPO")}
                  </span>
                }
              >
                {pomSystemProductDetailsLoader ? (
                  <Loader />
                ) : orderList && orderList.length !== 0 ? (
                  <DataTable
                    columns={columns}
                    rows={orderList}
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
                    {t("POManagement.RecordsIsNotAvailableForAboveFilter")}
                  </Alert>
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
