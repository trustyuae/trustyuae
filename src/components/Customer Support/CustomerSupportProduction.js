import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
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
import { OrderDetailsGet } from "../../Redux2/slices/OrderSystemSlice";
import { fetchProductionOrders } from "../../Redux2/slices/CustomerSupportSlice";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import PrintModal from "../P1 system/PrintModal";
import { setCurrentPage } from "../../Redux2/slices/PaginationSlice";

function formatProductionOrderStatus(itemsByCategory) {
  if (!itemsByCategory || typeof itemsByCategory !== "object") return "—";
  const keys = Object.keys(itemsByCategory).filter(
    (k) => Array.isArray(itemsByCategory[k]) && itemsByCategory[k].length > 0
  );
  return keys.length ? keys.join(", ") : "—";
}

/** Production orders API may return `items` or grouped `items_by_category`. */
function getCsOrderLineItems(order) {
  if (!order) return [];
  if (Array.isArray(order.items) && order.items.length > 0) {
    return order.items;
  }
  const byCat = order.items_by_category;
  if (!byCat || typeof byCat !== "object") return [];
  const out = [];
  Object.keys(byCat).forEach((categoryKey) => {
    const arr = byCat[categoryKey];
    if (!Array.isArray(arr)) return;
    arr.forEach((item) => {
      out.push({ ...item, _line_category: categoryKey });
    });
  });
  return out;
}

