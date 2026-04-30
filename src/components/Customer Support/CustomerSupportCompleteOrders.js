import React, { useState, useEffect, useRef, useMemo } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Modal from "react-bootstrap/Modal";
import { Link } from "react-router-dom";
import { Alert, Box, IconButton, Snackbar, Typography } from "@mui/material";
import DataTable from "../DataTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { FaEye } from "react-icons/fa";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { setCurrentPage } from "../../Redux2/slices/PaginationSlice";
import { useDispatch, useSelector } from "react-redux";
import { fetchCsCompletedOrders } from "../../Redux2/slices/CustomerSupportSlice";
import Loader from "../../utils/Loader";

function formatRowDate(value) {
  if (value == null || value === "") return "—";
  const d = dayjs(value);
  return d.isValid() ? d.format("YYYY-MM-DD") : String(value);
}

function extractFinalNoteEntries(items) {
  /** Returns [{ user, message }] parsed from `items[].final_note`. */
  if (!Array.isArray(items) || items.length === 0) {
    return [{ user: "N/A", message: "—" }];
  }
  const raw = items.find((it) => String(it?.final_note ?? "").trim() !== "")
    ?.final_note;
  if (!raw) return [{ user: "N/A", message: "—" }];
  if (typeof raw !== "string") {
    return [{ user: "N/A", message: String(raw) }];
  }
  const trimmed = raw.trim();
  if (!trimmed) return [{ user: "N/A", message: "—" }];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      const entries = parsed
        .map((entry) => ({
          user: String(entry?.user ?? "").trim() || "N/A",
          message: String(entry?.message ?? "").trim() || "—",
        }))
        .filter((entry) => entry.user !== "N/A" || entry.message !== "—");
      return entries.length ? entries : [{ user: "N/A", message: "—" }];
    }
    if (parsed && typeof parsed === "object") {
      return [
        {
          user: String(parsed.user ?? "").trim() || "N/A",
          message: String(parsed.message ?? "").trim() || "—",
        },
      ];
    }
    return [{ user: "N/A", message: trimmed }];
  } catch (_) {
    return [{ user: "N/A", message: trimmed }];
  }
}

