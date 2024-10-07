import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useLayoutEffect,
} from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import { useNavigate, useParams } from "react-router-dom";
import {
  Badge,
  Button,
  ButtonGroup,
  Card,
  Col,
  Modal,
  Row,
  ToggleButton,
} from "react-bootstrap";
import PrintModal from "./PrintModalInChina";
import {
  Alert,
  Avatar,
  Box,
  ListItem,
  ListItemText,
  Typography,
  AccordionDetails,
  List,
  Accordion,
  AccordionSummary,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Snackbar,
  TextField,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import { CompressImage } from "../../utils/CompressImage";
import DataTable from "../DataTable";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import ShowAlert from "../../utils/ShowAlert";
import Swal from "sweetalert2";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import axiosInstance from "../../utils/AxiosInstance";
import { getUserData } from "../../utils/StorageUtils";
import {
  AddMessageChina,
  AttachmentFileUploadChina,
  CustomItemSendToUAE,
  CustomOrderFinishChina,
  CustomOrderOHChina,
  InsertOrderPickupCancelChina,
  InsertOrderPickupChina,
  InstoreStatusUpdate,
  OrderDetailsChinaGet,
  OrderTrackingDetailsChinaGet,
  OverAllAttachmentFileUploadChina,
} from "../../Redux2/slices/OrderSystemChinaSlice";
import { useTranslation } from "react-i18next";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { green, red, grey, blue } from "@mui/material/colors";

function OrderTrackingNumberPendingDetails() {
  const { id } = useParams();
  const fileInputRef = useRef({});
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("En");
  const [userData, setUserData] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedVariationId, setSelectedVariationId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderProcess, setOrderProcess] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const webcamRef = useRef(null);
  const [showMessageModal, setshowMessageModal] = useState(false);
  const [showMessageOHModal, setshowMessageOHModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [message, setMessage] = useState("");
  const [messageOH, setOHMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [attachmentZoom, setAttachmentZoom] = useState(false);
  const [attachmentsubmitbtn, setAttachmentsubmitbtn] = useState(false);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isChecked, setIsChecked] = useState(false);

  const loader = useSelector((state) => state?.orderSystemChina?.isLoading);
  if (!fileInputRef.current) {
    fileInputRef.current = {};
  }
  fileInputRef.current[
    selectedVariationId ? selectedVariationId : selectedItemId
  ] = useRef(null);

  const AddInOnHold = useSelector(
    (state) => state?.orderSystemChina?.isLoading
  );

  const orderDetailsDataOrderId = useSelector(
    (state) => state?.orderSystemChina?.orderTrackingDetails?.orders?.[0]
  );

  const orderDetailsData = useSelector(
    (state) => state?.orderSystemChina?.orderTrackingDetails
  );

  const messageData = useSelector((state) => state?.orderSystemChina?.message);

  const CustomOrderOHDataa = useSelector(
    (state) => state?.orderSystemChina?.customOrderOnHoldData
  );

  useLayoutEffect(() => {
    const oDetails = orderDetailsData?.orders?.map((v, i) => ({ ...v, id: i }));
    setOrderData(oDetails);

    if (orderDetailsDataOrderId) {
      setOrderDetails(orderDetailsDataOrderId);
      setOrderProcess(orderDetailsDataOrderId.order_process);

      if (Array.isArray(orderDetailsDataOrderId.items)) {
        const newData = orderDetailsDataOrderId.items.map(
          (product, index1) => ({
            ...product,
            id: index1,
          })
        );
        setTableData(newData);
      } else {
        console.warn("orderDetailsDataOrderId.items is not an array");
      }
    }
  }, [orderDetailsData, orderDetailsDataOrderId]);

  async function fetchUserData() {
    try {
      const userdata = await getUserData();
      setUserData(userdata || {});
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelectedFileUrl(imageSrc);
    setShowAttachModal(false);
    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "screenshot.jpg", {
          type: "image/jpeg",
        });
        setSelectedFile(file);
      })
      .catch((error) => {
        console.error("Error converting data URL to file:", error);
      });
    setShowAttachmentModal(true);
  }, [webcamRef]);

  const retake = () => {
    setSelectedFileUrl(null);
  };

  async function fetchOrder() {
    try {
      dispatch(OrderTrackingDetailsChinaGet({ id: id }));
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value);
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

  const handleAddMessage = async (e) => {
    const requestedMessage = {
      message: message,
      order_id: parseInt(id, 10),
      name: userData.first_name,
    };
    dispatch(AddMessageChina(requestedMessage));
    if (messageData) {
      setMessage("");
      setshowMessageModal(false);
      ShowAlert("", messageData.data, "success", null, null, null, null, 2000);
    }
    await fetchOrder();
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

  const handleInstoreStatus = (instoreValue) => {
    if (!selectedItems || selectedItems.length === 0) {
      console.error("No items selected!");
      ShowAlert(
        "Error: No items selected for updating!",
        "",
        "error",
        false,
        false,
        "",
        "",
        2000
      );
      return;
    }

    const productIDD = selectedItems.map((item) => parseInt(item.item_id, 10));
    const variationIDD = selectedItems.map((item) =>
      parseInt(item.variation_id, 10)
    );
    const payload = {
      order_id: parseInt(orderDetails.order_id, 10),
      product_id: productIDD,
      variation_id: variationIDD,
      instore: instoreValue,
    };

    console.log(payload, "payload");
    dispatch(InstoreStatusUpdate({ payload }))
      .unwrap()
      .then((response) => {
        console.log("Success:", response);
        ShowAlert(
          "Items instored successfully!",
          "",
          "success",
          false,
          false,
          "",
          "",
          2000
        );
        setSelectedItems([]);
        setSelectedItemIds([]);
        fetchOrder();
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  };

  const submitOH = async () => {
    try {
      const result = {
        order_id: parseInt(orderDetails.order_id, 10),
        onhold_status: 1,
        item_id: [],
        variation_id: [],
        user_id: parseInt(orderDetails.user_id, 10),
        operation_user_id: parseInt(orderDetails.operation_user_id, 10),
        onhold_note: messageOH,
      };
      orderDetails.items.forEach((item) => {
        result.item_id.push(parseInt(item.item_id, 10));
        result.variation_id.push(parseInt(item.variation_id, 10));
      });
      dispatch(CustomOrderOHChina(result));
      if (CustomOrderOHDataa.status === 200) {
        setOHMessage("");
        setshowMessageOHModal(false);
        ShowAlert(
          "",
          CustomOrderOHDataa.data.message,
          "success",
          null,
          null,
          null,
          null,
          2000
        );
        navigate("/on_hold_orders_system_in_china");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setMessage, setTableData, setOrderData]);

  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };

  const handlePrint = () => {
    setShowModal(true);
  };

  const handleFileInputChange = async (e, itemId, itemVariationId) => {
    if (e.target.files[0]) {
      const file = await CompressImage(e.target.files[0]);
      const fr = new FileReader();
      fr.onload = function () {
        setSelectedFileUrl(fr.result);
        setSelectedFile(file);
        setShowAttachmentModal(true);
        setSelectedItemId(itemId);
        setSelectedVariationId(itemVariationId);
      };
      fr.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setSelectedFileUrl(null);
    setSelectedFile(null);
    setShowAttachmentModal(false);
  };

  const handleSubmitAttachment = async () => {
    setAttachmentsubmitbtn(true);
    try {
      const { user_id } = userData ?? {};
      if (selectedItemId) {
        dispatch(
          AttachmentFileUploadChina({
            user_id: user_id,
            order_id: id,
            item_id: selectedItemId,
            variation_id: selectedVariationId,
            selectedFile: selectedFile,
          })
        );
      } else {
        dispatch(
          OverAllAttachmentFileUploadChina({
            order_id: orderDetailsDataOrderId?.order_id,
            order_dispatch_image: selectedFile,
          })
        );
      }
      setShowAttachmentModal(false);
      setSelectedFile(null);
      const result = await ShowAlert(
        "",
        "Uploaded Successfully!",
        "success",
        null,
        null,
        null,
        null,
        2000
      );
      if (result.isConfirmed) handleCancel();
      fetchOrder();
      setAttachmentsubmitbtn(false);
    } catch (error) {
      console.error(error);
      setAttachmentsubmitbtn(false);
    }
  };

  const variant = (variations) => {
    const matches = variations.match(
      /"display_key";s:\d+:"([^"]+)";s:\d+:"display_value";s:\d+:"([^"]+)";/
    );
    if (matches) {
      const key = matches[1];
      const value = matches[2].replace(/<[^>]*>/g, ""); // Remove HTML tags
      return `${key}: ${value}`;
    } else {
      return "Variant data not available";
    }
  };

  const variant2 = (variations) => {
    const { Color, Size } = variations;

    if (!Color && !Size) {
      return "Variant data not available";
    }

    let details = [];

    if (Size) {
      details.push(`Size: ${Size}`);
    }

    if (Color) {
      details.push(`Color: ${Color}`);
    }

    return details.join(", ");
  };

  const columns = [
    {
      field: "select",
      headerName: t("POManagement.Select"),
      flex: 0.5,
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
      field: "item_id",
      headerName: t("P1ChinaSystem.ItemId"),
      className: "order-details",
      flex: 0.5,
    },
    {
      field: "product_name",
      headerName: t("P1ChinaSystem.Name"),
      className: "order-details",
      flex: 1.5,
    },
    {
      field: "variant_details",
      headerName: t("P1ChinaSystem.VariantDetails"),
      className: "order-details",
      flex: 1.5,
      renderCell: (params) => {
        if (
          params.row.variations &&
          Object.keys(params.row.variations).length !== 0
        ) {
          return variant2(params.row.variations);
        } else if (
          params.row.variation_value &&
          params.row.variation_value !== ""
        ) {
          return variant(params.row.variation_value);
        } else {
          return "No variations available";
        }
      },
    },
    {
      field: "product_image",
      headerName: t("POManagement.Image"),
      flex: 1,
      className: "order-details",
      renderCell: (params) => (
        <Box
          className="h-100 w-100 d-flex align-items-center"
          onClick={() => {
            ImageModule(params?.value);
            setAttachmentZoom(false);
          }}
        >
          <Avatar
            src={params.value || require("../../assets/default.png")}
            alt="Product Image"
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
      field: "quantity",
      headerName: t("P1ChinaSystem.QTY"),
      flex: 0.5,
      className: "order-details",
    },
    {
      field: "avl_quantity",
      headerName: t("P1ChinaSystem.AvlQTY"),
      flex: 0.5,
    },
    {
      field: "dispatch_type",
      headerName: t("POManagement.Status"),
      flex: 0.5,
      className: "order-details",
      type: "string",
    },
    {
      field: "stock_status",
      headerName: "Stock Status",
      flex: 1,
      renderCell: (params) => {
        const storeValue = params.row.instore;
        return storeValue === "1" ? (
          <span style={{ marginLeft: 8 }}>In Store</span>
        ) : (
          <span style={{ marginLeft: 8 }}>Out of Store</span>
        );
      },
    },
  ];

  const handleToggle = () => {
    setIsChecked(!isChecked); // Toggle the state between checked/unchecked
    handleCheckboxClick(); // Call your custom function
  };

  const handleCheckboxClick = () => {
    // Custom function to be called on checkbox click
    console.log("Checkbox clicked!");
  };

  const handleCopy = (text) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setSnackbarOpen(true); // Show the Snackbar
      })
      .catch((err) => {
        console.error("Failed to copy text: ", err);
      });
  };

  console.log(userData, "userData");

  return (
    <>
      <Container fluid className="px-5">
        <MDBRow className="my-3">
          <MDBCol className="d-flex">
            <Button
              variant="outline-secondary"
              className="bg-transparent text-secondary"
              onClick={() => navigate("/order_tracking_number_Pending")}
            >
              <ArrowBackIcon className="me-1" />
            </Button>
          </MDBCol>
          <MDBCol className="d-flex justify-content-end">
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
          </MDBCol>
        </MDBRow>
        <Card className="p-3 mb-3">
          <Row className="d-flex align-items-center justify-content-between">
            <Box>
              <Typography variant="h6" className="fw-bold mb-3">
                {t("P1ChinaSystem.OrderDetails")}
              </Typography>
              {loader ? (
                <Loader />
              ) : (
                <Row className="d-flex">
                  <Col md={4} className="d-flex align-items-start">
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center", // Align content to the start
                        justifyContent: "center", // Align content to the start
                        textAlign: "center",
                        borderRadius: 1, // Optional: to add rounded corners
                      }}
                    >
                      <Typography className="fw-bold">
                        #{t("P1ChinaSystem.Order")} {id}
                      </Typography>
                      <Typography sx={{ fontSize: 14 }}>
                        <Badge bg="success">{orderDetails?.order_status}</Badge>
                      </Typography>
                    </Box>
                  </Col>
                  <Col md={8}>
                    <Box className="d-flex justify-content-center">
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          textAlign: "center",
                          borderRadius: 1, // Optional: to add rounded corners
                        }}
                      >
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            padding: "0px",
                          }}
                        >
                          <TextField
                            variant="outlined"
                            value={orderDetails?.items[0].tracking_id || ""}
                            InputProps={{
                              readOnly: true,
                              endAdornment: (
                                <IconButton
                                  onClick={() =>
                                    handleCopy(
                                      orderDetails?.items[0].tracking_id
                                    )
                                  }
                                  sx={{
                                    cursor: "pointer",
                                    textAlign: "center",
                                  }}
                                >
                                  <ContentCopyIcon />
                                </IconButton>
                              ),
                            }}
                            inputProps={{
                              style: {
                                textAlign: "center",
                                fontWeight: "bold",
                                fontSize: "24px", // Increase font size for the tracking ID
                                padding: "8px", // Add padding to make the input box larger
                              },
                            }}
                            sx={{
                              width: "100%", // Make the input box larger
                              fontSize: "24px", // Increase font size for the input box text
                            }}
                          />
                        </Box>
                        <Typography sx={{ fontSize: 16 }}>
                          <Badge bg="success">Tracking ID</Badge>
                        </Typography>
                      </Box>
                    </Box>
                  </Col>
                </Row>
              )}
            </Box>
          </Row>
        </Card>
        <Row className="mb-3">
          <Col
            sm={12}
            md={tableData.some((data) => data.status_change === "1") ? 6 : 12}
          >
            <Card className="p-3 h-100">
              <Typography variant="h6" className="fw-bold mb-3">
                {t("P1ChinaSystem.CustomerOrder")}
              </Typography>
              {loader ? (
                <Loader />
              ) : (
                <>
                  <Row className="mb-2">
                    <Col md={5}>
                      <Typography
                        variant="label"
                        className="fw-semibold"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        {t("P1ChinaSystem.Name")}
                      </Typography>
                    </Col>
                    <Col md={7}>
                      <Typography
                        variant="label"
                        className="fw-semibold text-secondary"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        : {"  "}
                        {orderDetails?.customer_name}
                      </Typography>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={5}>
                      <Typography
                        variant="label"
                        className="fw-semibold"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        {t("P1ChinaSystem.Phone")}
                      </Typography>
                    </Col>
                    <Col md={7}>
                      <Typography
                        variant="label"
                        className="fw-semibold text-secondary"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        : {"  "}
                        {orderDetails?.contact_no}
                      </Typography>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={5}>
                      <Typography
                        variant="label"
                        className="fw-semibold"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        {t("P1ChinaSystem.CustomerShippingAddress")}
                      </Typography>
                    </Col>
                    <Col md={7}>
                      <Typography
                        variant="label"
                        className="fw-semibold text-secondary"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        : {"  "}
                        {orderDetails?.customer_shipping_address}
                      </Typography>
                    </Col>
                  </Row>
                  <Row className="mb-2">
                    <Col md={5}>
                      <Typography
                        variant="label"
                        className="fw-semibold"
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        {t("P1ChinaSystem.OrderProcess")}
                      </Typography>
                    </Col>
                    <Col md={7}>
                      <Typography
                        variant="label"
                        className="fw-semibold text-secondary"
                        sx={{
                          fontSize: 14,
                          textTransform: "capitalize",
                        }}
                      >
                        : {"  "}
                        <Badge bg="success">
                          {orderDetails?.order_process}
                        </Badge>
                      </Typography>
                    </Col>
                  </Row>
                </>
              )}
            </Card>
          </Col>
          {tableData.some((data) => data.status_change === "1") ? (
            <Col sm={12} md={6}>
              <Card className="p-3 h-100">
                <Typography variant="h6" className="fw-bold mb-3">
                  Attachment
                </Typography>
                {loader ? (
                  <Loader />
                ) : (
                  <>
                    <Row className={`${"justify-content-center"} h-100`}>
                      <Col
                        md={12}
                        className={`d-flex align-items-center justify-content-center my-1`}
                      >
                        {tableData.some(
                          (data) => data.dispatch_image === ""
                        ) ? (
                          <Alert
                            severity="warning"
                            sx={{ fontFamily: "monospace", fontSize: "18px" }}
                          >
                            Please upload attachment for all the products in
                            below order table!
                          </Alert>
                        ) : orderDetailsDataOrderId?.overall_order_dis_image !=
                          "" ? (
                          <Avatar
                            src={
                              orderDetailsDataOrderId?.overall_order_dis_image
                            }
                            alt="Product Image"
                            sx={{
                              height: "150px",
                              width: "100%",
                              borderRadius: "2px",
                              margin: "0 auto",
                              "& .MuiAvatar-img": {
                                height: "100%",
                                width: "100%",
                                borderRadius: "2px",
                              },
                            }}
                          />
                        ) : (
                          <>
                            <Card className="factory-card me-1 shadow-sm mb-0">
                              {userData?.user_id ==
                                orderDetailsDataOrderId?.operation_user_id &&
                              orderDetails.order_process == "started" ? (
                                <>
                                  <Button
                                    className="bg-transparent border-0 text-black"
                                    onClick={() =>
                                      fileInputRef?.current?.click()
                                    }
                                  >
                                    <CloudUploadIcon />
                                    <Typography style={{ fontSize: "14px" }}>
                                      Device
                                    </Typography>
                                  </Button>
                                  <input
                                    type="file"
                                    ref={fileInputRef}
                                    style={{ display: "none" }}
                                    onChange={handleFileInputChange}
                                  />
                                </>
                              ) : (
                                <Button
                                  className="bg-transparent border-0 text-black"
                                  disabled
                                >
                                  <CloudUploadIcon />
                                  <Typography style={{ fontSize: "14px" }}>
                                    Device
                                  </Typography>
                                </Button>
                              )}
                            </Card>

                            <Card className="factory-card ms-1 shadow-sm mb-0">
                              {userData?.user_id ==
                                orderDetailsDataOrderId?.operation_user_id &&
                              orderDetails.order_process == "started" ? (
                                <Button
                                  className="bg-transparent border-0 text-black"
                                  onClick={() => setShowAttachModal(true)}
                                >
                                  <CameraAltIcon />
                                  <Typography style={{ fontSize: "14px" }}>
                                    Camera
                                  </Typography>
                                </Button>
                              ) : (
                                <Button
                                  className="bg-transparent border-0 text-black"
                                  disabled
                                >
                                  <CameraAltIcon />
                                  <Typography style={{ fontSize: "14px" }}>
                                    Camera
                                  </Typography>
                                </Button>
                              )}
                            </Card>
                          </>
                        )}
                      </Col>
                    </Row>
                  </>
                )}
              </Card>
            </Col>
          ) : null}
        </Row>
        <Card className="p-3 mb-3">
          <Box className="d-flex justify-content-between">
            <Typography variant="h6" className="fw-bold mb-3">
              {t("P1ChinaSystem.OrderDetails")}
            </Typography>
            {userData && userData.user_role === "administrator" && (
              <Box className="d-flex">
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <CheckCircle
                    style={{
                      color: blue[500],
                      transition: "transform 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleInstoreStatus(1)}
                  />
                  <span style={{ marginLeft: 8 }}>In Store</span>
                </Box>
                <Box
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginLeft: 20,
                  }}
                >
                  <Cancel
                    style={{
                      color: red[500],
                      transition: "transform 0.15s ease",
                      display: "flex",
                      alignItems: "center",
                      cursor: "pointer",
                    }}
                    onClick={() => handleInstoreStatus(0)}
                  />
                  <span style={{ marginLeft: 8 }}>In Store</span>
                </Box>
              </Box>
            )}
          </Box>
          {loader ? (
            <Loader />
          ) : (
            <div className="mt-2">
              <DataTable
                columns={columns}
                rows={tableData}
                // page={page}
                // pageSize={pageSize}
                // totalPages={totalPages}
                // handleChange={handleChange}
                rowHeight={85}
              />
            </div>
          )}
        </Card>
        {orderDetailsDataOrderId?.operation_user_note &&
          orderDetailsDataOrderId?.operation_user_note.length > 0 && (
            <Card className="p-3 mb-3">
              <Box className="d-flex align-items-center justify-content-between">
                <Box className="w-100">
                  <Typography
                    variant="h6"
                    className="fw-bold mb-3"
                  ></Typography>
                  <Box className="d-flex justify-content-between">
                    <div style={{ width: "100%" }}>
                      <Accordion>
                        <AccordionSummary
                          expandIcon={<ExpandMoreIcon />}
                          aria-controls="panel1-content"
                          id="panel1-header"
                        >
                          <Typography variant="h6" className="fw-bold">
                            {t("P1ChinaSystem.Messages")}
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          <List>
                            {orderDetailsDataOrderId?.operation_user_note.map(
                              (message, i) => (
                                <ListItem
                                  key={i}
                                  className="d-flex justify-content-start"
                                >
                                  <ListItemText
                                    primary={message.message}
                                    secondary={message.user}
                                    className="rounded p-2"
                                    style={{
                                      maxWidth: "70%",
                                      minWidth: "50px",
                                      backgroundColor: "#bfdffb",
                                    }}
                                  />
                                </ListItem>
                              )
                            )}
                          </List>
                        </AccordionDetails>
                      </Accordion>
                    </div>
                  </Box>
                </Box>
              </Box>
            </Card>
          )}
        <Alert variant={"info"}>
          <label>Customer Note :-</label> "There is a customer note!"
        </Alert>
        <Modal
          show={showAttachModal}
          onHide={() => setShowAttachModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Select Attachment From</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3">
            <Box className="d-flex justify-content-center my-5">
              <Box className="">
                {selectedFileUrl ? (
                  <img src={selectedFileUrl} alt="webcam" />
                ) : (
                  <Webcam
                    style={{ width: "100%", height: "100%" }}
                    ref={webcamRef}
                  />
                )}
                <Box className="btn-container">
                  {selectedFileUrl ? (
                    <Button onClick={retake}>Retake photo</Button>
                  ) : (
                    <Button onClick={capture}>Capture photo</Button>
                  )}
                </Box>
              </Box>
            </Box>
          </Modal.Body>
        </Modal>
        <Modal
          show={showEditModal}
          // onHide={handleCloseEditModal}
          onHide={() => setShowEditModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>
              {attachmentZoom ? "Attached Image" : "Product Image"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="factory-card">
              <img src={imageURL} alt="Product" />
            </Card>
          </Modal.Body>
        </Modal>
        <PrintModal
          show={showModal}
          handleClosePrintModal={() => setShowModal(false)}
          showModal={showModal}
          orderData={orderData}
        />
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
              onChange={(e) => handleChange(e)}
            />
            <Box className="text-end my-3">
              <Button
                variant="secondary"
                className="mt-2 fw-semibold"
                onClick={handleAddMessage}
              >
                Add Message
              </Button>
            </Box>
          </Modal.Body>
        </Modal>
        <Modal
          show={showMessageOHModal}
          onHide={() => setshowMessageOHModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>On Hold Reason </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Control
              as="textarea"
              placeholder="Enter your reason here..."
              rows={3}
              value={messageOH}
              onChange={(e) => setOHMessage(e.target.value)}
            />
            <Box className="text-end my-3">
              {AddInOnHold ? (
                <Button
                  variant="secondary"
                  className="mt-2 fw-semibold"
                  onClick={submitOH}
                  disabled
                >
                  Submit
                </Button>
              ) : (
                <Button
                  variant="secondary"
                  className="mt-2 fw-semibold"
                  disabled={messageOH == "" ? true : false}
                  onClick={submitOH}
                >
                  Submit
                </Button>
              )}
            </Box>
          </Modal.Body>
        </Modal>
        <Modal
          show={showAttachmentModal}
          onHide={() => setShowAttachmentModal(false)}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Attachment</Modal.Title>
          </Modal.Header>
          <Modal.Body className="py-4">
            <Row className="justify-content-center">
              <Col md={10}>
                <Box
                  className="mx-auto mb-4 border border-secondary rounded-4"
                  sx={{
                    height: "150px",
                    width: "100%",
                    position: "relative",
                  }}
                >
                  <CancelIcon
                    sx={{
                      position: "absolute",
                      top: "-9px",
                      right: "-9px",
                      cursor: "pointer",
                    }}
                    onClick={handleCancel}
                  />
                  <img
                    style={{ objectFit: "cover" }}
                    className="h-100 w-100 rounded-4"
                    alt=""
                    src={selectedFileUrl}
                  />
                </Box>
                <Box className="text-end">
                  {selectedItemId ? (
                    <Button
                      variant="primary"
                      className=""
                      onClick={handleSubmitAttachment}
                      disabled={attachmentsubmitbtn}
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className=""
                      onClick={handleSubmitAttachment}
                      disabled={attachmentsubmitbtn}
                    >
                      Submitt
                    </Button>
                  )}
                </Box>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
        <Snackbar
          open={snackbarOpen}
          autoHideDuration={1000} // Snackbar will auto-dismiss after 3 seconds
          onClose={() => setSnackbarOpen(false)}
          message="Tracking ID copied to clipboard!"
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        />
      </Container>
    </>
  );
}
export default OrderTrackingNumberPendingDetails;
