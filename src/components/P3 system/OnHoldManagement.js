import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import { useParams } from "react-router-dom";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { Badge, Card, Col, Modal, Row } from "react-bootstrap";
import DataTable from "../DataTable";
import { useDispatch, useSelector } from "react-redux";
import { API_URL } from "../../redux/constants/Constants";
import {
  AddProductOrderForPre,
  AddProductOrderForStock,
  GetProductDetails,
  GetProductOrderDetails,
} from "../../redux/actions/P3SystemActions";
import Loader from "../../utils/Loader";
import ShowAlert from "../../utils/ShowAlert";

function OnHoldManagement() {
  const params = useParams();
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productDetailsData, setProductDetailsData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const loader = useSelector(
    (state) => state?.managementSystem?.isProductOrderDetails
  );

  const loader2 = useSelector(
    (state) => state?.managementSystem?.isProductDetails
  );

  async function fetchProductDetails() {
    let apiUrl = `${API_URL}wp-json/custom-product-details/v1/product-details-for-grn/${params.id}/${params.grn_no}`;
    await dispatch(
      GetProductDetails({
        apiUrl: `${apiUrl}`,
      })
    )
      .then((response) => {
        let data = response.data;
        setProductDetailsData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  async function fetchProductOrderDetails() {
    let apiUrl = `${API_URL}wp-json/on-hold-product/v1/product-in-grn/${params.id}/${params.grn_no}/${params.variation_id}`;
    await dispatch(
      GetProductOrderDetails({
        apiUrl: `${apiUrl}`,
      })
    )
      .then((response) => {
        let data = response.data.records.map((v, i) => ({
          ...v,
          id: i,
          isSelected: false,
        }));
        if (selectedOrders.length > 0) {
          selectedOrders.forEach((order) => {
            data.forEach((o) => {
              if (o.id === order.id) {
                o.isSelected = true;
              }
            });
          });
        }
        setProductData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleCheckboxChange = (e, rowData) => {
    rowData.isSelected = true;
    const index = selectedOrders?.findIndex((order) => order?.id == rowData.id);
    if (index === -1 && e.target.checked) {
      rowData.isSelected = true;
      setSelectedOrders((prevSelectedOrders) => [
        ...prevSelectedOrders,
        rowData,
      ]);
    } else if (index !== -1 && !e.target.checked) {
      rowData.isSelected = false;
      const updatedSelectedOrders = [...selectedOrders];
      updatedSelectedOrders.splice(index, 1);
      setSelectedOrders(updatedSelectedOrders);
    }
  };

  useEffect(() => {
    handleUpdatedValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    fetchProductOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setSelectedOrders, setProductData]);

  const handleOrderPerp = async () => {
    const orderId = selectedOrders.map((order) => order.order_id);
    const quantity = selectedOrders.map((order) => order.quantity);

    if (selectedOrders.length === 0) {
      await ShowAlert(
        "please select products for fullfilling orders",
        "",
        "error",
        false,
        false,
        "",
        "",
        1000
      );
    } else {
      const requestedDataP = {
        product_id: params.id,
        order_id: orderId,
        quantity: quantity,
        grn_no: params.grn_no,
      };

      try {
        const response = await dispatch(AddProductOrderForPre(requestedDataP));
        if (response?.data?.status_code === 200) {
          console.log(
            response?.data?.status_code,
            "response?.data?.status_code 200"
          );
          ShowAlert(
            "Order fulfilled successfully!",
            "",
            "success",
            false,
            false,
            "",
            "",
            3500
          );
        } else if (response?.data?.status_code === 400) {
          console.log(
            response?.data?.status_code,
            "response?.data?.status_code 400"
          );
          const unfilledOrderIdsString =
            response?.data?.unfilled_order_ids?.join(", ");
          const message =
            response.data.message +
            (unfilledOrderIdsString ? `: ${unfilledOrderIdsString}` : "");
          ShowAlert(message, "", "error", false, false, "", "", 3500);
        }

        await selectedOrders.forEach((order) => {
          order.isSelected = false;
        });

        setSelectedOrders([]);
        handleUpdatedValues();
      } catch (error) {
        console.error("Error occurred:", error);
      }
    }
  };

  const handleOrderStock = async () => {
    const product_id = params.id;
    const grn_no = params.grn_no;
    const requestedData = {
      product_id: product_id,
      grn_no: grn_no,
    };
    await dispatch(AddProductOrderForStock(requestedData))
      .then(async (response) => {
        if (response) {
          await ShowAlert(
            "product added in InStock Successfully!",
            "",
            "success",
            false,
            false,
            "OK",
            "",
            1000
          );
        }
        handleUpdatedValues();
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdatedValues = async () => {
    setSelectedOrders([]);
    fetchProductDetails();
  };

  const columns = [
    { field: "order_id", headerName: "Order ID", flex: 1 },
    { field: "shipping_country", headerName: "Shipping Country", flex: 1 },
    {
      field: "item_received",
      headerName: "Item Received",
      flex: 1,
      valueGetter: (value, row) => {
        return `${row.quantity} / ${row.quantity}`;
      },
    },
    {
      field: "select",
      headerName: "Select",
      flex: 1,
      renderCell: (params) => {
        return (
          <FormGroup>
            <FormControlLabel
              checked={params.row.isSelected}
              className="mx-auto"
              control={<Checkbox />}
              style={{ justifyContent: "center" }}
              onChange={(event) => handleCheckboxChange(event, params.row)}
            />
          </FormGroup>
        );
      },
    },
  ];

  const handleChange = (event, value) => {
    setPage(value);
  };

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          On-hold Management
        </Typography>
      </Box>
      <MDBRow className="px-3">
        <Card className="p-3 mb-3">
          <Typography variant="h6" className="fw-bold mb-3">
            Product Details
          </Typography>
          {loader2 ? (
            <Loader />
          ) : (
            <Box>
              <Row className="d-flex justify-content-center align-ite">
                <Col md="6">
                  <Box className="d-flex justify-content-center align-items-center h-100">
                    <Box>
                      <Typography variant="h5" className="fw-bold">
                        Product -{" "}
                        {productDetailsData?.product_details?.product_name}
                      </Typography>
                      <Typography
                        className=""
                        sx={{
                          fontSize: 14,
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <Box>
                          <span>Product Id:</span>{" "}
                          <Badge bg="success">
                            {params.variation_id != "0" && params.variation_id
                              ? params.variation_id
                              : productDetailsData?.product_details?.product_id}
                          </Badge>
                        </Box>
                        <Box>
                          <span>Quantity Received:</span>{" "}
                          <Badge bg="success">
                            {productDetailsData?.grn_details?.qty_received}
                          </Badge>
                        </Box>
                        <Box>
                          <span>Quantity Remain:</span>{" "}
                          <Badge bg="success">
                            {productDetailsData?.grn_details?.qty_remain}
                          </Badge>
                        </Box>
                      </Typography>
                    </Box>
                  </Box>
                </Col>
                <Col md="6">
                  <Box
                    className="w-100"
                    sx={{ height: "200px" }}
                    onClick={() => setShowImageModal(true)}
                  >
                    <img
                      className="w-100 h-100"
                      style={{
                        objectFit: "contain",
                        width: "auto",
                        height: "auto",
                      }}
                      src={productDetailsData?.product_details?.product_image}
                      alt="Product"
                    />
                  </Box>
                </Col>
              </Row>
            </Box>
          )}
        </Card>
      </MDBRow>

      <MDBRow className="px-3">
        <MDBCol col="10" md="12" sm="12"></MDBCol>
        <Card className="py-3">
          <Typography variant="h6" className="fw-bold mb-3">
            Order Details
          </Typography>
          {loader ? (
            <div className="loader-container">
              <Loader className="loader" />
            </div>
          ) : (
            <div className="mt-2">
              {productData && productData.length !== 0 ? (
                <DataTable
                  columns={columns}
                  rows={productData}
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
                  Above product doesn't have any order yet!
                </Alert>
              )}
            </div>
          )}
        </Card>
      </MDBRow>
      <MDBRow>
        <MDBCol md="12" className="d-flex justify-content-end">
          {productData.length === 0 ? (
            <Button variant="success" onClick={handleOrderStock}>
              Send For InStock
            </Button>
          ) : (
            <Button variant="success" onClick={handleOrderPerp}>
              Send for Preparation
            </Button>
          )}
        </MDBCol>
      </MDBRow>
      <Modal
        show={showImageModal}
        onHide={() => setShowImageModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="factory-card">
            <img
              src={
                productDetailsData?.product_details?.product_image ||
                `${require("../../assets/default.png")}`
              }
              alt="Product"
            />
          </Card>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default OnHoldManagement;