function CustomerSupportCompleteOrders() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [searchOrderID, setSearchOrderID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [isReset, setIsReset] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [selectedCompletedDateRange, setSelectedCompletedDateRange] = useState(
    [null, null]
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedFinalNoteEntries, setSelectedFinalNoteEntries] = useState([
    { user: "N/A", message: "—" },
  ]);

  const loader = useSelector(
    (state) => state?.customerSupport?.isCsCompletedOrdersLoading
  );
  const csCompletedRaw = useSelector(
    (state) => state?.customerSupport?.csCompletedOrders ?? []
  );
  const csCompletedPagination = useSelector(
    (state) => state?.customerSupport?.csCompletedOrdersPagination
  );

  const totalPages = Math.max(1, csCompletedPagination?.total_pages ?? 1);

  const overAllData = useMemo(
    () => ({
      total_count: csCompletedPagination?.total_orders ?? 0,
      total_pages: csCompletedPagination?.total_pages ?? 0,
    }),
    [csCompletedPagination]
  );

  const rows = useMemo(() => {
    return csCompletedRaw.map((o, i) => {
      const placeRaw = o.date ?? o.order_date ?? o.start_date;
      const doneRaw =
        o.updated_at ??
        o.completed_date ??
        o.end_date ??
        o.completed_at ??
        o.date;
      return {
        ...o,
        id: String(o.order_id ?? `row-${i}`),
        start_date: formatRowDate(placeRaw),
        end_date: formatRowDate(doneRaw),
      };
    });
  }, [csCompletedRaw]);

  function buildCsCompletedUrl() {
    const orderId = searchOrderID.trim();
    let url = `wp-json/custom-completed-orders/v1/cs-completed/?page=${page}&per_page=${pageSize}`;
    if (orderId) {
      url += `&order_id=${encodeURIComponent(orderId)}`;
    }
    if (startDate && endDate) {
      url += `&start_date=${encodeURIComponent(
        startDate
      )}&end_date=${encodeURIComponent(endDate)}`;
    }
    if (completedStartDate && completedEndDate) {
      url += `&completed_start_date=${encodeURIComponent(
        completedStartDate
      )}&completed_end_date=${encodeURIComponent(completedEndDate)}`;
    }
    return url;
  }

  useEffect(() => {
    dispatch(fetchCsCompletedOrders({ apiUrl: buildCsCompletedUrl() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    page,
    pageSize,
    searchOrderID,
    startDate,
    endDate,
    completedStartDate,
    completedEndDate,
    isReset,
    dispatch,
  ]);

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(String(text))
      .then(() => setSnackbarOpen(true))
      .catch((err) => console.error("Failed to copy:", err));
  };

  const handleOpenNoteModal = (row) => {
    setSelectedFinalNoteEntries(extractFinalNoteEntries(row?.items));
    setShowNoteModal(true);
  };

  const handleCloseNoteModal = () => {
    setShowNoteModal(false);
    setSelectedFinalNoteEntries([{ user: "N/A", message: "—" }]);
  };

  const columns = [
    {
      field: "start_date",
      headerName: "Order Place Date",
      className: "completed-order-system",
      flex: 1,
    },
    {
      field: "order_id",
      headerName: "Order ID",
      className: "completed-order-system",
      flex: 0.5,
      renderCell: (params) => {
        const OrderIDD = params?.row?.order_id ?? "";
        return (
          <Box className="d-flex align-items-center justify-content-center">
            <Typography>{OrderIDD}</Typography>
            {OrderIDD !== "0" && OrderIDD !== "" && (
              <IconButton onClick={() => handleCopy(OrderIDD)} size="small">
                <ContentCopyIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        );
      },
    },
    {
      field: "customer_name",
      headerName: "Customer Name",
      className: "completed-order-system",
      flex: 1,
    },
    {
      field: "note_view",
      headerName: "Note",
      flex: 0.55,
      className: "completed-order-system",
      sortable: false,
      renderCell: (params) => (
        <Button
          type="button"
          onClick={() => handleOpenNoteModal(params.row)}
          className="w-auto bg-transparent border-0 text-secondary fs-5"
          aria-label="View note"
        >
          <FaEye className="mb-1" />
        </Button>
      ),
    },
    {
      field: "end_date",
      headerName: "Completed Date",
      className: "completed-order-system",
      flex: 1,
    },
    {
      field: "view_item",
      headerName: "View Item",
      flex: 0.5,
      className: "completed-order-system",
      type: "html",
      renderCell: (value) => {
        return (
          <Link
            to={`/order_details/${value?.row?.order_id}?cs=1&complete=1`}
            className="d-flex justify-content-center"
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
    dispatch(
      setCurrentPage({ tableId: "CustomerSupportCompleteOrders", page: value })
    );
  };

  const handleDateChange = (newDateRange) => {
    if (newDateRange[0]?.$d && newDateRange[1]?.$d) {
      setSelectedDateRange(newDateRange);
      setStartDate(
        dayjs(newDateRange[0].$d.toDateString()).format("YYYY-MM-DD")
      );
      setEndDate(dayjs(newDateRange[1].$d.toDateString()).format("YYYY-MM-DD"));
    }
  };

  const handleCompletedDateChange = (newDateRange) => {
    if (newDateRange[0]?.$d && newDateRange[1]?.$d) {
      setSelectedCompletedDateRange(newDateRange);
      setCompletedStartDate(
        dayjs(newDateRange[0].$d.toDateString()).format("YYYY-MM-DD")
      );
      setCompletedEndDate(
        dayjs(newDateRange[1].$d.toDateString()).format("YYYY-MM-DD")
      );
    }
  };

  const handleSearchFilter = (e) => {
    e.preventDefault();
    const v = inputRef.current?.value?.trim() ?? "";
    setSearchOrderID(v);
    setPage(1);
  };

  const handleReset = () => {
    if (inputRef.current) inputRef.current.value = "";
    setSearchOrderID("");
    setStartDate("");
    setEndDate("");
    setCompletedStartDate("");
    setCompletedEndDate("");
    setSelectedDateRange([null, null]);
    setSelectedCompletedDateRange([null, null]);
    setPage(1);
    setIsReset((prev) => !prev);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1);
  };

  const orderIdKeyDown = (e) => {
    if (e.key === "Enter") handleSearchFilter(e);
  };

  const clearDateRange = () => {
    setSelectedDateRange([null, null]);
    setStartDate("");
    setEndDate("");
  };

  const clearCompletedDateRange = () => {
    setSelectedCompletedDateRange([null, null]);
    setCompletedStartDate("");
    setCompletedEndDate("");
  };

  return (
    <Container fluid className="py-3">
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          Complete orders
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
                  onKeyDown={orderIdKeyDown}
                  className="mr-sm-2 py-2"
                />
              </Form.Group>
            </Col>
            <Col xs="auto" lg="4">
              <Form.Group style={{ position: "relative" }}>
                <Form.Label className="fw-semibold mb-0">
                  Start Date Filter:
                </Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["SingleInputDateRangeField"]}>
                    <DateRangePicker
                      sx={{
                        "& .MuiInputBase-root": { paddingRight: 0 },
                        "& .MuiInputBase-input": {
                          padding: ".5rem .75rem .5rem .75rem",
                          "&:hover": { borderColor: "#dee2e6" },
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
                  Completed Date Filter:
                </Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DemoContainer components={["SingleInputDateRangeField"]}>
                    <DateRangePicker
                      sx={{
                        "& .MuiInputBase-root": { paddingRight: 0 },
                        "& .MuiInputBase-input": {
                          padding: ".5rem .75rem .5rem .75rem",
                          "&:hover": { borderColor: "#dee2e6" },
                        },
                      }}
                      value={selectedCompletedDateRange}
                      onChange={handleCompletedDateChange}
                      slots={{ field: SingleInputDateRangeField }}
                    />
                  </DemoContainer>
                </LocalizationProvider>
                {selectedCompletedDateRange[0] &&
                  selectedCompletedDateRange[1] && (
                    <CancelIcon
                      style={{
                        position: "absolute",
                        right: "0",
                        top: "47px",
                      }}
                      onClick={clearCompletedDateRange}
                    />
                  )}
              </Form.Group>
            </Col>
          </Row>
          <Box className="d-flex justify-content-between align-items-center flex-wrap">
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
          {rows && rows.length !== 0 ? (
            <div className="mt-2">
              <DataTable
                columns={columns}
                rows={rows}
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
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={1000}
        onClose={() => setSnackbarOpen(false)}
        message="Order ID copied to clipboard!"
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      />
      <Modal show={showNoteModal} onHide={handleCloseNoteModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Order Note</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-0">
            <Form.Label className="fw-semibold">Note</Form.Label>
            <Box
              sx={{
                border: "1px solid #dee2e6",
                borderRadius: "6px",
                padding: "10px 12px",
                maxHeight: 260,
                overflowY: "auto",
              }}
            >
              {selectedFinalNoteEntries.map((entry, idx) => (
                <Box
                  key={`note-entry-${idx}`}
                  sx={{
                    mb: idx === selectedFinalNoteEntries.length - 1 ? 0 : 1.5,
                    pb: idx === selectedFinalNoteEntries.length - 1 ? 0 : 1.5,
                    borderBottom:
                      idx === selectedFinalNoteEntries.length - 1
                        ? "none"
                        : "1px solid #f0f0f0",
                  }}
                >
                  <Typography variant="body2" className="mb-1">
                    <strong>User name:</strong> {entry.user || "N/A"}
                  </Typography>
                  <Typography variant="body2">
                    <strong>Note:</strong> {entry.message || "—"}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Form.Group>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default CustomerSupportCompleteOrders;
