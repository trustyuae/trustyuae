import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL, API_URL_N } from "../../redux/constants/Constants";
import {
  Badge,
  ButtonGroup,
  Card,
  Col,
  Modal,
  ToggleButton,
} from "react-bootstrap";
import DataTable from "../DataTable";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  List,
  ListItem,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import OrderDetailsPrintModal from "./OrderDetailsPrintModal";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  PerticularPoDetails,
  UpdatePODetails,
} from "../../redux/actions/P2SystemActions";
import Loader from "../../utils/Loader";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import PoDetailsModalInView from "./PoDetailsModalInView";
import { useTranslation } from "react-i18next";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import axios from "axios";
import defaulImage from "../../../src/assets/default.png";
import { DatePicker } from "@mui/x-date-pickers-pro";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";

const PoDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [PO_OrderList, setPO_OrderList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("");
  const [PoStatus, setPoStatus] = useState("");
  const [factories, setFactories] = useState([]);
  const [factorieName, setFactorieName] = useState("");
  const [printModal, setPrintModal] = useState(false);
  const [poDetailsModal, setPoDetailsModal] = useState(false);
  const [productId, setProductId] = useState(null);
  const [variationId, setVariationId] = useState(null);
  const [erId, setERId] = useState(null);
  const [lang, setLang] = useState("En");
  const [showMessageModal, setshowMessageModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [addMessageD, setAddMessageD] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rowDates, setRowDates] = useState([]);

  const navigate = useNavigate();
  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );

  const PoUpdate = useSelector(
    (state) => state?.orderNotAvailable?.isUpdatedPoDetails
  );

  const perticularOrderDetailsLoader = useSelector(
    (state) => state?.orderNotAvailable?.isPerticularPoDetailsData
  );

  const token = JSON.parse(localStorage.getItem("token"));
  const headers = {
    Authorization: `Live ${token}`,
  };

  useEffect(() => {
    dispatch(AllFactoryActions());
  }, [dispatch]);

  useEffect(() => {
    if (allFactoryDatas && allFactoryDatas.factories) {
      let data = allFactoryDatas.factories.map((item) => ({ ...item }));
      setFactories(data);
    }
  }, [allFactoryDatas]);

  const radios = [
    { name: "English", value: "En" },
    { name: "中國人", value: "Zn" },
  ];

  const handleLanguageChange = async (language) => {
    setLang(language);
    i18n.changeLanguage(language);
  };

  const handleDateChange = (rowId, newDate) => {
    if (newDate?.$d) {
      const isoDate = dayjs(newDate.$d.toDateString()).format("YYYY-MM-DD");
      setRowDates((prevDates) => ({
        ...prevDates,
        [rowId]: isoDate,
      }));
    } else {
      console.error("Invalid date range");
    }
  };

  const fetchPO = async () => {
    try {
      let apiUrl = `${API_URL}wp-json/custom-po-details/v1/po-order-details/${id}/?&page=${page}&per_page=${pageSize}`;
      await dispatch(PerticularPoDetails({ apiUrl })).then((response) => {
        console.log(response, "response");
        console.log(response?.data?.total_count, "response?.data?.total_count");
        let data = response.data.line_items.map((v, i) => ({ ...v, id: i }));
        data = data.map((v, i) => ({ ...v, dispatch_status: "" }));
        const row = [
          ...data,
          {
            id: "TAX",
            label: "Total:",
            total_quantity: response?.data?.total_count || 0,
            taxTotal: response?.data?.total_rmb_cost,
            total_cost: response?.data?.total_cost || 0,
          },
        ];
        setPO_OrderList(row);
        setERId(response.data.er_no);
        setFactorieName(response.data.factory_id);
        setPoStatus(response.data.po_status);
        setPaymentStatus(response.data.payment_status);
        setTotalPages(response?.data?.total_pages);
      });
    } catch {
      console.error("Error fetching PO:");
    }
  };

  const getMessages = async () => {
    try {
      const response = await axios.get(
        `${API_URL}wp-json/custom-po-note/v1/get-po-notes/${id}`,
        { headers }
      );
      console.log(response.data, "response");
      setMessages(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPO();
    // getMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, page]);

  useEffect(() => {
    // fetchPO();
    getMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMessages]);
  // }, []);

  useEffect(() => {
    // Set the initial language to 'En' when component mounts
    i18n.changeLanguage(lang);
  }, []);

  const handleStatusChange = (value, event) => {
    const updatedData = PO_OrderList.map((item) => {
      if (item.product_id === event.product_id) {
        if (item.variation_id == event.variation_id) {
          return { ...item, availability_status: value };
        }
      }
      return item;
    });
    setPO_OrderList(updatedData);
  };

  const handleDispatchStatusChange = (value, event) => {
    const updatedData = PO_OrderList.map((item) => {
      if (item.product_id === event.product_id) {
        if (item.variation_id == event.variation_id) {
          return { ...item, dispatch_type: value };
        }
      }
      return item;
    });
    setPO_OrderList(updatedData);
    console.log(PO_OrderList, "PO_OrderList");
  };

  const validateAvailabilityStatuses = (statuses) => {
    if (statuses.length === 0 || statuses.every((status) => status === "")) {
      return "Availability status is empty.";
    }
    if (statuses.some((status) => status === "")) {
      return "Availability status is empty.";
    }
    return "Successful";
  };

  const handleUpdate = async () => {
    let updatelist = PO_OrderList.slice(0, -1);
    console.log(updatelist, "fetching update list");

    // Extracting necessary data for update
    const updatedData = {
      po_number: id,
      request_quantity: updatelist.map((item) => item.available_quantity),
      product_ids: updatelist.map((item) => item.product_id),
      variation_id: updatelist.map((item) => item.variation_id || 0),
      po_status: PoStatus,
      dispatch_type: updatelist.map((item) =>
        item.dispatch_type == null ? "" : item.dispatch_type
      ),
      payment_status: paymentStatus,
      availability_date: rowDates,
      received_quantity: updatelist.map((item) => item.received_quantity),
    };
    console.log(updatedData, "updatedData below obj");

    // Check if availability_status is not empty
    const availabilityStatuses = updatelist.map((item) =>
      item.availability_status
        ? item.availability_status
        : item.estimated_production_time
        ? item.estimated_production_time
        : []
    );
    const flattenedStatuses = availabilityStatuses.flat();

    // Validate only if availability_status is not empty
    if (flattenedStatuses.length > 0) {
      const validationMessage = validateAvailabilityStatuses(flattenedStatuses);

      if (validationMessage === "Availability status is empty.") {
        Swal.fire({
          icon: "error",
          title: validationMessage,
          showConfirmButton: true,
        });
        return; // Stop execution if validation fails
      }

      // Include availability_status in updatedData
      updatedData.availability_status = availabilityStatuses;
    }

    console.log(updatedData, "updatedData");

    // Proceed with dispatch update action
    let apiUrl = `${API_URL}wp-json/custom-available-status/v1/estimated-status/${id}`;
    await dispatch(UpdatePODetails({ apiUrl }, updatedData, navigate));
  };

  const handlepayMentStatus = (value) => {
    setPaymentStatus(value);
  };

  const handlePOStatus = (value) => {
    setPoStatus(value);
  };

  const handleRecievedQtyChange = (index, event) => {
    console.log(event, "event");
    if (index.target.value >= 0) {
      const updatedRecivedQtyData = PO_OrderList.map((item) => {
        if (item.product_id === event.product_id) {
          if (item.variation_id == event.variation_id) {
            return { ...item, received_quantity: index.target.value };
          }
        }
        return item;
      });
      setPO_OrderList(updatedRecivedQtyData);
    }
  };

  const handleAvailableQtyChange = (index, event) => {
    console.log(event, "event");
    if (index.target.value >= 0 && index.target.value <= event.quantity) {
      const updatedData = PO_OrderList.map((item) => {
        if (item.product_id === event.product_id) {
          if (item.variation_id == event.variation_id) {
            return { ...item, available_quantity: index.target.value };
          }
        }
        return item;
      });
      setPO_OrderList(updatedData);
    }
  };

  const handlePrint = () => {
    setPrintModal(true);
  };

  const handlePoModal = (itemId, itemVId) => {
    setVariationId(itemVId);
    setProductId(itemId);
    setPoDetailsModal(true);
  };

  const variant2 = (variations) => {
    console.log(variations.row.variation_value, "variations");

    const variationArray = Object.entries(
      JSON.parse(variations.row.variation_value)
    ).map(([key, value]) => ({ [key]: value }));
    console.log(variationArray, "variationArray");

    return (
      <div className="container mt-4 mb-4">
        {variationArray.length === 0 ? (
          <div>Variations not available</div>
        ) : (
          <div>
            {variationArray.map((item, index) => {
              const attributeName = Object.keys(item)[0];
              const attributeValue = Object.values(item)[0];
              return (
                <span key={index}>
                  {`${attributeName}: ${attributeValue}`}
                  {index < variationArray.length - 1 ? ", " : ""}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const columns = [
    {
      field: "product_name",
      headerName: t("POManagement.ProductName"),
      flex: 4,
      colSpan: (value, row) => {
        if (row.id === "TAX") {
          return 3;
        }
        return undefined;
      },
      valueGetter: (value, row) => {
        if (row.id === "TAX") {
          return row.label;
        }
        return value;
      },
    },
    {
      field: "variation_value",
      headerName: t("POManagement.Variation"),
      flex: 4,
      renderCell: variant2,
    },
    {
      field: "factory_image",
      headerName: t("POManagement.Image"),
      flex: 4,
      type: "html",
      renderCell: (value, row) => {
        return (
          <>
            <img
              src={
                value.row.factory_image
                  ? value.row.factory_image
                  : value.row.image
                  ? value.row.image
                  : defaulImage
              }
              alt={value.row.product_name}
              className="img-fluid"
              width={100}
            />
          </>
        );
      },
    },

    {
      field: "quantity",
      headerName: t("POManagement.QtyOrdered"),
      flex: 2.5,
      renderCell: (params) => {
        const handleClick = () => {
          console.log(params.row, "params.row");
          handlePoModal(params.row.product_id, params.row.variation_id);
        };

        if (params.row.id === "TAX") {
          return params.row.total_quantity;
        }

        return (
          <Box variant="outline-primary" onClick={handleClick}>
            {params.value}
          </Box>
        );
      },
    },
    {
      field: "rmb_price",
      headerName: t("POManagement.RMBPrice"),
      flex: 3,
      valueGetter: (value, row) => {
        console.log(value, "rmb price");
        console.log(row, "row rmb price");
        if (row.id === "TAX") {
          return row.taxTotal;
        }
        return value;
      },
    },
    {
      field: "total_price",
      headerName: t("POManagement.AEDPrice"),
      flex: 3,
      colSpan: (value, row) => {
        if (row.id === "TAX") {
          return 1;
        }
        return undefined;
      },
      valueGetter: (value, row) => {
        if (row.id === "TAX") {
          return `${row.total_cost}`;
        }
        return value;
      },
    },
    {
      field: "received_quantity",
      headerName: t("POManagement.ReceivedQty"),
      flex: 2.5,
      colSpan: (value, row) => {
        if (row?.id == "TAX") {
          return 5;
        }
        return undefined;
      },
      renderCell: (params) => {
        if (params?.row?.id == "TAX") {
          return null;
        }
        return (
          <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
            <Form.Control
              style={{ justifyContent: "center" }}
              type="number"
              value={params.row.received_quantity}
              placeholder="0"
              onChange={(e) => handleRecievedQtyChange(e, params.row)}
            />
          </Form.Group>
        );
      },
    },
    {
      field: "available_quantity",
      headerName: t("POManagement.AvlQty"),
      flex: 2.5,
      renderCell: (params) => {
        if (params.row.id === "TAX") {
          return null;
        }
        return (
          <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
            <Form.Control
              style={{ justifyContent: "center" }}
              type="number"
              value={params.row.available_quantity}
              placeholder="0"
              onChange={(e) => handleAvailableQtyChange(e, params.row)}
            />
          </Form.Group>
        );
      },
    },
    {
      field: "availability_status",
      headerName: t("POManagement.AvlStatus"),
      flex: 8,
      renderCell: (params) => {
        const rowId = params.row.id;
        const selectedDate = params.row.availability_date || ""; // Use the state date or default to an empty string
        if (rowId === "TAX") {
          return null;
        }

        const dateValue =
          selectedDate && selectedDate !== "0000-00-00"
            ? dayjs(selectedDate)
            : dayjs();

        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: 0.5,
              height: "100%",
              width: "100%",
            }}
          >
            <Form.Select
              labelId={`customer-status-${rowId}-label`}
              id={`customer-status-${rowId}`}
              value={
                params.row.availability_status !== "" &&
                params.row.availability_status !== "0"
                  ? params.row.availability_status
                  : params.row.estimated_production_time
              }
              onChange={(event) =>
                handleStatusChange(event.target.value, params.row)
              }
              fullWidth
              style={{
                height: "30px",
                fontSize: "0.875rem",
                width: "80%",
              }}
            >
              <option disabled value="">
                {t("POManagement.Select")}...
              </option>
              <option value="In Stock">{t("POManagement.InStock")}</option>
              <option value="Out Of Stock">
                {t("POManagement.OutofStock")}
              </option>
            </Form.Select>

            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                format="YYYY-MM-DD"
                value={dateValue} // Use determined value for DatePicker
                onChange={(date) => handleDateChange(date)}
                sx={{
                  width: "80%",
                  "& .MuiInputBase-input": {
                    padding: "0.25rem 0.5rem",
                    fontSize: "0.875rem",
                  },
                }}
                renderInput={(params) => (
                  <TextField {...params} helperText="valid mask" />
                )}
              />
            </LocalizationProvider>
          </Box>
        );
      },
    },
    {
      field: "dispatch_type",
      headerName: t("POManagement.DispatchStatus"),
      flex: 3,
      renderCell: (params) => {
        if (params?.row?.id == "TAX") {
          return null;
        }
        return (
          <Form.Select
            className="mr-sm-2 py-2"
            value={params.row.dispatch_type}
            onChange={(e) =>
              handleDispatchStatusChange(e.target.value, params.row)
            }
          >
            <option disabled selected value="">
              {t("POManagement.Select")}...
            </option>
            <option value="Dispatched">{t("POManagement.Dispatched")}</option>
            <option value="Not Dispatched">
              {t("POManagement.NotDispatched")}
            </option>
          </Form.Select>
        );
      },
    },
  ];
  const handalBackButton = () => {
    navigate("/PO_ManagementSystem");
  };

  const POTypes = (id) => {
    const getPOType = id.substring(0, 2);
    if (getPOType == "PO") {
      return "PO against Orders";
    } else if (getPOType == "MO") {
      return "Manual PO";
    } else if (getPOType == "SO") {
      return "Scheduled PO";
    }
  };
  const handleAddMessage = async () => {
    setAddMessageD(true);
    try {
      // const orderId = parseInt(id, 10);
      let userID = JSON.parse(localStorage.getItem("user_data"));
      const requestedMessage = {
        po_note: message,
        po_id: id,
        user_id: userID.user_id,
      };

      const response = await axios.post(
        `${API_URL}wp-json/custom-po-note/v1/add-po-note/`,
        requestedMessage,
        { headers }
      );
      console.log(response.data);

      setshowMessageModal(false);
      setMessage("");
      setAddMessageD(false);
      getMessages();
    } catch (error) {}
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  return (
    <Container fluid className="px-5">
      <MDBRow className="my-3">
        <MDBCol className="d-flex justify-content-between align-items-center position-relative">
          <Button
            variant="outline-secondary"
            className="p-1 me-2 bg-transparent text-secondary"
            onClick={handalBackButton}
          >
            <ArrowBackIcon className="me-1" />
          </Button>

          <Box>
            <Button
              variant="outline-secondary"
              className="p-1 me-3 bg-transparent text-secondary"
              onClick={() => setshowMessageModal(true)}
            >
              <AddCommentOutlinedIcon />
            </Button>
            <Button
              variant="outline-primary"
              className="p-1 me-3 bg-transparent text-primary"
              onClick={handlePrint}
            >
              <LocalPrintshopOutlinedIcon className="me-1" />
            </Button>
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
        </MDBCol>
      </MDBRow>

      <Card className="p-3 mb-3">
        <Box className="d-flex align-items-center justify-content-between">
          <Box>
            <Typography variant="h6" className="fw-bold mb-3">
              {t("POManagement.PODetails")}
            </Typography>
            <Box className="d-flex justify-content-between">
              <Box>
                <Box>
                  <Typography className="fw-bold"># {id}</Typography>
                </Box>
                <Typography
                  className=""
                  sx={{
                    fontSize: 14,
                  }}
                >
                  <Badge bg="success">{POTypes(id)}</Badge>
                </Typography>
              </Box>
              <Box style={{ marginLeft: "20px" }}>
                <Box>
                  {erId ? (
                    <div>
                      <Typography className="fw-bold"># {erId}</Typography>
                      <Typography
                        className=""
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        <Badge bg="success">Exchange & Return ID</Badge>
                      </Typography>
                    </div>
                  ) : (
                    <Alert
                      severity="warning"
                      sx={{ fontFamily: "monospace", fontSize: "18px" }}
                    >
                      {t("POManagement.ER")}
                    </Alert>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" className="fw-bold mb-3">
              {
                factories.find((factory) => factory.id == factorieName)
                  ?.factory_name
              }
            </Typography>
          </Box>
        </Box>
      </Card>
      {messages && messages.length > 0 && (
        <Card className="p-3 mb-3">
          <Box className="d-flex align-items-center justify-content-between">
            <Box className="w-100">
              <Typography variant="h6" className="fw-bold mb-3">
                {/* Proper translation or localization function can be used here */}
                {/* Chat Messages */}
              </Typography>
              <Box className="d-flex justify-content-between">
                <div
                  style={{
                    zIndex: "100",
                    top: "0",
                    right: "50%",
                    width: "100%",
                  }}
                >
                  <Accordion>
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1-content"
                      id="panel1-header"
                    >
                      <Typography variant="h6" className="fw-bold">
                        Messages
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails
                      style={{ maxHeight: "200px", overflowY: "auto" }}
                    >
                      <List>
                        {messages?.map(({ id, po_note, note_time }, i) => (
                          // <ListItem key={i} className="d-flex justify-content-start">
                          //   <ListItemText
                          //     primary={po_note}
                          //     secondary={note_time}
                          //     className="rounded p-2"
                          //     style={{ maxWidth: '70%', minWidth: '50px', backgroundColor: "#bfdffb" }}
                          //   />
                          // </ListItem>
                          <ListItem
                            key={i}
                            className="d-flex justify-content-start"
                          >
                            <ListItemText
                              primary={
                                <Typography
                                  variant="body1"
                                  style={{ fontSize: "20px" }}
                                >
                                  {po_note}
                                </Typography>
                              }
                              secondary={
                                <Typography
                                  variant="body2"
                                  style={{ fontSize: "10px" }}
                                >
                                  {note_time}
                                </Typography>
                              }
                              className="rounded p-2"
                              style={{
                                maxWidth: "70%",
                                minWidth: "50px",
                                backgroundColor: "#bfdffb",
                              }}
                            />
                          </ListItem>
                        ))}
                      </List>
                    </AccordionDetails>
                  </Accordion>
                </div>
              </Box>
            </Box>
          </Box>
        </Card>
      )}
      <Card className="p-3 mb-3">
        <Row className="mb-3">
          <Col xs="auto" lg="4">
            <Form.Group className="fw-semibold mb-0">
              <Form.Label>{t("POManagement.PaymentStatus")}</Form.Label>
              <Form.Select
                className="mr-sm-2 py-2"
                value={paymentStatus}
                onChange={(e) => handlepayMentStatus(e.target.value)}
              >
                <option disabled selected value="">
                  {t("POManagement.Select")}...
                </option>
                <option value="Paid">{t("POManagement.Paid")}</option>
                <option value="Unpaid">{t("POManagement.Unpaid")}</option>
                <option value="Hold">{t("POManagement.Hold")}</option>
                <option value="Cancelled">{t("POManagement.Cancelled")}</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs="auto" lg="4" className="d-flex align-items-center">
            <Form.Group className="fw-semibold mb-0">
              <Form.Label>{t("POManagement.POStatus")}</Form.Label>
              <Form.Select
                className="mr-sm-2 py-2"
                value={PoStatus}
                onChange={(e) => handlePOStatus(e.target.value)}
              >
                <option disabled selected value="">
                  {t("POManagement.Select")}...
                </option>
                <option value="Closed">{t("POManagement.Closed")}</option>
                <option value="Open">{t("POManagement.Open")}</option>
                <option value="Checking with factory">
                  {t("POManagement.Checkingwithfactory")}
                </option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="fw-semibold mb-0 ms-3">
              <Form.Label>Page Size:</Form.Label>
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
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol col="10" md="12" sm="12"></MDBCol>

          {perticularOrderDetailsLoader ? (
            <Loader />
          ) : (
            <div className="mt-2">
              <DataTable
                columns={columns}
                rows={PO_OrderList}
                // page={pageSO}
                // pageSize={pageSizeSO}
                // totalPages={totalPagesSO}
                rowHeight={100}
                // handleChange={handleChangeSO}
                // // onCellEditStart={handleCellEditStart}
                // processRowUpdate={processRowUpdateSPO}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                handleChange={handleChange}
              />
            </div>
          )}

          <Row>
            {PoUpdate ? (
              <Button
                type="button"
                className="w-auto"
                onClick={handleUpdate}
                disabled
              >
                {t("POManagement.Update")}
              </Button>
            ) : (
              <Button type="button" className="w-auto" onClick={handleUpdate}>
                {t("POManagement.Update")}
              </Button>
            )}
          </Row>
        </MDBRow>
      </Card>
      <Modal
        show={showMessageModal}
        onHide={() => setshowMessageModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            placeholder="Enter your message here..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Box className="text-end my-3">
            <Button
              variant="secondary"
              disabled={addMessageD}
              className="mt-2 fw-semibold"
              onClick={handleAddMessage}
            >
              Add Message
            </Button>
          </Box>
        </Modal.Body>
      </Modal>
      <OrderDetailsPrintModal
        show={printModal}
        poId={id}
        factoryName={
          factories.find((factory) => factory.id == factorieName)?.factory_name
        }
        PO_OrderList={PO_OrderList}
        handleClosePrintModal={() => setPrintModal(false)}
        // showModal={printModal}
      />
      {poDetailsModal && (
        <PoDetailsModalInView
          show={poDetailsModal}
          poDetailsModal={poDetailsModal}
          productId={productId}
          variationId={variationId}
          handleClosePoDetailsModal={() => setPoDetailsModal(false)}
          poId={id}
        />
      )}
    </Container>
  );
};
export default PoDetails;
