import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { Link } from "react-router-dom";
import { Alert, Box, IconButton, Snackbar, Typography } from "@mui/material";
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
import { CompletedOrderSystemGet } from "../../Redux2/slices/OrderSystemSlice";
import {
  clearStoreData,
  setCurrentPage,
} from "../../Redux2/slices/PaginationSlice";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import * as XLSX from 'xlsx';
import AxiosInstance from '../../utils/AxiosInstance';

function CompletedOrderSystem() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [orders, setOrders] = useState([]);
  const [searchOrderID, setSearchOrderID] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [completedStartDate, setCompletedStartDate] = useState("");
  const [completedEndDate, setCompletedEndDate] = useState("");
  const [pageSize, setPageSize] = useState(100);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isReset, setIsReset] = useState(false);
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [selectedCompletedDateRange, setSelectedCompletedDateRange] = useState([
    null,
    null,
  ]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const loader = useSelector((state) => state?.orderSystem?.isLoading);
  const [exportPageCount, setExportPageCount] = useState("");
  const [isExporting, setIsExporting] = useState(false);

  const completedOrdersData = useSelector(
    (state) => state?.orderSystem?.completedOrders
  );

  // const currentPage = useSelector((state) => state.pagination.currentPage);
  const currentPage =
    useSelector(
      (state) => state.pagination.currentPage["CompletedOrderSystem"]
    ) || 1;

  useEffect(() => {
    if (currentPage) {
      dispatch(clearStoreData({ tableId: "CompletedOrderSystem" }));
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
  }, [completedOrdersData, currentPage]);

  async function fetchOrders() {
    let apiUrl = `wp-json/custom-orders-completed/v1/completed-orders/?warehouse=&page=${page}&per_page=${pageSize}`;
    if (searchOrderID) apiUrl += `&orderid=${searchOrderID}`;
    if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
    if (completedEndDate)
      apiUrl += `&completed_start_date=${completedStartDate}&completed_end_date=${completedEndDate}`;
    dispatch(
      CompletedOrderSystemGet({
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

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSnackbarOpen(true);
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
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
        const OrderIDD = params?.row?.order_id || [];
        return (
          <Box className="d-flex align-items-center justify-content-center">
            <Typography>{OrderIDD}</Typography>
            {OrderIDD !== "0" && (
              <IconButton onClick={() => handleCopy(OrderIDD)}>
                <ContentCopyIcon />
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
      field: "shipping_country",
      headerName: "Shipping Country",
      type: "string",
      className: "completed-order-system",
      flex: 1,
      valueGetter: (value, row) => getCountryName(row.shipping_country),
    },
    {
      field: "order_status",
      headerName: "Order Status",
      flex: 1,
      className: "completed-order-system",
      type: "string",
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
      renderCell: (value, row) => {
        return (
          <Link
            to={`/completed_order_details/${value?.row?.order_id}`}
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
    dispatch(setCurrentPage({ tableId: "CompletedOrderSystem", page: value }));
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
    // }, [pageSize, page,searchOrderID, isReset,selectedDateRange,selectedCompletedDateRange]);
  }, [pageSize, page, searchOrderID, isReset, setSearchOrderID]);

  // Helper to fetch data for a specific page (use AxiosInstance)
  const fetchPageData = async (pageNum) => {
    let apiUrl = `wp-json/custom-orders-completed/v1/completed-orders/?warehouse=&page=${pageNum}&per_page=${pageSize}`;
    if (searchOrderID) apiUrl += `&orderid=${searchOrderID}`;
    if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
    if (completedEndDate)
      apiUrl += `&completed_start_date=${completedStartDate}&completed_end_date=${completedEndDate}`;
    const response = await AxiosInstance.get(apiUrl);
    return response.data.orders || [];
  };

  const exportToExcel = async () => {
    if (isExporting) return;
    let exportPages = parseInt(exportPageCount);
    if (exportPageCount && (!exportPages || exportPages < 1)) {
      alert('Please enter a valid page number greater than 0.');
      return;
    }
    setIsExporting(true);
    try {
      let allOrders = orders;
      if (exportPageCount && exportPages > 0) {
        // Fetch all pages in parallel for speed
        const fetchPromises = [];
        for (let i = 1; i <= exportPages; i++) {
          fetchPromises.push(fetchPageData(i));
        }
        const pagesResults = await Promise.all(fetchPromises);
        let combinedOrders = [];
        pagesResults.forEach(pageOrders => {
          combinedOrders = combinedOrders.concat(pageOrders);
        });
        allOrders = combinedOrders.map((v, i) => ({ ...v, id: i }));
      }
      // Create an array to hold all items from all orders
      const excelData = allOrders.flatMap(order => {
        return order.items.map(item => ({
          'Date': order.start_date,
          'Order ID': order.order_id,
          'Customer Name': order.customer_name,
          'Contact No': order.contact_no || 'N/A',
          'Shipping Address': order.customer_shipping_address || 'N/A',
          'Shipping Country': getCountryName(order.shipping_country),
          'Order Status': order.order_status,
          'Completed Date': order.end_date,
          'Product ID': item.item_id,
          'Product Name': item.product_name,
          'Quantity': item.quantity,
          'Variation ID': item.variation_id,
          'Dispatch Type': item.dispatch_type || 'N/A',
          'Tracking ID': item.tracking_id || 'No Tracking ID',
          'Product Image': item.product_image || 'No Image',
          'Dispatch Image': item.dispatch_image || 'No Image'
        }));
      });
      const ws = XLSX.utils.json_to_sheet(excelData);
      const wscols = [
        {wch: 12}, {wch: 10}, {wch: 20}, {wch: 15}, {wch: 40}, {wch: 15}, {wch: 15}, {wch: 12}, {wch: 10}, {wch: 30}, {wch: 8}, {wch: 12}, {wch: 15}, {wch: 15}, {wch: 50}, {wch: 50}
      ];
      ws['!cols'] = wscols;
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Completed Orders");
      XLSX.writeFile(wb, exportPageCount && exportPages > 0 ? `Completed_Orders_Pages_1_to_${exportPages}.xlsx` : `Completed_Orders_Page_${page}.xlsx`);
    } catch (err) {
      alert('Export failed. Please try again.');
      console.error(err);
    }
    setIsExporting(false);
  };

  return (
    <Container fluid className="py-3">
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          Completed Order System
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
                  // value={searchOrderID}
                  onKeyDown={(e) => orderId(e)}
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
                  Completed Date Filter:
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
              onClick={(e) => handleSearchFilter(e)}
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
              <Box className="d-flex justify-content-end mt-3">
                <Form.Control
                  type="number"
                  min={1}
                  placeholder="Pages"
                  value={exportPageCount}
                  onChange={e => setExportPageCount(e.target.value.replace(/^0+/, '').replace(/[^0-9]/g, ""))}
                  style={{ width: 100, marginRight: 12 }}
                  disabled={isExporting}
                />
                <Button 
                  variant="success" 
                  onClick={exportToExcel}
                  className="d-flex align-items-center gap-2"
                  disabled={isExporting}
                >
                  <i className="fas fa-file-excel"></i>
                  {isExporting ? "Exporting..." : (exportPageCount ? "Export" : "Export to Excel")}
                </Button>
              </Box>
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
        autoHideDuration={1000} // Snackbar will auto-dismiss after 3 seconds
        onClose={() => setSnackbarOpen(false)}
        message="Order ID copied to clipboard!"
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      />
    </Container>
  );
}

export default CompletedOrderSystem;
