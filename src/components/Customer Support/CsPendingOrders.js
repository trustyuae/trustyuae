import React, { useEffect, useMemo, useRef, useState } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { Alert, Box, Typography } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import CancelIcon from "@mui/icons-material/Cancel";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import dayjs from "dayjs";
import DataTable from "../DataTable";
import Loader from "../../utils/Loader";
import { fetchAccountOrders } from "../../Redux2/slices/CustomerSupportSlice";
import { getUserData } from "../../utils/StorageUtils";

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

function formatAccountOrderStatus(itemsByCategory) {
  if (!itemsByCategory || typeof itemsByCategory !== "object") return "—";
  const keys = Object.keys(itemsByCategory).filter(
    (k) => Array.isArray(itemsByCategory[k]) && itemsByCategory[k].length > 0
  );
  return keys.length ? keys.join(", ") : "—";
}

function normalizePersonLabel(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function getOrderAssignedUser(order) {
  if (!order || typeof order !== "object") return "";
  const direct = String(order.assign_user ?? order.started_by ?? "").trim();
  if (direct) return direct;
  const lineAssigned = getCsOrderLineItems(order).find(
    (item) => String(item?.assign_user ?? item?.started_by ?? "").trim() !== ""
  );
  return String(
    lineAssigned?.assign_user ?? lineAssigned?.started_by ?? ""
  ).trim();
}

function orderMatchesLoggedInCsAssignee(order, userData) {
  if (!order || !userData) return false;
  const assigned = normalizePersonLabel(getOrderAssignedUser(order));
  if (!assigned) return false;
  const candidates = new Set(
    [
      userData.name,
      userData.display_name,
      userData.user_login,
      userData.username,
      userData.user_nicename,
      [userData.first_name, userData.last_name].filter(Boolean).join(" "),
      userData.first_name,
    ]
      .map(normalizePersonLabel)
      .filter(Boolean)
  );
  return candidates.has(assigned);
}

function CsPendingOrders() {
  const dispatch = useDispatch();
  const inputRef = useRef(null);
  const [searchOrderID, setSearchOrderID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const [page, setPage] = useState(1);
  const [isReset, setIsReset] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [currentUserData, setCurrentUserData] = useState(null);
  const [userContextLoaded, setUserContextLoaded] = useState(false);
  const pageSizeOptions = [5, 10, 20, 50, 100];

  const loader = useSelector(
    (state) => state?.customerSupport?.isAccountOrdersLoading
  );
  const accountOrdersRaw = useSelector(
    (state) => state?.customerSupport?.accountOrders ?? []
  );

  useEffect(() => {
    let mounted = true;
    async function loadUser() {
      try {
        const data = await getUserData();
        if (!mounted) return;
        setCurrentUserData(data ?? null);
      } catch (_) {
        if (!mounted) return;
        setCurrentUserData(null);
      } finally {
        if (mounted) setUserContextLoaded(true);
      }
    }
    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  function buildAccountApiUrl() {
    const orderIdFromInput = inputRef.current?.value?.trim() ?? "";
    const orderId = orderIdFromInput !== "" ? orderIdFromInput : searchOrderID;
    let url = `wp-json/custom-account-orders/v1/account-orders/?page=1&per_page=500`;
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

  useEffect(() => {
    if (!userContextLoaded) return;
    dispatch(fetchAccountOrders({ apiUrl: buildAccountApiUrl() }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, searchOrderID, startDate, endDate, isReset, userContextLoaded]);

  const filteredOrders = useMemo(() => {
    return accountOrdersRaw
      .filter((order) =>
        orderMatchesLoggedInCsAssignee(order, currentUserData)
      )
      .map((order, index) => ({
        ...order,
        id: order.order_id ?? index,
        date_display: order.order_date
          ? dayjs(order.order_date).format("YYYY-MM-DD")
          : "",
        order_status: formatAccountOrderStatus(order.items_by_category),
        assigned_user: getOrderAssignedUser(order) || "—",
      }));
  }, [accountOrdersRaw, currentUserData]);

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / pageSize));

  const pagedOrders = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, page, pageSize]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(1);
    }
  }, [page, totalPages]);

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
        return (page - 1) * pageSize + (Number.isFinite(idx) ? idx : 0) + 1;
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
      flex: 1.2,
    },
    {
      field: "order_status",
      headerName: "Status",
      className: "order-system",
      flex: 1,
    },
    {
      field: "assigned_user",
      headerName: "Assigned Person",
      className: "order-system",
      flex: 1.2,
    },
    {
      field: "view_item",
      headerName: "View",
      className: "order-system",
      flex: 0.7,
      sortable: false,
      renderCell: (value) => {
        return (
          <Box className="d-flex justify-content-center align-items-center">
            <Link
              to={`/order_details/${value?.row?.order_id}?cs=1&account=1&pending=1`}
              className="d-flex"
            >
              <Button
                type="button"
                className="w-auto bg-transparent border-0 text-secondary fs-5"
              >
                <FaEye className="mb-1" />
              </Button>
            </Link>
          </Box>
        );
      },
    },
  ];

  const handleDateChange = (newDateRange) => {
    if (newDateRange[0]?.$d && newDateRange[1]?.$d) {
      setSelectedDateRange(newDateRange);
      setStartDate(
        dayjs(newDateRange[0].$d.toDateString()).format("YYYY-MM-DD")
      );
      setEndDate(dayjs(newDateRange[1].$d.toDateString()).format("YYYY-MM-DD"));
      setPage(1);
    }
  };

  const clearDateRange = () => {
    setSelectedDateRange([null, null]);
    setStartDate("");
    setEndDate("");
    setPage(1);
  };

  const handleSearchFilter = () => {
    const v = inputRef.current?.value?.trim() ?? "";
    setSearchOrderID(v);
    setPage(1);
  };

  const handleReset = () => {
    if (inputRef.current) inputRef.current.value = "";
    setSearchOrderID("");
    setStartDate("");
    setEndDate("");
    setSelectedDateRange([null, null]);
    setPage(1);
    setIsReset((prev) => !prev);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value, 10));
    setPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearchFilter();
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container fluid className="py-3">
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          CS Pending Orders
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
                  value={filteredOrders.length}
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
                  value={totalPages}
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
      {loader || !userContextLoaded ? (
        <Loader />
      ) : pagedOrders.length > 0 ? (
        <div className="mt-2">
          <DataTable
            columns={columns}
            rows={pagedOrders}
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
    </Container>
  );
}

export default CsPendingOrders;
