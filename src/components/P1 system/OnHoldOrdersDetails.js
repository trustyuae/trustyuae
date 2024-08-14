import React, { useState, useEffect, useRef, useCallback } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, Col, Modal, Row } from "react-bootstrap";
import PrintModal from "./PrintModal";
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
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import Webcam from "react-webcam";
import { useDispatch, useSelector } from "react-redux";
import {
  AddMessage,
  AttachmentFileUpload,
  CustomItemSendToP2,
  CustomOrderFinish,
  CustomOrderFinishOH,
  InsertOrderPickup,
  InsertOrderPickupCancel,
  OnHoldOrderDetailsGet,
  OrderDetailsGet,
  OverAllAttachmentFileUpload,
} from "../../redux/actions/OrderSystemActions";
import Form from "react-bootstrap/Form";
import { CompressImage } from "../../utils/CompressImage";
import DataTable from "../DataTable";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import ShowAlert from "../../utils/ShowAlert";
import Swal from "sweetalert2";
import axiosInstance from "../../utils/AxiosInstance";
import { API_URL } from "../../redux/constants/Constants";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getUserData } from "../../utils/StorageUtils";

function OnHoldOrdersDetails() {
  const { id } = useParams();
  const fileInputRef = useRef({});
  const [userData, setUserData] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [tableData, setTableData] = useState([]);
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
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [selectedVariationId, setSelecetedVariationId] = useState("");
  const [toggleStatus, setToggleStatus] = useState(0);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [selectedItemIdss, setSelectedItemIdss] = useState([]);

  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [attachmentZoom, setAttachmentZoom] = useState(false);
  // const loader = useSelector((state) => state?.orderSystemData?.isOrderDetails);
  const [loader, setLoader] = useState(true);

  if (!fileInputRef.current) {
    fileInputRef.current = {};
  }
  fileInputRef.current[selectedItemId] = useRef(null);

  const orderDetailsDataOrderId = useSelector(
    (state) => state?.orderSystemData?.onHoldOrderDetails?.orders?.[0]
  );

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

  const fetchOrder = useCallback(async () => {
    try {
      const response = await dispatch(OnHoldOrderDetailsGet(id));
      const data = response.data.orders.map((v, i) => ({ ...v, id: i }));
      setOrderData(data);
      setOrderDetails(response.data.orders[0]);
      setToggleStatus(Number(response.data.orders[0].toggle_status));
      const order = response.data.orders[0];
      if (order) setOrderProcess(order.order_process);
      if (data) {
        const newData = data.flatMap((order) =>
          order.items.map((product, index1) => ({ ...product, id: index1 }))
        );
        setTableData(newData);
      }
      setLoader(false);
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (id) fetchOrder();
  }, [fetchOrder, id]);

  useEffect(() => {
    console.log(toggleStatus, "toggleStatus");
  }, [toggleStatus]);

  const handleAddMessage = async (e) => {
    const orderId = parseInt(id, 10);
    let userID = JSON.parse(localStorage.getItem("user_data"));
    const requestedMessage = {
      message: message,
      order_id: orderId,
      name: userID.first_name,
    };
    await dispatch(AddMessage(requestedMessage)).then(async (response) => {
      if (response.data) {
        setMessage("");
        setshowMessageModal(false);
        const result = await ShowAlert(
          "",
          response.data,
          "success",
          null,
          null,
          null,
          null,
          2000
        );
      }
    });
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
        setSelecetedVariationId(itemVariationId);
      };
      fr.readAsDataURL(file);
    }
  };

  const handleCancel = () => {
    setSelectedFileUrl(null);
    setSelectedFile(null);
    setShowAttachmentModal(false);
  };
  const handleCancelImg = async (e) => {
    Swal.fire({
      title: "Are you sure you want to delete this image?",
      icon: "question",
      showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "No",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axiosInstance.post(
          `${API_URL}wp-json/order-complete-attachment/v1/delete-attachment/${id}/${e.item_id}`,
          {
            variation_id: Number(e.variation_id),
            image_url: e.dispatch_image,
          }
        );
        fetchOrder();
      }
    });
  };

  const handleSubmitAttachment = async () => {
    setLoader(true);
    try {
      const { user_id } = userData ?? {};
      if (selectedItemId) {
        await dispatch(
          AttachmentFileUpload({
            user_id: user_id,
            order_id: orderDetailsDataOrderId?.order_id,
            item_id: selectedItemId,
            variation_id: selectedVariationId,
            selectedFile: selectedFile,
          })
        );
      } else {
        await dispatch(
          OverAllAttachmentFileUpload({
            // order_id: orderDetailsDataOrderId?.order_id,
            order_id: id,
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
      setLoader(false);
    } catch (error) {
      console.error(error);
    }
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

  const handleSendToP2ButtonClick = async () => {
    const selectedProductIds = selectedItems.map((item) => item.item_id);
    const selectedVariationIds = selectedItems.map((item) => item.variation_id);

    const payload = {
      product_id: selectedProductIds,
      variation_id: selectedVariationIds,
    };

    try {
      dispatch(CustomItemSendToP2(id, payload, navigate));
    } catch (error) {
      console.error("Error sending items to p2 system:", error);
    }
  };

  const handleStartOrderProcess = async () => {
    const requestData = {
      order_id: Number(id),
      user_id: userData.user_id,
      start_time: dayjs().format("YYYY-MM-DD HH:mm:ss"),
      end_time: "",
      order_status: "started",
    };
    await dispatch(InsertOrderPickup(requestData))
      .then((response) => {
        fetchOrder();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleCancelOrderProcess = async () => {
    const requestData = {
      order_id: parseInt(id, 10),
      operation_id: orderDetails?.operation_user_id,
      order_status: "Cancelled",
    };
    await dispatch(InsertOrderPickupCancel(requestData))
      .then((response) => {
        fetchOrder();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleFinishButtonClick = async () => {
    try {
      const { user_id } = userData ?? {};
      dispatch(CustomOrderFinishOH(user_id, id, navigate));
    } catch (error) {
      console.error("Error while finishing order:", error);
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
      headerName: "Select",
      flex: 1,
      renderCell: (params) => {
        return (
          <FormGroup>
            <FormControlLabel
              className="mx-auto"
              control={<Checkbox />}
              style={{ justifyContent: "center" }}
              checked={selectedItemIds.includes(params.row.id)}
              onChange={(event) => handleItemSelection(params.row)}
            />
          </FormGroup>
        );
      },
    },
    {
      field: "item_id",
      headerName: "Item Id",
      className: "order-details",
      flex: 0.5,
    },
    {
      field: "product_name",
      headerName: "Name",
      className: "order-details",
      flex: 1.5,
    },
    {
      field: "variant_details",
      headerName: "Variant Details",
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
      headerName: "Image",
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
      headerName: "QTY",
      flex: 0.5,
      className: "order-details",
    },
    {
      field: "avl_quantity",
      headerName: "Avl QTY",
      flex: 0.5,
    },
    {
      field: "dispatch_type",
      headerName: "Status",
      flex: 0.5,
      className: "order-details",
      type: "string",
    },
    {
      field: "dispatch_image",
      headerName: "Attachment",
      flex: 1.5,
      className: "order-details",
      type: "html",
      renderCell: (value, row) => {
        const itemId = value && value.row.item_id ? value.row.item_id : null;
        const itemVariationId =
          value && value.row.variation_id ? value.row.variation_id : 0;

        const qty = value.row.quantity;
        const avl_qty = value.row.avl_quantity;
        const handleFileInputChangeForRow = (e) => {
          handleFileInputChange(e, itemId, itemVariationId);
        };

        if (!fileInputRef.current) {
          fileInputRef.current = {};
        }
        if (value && value.row.dispatch_image) {
          const isDisabled = orderDetails.order_process !== "started";
          return (
            <Row className={`${"justify-content-center"} h-100`}>
              <Col
                md={12}
                className={`d-flex align-items-center justify-content-center my-1`}
              >
                <Box className="h-100 w-100 d-flex align-items-center justify-content-center position-relative">
                  <Avatar
                    src={value.row.dispatch_image}
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
                    onClick={() => {
                      ImageModule(value.row.dispatch_image);
                      setAttachmentZoom(true);
                    }}
                  />
                  {userData?.user_id == orderDetails?.operation_user_id &&
                    orderProcess == "started" &&
                    toggleStatus != 0 && (
                      <CancelIcon
                        sx={{
                          position: "relative",
                          top: "-30px",
                          right: "8px",
                          cursor: "pointer",
                          color: "red",
                          zIndex: 1,
                          // disabled=isDisabled
                          opacity: isDisabled ? 0.5 : 1,
                          pointerEvents: isDisabled ? "none" : "auto",
                          cursor: isDisabled ? "not-allowed" : "pointer",
                        }}
                        onClick={(e) => {
                          if (!isDisabled) {
                            handleCancelImg(value.row);
                          }
                        }}
                      />
                    )}
                </Box>
              </Col>
            </Row>
          );
        } else {
          return (
            <Row className={`${"justify-content-center"} h-100`}>
              <Col
                md={12}
                className={`d-flex align-items-center justify-content-center my-1`}
              >
                <Card className="factory-card me-1 shadow-sm mb-0">
                  {userData?.user_id == orderDetails?.operation_user_id &&
                  orderProcess == "started" &&
                  qty == avl_qty &&
                  toggleStatus != 0 ? (
                    <Button
                      className="bg-transparent border-0 text-black"
                      onClick={() =>
                        fileInputRef.current[
                          selectedVariationId ? selectedVariationId : itemId
                        ]?.click()
                      }
                    >
                      <CloudUploadIcon />
                      <Typography style={{ fontSize: "14px" }}>
                        Device
                      </Typography>
                      <input
                        type="file"
                        ref={(input) =>
                          (fileInputRef.current[
                            selectedVariationId ? selectedVariationId : itemId
                          ] = input)
                        }
                        style={{ display: "none" }}
                        onChange={handleFileInputChangeForRow}
                      />
                    </Button>
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
                  {userData?.user_id == orderDetails?.operation_user_id &&
                  orderProcess == "started" &&
                  qty == avl_qty &&
                  toggleStatus != 0 ? (
                    <Button
                      className="bg-transparent border-0 text-black"
                      onClick={() => {
                        setShowAttachModal(true);
                        setSelectedItemId(itemId);
                        setSelecetedVariationId(itemVariationId);
                      }}
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
              </Col>
            </Row>
          );
        }
      },
    },
  ];

  const handalswitch = async (e) => {
    setLoader(true);
    if (e) {
      // setToggleStatus(1)
      handelSend(e);
    } else {
      // setToggleStatus(0)
      handelSend(e);
    }
  };
  const handelSend = async (e) => {
    const result = {
      order_id: parseInt(orderDetails?.order_id, 10),
      item_id: [],
      product_name: [],
      variation_id: [],
      toggle_status: 0,
    };
    orderDetails?.items.forEach((item) => {
      result.item_id.push(parseInt(item.item_id, 10));
      result.product_name.push(item.product_name);
      result.variation_id.push(item.variation_id);
    });

    if (e) {
      result.toggle_status = 1;
      setToggleStatus(1);
    } else {
      result.toggle_status = 0;
      setToggleStatus(0);
    }

    console.log(result, "result");

    const response = await axiosInstance.post(
      `${API_URL}wp-json/custom-onhold-orders-toggle/v1/onhold_orders_toggle/`,
      result
    );
    console.log(response, "response");
    if (response) {
      fetchOrder();
    }
  };

  // useEffect(()=>{
  //   handelSend()
  // },[toggleStatus])
  return (
    <>
      <Container fluid className="px-5">
        <MDBRow className="my-3">
          <MDBCol
            md="5"
            className="d-flex justify-content-start align-items-center"
          >
            <Button
              variant="outline-secondary"
              className="p-1 me-2 bg-transparent text-secondary"
              onClick={() => navigate("/on_hold_orders_system")}
            >
              <ArrowBackIcon className="me-1" />
            </Button>
            <Box></Box>
          </MDBCol>
          {orderDetails?.operation_user_id != userData?.user_id &&
            orderDetails?.order_process == "started" && (
              <MDBCol md="7" className="d-flex justify-content-end">
                <Alert variant={"danger"}>
                  This order has already been taken by another user!
                </Alert>
              </MDBCol>
            )}
        </MDBRow>

        <Card className="p-3 mb-3">
          <Box className="d-flex align-items-center justify-content-between">
            <Box>
              <Typography variant="h6" className="fw-bold mb-3">
                On Hold Order Details
              </Typography>
              {loader ? (
                <Loader />
              ) : (
                <Box className="d-flex">
                  <Box>
                    <Typography className="fw-bold">Order# {id}</Typography>
                    <Typography
                      className=""
                      sx={{
                        fontSize: 14,
                      }}
                    >
                      <Badge bg="success">{orderDetails?.order_status}</Badge>
                    </Typography>
                  </Box>
                  {orderDetails?.order_process == "started" && (
                    <Box className="ms-5">
                      <Typography className="fw-bold">
                        {orderDetails?.user_name}
                      </Typography>
                      <Typography
                        className=""
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        <Badge bg="success">Order Started By</Badge>
                      </Typography>
                    </Box>
                  )}
                </Box>
              )}
            </Box>
            <Box className="d-flex">
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
                <LocalPrintshopOutlinedIcon />
              </Button>
              {userData?.user_id == orderDetails?.operation_user_id &&
              orderProcess == "started" ? (
                // <Button
                //   variant="outline-danger"
                //   className="p-1 me-2 bg-transparent text-danger"
                //   onClick={handleCancelOrderProcess}
                // >
                //   <CancelIcon />
                // </Button>
                <Form.Check // prettier-ignore
                  type="switch"
                  id="custom-switch"
                  style={{
                    width: "105px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  checked={toggleStatus}
                  // checked={0}
                  onChange={(e) => handalswitch(e.target.checked)}
                  // label="Send"
                />
              ) : orderProcess == "started" &&
                userData?.user_id != orderDetails?.operation_user_id ? (
                // <Button variant="success" disabled>
                //   Send
                // </Button>
                <Form.Check // prettier-ignore
                  type="switch"
                  disabled
                  id="custom-switch"
                  style={{
                    width: "105px",
                    height: "32px",
                    display: "flex",
                    alignItems: "center",
                  }}
                  checked={toggleStatus}
                  // checked={0}
                  onChange={(e) => handalswitch(e.target.checked)}
                  // label="Send"
                />
              ) : (
                <Button
                  variant="success"
                  // disabled
                  onClick={handleStartOrderProcess}
                >
                  Send
                </Button>
                // <Form.Check // prettier-ignore
                //   type="switch"
                //   id="custom-switch"
                //   style={{width:'105px',height:'32px',display:'flex',alignItems:'center' }}
                //   onChange={(e)=>handalswitch(e.target.checked)}
                //   label="Send"
                // />
              )}
            </Box>
          </Box>
        </Card>
        <Row className="mb-3">
          <Col
            sm={12}
            md={tableData.some((data) => data.status_change === "1") ? 6 : 12}
          >
            <Card className="p-3 h-100">
              <Typography variant="h6" className="fw-bold mb-3">
                Customer & Order
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
                        Name
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
                        Phone
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
                        Customer shipping address
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
                        Order Process
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
                        ) : orderDetails?.overall_order_dis_image != "" ? (
                          <Avatar
                            src={orderDetails?.overall_order_dis_image}
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
                                orderDetails?.operation_user_id &&
                              orderProcess == "started" ? (
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
                                orderDetails?.operation_user_id &&
                              orderProcess == "started" ? (
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
          <Typography variant="h6" className="fw-bold mb-3">
            On Hold Order Details
          </Typography>
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
        <Alert variant={"info"}>
          <label>Customer Note :-</label> "There is a customer note!"
        </Alert>
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
                            Messages
                          </Typography>
                        </AccordionSummary>
                        <AccordionDetails
                          style={{ maxHeight: "200px", overflowY: "auto" }}
                        >
                          <List>
                            {Array.isArray(
                              orderDetailsDataOrderId?.operation_user_note
                            ) ? (
                              orderDetailsDataOrderId.operation_user_note.map(
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
                              )
                            ) : (
                              <ListItem>
                                <ListItemText
                                  primary="No messages available"
                                  style={{ textAlign: "center" }}
                                />
                              </ListItem>
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
        <Alert variant={"success"}>
          <label>On Hold Meesage :-</label> {orderDetails?.onhold_note}
          {/* <Box>{orderDetails?.onhold_note}</Box> */}
        </Alert>
        <MDBRow>
          <MDBCol md="12" className="d-flex justify-content-end">
            {userData?.user_id == orderDetails?.operation_user_id &&
            orderProcess == "started" &&
            tableData?.some((data) => data.dispatch_image != "") ? (
              <>
                <Button
                  variant="danger"
                  disabled={orderDetails.toggle_status == 1 ? false : true}
                  onClick={handleSendToP2ButtonClick}
                  className="me-3"
                >
                  Send to P2 System
                </Button>
                <Button
                  variant="danger"
                  disabled={orderDetails.toggle_status == 1 ? false : true}
                  onClick={handleFinishButtonClick}
                >
                  Finish
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="danger"
                  disabled={
                    orderProcess != "started" ||
                    userData?.user_id != orderDetails?.operation_user_id ||
                    tableData?.some((data) => data.dispatch_image == "")
                  }
                  onClick={handleSendToP2ButtonClick}
                  className="me-3"
                >
                  Send to P2 System
                </Button>
                <Button
                  variant="danger"
                  disabled={
                    orderProcess != "started" ||
                    userData?.user_id != orderDetails?.operation_user_id ||
                    tableData?.some((data) => data.dispatch_image == "")
                  }
                  onClick={handleFinishButtonClick}
                >
                  Finish
                </Button>
              </>
            )}
          </MDBCol>
        </MDBRow>

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
              onChange={(e) => setMessage(e.target.value)}
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
                    >
                      Submit
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      className=""
                      onClick={handleSubmitAttachment}
                    >
                      Submitt
                    </Button>
                  )}
                </Box>
              </Col>
            </Row>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
export default OnHoldOrdersDetails;
