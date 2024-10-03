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
import { Badge, Card, Col, Form, Modal, Row } from "react-bootstrap";
import DataTable from "../DataTable";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/Loader";
import ShowAlert from "../../utils/ShowAlert";
import ShowAlert2 from "../../utils/ShowAlert2";
import {
  AddProductOrderForPre,
  AddProductOrderForStock,
  GetProductDetails,
  GetProductOrderDetails,
} from "../../Redux2/slices/P3SystemSlice";
import Swal from "sweetalert2";
import { CheckCircle, Cancel } from "@mui/icons-material";
import { green, red, grey } from "@mui/material/colors";

function OnHoldManagement() {
  const params = useParams();
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [productData, setProductData] = useState([]);
  const [productDetailsData, setProductDetailsData] = useState([]);
  const [productOverallData, setProductOverallData] = useState([]);
  const [showImageModal, setShowImageModal] = useState(false);
  const loader = useSelector((state) => state?.p3System?.isLoading);
  const [isChecked, setIsChecked] = useState(false);

  const productDetailsDataa = useSelector(
    (state) => state?.p3System?.productDetails
  );

  useEffect(() => {
    if (productDetailsDataa) {
      setProductDetailsData(productDetailsDataa);
    }
  }, [productDetailsDataa]);

  async function fetchProductDetails() {
    let apiUrl = `wp-json/custom-product-details/v1/product-details-for-grn/${params.id}/${params.grn_no}/${params.variation_id}`;
    dispatch(
      GetProductDetails({
        apiUrl: `${apiUrl}`,
      })
    );
  }

  async function fetchProductOrderDetails() {
    let apiUrl = `wp-json/on-hold-product/v1/product-in-grn/${params.id}/${params.grn_no}/${params.variation_id}`;
    dispatch(
      GetProductOrderDetails({
        apiUrl: `${apiUrl}`,
      })
    ).then(({ payload }) => {
      if (payload) {
        setProductOverallData(payload);
        let data = payload?.records?.map((v, i) => ({
          ...v,
          id: i,
          isSelected: false,
        }));
        if (selectedOrders?.length > 0) {
          selectedOrders?.forEach((order) => {
            data?.forEach((o) => {
              if (o.id === order.id) {
                o.isSelected = true;
              }
            });
          });
        }
        setProductData(data);
      }
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
  }, [params.id, params.grn_no, params.variation_id]);

  const handleOrderPerp = async () => {
    const orderId = selectedOrders.map((order) => order.order_id);
    // const quantity = selectedOrders.map((order) => order.qty_fullfilled);
    const grnNo = selectedOrders.map((order) => order.grn_no);
    const productIdd = selectedOrders.map((order) =>
      parseInt(order.product_id, 10)
    );
    const variationIdd = selectedOrders.map((order) =>
      parseInt(order.variation_id, 10)
    );
    const poIdd = [productOverallData.po_id];

    if (selectedOrders.length === 0) {
      await ShowAlert(
        "Please select products for fulfilling orders",
        "",
        "error",
        false,
        false,
        "",
        "",
        "",
        0
      );
      return;
    }

    const systemSelection = await ShowAlert2(
      "Please select the system to send data",
      "",
      "info",
      true,
      false,
      "P1 System UAE",
      "P1 System China",
      "Cancel",
      0,
      1,
      2,
      {
        allowOutsideClick: false, // Disable clicking outside
        allowEscapeKey: false, // Disable closing on Escape key
      }
    );

    if (systemSelection === "Cancel") {
      return;
    }

    const confirmation = await Swal.fire({
      title: `Are you sure you want to send the data to ${systemSelection}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      allowOutsideClick: false, // Disable clicking outside
      allowEscapeKey: false, // Disable escape key
    });

    if (confirmation.isConfirmed) {
      const requestedDataP = {
        product_id: productIdd,
        po_id: poIdd,
        order_id: orderId,
        // quantity: quantity,
        grn_no: grnNo,
        variation_id: variationIdd,
        warehouse: systemSelection === "P1 System UAE" ? "" : "China",
      };

      try {
        await dispatch(AddProductOrderForPre({ requestedDataP })).then(
          ({ payload }) => {
            console.log(payload, "payload from AddProductOrderForPre");
            if (payload?.status_code === 200) {
              ShowAlert(
                "order sending for prep successfully!",
                "",
                "success",
                false,
                false,
                "",
                "",
                2000
              );
              fetchProductOrderDetails();
            } else {
              ShowAlert(
                "error while sending order for prep!",
                "",
                "error",
                false,
                false,
                "",
                "",
                2000
              );
            }
          }
        );
        setSelectedOrders([]);
        setProductData((prevProductData) =>
          prevProductData.map((row) => ({ ...row, isSelected: false }))
        );
      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else if (confirmation.isDismissed) {
      return;
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
      .then(async ({ payload }) => {
        if (payload) {
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

  const handleToggle = () => {
    setIsChecked(!isChecked); // Toggle the state between checked/unchecked
    handleCheckboxClick(); // Call your custom function
  };

  const handleCheckboxClick = () => {
    // Custom function to be called on checkbox click
    console.log("Checkbox clicked!");
  };

  const columns = [
    {
      field: "order_id",
      headerName: "Order ID",
      flex: 1,
      renderCell: (params) => {
        const orderId =
          params.row.order_id !== "0" ? params.row.order_id : "No Order ID Avl";
        return <div>{orderId}</div>;
      },
    },
    { field: "shipping_country", headerName: "Shipping Country", flex: 1 },
    {
      field: "item_received",
      headerName: "Item Received",
      flex: 1,
      valueGetter: (value, row) => {
        return `${row.qty_fullfilled} / ${row.qty_received}`;
      },
    },
    {
      field: "select",
      headerName: "Select",
      flex: 0.5,
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
    {
      field: "stock_status",
      headerName: "In Store",
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{ display: "flex", alignItems: "center", cursor: "pointer" }}
            onClick={handleToggle}
          >
            <CheckCircle style={{ color: isChecked ? red[500] : grey[500] }} />
          </div>
        );
      },
    },
  ];

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(e.target.value);
  };

  console.log(productData, "productData from onhold management system");

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
          {loader ? (
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
          <Box className="d-flex justify-content-between">
            <Typography variant="h6" className="fw-bold mb-3">
              Order Details
            </Typography>
            <Box className="me-3">
              <Form.Group className="d-flex align-items-center justify-content-center justify-content-between">
                <Form.Label className="me-3 mt-2 fw-bold">PageSize </Form.Label>
                <Form.Control
                  as="select"
                  className="w-auto fw-bold"
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
            </Box>
          </Box>
          {loader ? (
            <div className="loader-container">
              <Loader className="loader" />
            </div>
          ) : (
            <div className="mt-2">
              {productData &&
              productData.length !== 0 &&
              productData.every((item) => item.order_id !== "0") ? (
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
                  One or more products having an order ID zero, so no data can
                  be shown!
                </Alert>
              )}
            </div>
          )}
        </Card>
      </MDBRow>
      <MDBRow>
        <MDBCol md="12" className="d-flex justify-content-end">
          {productData?.length === 0 ? (
            <Button variant="success" disabled onClick={handleOrderStock}>
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
