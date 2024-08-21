import React, { useState, useEffect, useRef, useCallback } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, Card, Col, Modal, Row } from "react-bootstrap";
import PrintModal from "./MissingPrintModal";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { useDispatch, useSelector } from "react-redux";
import Form from "react-bootstrap/Form";
import DataTable from "../DataTable";
import Loader from "../../utils/Loader";
import ShowAlert from "../../utils/ShowAlert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { getUserData } from "../../utils/StorageUtils";
import Swal from "sweetalert2";
import {
  AddMessage,
  CustomMissingOrderUpdate,
  CustomOrderPushToUAE,
  MissingOrderDetailsGet,
} from "../../Redux2/slices/OrderSystemSlice";

function MissingOrderDetails() {
  const { id } = useParams();
  const fileInputRef = useRef({});
  const [userData, setUserData] = useState(null);
  const [orderData, setOrderData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedVariationId, setSelectedVariationId] = useState("");
  const [orderDetails, setOrderDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showMessageModal, setshowMessageModal] = useState(false);
  const [selectedItemId, setSelectedItemId] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [attachmentZoom, setAttachmentZoom] = useState(false);
  const loader = useSelector((state) => state?.orderSystemData?.isOrderDetails);
  if (!fileInputRef.current) {
    fileInputRef.current = {};
  }
  fileInputRef.current[
    selectedVariationId ? selectedVariationId : selectedItemId
  ] = useRef(null);

  const orderDetailsDataOrderId = useSelector(
    (state) => state?.orderSystem?.missingOrderDetails?.orders?.[0]
  );

  const missingOrderDetailsData = useSelector(
    (state) => state?.orderSystem?.missingOrderDetails
  );

  useEffect(() => {
    async function fetchUserData() {
      try {
        const userdata = await getUserData();
        setUserData(userdata || {});
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    }
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (missingOrderDetailsData) {
      const missingOrderData = missingOrderDetailsData?.orders?.map((v, i) => ({
        ...v,
        id: i,
      }));
      setOrderData(missingOrderData);
    }

    if (orderDetailsDataOrderId) {
      setOrderDetails(orderDetailsDataOrderId);
      if (Array.isArray(orderDetailsDataOrderId.items)) {
        const newData = orderDetailsDataOrderId?.items?.map(
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
  }, [orderDetailsDataOrderId, missingOrderDetailsData]);

  async function fetchOrder() {
    try {
      dispatch(MissingOrderDetailsGet(id));
    } catch (error) {
      console.error(error);
    }
  }

  const handleChange = (e) => {
    setMessage(e.target.value);
  };

  const handleAddMessage = async (e) => {
    const requestedMessage = {
      message: message,
      order_id: parseInt(id, 10),
      name: userData.first_name,
    };
    await dispatch(AddMessage(requestedMessage)).then(async ({ payload }) => {
      if (payload) {
        setMessage("");
        setshowMessageModal(false);
        await ShowAlert("", payload, "success", null, null, null, null, 2000);
      }
    });
  };

  const handlePushToOrders = async () => {
    try {
      await dispatch(CustomOrderPushToUAE(id)).then(({ payload }) => {
        if (payload) {
          const result = Swal.fire({
            title: payload,
            icon: "success",
            showConfirmButton: true,
          });
          if (result.isConfirmed) {
            navigate("/ordersystem");
          }
        } else {
          Swal.fire({
            title: payload,
            icon: "error",
            showConfirmButton: true,
          });
        }
      });
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

  const handleStatusChange = (value, event) => {
    const updatedData = tableData.map((item) => {
      if (item.product_id === event.product_id) {
        if (item.variation_id == event.variation_id) {
          return { ...item, stock_status: value };
        }
      }
      return item;
    });
    setTableData(updatedData);
  };

  const handleOrderStatusChange = (value, event) => {
    const updatedData = tableData.map((item) => {
      if (item.product_id === event.product_id) {
        if (item.variation_id == event.variation_id) {
          return { ...item, order_status: value };
        }
      }
      return item;
    });
    setTableData(updatedData);
  };

  const handleDispatchTypeChange = (value, event) => {
    const updatedData = tableData.map((item) => {
      if (item.product_id === event.product_id) {
        if (item.variation_id == event.variation_id) {
          return { ...item, dispatch_type: value };
        }
      }
      return item;
    });
    setTableData(updatedData);
  };

  const handleUpdateData = async (rowdata) => {
    if (rowdata.dispatch_type !== rowdata.order_status) {
      await Swal.fire({
        title: "Dispatch type and Order Status need to be Same",
        icon: "error",
        showConfirmButton: true,
        timer: 2000,
      });
      return;
    }

    const payload = {
      order_id: Number(id),
      product_id: Number(rowdata.item_id),
      variation_id: Number(rowdata.variation_id || 0),
      stock_status: rowdata.stock_status,
      order_status: rowdata.order_status,
      dispatch_type: rowdata.dispatch_type,
    };

    try {
      dispatch(CustomMissingOrderUpdate(payload, navigate)).then(
        ({ payload }) => {
          if (payload) {
            Swal.fire({
              title: payload.message,
              icon: "success",
              showConfirmButton: true,
              timer: 2000,
            });
          } else {
            Swal.fire({
              title: payload,
              icon: "error",
              showConfirmButton: true,
              timer: 2000,
            });
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const columns = [
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
      flex: 1,
    },
    {
      field: "variant_details",
      headerName: "Variations",
      className: "order-details",
      flex: 0.8,
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
      flex: 0.5,
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
              height: "60px",
              width: "60px",
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
      headerName: "Dispatch Type",
      flex: 0.8,
      className: "order-details",
      type: "string",
      renderCell: (params) => {
        const rowId = params.row.id;
        const dispatchType = params.row.dispatch_type;

        return (
          <select
            id={`dispatch-type-${rowId}`}
            value={dispatchType}
            onChange={(event) =>
              handleDispatchTypeChange(event.target.value, params.row)
            }
            style={{
              height: "30px",
              fontSize: "0.875rem",
              width: "100%",
            }}
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="Dispatch">Dispatch</option>
            <option value="Reserve">Reserve</option>
            <option value="P2">P2</option>
          </select>
        );
      },
    },
    {
      field: "order_status",
      headerName: "Order Status",
      flex: 0.8,
      className: "order-details",
      type: "string",
      renderCell: (params) => {
        const rowId = params.row.id;
        const orderStatus = params.row.order_status;

        return (
          <select
            id={`order-status-${rowId}`}
            value={orderStatus}
            onChange={(event) =>
              handleOrderStatusChange(event.target.value, params.row)
            }
            style={{
              height: "30px",
              fontSize: "0.875rem",
              width: "100%",
            }}
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="Dispatch">Dispatch</option>
            <option value="Reserve">Reserve</option>
            <option value="P2">P2</option>
          </select>
        );
      },
    },
    {
      field: "stock_status",
      headerName: "Stock Status",
      flex: 0.8,
      className: "order-details",
      type: "string",
      renderCell: (params) => {
        const rowId = params.row.id;
        const currentStatus = params.row.stock_status;

        return (
          <select
            id={`stock-status-${rowId}`}
            value={currentStatus}
            onChange={(event) =>
              handleStatusChange(event.target.value, params.row)
            }
            style={{
              height: "30px",
              fontSize: "0.875rem",
              width: "100%",
            }}
          >
            <option value="" disabled>
              Select...
            </option>
            <option value="instock">In Stock</option>
            <option value="onbackorder">On BackOrder</option>
          </select>
        );
      },
    },
    {
      field: "update item",
      headerName: "Update Item",
      flex: 0.8,
      className: "order-system",
      type: "html",
      renderCell: (params) => {
        return (
          <Button
            type="button"
            className="w-auto border-0 text-white"
            onClick={() => handleUpdateData(params.row)}
          >
            Update
          </Button>
        );
      },
      cellClassName: "no-background",
    },
  ];

  console.log(tableData, "tabledata");

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
              onClick={() => navigate("/missing_orders_system")}
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
                Missing Order Details
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
              <Button variant="primary" onClick={handlePushToOrders}>
                Push To Orders
              </Button>
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
      </Container>
    </>
  );
}
export default MissingOrderDetails;
