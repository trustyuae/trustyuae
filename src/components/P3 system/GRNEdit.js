import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link,useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../redux/constants/Constants";
import axios from "axios";
import { Card } from "react-bootstrap";
import DataTable from "../DataTable";
import { Box,Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaEye } from "react-icons/fa";

const GRNEdit = () => {
  const { id } = useParams();
  const [PO_OrderList, setPO_OrderList] = useState([]);
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    let apiUrl = `${API_URL}wp-json/custom-api/v1/view-grn-details/${id}`;
    const response = await axios.get(apiUrl);
    let data = response.data.map((v, i) => ({ ...v, id: i }));
    setPO_OrderList(data);
    setData(response.data.line_items);
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  const columns = [
    {
      field: "product_name",
      headerName: "Product Name",
      flex: 2,
    },
    {
      field: "product_image",
      headerName: "Product images",
      flex: 2,
      type: "html",
      renderCell: (value, row) => {
        return (
          <>
            <img
              src={value.row.product_image}
              alt={value.row.product_name}
              className="img-fluid"
              width={100}
            />
          </>
        );
      },
    },
    {
      field: "variation_value",
      headerName: "Variation",
      flex: 2,
      renderCell: (params) => {
        if (params.row.variations != "") {
          return formatVariations(params.row.variations);
        } else {
          return "";
        }
      },
    },
    { field: "qty_received", headerName: "Qty Received", flex: 2 },
    { field: "qty_remain", headerName: "Qty Remain", flex: 2 },
    {
      field: "",
      headerName: "Action",
      flex: 1,
      type: "html",
      renderCell: (value, row) => {
        console.log(value, "value details of grn edite page");
        return (
          <Link to={`/On_Hold_Management/${value.row.product_id}`}>
            <Button
              type="button"
              className="w-auto bg-transparent border-0 text-secondary fs-5"
            >
              <FaEye className="mb-1" />
            </Button>
          </Link>
        );
      },
    },
  ];
  const handalBackButton = () => {
    navigate("/GRN_Management");
  };
  const formatVariations = (variations) => {
    const parsedVariations = variations;
    if (Object.keys(parsedVariations).length === 0) {
      return "No variations"; // If variations are empty
    } else {
      return Object.entries(parsedVariations)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    }
  };
  return (
    <Container fluid className="px-5" style={{ height: "100vh" }}>
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
      </MDBRow>
      <Card className="p-3 mb-3">
        <Box className="d-flex align-items-center justify-content-between">
          <Box>
            <Typography variant="h6" className="fw-bold mb-3">
              GRN View
            </Typography>
          </Box>
        </Box>
      </Card>

      <Card className="p-3 mb-3">
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol col="10" md="12" sm="12"></MDBCol>
          <div className="mt-2">
            <DataTable
              columns={columns}
              rows={PO_OrderList}
              // page={pageSO}
              // pageSize={pageSizeSO}
              // totalPages={totalPagesSO}
              rowHeight={100}
            />
          </div>
        </MDBRow>
      </Card>
    </Container>
  );
};
export default GRNEdit;
