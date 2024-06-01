import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DataTable from "../DataTable";
import {
  Alert,
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { API_URL } from "../../redux/constants/Constants";
import { Card, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  AddManualPO,
  AddPO,
  AddSchedulePO,
  ManualOrScheduledPoDetailsData,
  PoDetailsData,
} from "../../redux/actions/P2SystemActions";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import PoDetailsModal from "./PoDetailsModal";
import ShowAlert from "../../utils/ShowAlert";

const EstimatedTime = ["1 week", "2 week", "3 week", "1 month", "Out of stock"];

function OrderManagementSystem() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [manualPOorders, setManualPoOrders] = useState([]);
  const [scheduledPOorders, setScheduleOrders] = useState([]);

  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedOrderIdss, setSelectedOrderIdss] = useState([]);
  const [selectedManualOrderIds, setSelectedManualOrderIds] = useState([]);
  const [selectedScheduleOrderIds, setSelectedScheduleOrderIds] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const pageSizeOptions = [5, 10, 20, 50, 100];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [factories, setFactories] = useState([]);

  //selected  factory filter
  const [selectedFactory, setSelectedFactory] = useState("");

  //selected Product filter
  const [manualProductF, setManualProductF] = useState("");

  const [manualNote, setManualNote] = useState("");

  const [scheduledNote, setScheduledNote] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [remainderDate, setRemainderDate] = useState("");
  const [poDetailsModal, setPoDetailsModal] = useState(false);
  const [productId, setProductId] = useState(null);

  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );

  const poLoader = useSelector(
    (state) => state?.orderNotAvailable?.isPoDetailsData
  );

  const manualOrScheduledPoLoader = useSelector(
    (state) => state?.orderNotAvailable?.isManualOrScheduledPoDetailsData
  );

  // po ogainst order colum
  const columns1 = [
    {
      field: "select",
      headerName: "Select",
      flex: 1,
      renderCell: (params) => {
        return (
          <FormGroup>
            <FormControlLabel
              className="mx-auto"
              control={<Checkbox />}
              style={{ justifyContent: "center" }}
              checked={selectedOrderIds.includes(params.row.product_name)}
              onChange={(event) =>
                handleOrderSelection(params.row.product_name)
              }
            />
          </FormGroup>
        );
      },
    },
    { field: "product_name", headerName: "Product names", flex: 1 },
    {
      field: "variation_value",
      headerName: "Variation values",
      flex: 1,
      renderCell: (params) => variant(params.row.variation_value),
    },
    {
      field: "product_images",
      headerName: "Product images",
      flex: 1,
      type: "html",
      renderCell: (value, row) => (
        <Box className="h-100 w-100 d-flex align-items-center">
          <Avatar
            src={value.row.product_image || require("../../assets/default.png")}
            alt={value.row.product_image}
            sx={{
              height: "45px",
              width: "45px",
              borderRadius: "2px",
              margin: "0 auto",
              "& .MuiAvatar-img": {
                height: "100%",
                width: "100%",
                borderRadius: "2px",
              },
            }}
          />
        </Box>
      ),
    },
    {
      field: "total_quantity",
      headerName: "Total quantity",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box onClick={() => handlePoModal(params.row.item_id)}>
            {params.row.total_quantity}
          </Box>
        );
      },
    },
    {
      field: "factory_id",
      headerName: "Factory Name",
      flex: 1,
      renderCell: (params) => {
        const factory = factories.find(
          (factory) => factory.id === params.row.factory_id
        );
        return factory ? factory.factory_name : "Assign to factory";
      },
    },
  ];
  //MPO
  const columnsMPO = [
    {
      field: "select",
      headerName: "Select",
      flex: 1,
      renderCell: (params) => (
        <FormGroup>
          <FormControlLabel
            className="mx-auto"
            control={<Checkbox />}
            style={{ justifyContent: "center" }}
            checked={selectedManualOrderIds.includes(params.row.product_id)}
            onChange={() => handleOrderManualSelection(params.row.product_id)}
          />
        </FormGroup>
      ),
    },
    {
      field: "factory_id",
      headerName: "Factory Name",
      flex: 1,
      renderCell: (prams) =>
        factories.find((factory) => factory.id === prams.row.factory_id)
          ?.factory_name,
    },
    { field: "product_name", headerName: "Product names", flex: 1 },
    {
      field: "product_image",
      headerName: "Product images",
      flex: 1,
      type: "html",
      renderCell: (value, row) => (
        <Box className="h-100 w-100 d-flex align-items-center">
          <Avatar
            src={value.row.product_image || require("../../assets/default.png")}
            alt={value.row.product_image}
            sx={{
              height: "45px",
              width: "45px",
              borderRadius: "2px",
              margin: "0 auto",
              "& .MuiAvatar-img": {
                height: "100%",
                width: "100%",
                borderRadius: "2px",
              },
            }}
          />
        </Box>
      ),
    },
    {
      field: "variation_values",
      headerName: "Variation values",
      flex: 1,
      renderCell: (params) => {
        return variant2(params.row.variation_values);
      },
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      flex: 1,
      renderCell: (params) => {
        return (
          <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
            <Form.Control
              style={{ justifyContent: "center" }}
              type="number"
              value={params.row.Quantity}
              placeholder="0"
              onChange={(e) => handleMOQtyChange(e, params.row)}
            />
          </Form.Group>
        );
      },
    },
  ];
  const columnsSPO = [
    {
      field: "select",
      headerName: "Select",
      flex: 1,
      renderCell: (params) => {
        return (
          <FormGroup>
            <FormControlLabel
              className="mx-auto"
              control={<Checkbox />}
              style={{ justifyContent: "center" }}
              checked={selectedScheduleOrderIds.includes(params.row.product_id)}
              onChange={() =>
                handleOrderScheduleSelection(params.row.product_id)
              }
            />
          </FormGroup>
        );
      },
    },
    {
      field: "factory_id",
      headerName: "Factory Name",
      flex: 1,
      renderCell: (prams) =>
        factories.find((factory) => factory.id === prams.row.factory_id)
          ?.factory_name,
    },
    { field: "product_name", headerName: "Product names", flex: 1 },
    {
      field: "product_image",
      headerName: "Product images",
      flex: 1,
      type: "html",
      renderCell: (value, row) => (
        <Box className="h-100 w-100 d-flex align-items-center">
          <Avatar
            src={value.row.product_image || require("../../assets/default.png")}
            alt={value.row.product_image}
            sx={{
              height: "45px",
              width: "45px",
              borderRadius: "2px",
              margin: "0 auto",
              "& .MuiAvatar-img": {
                height: "100%",
                width: "100%",
                borderRadius: "2px",
              },
            }}
          />
        </Box>
      ),
    },
    {
      field: "variation_values",
      headerName: "Variation values",
      flex: 1,
      renderCell: (params) => {
        return variant2(params.row.variation_values);
      },
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      flex: 1,
      renderCell: (params) => (
        <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
          <Form.Control
            style={{ justifyContent: "center" }}
            type="number"
            value={params.row.Quantity}
            placeholder="0"
            onChange={(e) => handleSOQtyChange(e, params.row)}
          />
        </Form.Group>
      ),
    },
  ];
  const handleMOQtyChange = (index, event) => {
    const value = index.target.value;
    if (value >= 0) {
      const updatedData = manualPOorders.map((item) => {
        if (item.product_id === event.product_id) {
          return { ...item, Quantity: index.target.value };
        }
        return item;
      });
      setManualPoOrders(updatedData);
    }
  };
  const handleSOQtyChange = (index, event) => {
    const value = index.target.value;
    if (value >= 0) {
      const updatedData = scheduledPOorders.map((item) => {
        if (item.product_id === event.product_id) {
          return { ...item, Quantity: index.target.value };
        }
        return item;
      });
      setScheduleOrders(updatedData);
    }
  };

  useEffect(() => {
    if (activeKey == 'against_PO') {
      fetchOrders();
    }
    if (activeKey == 'manual_PO') {
      manualPO();
    }
    if (activeKey == 'scheduled_PO') {
      scheduledPO();
    }
  }, [page, pageSize, endDate, selectedFactory, manualProductF]);

  useEffect(() => {
    dispatch(AllFactoryActions());
  }, [dispatch]);

  useEffect(() => {
    setFactories(allFactoryDatas);
  }, [allFactoryDatas]);

  const fetchOrders = async () => {
    try {
      let apiUrl = `${API_URL}wp-json/custom-preorder-products/v1/pre-order/?&per_page=${pageSize}&page=${page}`;
      if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
      if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
      await dispatch(PoDetailsData({ apiUrl })).then((response) => {
        let data = response.data.pre_orders.map((v, i) => ({ ...v, id: i }));
        setOrders(data);
        setTotalPages(response.data.total_pages);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const manualPO = async () => {
    try {
      let apiUrl = `${API_URL}wp-json/custom-manual-po/v1/get-product-manual/?&per_page=${pageSize}&page=${page}`;
      if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
      if (manualProductF) apiUrl += `&product_name=${manualProductF}`;

      let data = await getManualOrScheduledPO(
        apiUrl,
        ManualOrScheduledPoDetailsData,
        setManualPoOrders,
        setTotalPages
      );
      setManualPoOrders(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setManualPoOrders([])
    }
  };

  const scheduledPO = async () => {
    try {
      let apiUrl = `${API_URL}wp-json/custom-manual-po/v1/get-product-manual/?&per_page=${pageSize}&page=${page}`;
      if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
      if (manualProductF) apiUrl += `&product_name=${manualProductF}`;

      let data = await getManualOrScheduledPO(
        apiUrl,
        ManualOrScheduledPoDetailsData,
        setManualPoOrders,
        setTotalPages
      );
      setScheduleOrders(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setScheduleOrders([])
    }
  };

  const getManualOrScheduledPO = async (
    apiUrl,
    dispatchFunction,
    setDataFunction,
    setTotalPagesFunction
  ) => {
    let data;
    await dispatch(ManualOrScheduledPoDetailsData({ apiUrl })).then(
      (response) => {
        data = response.data.products.map((v, i) => ({ ...v, id: i }));
        if (response.data.products) {
          setTotalPages(response.data.total_pages);
          return data;
        }
      }
    );
    return data;
  };

  const handleOrderSelection = (orderId) => {
    const filteredOrders = orders.filter(
      (order) => order.product_name === orderId
    );
    const orderIds = filteredOrders.map((order) => order.order_ids);

    const isSelected = selectedOrderIds.includes(orderId);
    const newSelected = isSelected
      ? selectedOrderIds.filter((id) => id !== orderId)
      : [...selectedOrderIds, orderId];
    const newSelected2 = isSelected
      ? selectedOrderIdss
        .filter((id) => id !== orderId)
        .flatMap((id) => id.split(","))
      : [...selectedOrderIdss, ...orderIds.flatMap((str) => str.split(","))];

    setSelectedOrderIds(newSelected);
    setSelectedOrderIdss(newSelected2);
  };

  const handleOrderManualSelection = (orderId) => {
    const selectedIndex = selectedManualOrderIds.indexOf(orderId);
    const newSelected =
      selectedIndex === -1
        ? [...selectedManualOrderIds, orderId]
        : selectedManualOrderIds.filter((id) => id !== orderId);

    setSelectedManualOrderIds(newSelected);
  };

  const handleOrderScheduleSelection = (orderId) => {
    const selectedIndex = selectedScheduleOrderIds.indexOf(orderId);
    const newSelected =
      selectedIndex === -1
        ? [...selectedScheduleOrderIds, orderId]
        : selectedScheduleOrderIds.filter((id) => id !== orderId);

    setSelectedScheduleOrderIds(newSelected);
  };

  const handleSelectAll = () => {
    if (activeKey === "against_PO") handleSelectAllAgainst();
    else if (activeKey === "manual_PO") handleSelectAllManual();
    else if (activeKey === "scheduled_PO") handleSelectAllSchedule();
  };

  const handleSelectAllAgainst = () => {
    const allOrderIds = orders.map((order) => order.product_name);
    const allOrderIdss = orders.flatMap((order) => order.order_ids);
    const flattenedData = allOrderIdss.flatMap((str) => str.split(","));
    setSelectedOrderIds(
      selectedOrderIds.length === allOrderIds.length ? [] : allOrderIds
    );
    setSelectedOrderIdss(
      selectedOrderIdss.length === flattenedData.length ? [] : flattenedData
    );
  };

  const handleSelectAllManual = () => {
    const allOrderIds = manualPOorders.map((order) => order.product_id);
    setSelectedManualOrderIds(
      selectedManualOrderIds.length === allOrderIds.length ? [] : allOrderIds
    );
  };
  const handleSelectAllSchedule = () => {
    const allOrderIds = scheduledPOorders.map((order) => order.product_id);
    setSelectedScheduleOrderIds(
      selectedScheduleOrderIds.length === allOrderIds.length ? [] : allOrderIds
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
      setStartDate("");
      setEndDate("");
    }
  };

  const handlePoModal = (itemId) => {
    setProductId(itemId);
    setPoDetailsModal(true);
  };

  // PO Generate
  const handleGeneratePO = () => {
    if (activeKey === "against_PO") handleGenerateAgainstPO();
    else if (activeKey === "manual_PO") handleGenerateManualPO();
    else if (activeKey === "scheduled_PO") handleGenerateScheduledPO();
  };

  const handleGenerateAgainstPO = async () => {
    const selectedOrders = orders.filter((order) =>
      selectedOrderIds.includes(order.product_name)
    );
    const factoryIds = [
      ...new Set(selectedOrders.map((order) => order.factory_id)),
    ];

    if (factoryIds.length === 1) {
      const selectedProductIds = selectedOrders
        .map((order) => order.item_id)
        .join(",");
      const selectedOrderIdsStr = selectedOrderIdss.join(",");

      const payload = {
        product_ids: selectedProductIds,
        factory_ids: factoryIds.join(","),
        order_ids: selectedOrderIdsStr,
      };

      try {
        await dispatch(AddPO(payload, navigate));
      } catch (error) {
        console.error("Error generating PO IDs:", error);
      }
    } else {
      let errMessage =
        "Selected orders belong to different factories. Please select orders from the same factory.";
      ShowAlert("", errMessage, "error", false, false, '', '', 1000);
    }
  };
  const handleGenerateManualPO = async () => {
    const selectedOrders = manualPOorders.filter((order) =>
      selectedManualOrderIds.includes(order.product_id)
    );
    const factoryIds = [
      ...new Set(selectedOrders.map((order) => order.factory_id)),
    ];

    if (factoryIds.length === 1) {
      const selectedquantities = selectedOrders.map((order) => order.Quantity);
      const selectedOrderIdsStr = selectedManualOrderIds;

      const payload = {
        quantities: selectedquantities,
        product_ids: selectedOrderIdsStr,
        note: manualNote,
      };

      try {
        await dispatch(AddManualPO(payload, navigate));
      } catch (error) {
        console.error("Error generating PO IDs:", error);
      }
    } else {
      await ShowAlert(
        "",
        "Selected orders belong to different factories. Please select orders from the same factory.",
        "error", false, false, '', '', 1000
      );
    }
  };

  const handleGenerateScheduledPO = async () => {
    const selectedOrders = scheduledPOorders.filter((order) =>
      selectedScheduleOrderIds.includes(order.product_id)
    );

    const factoryIds = [
      ...new Set(selectedOrders.map((order) => order.factory_id)),
    ];
    if (factoryIds.length === 1) {
      const selectedquantities = selectedOrders.map((order) => order.Quantity);
      const selectedOrderIdsStr = selectedScheduleOrderIds;

      const payload = {
        quantities: selectedquantities,
        product_ids: selectedOrderIdsStr,
        note: scheduledNote,
        estimated_time: estimatedTime,
        reminder_date: remainderDate,
      };

      try {
        await dispatch(AddSchedulePO(payload, navigate));
      } catch (error) {
        console.error("Error generating PO IDs:", error);
      }
    } else {
      await ShowAlert(
        "",
        "Selected orders belong to different factories. Please select orders from the same factory.",
        "error", false, false, '', '', 1000
      );
    }
  };

  // variant
  const variant = (e) => {
    const matches = e.match(
      /"display_key";s:\d+:"([^"]+)";s:\d+:"display_value";s:\d+:"([^"]+)";/g
    );
    let size = null;
    let color = null;

    if (matches) {
      matches.forEach((match) => {
        const keyValueMatches = match.match(
          /"display_key";s:\d+:"([^"]+)";s:\d+:"display_value";s:\d+:"([^"]+)";/
        );
        if (keyValueMatches) {
          const key = keyValueMatches[1];
          const value = keyValueMatches[2].replace(/<[^>]*>/g, ""); // Remove HTML tags
          if (key === "size") {
            size = value;
          } else if (key === "color") {
            color = value;
          }
        }
      });
    }

    if (size && color) {
      return `Size: ${size}, Color: ${color}`;
    }
    if (size) {
      return `Size:${size}`;
    }
    if (color) {
      return `Color:${color}`;
    } else {
      return "Variant data not available";
    }
  };

  const variant2 = (e) => {
    if (e.length === 0) {
      return "Variant data not available";
    } else {
      const { color, size } = e;
      if (size.length > 0 && color.length > 0) {
        return `Size: ${size.join(", ")}, Color: ${color.join(", ")}`;
      }
      if (size.length > 0) {
        return `Size: ${size.join(", ")}`;
      }
      if (color.length > 0) {
        return `Color: ${color.join(", ")}`;
      } else {
        return "Variant data not available";
      }
    }
  }

  const handleChange = (event, value) => {
    setPage(value);
  };

  const [activeKey, setActiveKey] = useState("against_PO");

  const handleTabSelect = (key) => {
    setActiveKey(key);
    if (key === "manual_PO") {
      manualPO();
    } else if (key === "scheduled_PO") {
      scheduledPO();
    } else {
      fetchOrders();
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  return (
    <Container
      fluid
      className="py-3"
      style={{ maxHeight: "100%", minHeight: "100vh" }}
    >
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          Order Management System
        </Typography>
      </Box>
      <Card>
        <Card.Body>
          <Tabs
            defaultActiveKey="against_PO"
            id="fill-tab-example"
            className="mb-3"
            justify
            onSelect={handleTabSelect}
          >
            <Tab
              eventKey="against_PO"
              title={
                <span
                  style={{
                    backgroundColor:
                      activeKey === "against_PO" ? "blue" : "inherit",
                    color: activeKey === "against_PO" ? "white" : "inherit",
                    display: "block",
                    borderRadius: "5px",
                  }}
                >
                  Order against PO
                </span>
              }
            ></Tab>
            <Tab
              eventKey="manual_PO"
              title={
                <span
                  style={{
                    backgroundColor:
                      activeKey === "manual_PO" ? "blue" : "inherit",
                    color: activeKey === "manual_PO" ? "white" : "inherit",
                    display: "block",
                    borderRadius: "5px",
                  }}
                >
                  Manual PO
                </span>
              }
            ></Tab>
            <Tab
              eventKey="scheduled_PO"
              title={
                <span
                  style={{
                    backgroundColor:
                      activeKey === "scheduled_PO" ? "blue" : "inherit",
                    color: activeKey === "scheduled_PO" ? "white" : "inherit",
                    display: "block",
                    borderRadius: "5px",
                  }}
                >
                  Scheduled PO
                </span>
              }
            ></Tab>
          </Tabs>
          <Row className="mb-4 mt-4">
            <Form inline>
              <Row>
                {activeKey === "against_PO" ? (
                  <Col xs="auto" lg="4">
                    <Form.Group>
                      <Form.Label className="fw-semibold mb-0">
                        Date filter:
                      </Form.Label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={["SingleInputDateRangeField"]}
                        >
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
                    </Form.Group>
                  </Col>
                ) : null}

                <Col xs="auto" lg="4">
                  <Form.Group className="fw-semibold mb-0">
                    <Form.Label>Factory Filter:</Form.Label>
                    <Form.Control
                      as="select"
                      className="mr-sm-2"
                      value={selectedFactory}
                      onChange={(e) => setSelectedFactory(e.target.value)}
                    >
                      <option value="">All Factory</option>
                      {factories.map((factory) => (
                        <option key={factory.id} value={factory.id}>
                          {factory.factory_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>

                {activeKey === "manual_PO" || activeKey === "scheduled_PO" ? (
                  <Col xs="auto" lg="4">
                    <Form.Group className="fw-semibold mb-0">
                      <Form.Label>Product Filter:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Product"
                        value={manualProductF}
                        onChange={(e) => setManualProductF(e.target.value)}
                      />
                    </Form.Group>
                  </Col>
                ) : null}

                <Col xs="auto" lg="4">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Page Size:</Form.Label>
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
                </Col>
              </Row>
            </Form>
          </Row>
          <Box className="mt-2">
            {activeKey === "against_PO" &&
              (poLoader ? (
                <Loader />
              ) : (
                <>
                  {
                    orders && orders.length !== 0 ? (
                      <DataTable
                        columns={columns1}
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
                        Records is not Available for above filter
                      </Alert>
                    )
                  }
                </>
              ))}
            {activeKey === "manual_PO" &&
              (manualOrScheduledPoLoader ? (
                <Loader />
              ) : (

                <>
                  {
                    manualPOorders && manualPOorders.length !== 0 ? (
                      <DataTable
                        columns={columnsMPO}
                        rows={manualPOorders}
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
                        Records is not Available for above filter
                      </Alert>
                    )
                  }
                </>
              ))}
            {activeKey === "scheduled_PO" &&
              (manualOrScheduledPoLoader ? (
                <Loader />
              ) : (
                <>
                  {
                    scheduledPOorders && scheduledPOorders.length !== 0 ? (
                      <DataTable
                        columns={columnsSPO}
                        rows={scheduledPOorders}
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
                        Records is not Available for above filter
                      </Alert>
                    )
                  }
                </>
              ))}
          </Box>
          {activeKey === "manual_PO" || activeKey === "scheduled_PO" ? (
            <Row>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Add Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  onChange={(e) => setScheduledNote(e.target.value)}
                />
              </Form.Group>
            </Row>
          ) : null}
          {activeKey === "scheduled_PO" ? (
            <Row>
              <Col xs="auto" lg="4">
                <Form.Group controlId="duedate">
                  <Form.Label>Estimated time</Form.Label>
                  <Form.Control
                    as="select"
                    className="mr-sm-2"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                  >
                    <option value="">select time</option>
                    {EstimatedTime.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs="auto" lg="4">
                <Form.Group controlId="duedate">
                  <Form.Label>Remainder date</Form.Label>
                  <Form.Control
                    type="date"
                    name="duedate"
                    placeholder="Due date"
                    onChange={(e) => setRemainderDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          ) : null}

          <Box className="d-flex justify-content-end align-items-center pt-3 my-4">
            <Button
              variant="outline-primary"
              className="me-2 fw-semibold"
              onClick={handleSelectAll}
            >
              Select All Orders
            </Button>

            <Button
              variant="primary"
              className="ms-2 fw-semibold"
              onClick={handleGeneratePO}
            >
              Create PO
            </Button>
          </Box>
        </Card.Body>
      </Card>
      {PoDetailsModal && (
        <PoDetailsModal
          show={poDetailsModal}
          poDetailsModal={poDetailsModal}
          productId={productId}
          handleClosePoDetailsModal={() => setPoDetailsModal(false)}
        />
      )}
    </Container>
  );
}

export default OrderManagementSystem;