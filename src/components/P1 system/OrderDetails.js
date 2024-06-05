import React, { useState, useEffect, useRef, useCallback } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, Col, Modal, Row } from "react-bootstrap";
import PrintModal from "./PrintModal";
import { Alert, Avatar, Box, Typography } from "@mui/material";
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
  CustomOrderFinish,
  InsertOrderPickup,
  InsertOrderPickupCancel,
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
import axios from "axios";
import { API_URL } from "../../redux/constants/Constants";

function OrderDetails() {
  const { id } = useParams();
  const fileInputRef = useRef({});
  const [orderData, setOrderData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderProcess, setOrderProcess] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const webcamRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem("user_data")) ?? {};
  const [showMessageModal, setshowMessageModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [attachmentZoom, setAttachmentZoom] = useState(false);
  const loader = useSelector((state) => state?.orderSystemData?.isOrderDetails);
  fileInputRef.current[selectedItemId] = useRef(null);
  const orderDetailsDataOrderId = useSelector(
    (state) => state?.orderSystemData?.orderDetails?.orders?.[0]
  );

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
      const response = await dispatch(OrderDetailsGet({ id: id }));

      let data = response.data.orders.map((v, i) => ({ ...v, id: i }));
      setOrderData(data);
      setOrderDetails(response.data.orders[0]);
      const order = response.data.orders[0];
      if (order) setOrderProcess(order.order_process);
      if (data) {
        data.forEach((order, index) => {
          const newData = order.items.map((product, index1) => ({
            ...product,
            id: index1,
          }));
          setTableData(newData);
        });
      }
    } catch (error) {
      console.error(error);
    }
  }

  const handleAddMessage = async () => {
    const orderId = parseInt(id, 10);
    const requestedMessage = {
      message: message,
      order_id: orderId,
    };
    await dispatch(AddMessage(requestedMessage)).then(async (response) => {
      if (response.data) {
        const result = await ShowAlert("", response.data, "success");
        if (result.isConfirmed) {
          setMessage("");
          setshowMessageModal(false);
        }
      }
    });
  };

  useEffect(() => {
    fetchOrder();
  }, [message, setTableData, setOrderData]);

  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };

  const handlePrint = () => {
    setShowModal(true);
  };

  const handleFileInputChange = async (e, itemId) => {
    if (e.target.files[0]) {
      const file = await CompressImage(e.target.files[0]);
      const fr = new FileReader();
      fr.onload = function () {
        setSelectedFileUrl(fr.result);
        setSelectedFile(file);
        setShowAttachmentModal(true);
        setSelectedItemId(itemId);
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
        const response = await axios.post(
          `${API_URL}wp-json/order-complete-attachment/v1/delete-attachment/${id}/${e.item_id}`,
          {
            variation_id: e.variation_id,
            image_url: e.dispatch_image,
          }
        );
        fetchOrder();
      }
    });
  };

  const handleSubmitAttachment = async () => {
    try {
      const { user_id } = userData ?? {};
      if (selectedItemId) {
        await dispatch(
          AttachmentFileUpload({
            user_id: user_id,
            order_id: orderDetailsDataOrderId?.order_id,
            item_id: selectedItemId,
            selectedFile: selectedFile,
          })
        );
      } else {
        await dispatch(
          OverAllAttachmentFileUpload({
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
      console.log(result, "result=======img");
      if (result.isConfirmed) handleCancel();
      fetchOrder();
    } catch (error) {
      console.error(error);
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

  const   handleFinishButtonClick = async () => {
    try {
      const { user_id } = userData ?? {};
      const response = await dispatch(CustomOrderFinish(user_id, id, navigate));
      if (response.data.status === "Completed") {
        await Swal.fire({
          title: response.data.message,
          icon: "success",
          showConfirmButton: true,
        });
        navigate("/ordersystem");
      } else {
        Swal.fire({
          title: response.data.message,
          icon: "error",
          showConfirmButton: true,
        });
      }
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

  const columns = [
    {
      field: "item_id",
      headerName: "Item Id",
      className: "order-details",
      flex: 1,
    },
    {
      field: "product_name",
      headerName: "Name",
      className: "order-details",
      flex: 2,
    },
    {
      field: "variant_details",
      headerName: "Variant Details",
      className: "order-details",
      flex: 1.5,
      renderCell: (params) => {
        if (params.row.variation_value && params.row.variation_value !== "") {
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
      field: "dispatch_type",
      headerName: "Status",
      flex: 1,
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
        const handleFileInputChangeForRow = (e) => {
          handleFileInputChange(e, itemId);
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
                  orderProcess == "started" ? (
                    <Button
                      className="bg-transparent border-0  text-black"
                      onClick={() => fileInputRef.current[itemId]?.click()}
                    >
                      <CloudUploadIcon />
                      <Typography style={{ fontSize: "14px" }}>
                        Device
                      </Typography>
                      <input
                        type="file"
                        ref={(input) => (fileInputRef.current[itemId] = input)}
                        style={{ display: "none" }}
                        onChange={handleFileInputChangeForRow}
                      />
                    </Button>
                  ) : orderProcess == "started" &&
                    userData?.user_id != orderDetails?.operation_user_id ? (
                    <Button
                      className="bg-transparent border-0  text-black"
                      disabled
                    >
                      <CloudUploadIcon />
                      <Typography style={{ fontSize: "14px" }}>
                        Device
                      </Typography>
                    </Button>
                  ) : (
                    <Button
                      className="bg-transparent border-0  text-black"
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
                  orderProcess == "started" ? (
                    <Button
                      className="bg-transparent border-0 text-black"
                      onClick={() => {
                        setShowAttachModal(true);
                        setSelectedItemId(itemId);
                      }}
                    >
                      <CameraAltIcon />
                      <Typography style={{ fontSize: "14px" }}>
                        Camera
                      </Typography>
                    </Button>
                  ) : orderProcess == "started" &&
                    userData?.user_id != orderDetails?.operation_user_id ? (
                    <Button
                      className="bg-transparent border-0 text-black"
                      disabled
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
              onClick={() => navigate("/ordersystem")}
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
                Order Details
              </Typography>
              {loader ? (
                <Loader />
              ) : (
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
              )}
            </Box>
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
                <LocalPrintshopOutlinedIcon />
              </Button>
              {userData?.user_id == orderDetails?.operation_user_id &&
              orderProcess == "started" ? (
                <Button
                  variant="outline-danger"
                  className="p-1 me-2 bg-transparent text-danger"
                  onClick={handleCancelOrderProcess}
                >
                  <CancelIcon />
                </Button>
              ) : orderProcess == "started" &&
                userData?.user_id != orderDetails?.operation_user_id ? (
                <Button variant="success" disabled>
                  Start
                </Button>
              ) : (
                <Button
                  variant="success"
                  // disabled
                  onClick={handleStartOrderProcess}
                >
                  Start
                </Button>
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
                                orderDetailsDataOrderId?.operation_user_id &&
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
            Order Details
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
        <Alert variant={"success"}>
          <label>Meesage :-</label>{" "}
          <Box>{orderDetailsDataOrderId?.operation_user_note}</Box>
        </Alert>
        <MDBRow>
          <MDBCol md="12" className="d-flex justify-content-end">
            {userData?.user_id == orderDetails?.operation_user_id &&
            orderProcess == "started" ? (
              <Button variant="danger" onClick={handleFinishButtonClick}>
                Finish
              </Button>
            ) : (
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
export default OrderDetails;
