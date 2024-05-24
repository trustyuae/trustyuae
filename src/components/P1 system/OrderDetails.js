import React, { useState, useEffect, useRef, useCallback } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Badge, Card, Col, Row } from "react-bootstrap";
import PrintModal from "./PrintModal";
import Swal from "sweetalert2";
import { Box, Typography } from "@mui/material";
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
} from "../../redux/actions/OrderSystemActions";
import Form from "react-bootstrap/Form";
import { CompressImage } from "../../utils/CompressImage";

function OrderDetails() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderProcess, setOrderProcess] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAttachModal, setShowAttachModal] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedFileUrl, setSelectedFileUrl] = useState(null);
  const fileInputRef = useRef(null);
  const webcamRef = useRef(null);
  const userData = JSON.parse(localStorage.getItem("user_data")) ?? {};
  const [showMessageModal, setshowMessageModal] = useState(false);
  const [showAttachmentModal, setShowAttachmentModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const loader = useSelector(
    (state) => state?.orderSystemData?.isOrderDetails
  );
  console.log(loader,'loader')
  const orderDetailsDataOrderId = useSelector(
    (state) => state?.orderSystemData?.orderDetails?.orders?.[0]
  );
  console.log(orderDetailsDataOrderId?.operation_user_note, 'orderDetailsDataOrderId?.operation_user_note')
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
    await dispatch(
      OrderDetailsGet({
        id: id,
      })
    )
      .then((response) => {
        let data = response.data.orders.map((v, i) => ({ ...v, id: i }));
        setOrderData(data);
        setOrderDetails(response.data.orders[0]);
        const order = response.data.orders[0];
        if (order) {
          setOrderProcess(order.order_process);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleAddMessage = async () => {
    const orderId = parseInt(id, 10);
    const requestedMessage = {
      message: message,
      order_id: orderId
    }
    await dispatch(AddMessage(requestedMessage))
      .then((response) => {
        if (response.data === "Message added successfully") {
          Swal.fire({
            icon: "success",
            title: "Message uploaded Successfully!",
          }).then(() => {
            setMessage('');
            handleMessageCloseModal();
          });
        }
      })
  }

  useEffect(() => {
    fetchOrder();
  }, [message]);

  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };

  const handlePrint = (orderId) => {
    const order = orderData?.find((o) => o.id === orderId);
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleFileInputChange = async (e, itemId) => {
    if (e.target.files[0]) {
      const file = await CompressImage(e.target.files[0])
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

  const handleSubmitAttachment = async () => {
    const { user_id } = userData ?? {};
    console.log(selectedFile, 'selectedfile')
    dispatch(
      AttachmentFileUpload({
        user_id: user_id,
        order_id: orderDetailsDataOrderId?.order_id,
        item_id: selectedItemId,
        selectedFile: selectedFile,
      })
    )
      .then((response) => {
        console.log(response, "response upload");
        if (response.data.success) {
          Swal.fire({
            icon: "success",
            title: "Uploaded Successfully!",
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              handleCancel();
            }
          });
        }
        setShowAttachmentModal(false);
        setSelectedFile(null);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleStartOrderProcess = async () => {
    const currentDate = new Date();
    const orderId = parseInt(id, 10);
    const started = "started";
    const requestData = {
      order_id: orderId,
      user_id: userData.user_id,
      start_time: currentDate.toISOString().slice(0, 19).replace("T", " "),
      end_time: "",
      order_status: started,
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
    const orderId = parseInt(id, 10);
    const Cancel = "Cancelled";
    const requestData = {
      order_id: orderId,
      operation_id: orderDetails?.operation_user_id,
      order_status: Cancel,
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

      await dispatch(CustomOrderFinish({ user_id, id }))
        .then((response) => {
          if (response.data.status == "Completed") {
            Swal.fire({
              text: response.data?.message,
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/ordersystem");
              }
            });
          }
          if (response.data.status == "Dispatch Image") {
            Swal.fire({
              text: response.data?.message,
            });
          }
          if (response.data.status == "P2") {
            Swal.fire({
              text: response.data?.message,
            });
          }
        })
        .catch((error) => {
          console.error(error);
        });
    } catch (error) {
      console.error("Error while attaching file:", error);
    }
  };

  const variant = (e) => {
    const matches = e.match(
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

  const handalBackButton = () => {
    navigate("/ordersystem");
  };

  const handleMessageButtonClick = () => {
    setshowMessageModal(true);
  };

  const handleMessageCloseModal = () => {
    setshowMessageModal(false);
  };

  const handleAttachmentCloseModal = () => {
    setShowAttachmentModal(false);
  };
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
              onClick={handalBackButton}
            >
              <ArrowBackIcon className="me-1" />
            </Button>
            <Box></Box>
          </MDBCol>
          {orderDetails?.operation_user_id != userData?.user_id &&
            orderDetails?.order_process === "started" && (
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
              <Box>
                <Typography className="fw-bold">Order# {id}</Typography>
              </Box>
              <Typography
                className=""
                sx={{
                  fontSize: 14,
                }}
              >
                <Badge bg="success">{orderDetails?.order_status}</Badge>
              </Typography>
            </Box>
            <Box>
              <Button
                variant="outline-secondary"
                className="p-1 me-3 bg-transparent text-secondary"
                onClick={handleMessageButtonClick}
              >
                <AddCommentOutlinedIcon className="me-1" />
              </Button>
              <Button
                variant="outline-primary"
                className="p-1 me-3 bg-transparent text-primary"
                onClick={handlePrint}
              >
                <LocalPrintshopOutlinedIcon className="me-1" />
              </Button>
              {userData?.user_id == orderDetails?.operation_user_id &&
                orderProcess == "started" ? (
                <Button
                  variant="outline-danger"
                  className="p-1 me-2 bg-transparent text-danger"
                  onClick={handleCancelOrderProcess}
                >
                  <CancelIcon className="me-1" />
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
          <Col sm={12} md={12}>
            <Card className="p-3 h-100">
              <Typography variant="h6" className="fw-bold mb-3">
                Customer & Order
              </Typography>
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
                    <Badge bg="success">{orderDetails?.order_process}</Badge>
                  </Typography>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Card className="p-3 mb-3">
          <Typography variant="h6" className="fw-bold mb-3">
            Order Details
          </Typography>
          <Table striped bordered hover>
            <thead>
              <tr style={{ textAlign: "center" }}>
                <th>Item Id</th>
                <th>Name</th>
                <th>Variant Details</th>
                <th>Image</th>
                <th>Qty</th>
                <th>Status</th>
                <th>Attachment</th>
              </tr>
            </thead>
            <tbody>
              {orderData?.map((order, index) =>
                order?.items?.map((product, index1) => (
                  <tr style={{ verticalAlign: "middle", textAlign: "center" }}>
                    <td style={{ fontSize: 14 }}>{product.item_id}</td>
                    <td style={{ fontSize: 14 }}>{product.product_name}</td>
                    <td style={{ fontSize: 14 }}>
                      {variant(product.variation_value)}
                    </td>
                    <td style={{ fontSize: 14 }}>
                      <Box
                        className="mx-auto"
                        sx={{
                          height: "75px",
                          width: "75px",
                        }}
                      >
                        <img
                          onClick={() => ImageModule(product.product_image)}
                          src={
                            product.product_image ||
                            `${require("../../assets/default.png")}`
                          }
                          alt={product.product_name || "Product Image"}
                          className="h-100 w-100"
                          style={{ objectFit: "contain", cursor: "pointer" }}
                        />
                      </Box>
                    </td>
                    <td style={{ fontSize: 14 }}>{product.quantity}</td>
                    <td style={{ fontSize: 14 }}>
                      <Badge bg="success">{product.dispatch_type}</Badge>
                    </td>
                    <td
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        alignContent: "center",
                        textAlign: "center",
                      }}
                    >
                      <Row className={`${"justify-content-center"}`}>
                        <Col
                          md={12}
                          className={`d-flex align-items-center justify-content-center my-1`}
                        >
                          <Card className="factory-card me-1 shadow-sm mb-0">
                            {userData?.user_id ==
                              orderDetails?.operation_user_id &&
                              orderProcess == "started" ? (
                              <Button
                                className="bg-transparent border-0  text-black"
                                onClick={() => fileInputRef.current.click()}
                              >
                                <CloudUploadIcon />
                                <Typography style={{ fontSize: "14px" }}>
                                  Device
                                </Typography>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    handleFileInputChange(e, product.item_id)
                                  }
                                />
                              </Button>
                            ) : orderProcess == "started" &&
                              userData?.user_id !=
                              orderDetails?.operation_user_id ? (
                              <Button
                                className="bg-transparent border-0  text-black"
                                disabled
                                onClick={() => fileInputRef.current.click()}
                              >
                                <CloudUploadIcon />
                                <Typography style={{ fontSize: "14px" }}>
                                  Device
                                </Typography>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    handleFileInputChange(e, product.item_id)
                                  }
                                />
                              </Button>
                            ) : (
                              <Button
                                className="bg-transparent border-0  text-black"
                                disabled
                                onClick={() => fileInputRef.current.click()}
                              >
                                <CloudUploadIcon />
                                <Typography style={{ fontSize: "14px" }}>
                                  Device
                                </Typography>
                                <input
                                  type="file"
                                  ref={fileInputRef}
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    handleFileInputChange(e, product.item_id)
                                  }
                                />
                              </Button>
                            )}
                          </Card>
                          <Card className="factory-card ms-1 shadow-sm mb-0">
                            {userData?.user_id ==
                              orderDetails?.operation_user_id &&
                              orderProcess == "started" ? (
                              <Button
                                className="bg-transparent border-0 text-black"
                                onClick={() => {
                                  setShowAttachModal(true);
                                  setSelectedItemId(product.item_id);
                                }}
                              >
                                <CameraAltIcon />
                                <Typography style={{ fontSize: "14px" }}>
                                  Camera
                                </Typography>
                              </Button>
                            ) : orderProcess == "started" &&
                              userData?.user_id !=
                              orderDetails?.operation_user_id ? (
                              <Button
                                className="bg-transparent border-0 text-black"
                                disabled
                                onClick={() => {
                                  setShowAttachModal(true);
                                  setSelectedItemId(product.item_id);
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
                                onClick={() => {
                                  setShowAttachModal(true);
                                  setSelectedItemId(product.item_id);
                                }}
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
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Card>
        <Alert variant={"info"}>
          <label>Customer Note :-</label> "There is a customer note!"
        </Alert>
        <Alert variant={"success"}>
          <label>Meesage :-</label> <Box>{orderDetailsDataOrderId?.operation_user_note}</Box>
        </Alert>
        <MDBRow>
          <MDBCol md="12" className="d-flex justify-content-end">
            {userData?.user_id == orderDetails?.operation_user_id &&
              orderProcess == "started" ? (
              <Button variant="danger" onClick={handleFinishButtonClick}>
                Finish
              </Button>
            ) : orderProcess == "started" &&
              userData?.user_id != orderDetails?.operation_user_id ? (
              <Button
                variant="danger"
                disabled
                onClick={handleFinishButtonClick}
              >
                Finish
              </Button>
            ) : (
              <Button
                variant="danger"
                disabled
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
            <Modal.Title>Product Image</Modal.Title>
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
          onHide={handleMessageCloseModal}
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
            <Button className="mt-2" onClick={handleAddMessage}>Add Message</Button>
          </Modal.Body>
        </Modal>

        <Modal
          show={showAttachmentModal}
          onHide={handleAttachmentCloseModal}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Attachment</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Box className="text-center">
              <Box
                className="mx-auto mb-4"
                sx={{
                  height: "150px",
                  width: "100%",
                  position: "relative",
                }}
              >
                <CancelIcon
                  sx={{
                    position: "absolute",
                    top: "-15px",
                    right: "-15px",
                    cursor: "pointer",
                  }}
                  onClick={handleCancel}
                />
                <img
                  style={{ objectFit: "contain" }}
                  className="h-100 w-100"
                  alt=""
                  src={selectedFileUrl}
                />
              </Box>
              <Box className="text-center">
                <Button
                  variant="primary"
                  className="me-3"
                  onClick={handleSubmitAttachment}
                >
                  Submit
                </Button>
              </Box>
            </Box>
          </Modal.Body>
        </Modal>
      </Container>
    </>
  );
}
export default OrderDetails;
