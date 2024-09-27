import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { Alert, Box, IconButton, Typography } from "@mui/material";
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
import { CompletedOrderSystemChinaGet } from "../../Redux2/slices/OrderSystemChinaSlice";
import { useTranslation } from "react-i18next";
import { ButtonGroup, Card, Modal, Table, ToggleButton } from "react-bootstrap";
import { setCurrentPage } from "../../Redux2/slices/PaginationSlice";

function CompletedOrderSystemInChina() {
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
  const [showTrackidModalOpen, setShowTrackidModalOpen] = useState(false);
  const [modalData, setModaldata] = useState([]);

  const loader = useSelector((state) => state?.orderSystemChina?.isLoading);

  const completedOrdersData = useSelector(
    (state) => state?.orderSystemChina?.completedOrders
  );

  const currentPage = useSelector((state) => state.pagination.currentPage['CompletedOrderSystemInChina']) || 1;

  useEffect(() => {
    if (currentPage) {
      setPage(currentPage);
    }
    if (completedOrdersData) {
      const completedData = completedOrdersData?.orders?.map((v, i) => ({
        ...v,
        id: i,
      }));
      setOrders(completedData);
      setTotalPages(completedOrdersData.total_pages);
    }
  }, [completedOrdersData,currentPage]);

  async function fetchOrders() {
    let apiUrl = `wp-json/custom-orders-completed/v1/completed-orders/?warehouse=China&page=${page}&per_page=${pageSize}`;
    if (searchOrderID) apiUrl += `&orderid=${searchOrderID}`;
    if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
    if (completedEndDate)
      apiUrl += `&completed_start_date=${completedStartDate}&completed_end_date=${completedEndDate}`;
    dispatch(
      CompletedOrderSystemChinaGet({
        apiUrl: `${apiUrl}`,
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
    {
      field: "start_date",
      headerName: t("P1ChinaSystem.StartedDate"),
      className: "complete-order-system-china",
      flex: 1,
    },
    {
      field: "order_id",
      headerName: t("P1ChinaSystem.OrderId"),
      className: "complete-order-system-china",
      flex: 0.5,
    },
    {
      field: "customer_name",
      headerName: t("P1ChinaSystem.CustomerName"),
      className: "complete-order-system-china",
      flex: 1,
    },
    {
      field: "shipping_country",
      headerName: t("P1ChinaSystem.ShippingCountry"),
      type: "string",
      className: "complete-order-system-china",
      flex: 1,
      valueGetter: (value, row) => getCountryName(row.shipping_country),
    },
    {
      field: "tracking_id",
      headerName: t("P1ChinaSystem.TrackingID"),
      flex: 1,
      className: "complete-order-system-china",
      type: "string",
      renderCell: (params) => {
        const items = params?.row?.items || [];
        const allSameTrackingID = items.every(
          (item) => item.tracking_id === items[0]?.tracking_id
        );

        const trackingID = allSameTrackingID ? items[0]?.tracking_id : "";

        const handleTrackIdModal = () => {};
        console.log(trackingID, "trackingID");

        return (
          <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
            {allSameTrackingID ? (
              <Form.Control
                type="text"
                value={trackingID == 0 ? "No Tracking ID" : trackingID}
                placeholder="Enter tracking ID"
                style={{
                  width: "80%",
                  textAlign: "center",
                  fontWeight: trackingID == 0 ? "lighter" : "bold",
                }}
                readOnly
              />
            ) : (
              <Button
                onClick={() => {
                  setModaldata(params?.row?.items);
                  setShowTrackidModalOpen(true);
                }}
              >
                <FaEye className="mb-1" />
              </Button>
            )}
          </Form.Group>
        );
      },
    },
    {
      field: "end_date",
      headerName: t("P1ChinaSystem.EndDate"),
      className: "complete-order-system-china",
      flex: 1,
    },
    {
      field: "view_item",
      headerName: t("POManagement.ViewItem"),
      flex: 0.5,
      className: "complete-order-system-china",
      type: "html",
      renderCell: (value, row) => {
        return (
          <Link
            to={`/completed_order_details_in_china/${value?.row?.order_id}`}
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
    // dispatch(setCurrentPage(value));
    dispatch(setCurrentPage({ tableId: 'CompletedOrderSystemInChina', page: value }));
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

  const handleSearchFilter = (e) => {
    e.preventDefault();
    setSearchOrderID(inputRef.current.value);
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
  }, [pageSize, page, searchOrderID, isReset, setSearchOrderID]);

  return (
    <Container fluid className="py-3">
      <Box className="d-flex mb-4 justify-content-between">
        <Typography variant="h4" className="fw-semibold">
          {t("P1ChinaSystem.CompletedOrderSystemInChina")}
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
                  onKeyDown={(e) => orderId(e)}
                  className="mr-sm-2 py-2"
                />
              </Form.Group>
            </Col>
            <Col xs="auto" lg="4">
              <Form.Group style={{ position: "relative" }}>
                <Form.Label className="fw-semibold mb-0">
                  {t("P1ChinaSystem.StartDateFilter")}:
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
              <Form.Group style={{ position: "relative" }}>
                <Form.Label className="fw-semibold">
                  {t("P1ChinaSystem.CompleteDateFilter")}:
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
                      value={selectedCompletedDateRange}
                      onChange={handleCompltedDateChange}
                      slots={{ field: SingleInputDateRangeField }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {selectedCompletedDateRange[0] &&
                  selectedCompletedDateRange[1] && (
                    <CancelIcon
                      style={{ position: "absolute", right: "0", top: "47px" }}
                      onClick={clearEndDateRange}
                    />
                  )}
              </Form.Group>
            </Col>
          </Row>
          <Box className="d-flex justify-content-end">
            <Form.Group className="d-flex mx-1 align-items-center">
              <Form.Label className="fw-semibold mb-0 me-2">
                {t("POManagement.PageSize")}:
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
              onClick={(e) => handleSearchFilter(e)}
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
              {t("P1ChinaSystem.RecordsIsNotAlert")}
            </Alert>
          )}
        </>
      )}

      <Modal
        show={showTrackidModalOpen}
        onHide={() => setShowTrackidModalOpen(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>TrackingID Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table responsive className="table-bordered">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Tracking ID</th>
                <th>Image</th>
              </tr>
            </thead>
            <tbody>
              {modalData?.map((item, index) => (
                <tr key={index}>
                  <td>{item.product_name || "N/A"}</td>
                  <td>{item.tracking_id || "N/A"}</td>
                  <td>
                    <img
                      src={
                        item?.product_image ||
                        require("../../assets/default.png")
                      }
                      alt="Product"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default CompletedOrderSystemInChina;