function CustomerSupportProduction() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [orders, setOrders] = useState([]);
  const [searchOrderID, setSearchOrderID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isReset, setIsReset] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [overAllData, setOverAllData] = useState({
    total_count: 0,
    total_pages: 0,
  });
  const [orderData, setOrderData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showProductModal, setShowProductModal] = useState(false);
  const [productModalLines, setProductModalLines] = useState([]);
  const [productModalOrderId, setProductModalOrderId] = useState(null);

  const loader = useSelector(
    (state) => state?.customerSupport?.isProductionOrdersLoading
  );
  const productionOrdersRaw = useSelector(
    (state) => state?.customerSupport?.productionOrders ?? []
  );
  const productionPagination = useSelector(
    (state) => state?.customerSupport?.productionOrdersPagination
  );

  const orderDetails = useSelector(
    (state) => state?.orderSystem?.orderDetailsData
  );

  useEffect(() => {
    const rows = productionOrdersRaw.map((o, i) => ({
      ...o,
      id: o.order_id ?? i,
      date_display: o.order_date
        ? dayjs(o.order_date).format("YYYY-MM-DD")
        : "",
      order_status: formatProductionOrderStatus(o.items_by_category),
    }));
    setOrders(rows);
  }, [productionOrdersRaw]);

  useEffect(() => {
    if (productionPagination) {
      setOverAllData({
        total_count: productionPagination.total_orders ?? 0,
        total_pages: productionPagination.total_pages ?? 1,
      });
      setTotalPages(productionPagination.total_pages ?? 1);
    }
  }, [productionPagination]);

  useEffect(() => {
    if (orderDetails) {
      const oDetails = orderDetails?.orders?.map((v, i) => ({ ...v, id: i }));
      setOrderData(oDetails);
    }
  }, [orderDetails]);

  function buildProductionApiUrl() {
    const orderIdFromInput = inputRef.current?.value?.trim() ?? "";
    const orderId =
      orderIdFromInput !== "" ? orderIdFromInput : searchOrderID;
    let url = `wp-json/custom-pro-orders/v1/pro-orders/?page=${page}&per_page=${pageSize}`;
    if (orderId) {
      url += `&order_id=${encodeURIComponent(orderId)}`;
    }
    if (startDate && endDate) {
      url += `&start_date=${encodeURIComponent(
        startDate
      )}&end_date=${encodeURIComponent(endDate)}`;
    }
    return url;
  }

  async function fetchOrders() {
    dispatch(fetchProductionOrders({ apiUrl: buildProductionApiUrl() }));
  }

  const handleReset = () => {
    if (inputRef.current) inputRef.current.value = "";
    setSearchOrderID("");
    setStartDate("");
    setEndDate("");
    setSelectedDateRange([null, null]);
    setTotalPages(1);
    setIsReset((prev) => !prev);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handlePrint = async (orderId) => {
    try {
      dispatch(OrderDetailsGet(orderId));
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleOpenProductModal = (row) => {
    const lines = getCsOrderLineItems(row);
    setProductModalLines(lines);
    setProductModalOrderId(row?.order_id ?? null);
    setShowProductModal(true);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    setProductModalLines([]);
    setProductModalOrderId(null);
  };

  const columns = [
    {
      field: "sr_no",
      headerName: "S.No.",
      width: 72,
      minWidth: 64,
      flex: 0.35,
      sortable: false,
      className: "order-system",
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const idx = params.api.getRowIndexRelativeToVisibleRows(params.id);
        const n = (page - 1) * pageSize + (Number.isFinite(idx) ? idx : 0) + 1;
        return n;
      },
    },
    {
      field: "date_display",
      headerName: "Date",
      className: "order-system",
      flex: 1,
    },
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
      field: "order_status",
      headerName: "Order",
      flex: 1,
      className: "order-system",
      type: "string",
    },
    {
      field: "product_action",
      headerName: "Product",
      flex: 0.5,
      className: "order-system",
      type: "html",
      sortable: false,
      renderCell: (value) => {
        return (
          <Button
            type="button"
            className="w-auto w-auto bg-transparent border-0 text-secondary fs-5"
            onClick={(e) => {
              e.stopPropagation();
              handleOpenProductModal(value?.row);
            }}
          >
            <FaEye className="mb-1" />
          </Button>
        );
      },
    },
    {
      field: "",
      headerName: "Note",
      flex: 0.5,
      className: "order-system",
      type: "html",
      renderCell: (value) => {
        const orderId = value?.row?.order_id;
        return (
          <Button
            type="button"
            className="w-auto w-auto bg-transparent border-0 text-secondary fs-5"
            onClick={() => handlePrint(orderId)}
          >
            <FaEye className="mb-1" />
          </Button>
        );
      },
    },
    {
      field: "view_item",
      headerName: "View Item",
      flex: 1,
      className: "order-system",
      type: "html",
      renderCell: (value) => {
        return (
          <Box className="d-flex justify-content-center align-items-center">
            <Link
              to={`/order_details/${value?.row?.order_id}?cs=1&production=1`}
              className=" d-flex "
            >
              <Button
                type="button"
                className="w-auto w-auto bg-transparent border-0 text-secondary fs-5"
              >
                <FaEye className="mb-1" />
              </Button>
            </Link>
          </Box>
        );
      },
    },
  ];

  const handleChange = (event, value) => {
    setPage(value);
    dispatch(
      setCurrentPage({ tableId: "CustomerSupportProduction", page: value })
    );
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

  const runProductionSearch = () => {
    const v = inputRef.current?.value?.trim() ?? "";
    setSearchOrderID(v);
    setPage(1);
    let url = `wp-json/custom-pro-orders/v1/pro-orders/?page=1&per_page=${pageSize}`;
    if (v) url += `&order_id=${encodeURIComponent(v)}`;
    if (startDate && endDate) {
      url += `&start_date=${encodeURIComponent(
        startDate
      )}&end_date=${encodeURIComponent(endDate)}`;
    }
    dispatch(fetchProductionOrders({ apiUrl: url }));
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      runProductionSearch();
    }
  };

  const handleSearchFilter = () => {
    runProductionSearch();
  };

  const clearDateRange = () => {
    setSelectedDateRange([null, null]);
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, searchOrderID, page, isReset]);

  return (
    <Container fluid className="py-3">
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          Production
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
                  onKeyDown={handleKeyDown}
                  className="mr-sm-2 py-2"
                />
              </Form.Group>
            </Col>
            <Col xs="auto" lg="4">
              <Form.Group style={{ position: "relative" }}>
                <Form.Label className="fw-semibold mb-0">Date filter:</Form.Label>
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
                  style={{ width: "100px", textAlign: "center" }}
                  value={overAllData.total_count}
                  readOnly
                />
              </Form.Group>
              <Form.Group className="d-flex mx-1 align-items-center">
                <Form.Label className="fw-semibold mb-0 me-2">
                  Total pages:
                </Form.Label>
                <Form.Control
                  as="input"
                  type="number"
                  className="color-black"
                  style={{ width: "100px", textAlign: "center" }}
                  value={overAllData.total_pages}
                  readOnly
                />
              </Form.Group>
            </Box>
            <Box className="d-flex">
              <Form.Group className="d-flex mx-1 align-items-center">
                <Form.Label className="fw-semibold mb-0 me-2">Page Size:</Form.Label>
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
      <PrintModal
        show={showModal}
        handleClosePrintModal={() => setShowModal(false)}
        showModal={showModal}
        orderData={orderData}
      />
      <Modal
        show={showProductModal}
        onHide={handleCloseProductModal}
        centered
        size="lg"
        scrollable
      >
        <Modal.Header closeButton>
          <Modal.Title>
            Product details
            {productModalOrderId != null
              ? ` (Order #${productModalOrderId})`
              : ""}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {productModalLines.length === 0 ? (
            <Alert severity="info" sx={{ mb: 0 }}>
              No line items returned for this order.
            </Alert>
          ) : (
            <Table responsive bordered hover size="sm" className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Name</th>
                  <th>Variant Details</th>
                  <th style={{ width: 120 }}>Image</th>
                </tr>
              </thead>
              <tbody>
                {productModalLines.map((line, idx) => {
                  const name =
                    line.product_eng_name || line.product_name || "—";
                  const variantText =
                    line.variation_id != null && line.variation_id !== ""
                      ? `Variation ID: ${line.variation_id}`
                      : "—";
                  const imgSrc =
                    line.product_image || require("../../assets/default.png");
                  return (
                    <tr key={`${line.item_id ?? idx}-${idx}`}>
                      <td className="align-middle">{name}</td>
                      <td className="align-middle small">{variantText}</td>
                      <td className="align-middle text-center">
                        <img
                          src={imgSrc}
                          alt=""
                          style={{
                            maxHeight: 72,
                            maxWidth: 72,
                            objectFit: "contain",
                            borderRadius: 4,
                          }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCloseProductModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default CustomerSupportProduction;
