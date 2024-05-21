import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Pagination from "react-bootstrap/Pagination";
import { useParams } from "react-router-dom";
import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import { Badge, Card, Col, Row } from "react-bootstrap";
import DataTable from "../DataTable";
import { useDispatch } from "react-redux";
import { API_URL } from "../../redux/constants/Constants";
import {
  AddProductOrderForPre,
  GetProductOrderDetails,
} from "../../redux/actions/P3SystemActions";
import Swal from "sweetalert2";

function OnHoldManagement() {
  const params = useParams();
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [productData, setProductData] = useState([]);
  const [overallProductData, setOverallProductData] = useState([]);

  async function fetchProductOrderDetails() {
    let apiUrl = `${API_URL}wp-json/on-hold-product/v1/product-in-grn/${params.id}`;
    await dispatch(
      GetProductOrderDetails({
        apiUrl: `${apiUrl}`,
      })
    )
      .then((response) => {
        let data = response.data.records.map((v, i) => ({
          ...v,
          id: i,
        }));
        setProductData(data);
        setOverallProductData(response.data);
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
    fetchProductOrderDetails();
  }, [productData,selectedOrders,overallProductData]);

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

      await dispatch(AddProductOrderForPre(requestedDataP))
      .then((response) => {
        if (response) {
          Swal.fire({
            icon: "success",
            title: "Uploaded Successfully!",
          })
        }
      }).then(()=>{
        handleUpdatedValues();
      })
    }
  };

  const handleUpdatedValues = () => {
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
          <Box>
            <Row className="justify-content-center">
              <Col md="6">
                <Box className="d-flex justify-content-center align-items-center h-100">
                  <Box>
                    <Typography variant="h5" className="fw-bold">
                      Product - Chanel Double Flap
                    </Typography>
                    <Typography
                      className=""
                      sx={{
                        display: "flex",
                        fontSize: 14,
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <Box>
                        <span>Product Id:</span>{" "}
                        <Badge bg="success">
                          {overallProductData.product_id}
                        </Badge>
                      </Box>
                      <Box>
                        <span>Quantity Received:</span>{" "}
                        <Badge bg="success">
                          {overallProductData.qty_received}
                        </Badge>
                      </Box>
                      <Box>
                        <span>Quantity Remain:</span>{" "}
                        <Badge bg="success">
                          {overallProductData.qty_remain}
                        </Badge>
                      </Box>
                    </Typography>
                  </Box>
                </Box>
              </Col>
              <Col md="6">
                <Box className="w-100" sx={{ height: "200px" }}>
                  <img
                    className="w-100 h-100"
                    alt=""
                    style={{ objectFit: "cover" }}
                    src={require("../../assets/default.png")}
                  />
                </Box>
              </Col>
            </Row>
          </Box>
        </Card>
      </MDBRow>

      <MDBRow className="px-3">
        <MDBCol col="10" md="12" sm="12"></MDBCol>
        <Card className="py-3">
          <Typography variant="h6" className="fw-bold mb-3">
            Order Details
          </Typography>
          <div className="mt-2">
            <DataTable
              columns={columns}
              rows={productData}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              handleChange={handleChange}
            />
          </div>
        </Card>
      </MDBRow>
      <MDBRow>
        <MDBCol md="12" className="d-flex justify-content-end">
          <Button variant="success" onClick={handleOrderPerp}>
            Send for Preparation
          </Button>
        </MDBCol>
      </MDBRow>
    </Container>
  );
}

export default OnHoldManagement;
