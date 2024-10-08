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
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers-pro";
import { useTranslation } from "react-i18next";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { fetchAllFactories } from "../../Redux2/slices/FactoriesSlice";
import { GetErManagementData } from "../../Redux2/slices/ErManagementSlice";
import { clearStoreData, setCurrentPage } from "../../Redux2/slices/PaginationSlice";

function ERManagement() {
  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();
  const [dueDate, setDueDate] = useState("");
  const [selectedDueType, setSelectedDueType] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState("");
  const [orders, setOrders] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [lang, setLang] = useState("En");

  const loader = useSelector((state) => state?.erManagement?.isLoading);

  const factoryData = useSelector((state) => state?.factory?.factories);

  const currentPage = useSelector((state) => state.pagination.currentPage['ERManagement']) || 1;

  const radios = [
    { name: "English", value: "En" },
    { name: "中國人", value: "Zn" },
  ];

  useEffect(() => {
    dispatch(fetchAllFactories());
  }, [dispatch]);

  useEffect(() => {
    if (factoryData) {
      const factData = factoryData?.factories?.map((item) => ({ ...item }));
      setFactories(factData);
    }
  }, [factoryData]);

  useEffect(()=>{
    if (currentPage) {
      dispatch(clearStoreData({ tableId: 'ERManagement' }));
      setPage(currentPage);
    }
  },[currentPage])

  async function fetchOrders() {
    let apiUrl = `wp-json/custom-er-fetch/v1/fetch-all-er/?per_page=${pageSize}&page=${page}`;
    if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
    if (dueDate) apiUrl += `&due_date=${dueDate}`;
    if (selectedDate) apiUrl += `&date=${selectedDate}`;
    await dispatch(GetErManagementData(apiUrl))
      .then(({payload}) => {
        console.log(payload,'payload from Er management system')
        let data = payload.er_details.map((v, i) => ({ ...v, id: i }));
        setOrders(data);
        setTotalPages(payload.total_pages);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleReset = () => {
    setSelectedDate(null);
    setSelectedDueType("");
    setSelectedFactory("");
    setDueDate("");
    setTotalPages(1);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(e.target.value);
  };

  const handleFactoryChange = (e) => {
    setSelectedFactory(e.target.value);
  };

  const handleLanguageChange = async (language) => {
    setLang(language);
    i18n.changeLanguage(language);
  };

  const columns = [
    {
      field: "er_no",
      headerName: t("POManagement.ERNo"),
      className: "order-system",
      flex: 1,
    },
    {
      field: "er_total_qty",
      headerName: t("POManagement.TotalQty"),
      className: "order-system",
      flex: 1,
    },
    {
      field: "er_status",
      headerName: t("POManagement.Status"),
      className: "order-system",
      flex: 1,
    },
    {
      field: "received_qty",
      headerName: t("POManagement.ReceivedStatus"),
      type: "string",
      className: "order-system",
      flex: 1,
      valueGetter: (value, row) => {
        return `${row.received_qty} / ${row.returned_qty}`;
      },
    },
    {
      field: "view_item",
      headerName: t("POManagement.Action"),
      flex: 0.5,
      className: "order-system",
      type: "html",
      renderCell: (value, row) => {
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
    dispatch(setCurrentPage({ tableId: 'ERManagement', page: value }));
  };

  const handleDateChange = async (newDateRange) => {
    setSelectedDueType("");
    setDueDate("");
    if (newDateRange?.$d) {
      const isoDate = dayjs(newDateRange.$d.toDateString()).format(
        "YYYY-MM-DD"
      );
      setSelectedDate(isoDate);
    } else {
      console.error("Invalid date range");
    }
  };

  const handleSearchFilter = () => {
    setPage(1);
    fetchOrders();
  };

  const searchDueByFilter = (value) => {
    setSelectedDate(null);
    setSelectedDueType(value);
    value === "today"
      ? setDueDate(dayjs().format("YYYY-MM-DD"))
      : setDueDate(dayjs().add(1, "day").format("YYYY-MM-DD"));
    setPage(1);
  };

  useEffect(() => {
    fetchOrders();
  }, [pageSize, page, dueDate, selectedFactory, selectedDate]);

  useEffect(() => {
    // Set the initial language to 'En' when component mounts
    i18n.changeLanguage(lang);
  }, []);

  return (
    <Container fluid className="py-3">
      <Box className="d-flex mb-4 justify-content-between">
        <Typography variant="h4" className="fw-semibold">
          {t("POManagement.ERManagement")}
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
          <Row className="mb-4 align-items-center">
            <Col xs="auto" lg="4">
              <Form.Group className="fw-semibold mb-0">
                <Form.Label>{t("POManagement.DateFilter")}</Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={dayjs(selectedDate)}
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
                <Form.Label>{t("POManagement.FactoryFilter")}</Form.Label>
                <Form.Control
                  as="select"
                  className="mr-sm-2"
                  value={selectedFactory}
                  onChange={handleFactoryChange}
                >
                  <option disabled selected value="">
                    All Factory
                  </option>
                  {factories?.map((factory) => (
                    <option key={factory.id} value={factory.id}>
                      {factory.factory_name}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Col>
            <Col xs="auto" lg="4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  {t("POManagement.DuebyFilter")}
                </Form.Label>
                <Form.Select
                  className="mr-sm-2 py-2"
                  value={selectedDueType}
                  onChange={(e) => searchDueByFilter(e.target.value)}
                >
                  <option disabled selected value="">
                    {t("POManagement.Select")}...
                  </option>
                  <option value="today">{t("POManagement.Today")}</option>
                  <option value="tomorrow">{t("POManagement.Tomorrow")}</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Box className="d-flex justify-content-end">
            <Form.Group className="d-flex mx-1 align-items-center">
              <Form.Label className="fw-semibold mb-0 me-2">
                {t("POManagement.PageSize")}
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
              {t("POManagement.Search")}
            </Button>
            <Button
              type="button"
              className="mr-2 mx-1 w-auto"
              onClick={handleReset}
            >
              {t("POManagement.ResetFilter")}
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
              {t("POManagement.NoExachangeandReturnManagementDataAvailable")}
            </Alert>
          )}
        </div>
      )}
    </Container>
  );
}

export default ERManagement;
