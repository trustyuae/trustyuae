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
import { Badge, ButtonGroup, ToggleButton } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { getCountryName } from "../../utils/GetCountryName";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import PrintModal from "./PrintModalInChina";
import {
  OrderDetailsChinaGet,
  OrderSystemChinaGet,
} from "../../Redux2/slices/OrderSystemChinaSlice";
import { useTranslation } from "react-i18next";

function OrderSystemInChina() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("En");
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
  const [orderData, setOrderData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const loader = useSelector((state) => state?.orderSystemChina?.isLoading);
  const ordersData = useSelector(
    (state) => state?.orderSystemChina?.orders?.orders
  );
  const otherData = useSelector((state) => state?.orderSystemChina?.orders);
  const orderDetails = useSelector(
    (state) => state?.orderSystemChina?.orderDetails
  );

  useEffect(() => {
    if (ordersData) {
      const oData = ordersData.map((v, i) => ({ ...v, id: i }));
      setOrders(oData);
    }
    if (otherData) {
      setOverAllData({
        total_count: otherData?.total_count,
        total_dispatch_orders: otherData?.total_dispatch_orders,
        total_reserve_orders: otherData?.total_reserve_orders,
      });
      setTotalPages(otherData?.total_pages);
    }
  }, [ordersData, otherData]);

  useEffect(() => {
    if (orderDetails) {
      const oDetails = orderDetails?.orders?.map((v, i) => ({ ...v, id: i }));
      setOrderData(oDetails);
    }
  }, [orderDetails]);

  async function fetchOrders() {
    let apiUrl = `wp-json/custom-orders-new/v1/orders/?warehouse=China&trackorder=1`;
    if (searchOrderID) apiUrl += `&orderid=${searchOrderID}`;
    if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
    dispatch(
      OrderSystemChinaGet({
        apiUrl: `${apiUrl}&page=${page}&per_page=${pageSize}&status=${dispatchType}`,
      })
    );
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

  const handlePrint = async (orderId) => {
    try {
      const response = await dispatch(OrderDetailsChinaGet({ id: orderId }));
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
    {
      field: "date",
      headerName: t("POManagement.Date"),
      className: "order-system",
      flex: 1,
    },
    {
      field: "order_id",
      headerName: t("P1ChinaSystem.OrderId"),
      className: "order-system",
      flex: 1,
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
      field: "tracking_id",
      headerName: t("P1ChinaSystem.TrackingID"),
      flex: 1,
      className: "order-system",
      type: "string",
      renderCell: (params) => {
        const items = params?.row?.items || [];
        const trackingID = items.length > 0 ? items[0]?.tracking_id : "";
        return <div>{trackingID}</div>;
      },
    },
    {
      field: "",
      headerName: t("P1ChinaSystem.printpdf"),
      flex: 0.5,
      className: "order-system",
      type: "html",
      renderCell: (value, row) => {
        const orderId = value && value.row && value.row.order_id;
        return (
          <Button
            type="button"
            className="w-auto w-auto bg-transparent border-0 text-secondary fs-5"
            onClick={() => handlePrint(orderId)}
          >
            <LocalPrintshopOutlinedIcon className="mb-1" />
          </Button>
        );
      },
    },
    {
      field: "view_item",
      headerName: t("POManagement.ViewItem"),
      flex: 1,
      className: "order-system",
      type: "html",
      renderCell: (value, row) => {
        return (
          <Link
            to={`/order_details_in_china/${value?.row?.order_id}`}
            className=" d-flex "
          >
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

  const orderId = (e) => {
    if (e.key === "Enter") {
      setSearchOrderID(e.target.value);
      // setProductName("");
      // fetchOrders();
    }
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
      <Box className="d-flex mb-4 justify-content-between">
        <Typography variant="h4" className="fw-semibold">
          {t("P1ChinaSystem.OrderFulfillmentSystemInChina")}
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
                <Form.Label className="fw-semibold">
                  {" "}
                  {t("P1ChinaSystem.OrderId")}:
                </Form.Label>
                <Form.Control
                  type="text"
                  placeholder={t("P1ChinaSystem.EnterOrderId")}
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
            <Col xs="auto" lg="4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  {t("P1ChinaSystem.Dispatchtype")}:
                </Form.Label>
                <Form.Select
                  className="mr-sm-2 py-2"
                  onChange={(e) => searchDispatchTypeFilter(e.target.value)}
                >
                  <option value="all">{t("POManagement.All")}</option>
                  <option value="dispatch">
                    {t("P1ChinaSystem.dispatch")}
                  </option>
                  {/* <option value="reserve">{t("P1ChinaSystem.reserve")}</option> */}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Box className="d-flex justify-content-between">
            <Box className="d-flex">
              <Form.Group className="d-flex mx-1 align-items-center">
                <Form.Label className="fw-semibold mb-0 me-2">
                  {t("P1ChinaSystem.TotalOrders")}:
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
                  {t("P1ChinaSystem.DispatchOrders")}:
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
              {/* <Form.Group className="d-flex mx-1 align-items-center">
                <Form.Label className="fw-semibold mb-0 me-2">
                {t("P1ChinaSystem.ReserveOrders")}:
                </Form.Label>
                <Form.Control
                  as="input"
                  type="number"
                  className="color-black"
                  style={{ width: "100px", textAlign: "center" }} // Add a custom width style here
                  value={overAllData.total_reserve_orders}
                  readOnly
                />
              </Form.Group> */}
            </Box>
            <Box className="d-flex">
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
      <PrintModal
        show={showModal}
        handleClosePrintModal={() => setShowModal(false)}
        showModal={showModal}
        orderData={orderData}
      />
    </Container>
  );
}

export default OrderSystemInChina;
