import React, { useState, useEffect, useRef } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  IconButton,
  Snackbar,
  Typography,
} from "@mui/material";
import DataTable from "../DataTable";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { ButtonGroup, ToggleButton } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { getCountryName } from "../../utils/GetCountryName";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import {
  AssignTrackID,
  OrderDetailsChinaGet,
  OrderTrackingSystemChinaGet,
  PushTrackOrder,
} from "../../Redux2/slices/OrderSystemChinaSlice";
import { useTranslation } from "react-i18next";
import ShowAlert from "../../utils/ShowAlert";
import { Link, useNavigate } from "react-router-dom";
import OrderTrackingFileUpload from "./OrderTrackingFileUpload";
import UploadFileOutlinedIcon from "@mui/icons-material/UploadFileOutlined";
import * as XLSX from "xlsx";
import { FaEye } from "react-icons/fa";

function OrderTrackingNumberPending() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [allSelected, setAllSelected] = useState(false);

  const [showFileUploadModal, setShowfileUploadModal] = useState(false);
  const [tempTrackIds, setTempTrackIds] = useState({});

  const loader = useSelector((state) => state?.orderSystemChina?.isLoading);
  const ordersData = useSelector(
    (state) => state?.orderSystemChina?.ordersTracking?.orders
  );
  const otherData = useSelector(
    (state) => state?.orderSystemChina?.ordersTracking
  );
  const orderDetails = useSelector(
    (state) => state?.orderSystemChina?.orderDetails
  );

  const itemsData = useSelector(
    (state) => state?.orderSystemChina?.ordersTracking?.orders?.items
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
    let apiUrl = `wp-json/custom-orders-new/v1/orders/?warehouse=China&trackorder=0`;
    if (searchOrderID) apiUrl += `&orderid=${searchOrderID}`;
    if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
    dispatch(
      OrderTrackingSystemChinaGet({
        apiUrl: `${apiUrl}&page=${page}&per_page=${pageSize}&status=${dispatchType}`,
      })
    );
  }

  const onSelectAll = () => {
    if (allSelected) {
      // Deselect all items on the current page
      setSelectedItemIds([]);
      setSelectedItems([]);
    } else {
      // Select all items on the current page
      const allIdsOnPage = orders.map((order) => order.id); // Update to get IDs of items on the current page
      setSelectedItemIds(allIdsOnPage);
      setSelectedItems(orders); // Select all items on the current page
    }
    setAllSelected(!allSelected);
  };

  const handleItemSelection = (rowData) => {
    const selectedIndex = selectedItemIds.indexOf(rowData.id);
    const newSelected =
      selectedIndex !== -1
        ? selectedItemIds.filter((id) => id !== rowData.id)
        : [...selectedItemIds, rowData.id];

    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, rowData]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item.id !== rowData.id));
    }
    setSelectedItemIds(newSelected);
  };

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
      dispatch(OrderDetailsChinaGet({ id: orderId }));
      setShowModal(true);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTrackIdAssign = (row, event) => {

    const { value } = event.target;

    setTempTrackIds((prev) => ({
      ...prev,
      [row.id]: value, // Temporarily store tracking ID for this row
    }));

    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === row.id
          ? {
              ...order,
              items: order.items.map((item) => ({
                ...item,
                tracking_id: value,
              })),
            }
          : order
      )
    );
  };

  const handleUpdate = (rowData) => {
    const orderId = rowData.order_id;
    const productIds = rowData.items.map((item) => parseInt(item.item_id, 10));
    const variationIds = rowData.items.map((item) =>
      parseInt(item.variation_id, 10)
    );
    const trackingId = tempTrackIds[rowData.id]; // Use the temporary tracking ID
    const payload = {
      track_id: trackingId, // Use the updated tracking ID
      product_id: productIds,
      variation_id: variationIds,
    };

    // Update the row with the new tracking ID
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.id === rowData.id
          ? {
              ...order,
              items: order.items.map((item) => ({
                ...item,
                tracking_id: trackingId,
              })),
            }
          : order
      )
    );

    // Dispatch the update action
    dispatch(AssignTrackID({ orderId, payload }));

    // Optionally: Clear the temporary tracking ID after the update
    setTempTrackIds((prev) => {
      const newState = { ...prev };
      delete newState[rowData.id];
      return newState;
    });
  };

  const handlePush = (rowData) => {
    const payload = {
      order_id: [parseInt(rowData.order_id, 10)], // Parse and wrap in an array in one step
      product_id: rowData.items.map((item) => parseInt(item.item_id, 10)),
      variation_id: rowData.items.map((item) =>
        parseInt(item.variation_id, 10)
      ),
    };
    dispatch(PushTrackOrder({ payload })).then(({ payload }) => {
      ShowAlert("Success", payload, "success", false, false, null, "", 1000);
    });
    navigate("/ordersystem_in_china");
  };

  const handleSelectedPush = async () => {
    console.log(selectedItems, "selectedItems");
    const selectedOrderIds = selectedItems.map((item) =>
      parseInt(item.order_id, 10)
    );
    const allProductIds = selectedItems.flatMap(
      (item) =>
        item.items?.map((subItem) => parseInt(subItem.item_id, 10)) || []
    );
    const allVariationIds = selectedItems.flatMap(
      (item) =>
        item.items?.map((subItem) => parseInt(subItem.variation_id, 10)) || []
    );

    const hasItemsInSystem = selectedItems.some(
      (item) => item.exist_item === "1"
    );

    if (hasItemsInSystem) {
      ShowAlert(
        "",
        "This order has items available in P1 system China",
        "error",
        false,
        false,
        null,
        "",
        1000
      );
      return;
    }

    const payload = {
      order_id: selectedOrderIds,
      product_id: allProductIds,
      variation_id: allVariationIds,
    };

    dispatch(PushTrackOrder({ payload })).then(({ payload }) => {
      ShowAlert("Success", payload, "success", false, false, null, "", 1000);
    });
    // Deselect all items
    setSelectedItemIds([]);
    setSelectedItems([]);
    navigate("/ordersystem_in_china");
  };

  const downloadExcel = async () => {
    console.log(orders, "orders from downloadexcel");
    console.log(selectedItems, "selectedItems from downloadexcel");
    const filteredOrderData = orders.map((order) => {
      return {
        "Order Id": order.order_id,
        "Product Name": order.items.map((item) => item.product_name).join(", "),
        "Shipping Country": order.shipping_country,
        "Tracking ID": order.items.map((item) => item.tracking_id).join(", "),
      };
    });

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(filteredOrderData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Order Data");

    XLSX.writeFile(workbook, "OrderTrackingData.xlsx");
  };

  const downloadSelectedItemsExcel = async () => {
    const filteredOrderData = selectedItems.map((order) => {
      return {
        "Order Id": order.order_id,
        "Product Name": order.items.map((item) => item.product_name).join(", "),
        "Shipping Country": order.shipping_country,
        "Tracking ID": order.items.map((item) => item.tracking_id).join(", "),
      };
    });

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(filteredOrderData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Order Data");

    XLSX.writeFile(workbook, "OrderTrackingData.xlsx");
    // Deselect all items
    setSelectedItemIds([]);
    setSelectedItems([]);
  };

  const downloadExcelIndividual = async (rowData) => {
    const filteredOrderData = [
      {
        "Order Id": rowData.order_id,
        "Product Name": rowData.items
          .map((item) => item.product_name)
          .join(", "),
        "Shipping Country": rowData.shipping_country,
        "Tracking ID": rowData.items.map((item) => item.tracking_id).join(", "),
      },
    ];

    const workbook = XLSX.utils.book_new();

    const worksheet = XLSX.utils.json_to_sheet(filteredOrderData);

    XLSX.utils.book_append_sheet(workbook, worksheet, "Order Data");

    XLSX.writeFile(workbook, "OrderTrackingData.xlsx");
  };

  const columns = [
    {
      field: "select",
      headerName: t("POManagement.Select"),
      flex: 0.5,
      renderHeader: (params) => (
        <FormControlLabel
          control={
            <Checkbox
              checked={allSelected}
              onChange={() => onSelectAll()}
              indeterminate={selectedItemIds.length > 0 && !allSelected} // Show indeterminate state if some but not all items are selected
            />
          }
          label={t("POManagement.Select")}
          style={{ justifyContent: "center" }}
        />
      ),
      renderCell: (params) => (
        <FormGroup>
          <FormControlLabel
            className="mx-auto"
            control={
              <Checkbox
                checked={selectedItemIds.includes(params.row.id)}
                onChange={() => handleItemSelection(params.row)}
              />
            }
            style={{ justifyContent: "center" }}
          />
        </FormGroup>
      ),
    },
    {
      field: "date",
      headerName: t("POManagement.Date"),
      className: "order-system-track",
      flex: 1,
    },
    {
      field: "order_id",
      headerName: t("P1ChinaSystem.OrderId"),
      className: "order-system-track",
      flex: 0.5,
    },
    {
      field: "items",
      headerName: t("P1ChinaSystem.ProductName"),
      className: "order-system-track",
      flex: 1,
      renderCell: (params) => {
        const productNames = params?.row?.items
          ?.map((item) => item?.product_name)
          .join(", ");
        return <div>{productNames}</div>;
      },
    },
    {
      field: "shipping_country",
      headerName: t("P1ChinaSystem.ShippingCountry"),
      type: "string",
      className: "order-system-track",
      flex: 1,
      valueGetter: (value, row) => getCountryName(row.shipping_country),
    },
    {
      field: "order_status",
      headerName: t("P1ChinaSystem.TrackingID"),
      flex: 1.5,
      className: "order-system-track",
      renderCell: (params) => {
        const trackId =
          tempTrackIds[params.row.id] || params.row.items[0]?.tracking_id || "";
        return (
          <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
            <Form.Control
              type="text"
              value={trackId !== "0" ? trackId : ""} // Assign tracking ID directly, including "0"
              placeholder={
                trackId === "0" || trackId === ""
                  ? "Please Enter trackID"
                  : trackId
              }
              onChange={(e) => handleTrackIdAssign(params.row, e)}
              onPaste={(e) => {
                e.preventDefault();
                const pastedText = e.clipboardData.getData("text");
                handleTrackIdAssign(params.row, {
                  target: { value: pastedText },
                });
              }} // Handle paste event and replace any placeholder
              style={{
                width: "90%",
                textAlign: "center",
                fontWeight: trackId !== "" ? "bold" : "normal", // Conditionally set font weight
              }}
            />
          </Form.Group>
        );
      },
    },
    {
      field: "",
      headerName: t("P1ChinaSystem.ExcellSheet"),
      flex: 0.5,
      className: "order-system-track",
      type: "html",
      renderCell: (value, row) => {
        return (
          <Button
            type="button"
            className="w-auto w-auto bg-transparent border-0 text-secondary fs-5"
            onClick={() => downloadExcelIndividual(value.row)}
          >
            <UploadFileOutlinedIcon className="mb-1" />
          </Button>
        );
      },
    },
    {
      field: "view_item",
      headerName: t("POManagement.Action"),
      flex: 1.5,
      className: "order-system-track",
      type: "html",
      renderCell: (params) => {
        const pushOff =
          params.row.exist_item === "1" ||
          params.row.items[0]?.tracking_id === "0" ||
          params.row.items[0]?.tracking_id === "" ||
          tempTrackIds[params.row.id]
            ? true
            : false;
        return (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              size="small"
              variant="primary"
              color="primary"
              onClick={() => handleUpdate(params.row)}
              className="buttonStyle"
            >
              {t("P1ChinaSystem.Update")}
            </Button>
            <Button
              size="small"
              disabled={pushOff}
              variant="danger"
              color="danger"
              onClick={() => handlePush(params.row)}
              style={{ marginLeft: 8 }} // Adds space between buttons
              className="buttonStyle"
            >
              {t("P1ChinaSystem.Push")}
            </Button>
            <Link
              to={`/order_tracking_number_pending_details/${params?.row?.order_id}`}
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

  const clearDateRange = () => {
    setSelectedDateRange([null, null]);
    setStartDate("");
    setEndDate("");
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    pageSize,
    searchOrderID,
    page,
    dispatchType,
    isReset,
    setSearchOrderID,
    itemsData,
  ]);

  return (
    <Container fluid className="py-3">
      <Box className="d-flex mb-4 justify-content-between">
        <Typography variant="h4" className="fw-semibold">
          {t("P1ChinaSystem.OrderTrackingNumberPending")}
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
              <Button
                type="button"
                variant="secondary"
                className="mr-2 mx-1 w-auto"
                onClick={() => setShowfileUploadModal(true)}
              >
                {t("P1ChinaSystem.Upload")}
              </Button>
              <Button
                type="button"
                className="mr-2 mx-1 w-auto"
                onClick={() => handleSelectedPush()}
              >
                {t("P1ChinaSystem.Push")}
              </Button>
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
                {t("P1ChinaSystem.Search")}
              </Button>
              <Button
                type="button"
                className="mr-2 mx-1 w-auto"
                onClick={handleReset}
              >
                {t("P1ChinaSystem.ResetFilter")}
              </Button>
              <Button
                type="button"
                variant="secondary"
                className="mr-2 mx-1 w-auto"
                onClick={
                  selectedItems && selectedItems.length != 0
                    ? downloadSelectedItemsExcel
                    : downloadExcel
                }
              >
                {t("P1ChinaSystem.ExcellSheet")}
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
      <OrderTrackingFileUpload
        show={showFileUploadModal}
        handleClosePrintModal={() => setShowfileUploadModal(false)}
        showModal={showFileUploadModal}
        onFileUpload={fetchOrders}
      />
    </Container>
  );
}

export default OrderTrackingNumberPending;
