import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useDispatch } from "react-redux";
import { OrderNotAvailableData } from "../../redux/actions/P2SystemActions";
import DataTable from "../DataTable";
import ReleaseSchedulePoModal from "./ReleaseSchedulePoModal";
import {
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
} from "@mui/material";
import { API_URL } from "../../redux/constants/Constants";
import axios from "axios";
import Swal from "sweetalert2";

function OrderNotAvailable() {
  const dispatch = useDispatch();
  const [ordersNotAvailableData, setOrdersNotAvailableData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrderNotAvailable, setSelectedOrderNotAvailable] = useState(
    []
  );
  const [factories, setFactories] = useState([]);
  const [checkBox, setCheckBox] = useState(false);
  const [currentStartIndex, setCurrentStartIndex] = useState(1);

  const fetchFactories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}wp-json/custom-factory/v1/fetch-factories/`
      );
      setFactories(response.data);
    } catch (error) {
      console.error("Error fetching factories:", error);
    }
  };

  const handleStatusChange = (event, itemData) => {
    const { value } = event.target;
    ordersNotAvailableData.forEach((order) => {
      if (order.id === itemData.id) order.customer_status = value;
    });
  };

  const handleCheckboxChange = (e, rowData) => {
     if (selectedOrderNotAvailable.length > 0) {
          selectedOrderNotAvailable.forEach((order) => {
            ordersNotAvailableData.forEach((o) => {
              if (o.id === order.id) {
                o.isSelected = true;
                o.customer_status = order.customer_status;
              }
            });
          });
        }
    if (!rowData.customer_status) {
      Swal.fire({
        icon: "error",
        title: "please confirm your customer status first!",
      });
    } else {
      rowData.isSelected = true;
      setCheckBox(true);
      const index = selectedOrderNotAvailable?.findIndex(
        (order) => order?.id == rowData.id
      );
      if (index === -1 && e.target.checked) {
        rowData.isSelected = true;
        setSelectedOrderNotAvailable((prevSelectedOrders) => [
          ...prevSelectedOrders,
          rowData,
        ]);
      } else if (index !== -1 && !e.target.checked) {
        rowData.isSelected = false;
        setCheckBox(false);
        const updatedSelectedOrders = [...selectedOrderNotAvailable];
        updatedSelectedOrders.splice(index, 1);
        setSelectedOrderNotAvailable(updatedSelectedOrders);
      }
    }
  };

  async function fetchOrdersNotAvailableData() {
    let apiUrl = `${API_URL}wp-json/custom-order-not/v1/order-not-available/?`;

    await dispatch(
      OrderNotAvailableData({
        apiUrl: `${apiUrl}&per_page=${pageSize}&page=${page}`,
      })
    )
      .then((response) => {
        let data = response.data.orders.map((v, i) => ({
          ...v,
          id: i + currentStartIndex,
          isSelected: false,
        }));
        setOrdersNotAvailableData(data);
        setTotalPages(response.data.total_pages);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const handleGenerateSchedulePo = () => {
    const customerStatus = selectedOrderNotAvailable.filter(
      (order) => order.customer_status === "Confirmed"
    );

    const estimatedTime = selectedOrderNotAvailable.map(
      (order) => order.estimated_production_time
    );

    const factoryNames = selectedOrderNotAvailable.map(
      (order) => order.factory_id
    );

    if (selectedOrderNotAvailable.length === 0) {
      Swal.fire({
        icon: "error",
        title: "please select products for generating schedule po",
      });
    } else if (customerStatus.length < selectedOrderNotAvailable.length) {
      Swal.fire({
        icon: "error",
        title: "Only for confirmed items we can raise the scheduled PO!",
      });
    } else if (new Set(estimatedTime).size !== 1) {
      Swal.fire({
        icon: "error",
        title:
          "Purchase order items are on separate schedules. Do you want to proceed with the action?!",
      });
    } else if (new Set(factoryNames).size !== 1) {
      Swal.fire({
        icon: "error",
        title: "Factory name should be the same for all selected items!",
      });
    } else {
      setShowModal(true);
    }
  };

  const handleUpdateStatus = () => {
    // const customerStatus =
  };

  const handleModalClose = async () => {
    await ordersNotAvailableData.forEach((order) => {
      order.isSelected = false;
      order.customer_status = "";
    });
    setSelectedOrderNotAvailable([]);
    setShowModal(false);
  };

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "order_id", headerName: "Order ID", flex: 1 },
    {
      field: "factory_id",
      headerName: "Factory Name",
      flex: 1,
      renderCell: (params) => {
        return factories.find((factory) => factory.id === params.row.factory_id)
          ?.factory_name;
      },
    },
    { field: "product_name", headerName: "Item Name", flex: 1 },
    {
      field: "product_image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <Box className="h-100 w-100 d-flex align-items-center">
          <Avatar
            src={params.value}
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
      headerName: "QTY",
      flex: 1,
    },
    {
      field: "custom_number",
      headerName: "Customer Contact Number",
      flex: 1,
    },
    {
      field: "estimated_production_time",
      headerName: "Estimated Production Timing",
      flex: 1,
    },
    {
      field: "customer_status",
      headerName: "Customer Status",
      flex: 1,
      renderCell: (params) => {
        return (
          <Select
            labelId={`customer-status-${params.row.id}-label`}
            id={`customer-status-${params.row.id}`}
            value={params.row.customer_status}
            onChange={(event) => handleStatusChange(event, params.row)}
            fullWidth
            style={{ height: "60%", width: "100%" }}
          >
            <MenuItem value={""}></MenuItem>
            {["Confirmed", "NotConfirmed", "Exchange", "Refund"].map(
              (status) => (
                <MenuItem key={status} value={status}>
                  {status}
                </MenuItem>
              )
            )}
          </Select>
        );
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
    let currIndex = value * pageSize - pageSize + 1;
    setCurrentStartIndex(currIndex, "currIndex");
  };
  const handleUpdatedValues = () => {
    fetchOrdersNotAvailableData();
  };

  useEffect(() => {
    fetchFactories();
    fetchOrdersNotAvailableData();
  }, [currentStartIndex]);

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <h3 className="fw-bold text-center py-3">Order Not Available</h3>
      <div className="d-flex justify-content-between my-3">
        <Button
          variant="primary w-20 h4"
          className="fw-semibold"
          onClick={handleGenerateSchedulePo}
        >
          Release Scheduled PO
        </Button>
        <Button
          variant="primary w-15 h4"
          className="fw-semibold"
          onClick={handleUpdateStatus}
        >
          Update Status
        </Button>
      </div>
      <div className="mt-2">
        <DataTable
          columns={columns}
          rows={ordersNotAvailableData}
          page={page}
          pageSize={pageSize}
          totalPages={totalPages}
          handleChange={handleChange}
        />
      </div>
      <ReleaseSchedulePoModal
        show={showModal}
        handleCloseReleaseSchedulePoModal={handleModalClose}
        showModal={showModal}
        OrderNotAvailable={selectedOrderNotAvailable}
        handleUpdatedValues={handleUpdatedValues}
      />
    </Container>
  );
}

export default OrderNotAvailable;
