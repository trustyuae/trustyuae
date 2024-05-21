import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../redux/constants/Constants";
import axios from "axios";
import { Badge, Card, Col } from "react-bootstrap";
import DataTable from "../DataTable";
import { Box, MenuItem, Select, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import OrderDetailsPrintModal from "./OrderDetailsPrintModal";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";

const PoDetails = () => {
  const { id } = useParams();
  const [PO_OrderList, setPO_OrderList] = useState([]);
  const [data, setData] = useState(null);
  const [paymentStatus, setPaymentStatus] = useState("Paid");
  const paymentS = ["Paid", "Unpaid", "Hold", "Cancelled"];
  const POStatusFilter = ["Open", "Checking with factory", "Closed"];
  const [PoStatus, setPoStatus] = useState("open");
  const [factories, setFactories] = useState([]);
  const [factorieName, setFactorieName] = useState("");
  const [printModal, setPrintModal] = useState(false);
  const [productData, setProductData] = useState(null);

  console.log(PO_OrderList, "PO_OrderList by akash");
  const navigate = useNavigate();

  const fetchOrder = async () => {
    let apiUrl = `${API_URL}wp-json/custom-po-details/v1/po-order-details/${id}`;
    const response = await axios.get(apiUrl);
    let data = response.data.line_items.map((v, i) => ({ ...v, id: i }));
    data = data.map((v, i) => ({ ...v, dispatch_status: "Dispatched" }));
    console.log(data, "data======");
    const row = [
      ...data,
      {
        id: "TAX",
        label: "Total:",
        taxRate: response.data.total_count,
        taxTotal: 8100,
        totals: response.data.total_cost,
      },
    ];
    console.log(row, "data======");

    setPO_OrderList(row);
    setData(response.data.line_items);
    setFactorieName(response.data.factory_id);
  };

  const fetchFactories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}wp-json/custom-factory/v1/fetch-factories`
      );
      setFactories(response.data);
    } catch (error) {
      console.error("Error fetching factories:", error);
    }
  };

  useEffect(() => {
    fetchOrder();
    fetchFactories();
  }, []);

  const availabilityStatus = [
    "Confirmed",
    "1 week",
    "2 week",
    "3 weeks",
    "1 month",
    "Out of Stock",
  ];
  const dispatchedStatus = ["Dispatched", "Not Dispatched"];

  const handleStatusChange = (index, event) => {
    console.log(index.target, event);
    const updatedData = PO_OrderList.map((item) => {
      if (item.product_id === event.product_id) {
        return { ...item, availability_status: index.target.value };
      }
      return item;
    });
    console.log(updatedData, "updatedData====");
    setPO_OrderList(updatedData);
  };
  const handleDispatchStatusChange = (index, event) => {
    console.log(index.target, event);
    const updatedData = PO_OrderList.map((item) => {
      if (item.product_id === event.product_id) {
        return { ...item, dispatch_status: index.target.value };
      }
      return item;
    });
    console.log(updatedData, "updatedData====");
    setPO_OrderList(updatedData);
  };

  const validateAvailabilityStatuses = (statuses) => {
    if (statuses.length === 0 || statuses.every((status) => status === "")) {
      return "Availability status is empty.";
    }
    if (statuses.some((status) => status === "")) {
      return "Availability status is empty.";
    }
    return "Successful";
  };

  const handleUpdate = async () => {
    console.log(PO_OrderList, "PO_OrderList======");
    let updatelist = PO_OrderList.slice(0, -1);
    console.log(updatelist, "PO_OrderList pop======");
    console.log(
      updatelist?.map((item) => item.product_id),
      "PO_OrderList.line_items.map(item => item.product_id)"
    );

    const availabilityStatuses =
      updatelist?.map((item) => item.availability_status) || [];

    // Flatten the array in case availability_status is an array itself
    const flattenedStatuses = availabilityStatuses.flat();

    // Validate the result and set the message
    const validationMessage = validateAvailabilityStatuses(flattenedStatuses);
    console.log(validationMessage, "validationMessage");
    if (validationMessage == "Availability status is empty.") {
      Swal.fire({
        icon: "error",
        title: validationMessage,
        showConfirmButton: true,
      });
    }

    const updatedData = {
      po_number: id,
      availability_status: updatelist?.map((item) => item.availability_status),
      request_quantity: updatelist?.map((item) => item.available_quantity),
      product_ids: updatelist?.map((item) => item.product_id),
      // order_ids: updatelist?.map(item => item.order_ids).flat(),
      po_status: paymentStatus,
      payment_status: PoStatus,
    };
    if (validationMessage == "Successful") {
      let apiUrl = `${API_URL}wp-json/custom-available-status/v1/estimated-status/${id}`;
      const response = await axios.post(apiUrl, updatedData);
      console.log(response, "response");
      Swal.fire({
        icon: "success",
        title: response.data.message,
        showConfirmButton: true,
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/PO_ManagementSystem");
        }
      });
      console.log(updatedData, "updatedData");
    }
  };

  const handlepayMentStatus = (e) => {
    setPaymentStatus(e.target.value);
  };
  const handlePOStatus = (e) => {
    setPoStatus(e.target.value);
  };

  const handleAvailableQtyChange = (index, event) => {
    console.log(index.target, event);
    const updatedData = PO_OrderList.map((item) => {
      if (item.product_id === event.product_id) {
        return { ...item, available_quantity: index.target.value };
      }
      return item;
    });
    console.log(updatedData, "updatedData====");
    setPO_OrderList(updatedData);
  };

  const handlePrint = () => {
    setPrintModal(true);
  };

  const columns = [
    {
      field: "product_name",
      headerName: "Product Name",
      flex: 2,
      colSpan: (value, row) => {
        // if (row.id === 'SUBTOTAL' || row.id === 'TOTAL') {
        //   return 3;
        // }
        if (row.id === "TAX") {
          return 2;
        }
        return undefined;
      },
      valueGetter: (value, row) => {
        if (row.id === "TAX") {
          return row.label;
        }
        return value;
      },
    },
    {
      field: "image",
      headerName: "product images",
      flex: 2,
      type: "html",
      renderCell: (value, row) => {
        return (
          <>
            <img
              src={value.row.image}
              alt={value.row.product_name}
              className="img-fluid"
              width={100}
            />
          </>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Qty Ordered",
      flex: 2,
      valueGetter: (value, row) => {
        if (row.id === "TAX") {
          return `${row.taxRate}`;
        }
        return value;
      },
    },
    {
      field: "",
      headerName: "Estimated Cost(RMB)",
      flex: 3,
      valueGetter: (value, row) => {
        // if (row.id === 'SUBTOTAL') {
        //   return row.subtotal;
        // }
        if (row.id === "TAX") {
          return row.taxTotal;
        }
        // if (row.id === 'TOTAL') {
        //   return row.total;
        // }
        return value;
      },
    },
    {
      field: "total_price",
      headerName: "Estimated Cost(AED)",
      flex: 3,
      colSpan: (value, row) => {
        if (row.id === "TAX") {
          return 4;
        }
        return undefined;
      },
      valueGetter: (value, row) => {
        if (row.id === "TAX") {
          return `${row.totals}`;
        }
        return value;
      },
    },
    {
      field: "available_quantity",
      headerName: "Available Qty",
      flex: 3,
      renderCell: (params) => {
        return (
          <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
            <Form.Control
              style={{ justifyContent: "center" }}
              type="number"
              value={params.row.available_quantity}
              placeholder="0"
              onChange={(e) => handleAvailableQtyChange(e, params.row)}
            />
          </Form.Group>
        );
      },
    },

    {
      field: "availability_status",
      headerName: "Availability Status",
      flex: 3,
      renderCell: (params) => {
        return (
          <Select
            labelId={`customer-status-${params.row.id}-label`}
            id={`customer-status-${params.row.id}`}
            value={params.row.availability_status}
            onChange={(event) => handleStatusChange(event, params.row)}
            fullWidth
            style={{ height: "40%", width: "100%" }}
            // className="fw-semibold d-flex align-items-center justify-content-center h-100"
          >
            {availabilityStatus.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "dispatch_status",
      headerName: "Dispatch Status",
      flex: 3,
      renderCell: (params) => {
        return (
          <Select
            labelId={`customer-status-${params.row.id}-label`}
            id={`customer-status-${params.row.id}`}
            value={params.row.dispatch_status}
            onChange={(event) => handleDispatchStatusChange(event, params.row)}
            fullWidth
            style={{ height: "40%", width: "100%" }}
          >
            {dispatchedStatus.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
  ];
  const handalBackButton = () => {
    navigate("/PO_ManagementSystem");
  };

  const POTypes = (id) => {
    const getPOType = id.substring(0, 2);
    if (getPOType == "PO") {
      return ",PO against Orders";
    } else if (getPOType == "MO") {
      return "Manual PO";
    } else if (getPOType == "SO") {
      return "Scheduled PO";
    }
  };
  return (
    <Container fluid className="px-5" style={{ height: "100vh" }}>
      <MDBRow className="my-3">
        <MDBCol className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-secondary"
            className="p-1 me-2 bg-transparent text-secondary"
            onClick={handalBackButton}
          >
            <ArrowBackIcon className="me-1" />
          </Button>
          <Button
            variant="outline-primary"
            className="p-1 me-3 bg-transparent text-primary"
            onClick={handlePrint}
          >
            <LocalPrintshopOutlinedIcon className="me-1" />
          </Button>
        </MDBCol>
      </MDBRow>
      <Card className="p-3 mb-3">
        <Box className="d-flex align-items-center justify-content-between">
          <Box>
            <Typography variant="h6" className="fw-bold mb-3">
              PO Details
            </Typography>
            <Box>
              <Typography className="fw-bold">
                {/* PO Number */}# {id}
              </Typography>
            </Box>
            <Typography
              className=""
              sx={{
                fontSize: 14,
              }}
            >
              <Badge bg="success">{POTypes(id)}</Badge>
            </Typography>
          </Box>
          <Box>
            <Typography variant="h6" className="fw-bold mb-3">
              {
                factories.find((factory) => factory.id == factorieName)
                  ?.factory_name
              }
            </Typography>
          </Box>
        </Box>
      </Card>
      <Card className="p-3 mb-3">
        <Row className="mb-3">
          <Col xs="auto" lg="4">
            <Form.Group className="fw-semibold mb-0">
              <Form.Label>Payment Status:</Form.Label>
              <Form.Control
                as="select"
                className="mr-sm-2"
                // value={selectedFactory}
                onChange={(e) => handlepayMentStatus(e)}
              >
                {/* <option value="">All </option> */}
                {paymentS.map((po) => (
                  <option key={po} value={po}>
                    {po}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs="auto" lg="4">
            <Form.Group className="fw-semibold mb-0">
              <Form.Label>PO Status:</Form.Label>
              <Form.Control
                as="select"
                className="mr-sm-2"
                // value={selectedFactory}
                onChange={handlePOStatus}
              >
                {/* <option value="">All </option> */}
                {POStatusFilter.map((po) => (
                  <option key={po} value={po}>
                    {po}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
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
              // handleChange={handleChangeSO}
              // // onCellEditStart={handleCellEditStart}
              // processRowUpdate={processRowUpdateSPO}
            />
          </div>

          <Row>
            <Button type="button" className="w-auto" onClick={handleUpdate}>
              Update
            </Button>
          </Row>
        </MDBRow>
      </Card>
      <OrderDetailsPrintModal
        show={printModal}
        poId={id}
        factoryName={
          factories.find((factory) => factory.id == factorieName)?.factory_name
        }
        PO_OrderList={PO_OrderList}
        handleClosePrintModal={() => setPrintModal(false)}
        // showModal={printModal}
      />
    </Container>
  );
};
export default PoDetails;
