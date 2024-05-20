import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
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
import { GetProductOrderDetails } from "../../redux/actions/P3SystemActions";

function OnHoldManagement() {
  const params = useParams();
  const dispatch = useDispatch();
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [productData, setProductData]=useState([]);
  const data = [
    {
      id: 1,
      order_id: 86700,
      shipping_country: "Saudia Arabia",
      item_received: 1,
      ouantity_ordered: 1,
    },
    {
      id: 2,
      order_id: 88802,
      shipping_country: "Kuwait",
      item_received: 1,
      ouantity_ordered: 2,
    },
    {
      id: 3,
      order_id: 89065,
      shipping_country: "UAE",
      item_received: 1,
      ouantity_ordered: 3,
    },
  ];

  async function fetchProductOrderDetails() {
    // let apiUrl = `${API_URL}wp-json/on-hold-product/v1/product-in-grn/${params.id}`;
    let apiUrl = `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/on-hold-product/v1/product-in-grn/${params.id}`;
    console.log(params.id,'params.id')
    await dispatch(
      GetProductOrderDetails({
        apiUrl: `${apiUrl}`,
      })
    )
      .then((response)=>{
        let data = response.data.records.map((v, i) => ({
          ...v,
          id: i,
        }));
        console.log(response.data.records,'response')
        setProductData(data)
      })
      .catch((error) => {
        console.error(error);
      });
  }

  console.log(productData,'productData')

  const handleCheckboxChange = (e, rowData) => {
    const index = selectedOrders?.findIndex((order) => order?.id == rowData.id);
    if (index === -1 && e.target.checked) {
      setSelectedOrders((prevSelectedOrders) => [
        ...prevSelectedOrders,
        rowData,
      ]);
    } else if (index !== -1 && !e.target.checked) {
      const updatedSelectedOrders = [...selectedOrders];
      updatedSelectedOrders.splice(index, 1);
      setSelectedOrders(updatedSelectedOrders);
    }
    console.log(selectedOrders, "selectedOrders");
  };

  useEffect(() => {
    fetchProductOrderDetails();
  }, []);

  const columns = [
    { field: "order_id", headerName: "Order ID", flex: 1 },
    { field: "shipping_country", headerName: "Shipping Country", flex: 1 },
    {
      field: "item_received",
      headerName: "Item Received",
      flex: 1,
      valueGetter: (value, row) =>{
        console.log(row,'row')
        console.log(value,'value')
        return `${row.quantity} / ${row.available_quantity
          }`
      }
    },
    {
      field: "qtyOrdered",
      headerName: "Select All",
      flex: 1,
      renderCell: (params) => {
        return (
          <FormGroup>
            <FormControlLabel
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
                        fontSize: 14,
                      }}
                    >
                      <Badge bg="success">{"Order ID"}</Badge>
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
          <Button variant="success">Send for Preparation</Button>
        </MDBCol>
      </MDBRow>
    </Container>
  );
}

export default OnHoldManagement;
