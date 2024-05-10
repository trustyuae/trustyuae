import React, { useState, useEffect, useRef, useCallback } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Alert, Badge, Card, Col, Row } from "react-bootstrap";
import PrintModal from "./PrintModal";
import { getCountryName } from "../../utils/GetCountryName";
import Swal from "sweetalert2";
import { Box, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import Webcam from "react-webcam";

function OrderDetails() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  // const orderProcess = orderData && orderData.length > 0 ? orderData[0]?.order_process : null;
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

  const navigate = useNavigate();

  const apiUrl = `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-orders-new/v1/orders/?orderid=${id}`;

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current.getScreenshot();
    setSelectedFileUrl(imageSrc);
    setShowAttachModal(false);

    fetch(imageSrc)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], "screenshot.jpg", { type: "image/jpeg" });
        setSelectedFile(file);
      })
      .catch((error) => {
        console.error("Error converting data URL to file:", error);
      });
  }, [webcamRef]);

  const retake = () => {
    setSelectedFileUrl(null);
  };

  const fetchOrder = async () => {
    try {
      const response = await axios.get(apiUrl);
      let data = response.data.orders.map((v, i) => ({ ...v, id: i }));
      setOrderData(data);
      console.log(response.data.orders[0].user_id, "response.data.orders[0]");
      setOrderDetails(response.data.orders[0]);
      const order = response.data.orders[0];
      if (order) {
        setOrderProcess(order.order_process);
      }
    } catch (error) {
      console.error("Error fetching order data:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderProcess]);

  // const handleCloseEditModal = () => {
  //   setShowEditModal(false);
  // };

  const handleCloseAttachModal = () => {
    setShowAttachModal(false);
  };

  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };

  const handlePrint = (orderId) => {
    const order = orderData?.find((o) => o.id === orderId);
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleClosePrintModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    // if (selectedFile !== null) {
    // handleAttachButtonClick();
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile]);

  const handleFileUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileInputChange = async (e) => {
    const file = e.target.files[0];
    var fr = new FileReader();
    fr.onload = function () {
      setSelectedFileUrl(fr.result);
    };
    fr.readAsDataURL(file);
    setSelectedFile(file);
  };

  const handleCameraUpload = () => {
    setShowAttachModal(true);
  };

  const handleCancel = () => {
    setSelectedFileUrl(null);
    setSelectedFile(null);
  };

  const handleSubmitAttachment = async () => {
    try {
      const { user_id } = userData ?? {};
      const requestData = new FormData();
      requestData.append("dispatch_image", selectedFile);
      const response = await axios.post(
        `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-order-attachment/v1/insert-attachment/${user_id}/${id}`,
        requestData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
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
      setSelectedFile(null);
    } catch (error) {
      console.error("Error while attaching file:", error);
    }
  };

  // const handleAttachButtonClick = async () => {
  //   setShowAttachModal(true)
  // };
  const userData = JSON.parse(localStorage.getItem("user_data")) ?? {}; // Set default value to an empty object if userData is null

  const handleClick = async () => {
    const currentDate = new Date();
    const currentDateTimeString = currentDate
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");
    const { user_id } = userData;
    const orderId = parseInt(id, 10);
    const started = "started";
    const requestData = {
      order_id: orderId,
      user_id: user_id,
      start_time: currentDateTimeString,
      end_time: "",
      order_status: started,
    };
    axios
      .post(
        "https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-order-pick/v1/insert-order-pickup/",
        requestData
      )
      .then((response) => {
        if (response.status == 200) {
          fetchOrder();
        }
      })
      .catch((error) => {
        console.error("There was a problem with the API request:", error);
      });
  };

  const handleFinishButtonClick = async () => {
    try {
      const { user_id } = userData ?? {};
      const response = await axios.post(
        `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-order-finish/v1/finish-order/${user_id}/${id}`
      );
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

  return (
    <>
      <Container fluid className="px-5" >
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
            <Box>
              <Typography
                className="text-secondary"
                sx={{
                  fontSize: 14,
                }}
              >
                Order Details
              </Typography>
              <Typography className="fw-bold">Order# {id}</Typography>
            </Box>
          </MDBCol>
          {orderDetails?.user_id != userData?.user_id &&
            orderDetails?.order_process === "started" && (
              <MDBCol md="7" className="d-flex justify-content-end">
                <Alert variant={"danger"}>
                  This order has already been taken by another user!
                </Alert>
              </MDBCol>
            )}
          {/* <MDBCol md="6" className="d-flex justify-content-end">
            <Button
              type="button"
              className="btn btn-primary me-3"
              onClick={handlePrint}
            >
              Print
            </Button>
            <Button variant="success" disabled={orderProcess === 'started'} onClick={handleClick}>Start</Button>
          </MDBCol> */}
        </MDBRow>

        <Card className="p-3 mb-3">
          <Box className="d-flex align-items-center justify-content-between">
            <Box>
              <Typography variant="h6" className="fw-bold">
                Order# {id}
              </Typography>
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
                type="button"
                className="btn btn-primary me-3"
                onClick={handlePrint}
              >
                Print
              </Button>
              <Button
                variant="success"
                disabled={orderProcess === "started"}
                onClick={handleClick}
              >
                Start
              </Button>
            </Box>
          </Box>
        </Card>
        <Row className="mb-3">
          <Col sm={12} md={6}>
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
          <Col sm={12} md={6}>
            <Card className="p-3 h-100">
              <Typography variant="h6" className="fw-bold mb-3">
                Attachment
              </Typography>
              <Row
                className={`${
                  selectedFileUrl
                    ? "justify-content-start"
                    : "justify-content-center"
                } my-1`}
              >
                <Col
                  md={selectedFileUrl ? 7 : 12}
                  className={`d-flex ${
                    selectedFileUrl
                      ? "justify-content-start"
                      : "justify-content-center"
                  } my-1`}
                >
                  <Card className="factory-card p-3 mx-2 shadow-sm">
                    <Button
                      className="bg-transparent border-0 p-3 text-black"
                      onClick={handleFileUpload}
                    >
                      <CloudUploadIcon />
                      <Typography>Device</Typography>
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
                        onChange={handleFileInputChange}
                      />
                    </Button>
                  </Card>
                  <Card className="factory-card p-3 mx-2 shadow-sm">
                    <Button
                      className="bg-transparent border-0 p-3 text-black"
                      onClick={handleCameraUpload}
                    >
                      <CameraAltIcon />
                      <Typography>Camera</Typography>
                    </Button>
                  </Card>
                </Col>
                {selectedFileUrl && (
                  <Col md={5}>
                    <Box className="text-center">
                      <Box
                        className="mx-auto mb-2"
                        sx={{
                          height: "80px",
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
                          style={{ objectFit: "cover" }}
                          className="h-100 w-100"
                          alt=""
                          src={selectedFileUrl}
                        />
                      </Box>
                      <Button
                        variant="primary"
                        className="me-3"
                        onClick={handleSubmitAttachment}
                      >
                        Submit
                      </Button>
                    </Box>
                  </Col>
                )}
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
                          className="h-100 w-100"
                          style={{ objectFit: "contain", cursor: "pointer" }}
                        />
                      </Box>
                    </td>
                    <td style={{ fontSize: 14 }}>{product.quantity}</td>
                    <td style={{ fontSize: 14 }}>
                      <Badge bg="success">{product.dispatch_type}</Badge>
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

        {/* <Box className="py-3">
          <Typography variant="h4" className="fw-bold text-center">
            Order ID -{id}
          </Typography>
        </Box> 
        <Box className="mb-3">
           <Typography variant="h5" className="fw-bold mb-3">
            Shipping Address
          </Typography> 
          <MDBRow className="">
            <MDBCol col="10" md="12" sm="12"></MDBCol>

             <DataTable
              columns={shippingColumns}
              rows={orderData}
            /> 
            <Table
              striped
              bordered
              hover
              style={{ boxShadow: "4px 4px 11px 0rem rgb(0 0 0 / 25%)" }}
            >
              <thead>
                <tr className="table-headers">
                  <th
                    style={{
                      backgroundColor: "#DEE2E6",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    Customer name
                  </th>
                  <th
                    style={{
                      backgroundColor: "#DEE2E6",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    Address
                  </th>
                  <th
                    style={{
                      backgroundColor: "#DEE2E6",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    Country
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData?.map((order, index) => (
                  <tr key={index}>
                    <td className="text-center">{order.customer_name}</td>
                    <td className="text-center">{order.customer_shipping_address}</td>
                    <td className="text-center">{getCountryName(order.shipping_country)}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </MDBRow>
        </Box>

        <Box>
          <Typography variant="h5" className="fw-bold mb-3">
            Order Details
          </Typography>
          <MDBRow className="d-flex justify-content-center align-items-center">
            <MDBCol col="10" md="12" sm="12"></MDBCol>
            <Table
              striped
              bordered
              hover
              style={{ boxShadow: "4px 4px 11px 0rem rgb(0 0 0 / 25%)" }}
            >
              <thead>
                <tr className="table-headers">
                  <th
                    style={{
                      backgroundColor: "#DEE2E6",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    Name
                  </th>
                  <th
                    style={{
                      backgroundColor: "#DEE2E6",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    Variant Details
                  </th>
                  <th
                    style={{
                      backgroundColor: "#DEE2E6",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    Image
                  </th>
                  <th
                    style={{
                      backgroundColor: "#DEE2E6",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    Qty
                  </th>
                  <th
                    style={{
                      backgroundColor: "#DEE2E6",
                      padding: "8px",
                      textAlign: "center",
                    }}
                  >
                    Dispatch type
                  </th>
                </tr>
              </thead>
              <tbody>
                {orderData?.map((order, index) => (
                  order?.items.map((product, index1) => (
                    <tr key={`${index}-${index1}`}>
                      <td className="text-center">{product.product_name}</td>
                      <td className="text-center">{variant(product.variation_value)}</td>

                      <td className="text-center">
                        <span onClick={() => ImageModule(product.product_image)}>
                          <img
                            src={product.product_image}
                            alt={product.product_name}
                            style={{ maxWidth: "100px", cursor: "pointer" }}
                          />
                        </span>
                      </td>
                      <td className="text-center">{product.quantity}</td>
                      <td className="text-center">{product.dispatch_type}</td>
                    </tr>
                  ))
                ))}
              </tbody>
            </Table>
          </MDBRow>
        </Box>
        <MDBRow>
          <MDBCol md="12" className="d-flex ">
            <div className="alert alert-primary z-0" role="alert">
              <label>Customer Note:-</label>
              "There is a customer note!"
            </div>
          </MDBCol>
        </MDBRow>*/}
        <MDBRow>
          <MDBCol md="12" className="d-flex justify-content-end">
            {/* <Button
              variant="primary"
              className="me-3"
              onClick={handleAttachButtonClick}
            >
              Attach
            </Button> */}
            <Button variant="danger" onClick={handleFinishButtonClick}>
              Finish
            </Button>
          </MDBCol>
        </MDBRow>

        <Modal
          show={showAttachModal}
          onHide={handleCloseAttachModal}
          // style={{ marginTop: "130px" }}
          centered
        >
          <Modal.Header closeButton>
            <Modal.Title>Select Attachment From</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-3">
            <Box className="d-flex justify-content-center my-5">
              {/* <Card className="factory-card p-3 mx-2 shadow-sm"> */}
              {/* <Button className="bg-transparent border-0 p-3 text-black"
                  onClick={handleFileUpload}>
                  <CloudUploadIcon />
                  <Typography>
                    Device
                  </Typography>
                  <input
                    type="file"
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                    onChange={handleFileInputChange}
                  />
                </Button> */}
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
              {/* </Card> */}
              {/* <Card className="factory-card p-3 mx-2 shadow-sm">
                <Button className="bg-transparent border-0 p-3 text-black">
                  <CameraAltIcon />
                  <Typography>
                    Camera
                  </Typography>
                </Button>
              </Card> */}
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
          handleClosePrintModal={handleClosePrintModal}
          showModal={showModal}
          selectedOrder={selectedOrder}
          orderData={orderData}
        />
      </Container>
    </>
  );
}
export default OrderDetails;
