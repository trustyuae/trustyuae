import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
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
import Swal from "sweetalert2";
import Loader from "../../utils/Loader";

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

  console.log(productDetailsData, "productDetailsData");
  console.log(productData, "productData");

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
    let apiUrl = `${API_URL}wp-json/on-hold-product/v1/product-in-grn/${params.id}/${params.grn_no}`;
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
    fetchProductDetails();
    fetchProductOrderDetails();
  }, [selectedOrders]);

  const handleOrderPerp = async () => {
    const orderId = selectedOrders.map((order) => order.order_id);
    const quantity = selectedOrders.map((order) => order.quantity);

    console.log(selectedOrders, "selectedOrders in handleOrderPerp");
    if (selectedOrders.length === 0) {
      Swal.fire({
        icon: "error",
        title: "please select products for generating schedule po",
      });
    } else {
      const requestedDataP = {
        product_id: params.id,
        order_id: orderId,
        quantity: quantity,
      };

      await dispatch(AddProductOrderForPre(requestedDataP)).then((response) => {
        if (response) {
          Swal.fire({
            icon: "success",
            title: "Uploaded Successfully!",
          });
        }
        selectedOrders.forEach((order) => {
          order.isSelected = false;
        });
        handleUpdatedValues();
      });
    }
  };

  const handleOrderStock = async () => {
    const product_id = params.id;
    const username = "ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a";
    const password = "cs_8dcdba11377e29282bd2b898d4a517cddd6726fe";
    const requestedData = {
      stock_status: "instock",
      stock_quantity: productDetailsData?.grn_details?.qty_received,
    };
    await dispatch(
      AddProductOrderForStock(requestedData, product_id, username, password)
    )
      .then((response) => {
        if (response) {
          Swal.fire({
            icon: "success",
            title: "product added in InStock Successfully!",
          });
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleUpdatedValues = () => {
    selectedOrders.forEach((order) => {
      order.isSelected = false;
    });
    setSelectedOrders([]);
    fetchProductOrderDetails();
  };

  const columns = [
    { field: "order_id", headerName: "Order ID", flex: 1 },
    { field: "shipping_country", headerName: "Shipping Country", flex: 1 },
    {
      field: "item_received",
      headerName: "Item Received",
      flex: 1,
      valueGetter: (value, row) => {
        console.log(row, "row");
        console.log(value, "value");
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
                            {productDetailsData?.product_details?.product_id}
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
