import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import { useNavigate, useParams } from "react-router-dom";
import { Badge, Button, ButtonGroup, Card, Col, Modal, Row, ToggleButton } from "react-bootstrap";
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { useDispatch, useSelector } from "react-redux";
import DataTable from "../DataTable";
import Loader from "../../utils/Loader";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ShowAlert from "../../utils/ShowAlert";
import Form from "react-bootstrap/Form";
import {
  AddMessage,
  ReserveOrderDetailsGet,
} from "../../redux/actions/OrderSystemchinaActions";
import { useTranslation } from "react-i18next";
import { getUserData } from "../../utils/StorageUtils";

const ReserveOrderdetailsInChina = () => {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const [lang, setLang] = useState("En");
  const [orderData, setOrderData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [orderDetails, setOrderDetails] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [attachmentZoom, setAttachmentZoom] = useState(false);
  const [message, setMessage] = useState("");
  const [showMessageModal, setshowMessageModal] = useState(false);

  const loader = useSelector(
    (state) => state?.orderSystemDataChina?.isCompletedOrderDetails
  );
  const orderDetailsDataOrderId = useSelector(
    (state) => state?.orderSystemDataChina?.completedOrderDetails?.orders?.[0]
  );

  useEffect(() => {
    fetchOrder();
  }, [setMessage, setTableData, setOrderData]);

  async function fetchOrder() {
    try {
      const response = await dispatch(ReserveOrderDetailsGet(params.id));
      let data = response.data.orders.map((v, i) => ({ ...v, id: i }));
      setOrderData(data);
      setOrderDetails(response.data.orders[0]);
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

  const columns = [
    {
      field: "item_id",
      headerName: t("P1ChinaSystem.ItemId"),
      className: "order-details",
      flex: 1,
    },
    {
      field: "product_name",
      headerName: t("P1ChinaSystem.Name"),
      className: "order-details",
      flex: 2,
    },
    {
      field: "variant_details",
      headerName: t("P1ChinaSystem.VariantDetails"),
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
      field: "dispatch_type",
      headerName: t("POManagement.Status"),
      flex: 1,
      className: "order-details",
      type: "string",
    },
    {
      field: "dispatch_image",
      headerName: t("P1ChinaSystem.Attachment"),
      flex: 1,
      className: "order-details",
      renderCell: (params) => (
        <Box
          className="h-100 w-100 d-flex align-items-center"
          onClick={() => {
            ImageModule(params?.value);
            setAttachmentZoom(true);
          }}
        >
          <Avatar
            src={params.value || require("../../assets/default.png")}
            alt="dispatch image"
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
  ];

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
    const orderId = parseInt(params.id, 10);
    let userData = getUserData()
    const requestedMessage = {
      message: message,
      order_id: orderId,
      name: userData.first_name,
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

  return (
    <>
      <Container fluid className="px-5">
        <MDBRow className="my-3">
          <MDBCol className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              className="p-1 me-2 bg-transparent text-secondary"
              onClick={() => navigate("/reserve_orders_system_in_china")}
            >
              <ArrowBackIcon className="me-1" />
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
          </MDBCol>
        </MDBRow>

        <Card className="p-3 mb-3">
          <Box className="d-flex align-items-center justify-content-between">
            <Box>
              <Typography variant="h6" className="fw-bold mb-3">
              {t("P1ChinaSystem.OrderDetails")}:
              </Typography>
              {loader ? (
                <Loader />
              ) : (
                <Box className="d-flex justify-content-between">
                  <Box>
                    <Typography className="fw-bold">
                    {t("P1ChinaSystem.Order")}# {params.id}
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
                  <Box sx={{ marginLeft: "20px" }}>
                    <Typography className="fw-bold">
                      # {orderDetails?.user_name}
                    </Typography>
                    <Typography
                      className=""
                      sx={{
                        fontSize: 14,
                      }}
                    >
                      <Badge bg="success">Order Completed by</Badge>
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>
            <Box>
              <Button
                variant="outline-primary"
                className="p-1 me-3 bg-transparent text-primary"
                onClick={handlePrint}
              >
                <LocalPrintshopOutlinedIcon />
              </Button>
            </Box>
          </Box>
        </Card>
        <Row className="mb-3">
          <Col
            sm={12}
            md={orderDetailsDataOrderId?.overall_order_dis_image ? 6 : 12}
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
                        <Badge bg="success">{orderDetails?.order_status}</Badge>
                      </Typography>
                    </Col>
                  </Row>
                </>
              )}
            </Card>
          </Col>
          {orderDetailsDataOrderId?.overall_order_dis_image ? (
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
                        <Avatar
                          src={orderDetailsDataOrderId.overall_order_dis_image}
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
          {t("P1ChinaSystem.OrderDetails")}
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
        <Modal
          show={showEditModal}
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
};

export default ReserveOrderdetailsInChina;
