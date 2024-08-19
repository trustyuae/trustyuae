import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link, useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../redux/constants/Constants";
import { Badge, Card } from "react-bootstrap";
import DataTable from "../DataTable";
import { Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { GetGRNView } from "../../redux/actions/P3SystemActions";
import Loader from "../../utils/Loader";

const GRNView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [PO_OrderList, setPO_OrderList] = useState([]);
  const navigate = useNavigate();
  const loader = useSelector((state) => state?.managementSystem?.isGrnView);
  const [pageSize, setPageSize] = useState(5);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [verifiedName, setVerifiedName] =useState("");

  const fetchOrder = async () => {
    let apiUrl = `${API_URL}wp-json/custom-view-grn-api/v1/view-grn-details/${id}/?&per_page=${pageSize}&page=${page}`;
    await dispatch(GetGRNView({ apiUrl }))
      .then((response) => {
        if (response?.data) {
          let data = response.data.data.map((v, i) => ({ ...v, id: i }));
          setPO_OrderList(data);
          setVerifiedName(response.data.verified_by)
        } else {
          setPO_OrderList([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching order:", error);
        setPO_OrderList([]);
      });
  };

  useEffect(() => {
    fetchOrder();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize,totalPages]);

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
              className="img-fluid "
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
          return "No any variations";
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
        return (
          <Link
            to={`/On_Hold_Management/${value.row.grn_no}/${value.row.product_id}/${value.row.variation_id}`}
          >
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
  const handleChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(e.target.value);
  };

  const formatVariations = (variations) => {
    const data = JSON.parse(variations);
    if (Object.keys(data).length === 0) {
      return "No variations";
    } else {
      return Object.entries(data)
        .map(([key, value]) => `${key}: ${value}`)
        .join(", ");
    }
  };

  return (
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
      </MDBRow>
      <Card className="p-3 mb-3">
        <Box className="d-flex align-items-center">
          <Box>
            <Typography variant="h6" className="fw-bold">
              GRN View
            </Typography>
          </Box>
          <Box className="ms-5">
            <Typography className="fw-bold">#{verifiedName}</Typography>
            <Typography>
              <Badge bg="success">Verified by</Badge>
            </Typography>
          </Box>
        </Box>
      </Card>

      <Card className="p-3 mb-3">
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol col="10" md="12" sm="12"></MDBCol>
          {loader ? (
            <Loader />
          ) : (
            <div className="mt-2">
              <DataTable
                columns={columns}
                rows={PO_OrderList}
                page={page}
                pageSize={pageSize}
                totalPages={totalPages}
                handleChange={handleChange}
                rowHeight={100}
              />
            </div>
          )}
        </MDBRow>
      </Card>
    </Container>
  );
};
export default GRNView;
