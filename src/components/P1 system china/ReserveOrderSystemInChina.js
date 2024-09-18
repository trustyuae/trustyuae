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
import { ReserveOrderSystemChinaGet } from "../../Redux2/slices/OrderSystemChinaSlice";
import { useTranslation } from "react-i18next";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { setCurrentPage } from "../../Redux2/slices/PaginationSlice";

function ReserveOrderSystemInChina() {
  const inputRef = useRef(null);
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [lang, setLang] = useState("En");
  const [orders, setOrders] = useState([]);
  const [searchOrderID, setSearchOrderID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isReset, setIsReset] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [selectedCompletedDateRange, setSelectedCompletedDateRange] = useState([
    null,
    null,
  ]);
  const loader = useSelector((state) => state?.orderSystemChina?.isLoading);

  const reserveOrdersData = useSelector(
    (state) => state?.orderSystemChina?.reserveOrders
  );

  const currentPage = useSelector((state) => state.pagination.currentPage);

  useEffect(() => {
    if (currentPage) {
      setPage(currentPage);
    }
    if (reserveOrdersData) {
      const reserveData = reserveOrdersData?.orders?.map((v, i) => ({
        ...v,
        id: i,
      }));
      setOrders(reserveData);
      setTotalPages(reserveOrdersData.total_pages);
    }
  }, [reserveOrdersData]);

  async function fetchOrders() {
    let apiUrl = `wp-json/custom-reserved-orders/v1/reserved-orders/?warehouse=China&page=${page}&per_page=${pageSize}`;
    if (searchOrderID) apiUrl += `&orderid=${searchOrderID}`;
    if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
    if (completedEndDate)
      apiUrl += `&completed_start_date=${completedStartDate}&completed_end_date=${completedEndDate}`;
    await dispatch(
      ReserveOrderSystemChinaGet({
        apiUrl: `${apiUrl}`,
      })
    ).catch((error) => {
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
    clearDateRange();
    clearEndDateRange();
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
    { field: "date", headerName: t("POManagement.Date"), className: "order-system", flex: 1 },
    {
      field: "order_id",
      headerName: t("P1ChinaSystem.OrderId"),
      className: "order-system",
      flex: 0.5,
    },
    {
      field: "customer_name",
      headerName: t("P1ChinaSystem.CustomerName"),
      className: "order-system",
      flex: 1,
    },
    {
      field: "shipping_country",
      headerName: t("P1ChinaSystem.ShippingCountry"),
      type: "string",
      className: "order-system",
      flex: 1,
      valueGetter: (value, row) => getCountryName(row.shipping_country),
    },
    {
      field: "order_status",
      headerName: t("P1ChinaSystem.OrderStatus"),
      flex: 1,
      className: "order-system",
      type: "string",
    },
    {
      field: "view_item",
      headerName:  t("POManagement.ViewItem"),
      flex: 0.5,
      className: "order-system",
      type: "html",
      renderCell: (value, row) => {
        return (
          <Link
            to={`/reserve_order_details_in_china/${value?.row?.order_id}`}
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
    dispatch(setCurrentPage(value));
  };

  const radios = [
    { name: "English", value: "En" },
    { name: "中國人", value: "Zn" },
  ];

  const handleLanguageChange = async (language) => {
    setLang(language);
    i18n.changeLanguage(language);
  };

  useEffect(() => {
    // Set the initial language to 'En' when component mounts
    i18n.changeLanguage(lang);
  }, []);

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

  const handleCompltedDateChange = async (newDateRange) => {
    if (newDateRange[0]?.$d && newDateRange[1]?.$d) {
      setSelectedCompletedDateRange(newDateRange);
      const isoStartDate = dayjs(newDateRange[0].$d.toDateString()).format(
        "YYYY-MM-DD"
      );
      const isoEndDate = dayjs(newDateRange[1].$d.toDateString()).format(
        "YYYY-MM-DD"
      );
      setCompletedStartDate(isoStartDate);
      setCompletedEndDate(isoEndDate);
    } else {
      console.error("Invalid date range");
    }
  };

  const handleSearchFilter = () => {
    setPage(1);
    fetchOrders();
  };
  const orderId = (e) => {
    if (e.key === "Enter") {
      setSearchOrderID(e.target.value);
    }
  };
  const clearDateRange = () => {
    setSelectedDateRange([null, null]);
    setStartDate("");
    setEndDate("");
  };
  const clearEndDateRange = () => {
    setSelectedCompletedDateRange([null, null]);
    setCompletedStartDate("");
    setCompletedEndDate("");
  };
  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, page, searchOrderID, isReset]);

  return (
    <Container fluid className="py-3">
       <Box className="d-flex mb-4 justify-content-between">
        <Typography variant="h4" className="fw-semibold">
        {t("P1ChinaSystem.ReserveOrderSystemInChina")}
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
              <Form.Group>
              <Form.Label className="fw-semibold">  {t("P1ChinaSystem.OrderId")}::</Form.Label>
              <Form.Control
                  type="text"
                  placeholder={t("P1ChinaSystem.EnterOrderId")}
                  ref={inputRef}
                  // value={searchOrderID}
                  onKeyDown={(e) => orderId(e)}
                  className="mr-sm-2 py-2"
                />
              </Form.Group>
            </Col>
            <Col xs="auto" lg="4">
              <Form.Group style={{ position: "relative" }}>
                <Form.Label className="fw-semibold mb-0">
                {t("P1ChinaSystem.Datefilter")}:
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
          </Row>
          <Box className="d-flex justify-content-end">
            <Form.Group className="d-flex mx-1 align-items-center">
              <Form.Label className="fw-semibold mb-0 me-2">
              {t("P1ChinaSystem.PageSize")}:
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
             {t("P1ChinaSystem.Search")}:
             </Button>
            <Button
              type="button"
              className="mr-2 mx-1 w-auto"
              onClick={handleReset}
            >
              {t("P1ChinaSystem.ResetFilter")}:
              </Button>
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
                {t("P1ChinaSystem.RecordsIsNotAlert")}:
                </Alert>
          )}
        </>
      )}
    </Container>
  );
};

export default ReserveOrderSystemInChina;
