import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useDispatch } from "react-redux";
import {
  OrderNotAvailableData,
  OrderNotAvailableDataStatus,
  OrderNotAvailableRefund,
} from "../../redux/actions/P2SystemActions";
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
  Typography,
} from "@mui/material";
import { API_URL } from "../../redux/constants/Constants";
import axios from "axios";
import Swal from "sweetalert2";
import { Card, Modal } from "react-bootstrap";

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
  const [selectedStatus, setSelectedStatus] = useState({ id: 0, status: "" });
  const [currentStartIndex, setCurrentStartIndex] = useState(1);
  const [imageURL, setImageURL] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

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
    setSelectedStatus({ id: itemData.id, status: itemData.customer_status });
    ordersNotAvailableData.forEach((order) => {
      if (order.id === itemData.id) order.customer_status = value;
    });
  };

  const handleCheckboxChange = (e, rowData) => {
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
        if (selectedOrderNotAvailable.length > 0) {
          selectedOrderNotAvailable.forEach((order) => {
            data.forEach((o) => {
              if (o.id === order.id) {
                o.isSelected = true;
                o.customer_status = order.customer_status;
              }
            });
          });
        }
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

  // const handleUpdateStatus = async () => {
  //   console.log(
  //     selectedOrderNotAvailable,
  //     "selectedOrderNotAvailable handle update"
  //   );
  //   const poId = selectedOrderNotAvailable.map((order) => order.po_id);
  //   const orderId = selectedOrderNotAvailable.map((order) => order.order_id);
  //   const productId = selectedOrderNotAvailable.map(
  //     (order) => order.product_id
  //   );
  //   const customerStatus = selectedOrderNotAvailable.map(
  //     (order) => order.customer_status
  //   );
  //   if (selectedOrderNotAvailable.length === 0) {
  //     Swal.fire({
  //       icon: "error",
  //       title: "please select products whose you wanna update status!",
  //     });
  //   }

  //   if (customerStatus === "Refund") {
  //     console.log(customerStatus,'customerStatus in loop')
  //     Swal.fire({
  //       icon: "Success",
  //       title: "are you sure to refund this project?",
  //       showConfirmButton: true,
  //     }).then((result) => {
  //       console.log(result, "result");
  //     });
  //   } else {
  //     const requestedDataS = {
  //       po_id: poId,
  //       order_id: orderId,
  //       product_id: productId,
  //       customer_status: customerStatus,
  //     };
  //     await dispatch(OrderNotAvailableDataStatus(requestedDataS)).then(() => {
  //       setSelectedOrderNotAvailable([]);
  //     });
  //   }
  // };

  const handleUpdateStatus = async () => {
    console.log(
      selectedOrderNotAvailable,
      "selectedOrderNotAvailable handle update"
    );
    const poIds = selectedOrderNotAvailable.map((order) => order.po_id);
    const orderIds = selectedOrderNotAvailable.map((order) => order.order_id);
    const productIds = selectedOrderNotAvailable.map(
      (order) => order.product_id
    );
    const customerStatuses = selectedOrderNotAvailable.map(
      (order) => order.customer_status
    );

    if (selectedOrderNotAvailable.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Please select products you want to update status for!",
      });
      return;
    }

    const hasRefund = customerStatuses.some((status) => status === "Refund");
    // const unitPrice = selectedOrderNotAvailable.map(
    //   (order) => order.unit_price
    // );
    // const totalPrice = selectedOrderNotAvailable.map(
    //   (order) => order.total_price
    // );
    if (hasRefund) {
      Swal.fire({
        icon: "question",
        title: "Are you sure you want to refund this order?",
        showCancelButton: true,
        confirmButtonText: "Yes, refund it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          try {
            const username = "ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a";
            const password = "cs_8dcdba11377e29282bd2b898d4a517cddd6726fe";
            const requestedInfo = {
              amount: selectedOrderNotAvailable.reduce((acc, order) => acc + order.total_price, 0),
            };
            const response = await dispatch(OrderNotAvailableRefund(requestedInfo, orderIds, username, password));
            Swal.fire({
              icon: "success",
              title: "Refund process completed successfully!",
            });
            console.log("Refund response:", response);
          } catch (error) {
            console.error("Error in refund process:", error);
            Swal.fire({
              icon: "error",
              title: "Error in refund process!",
            });
          }
        } else {
          console.log("Refund cancelled");
        }
      });
    }else {
      const requestedDataS = {
        po_id: poIds,
        order_id: orderIds,
        product_id: productIds,
        customer_status: customerStatuses,
      };
      await dispatch(OrderNotAvailableDataStatus(requestedDataS)).then(() => {
        setSelectedOrderNotAvailable([]);
      });
    }
  };

  const handleModalClose = async () => {
    ordersNotAvailableData.forEach((order) => {
      order.isSelected = false;
      order.customer_status = "";
    });
    setSelectedOrderNotAvailable([]);
    setShowModal(false);
  };

  const columns = [
    {
      field: "id",
      headerName: "ID",
      className: "order-not-available",
      flex: 1,
    },
    {
      field: "order_id",
      headerName: "Order ID",
      className: "order-not-available",
      flex: 1,
    },
    {
      field: "factory_id",
      headerName: "Factory Name",
      className: "order-not-available",
      flex: 1,
      renderCell: (params) => {
        return factories.find((factory) => factory.id === params.row.factory_id)
          ?.factory_name;
      },
    },
    {
      field: "product_name",
      headerName: "Item Name",
      className: "order-not-available",
      flex: 1,
    },
    {
      field: "product_image",
      headerName: "Image",
      flex: 1,
      className: "order-not-available",
      renderCell: (params) => (
        <Box
          className="h-100 w-100 d-flex align-items-center"
          onClick={() => ImageModule(params.value)}
        >
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
      className: "order-not-available",
    },
    {
      field: "custom_number",
      headerName: "Customer Contact Number",
      flex: 1,
      className: "order-not-available",
    },
    {
      field: "estimated_production_time",
      headerName: "Estimated Production Timing",
      flex: 1,
      className: "order-not-available",
    },
    {
      field: "customer_status",
      headerName: "Customer Status",
      flex: 1,
      className: "order-not-available",
      renderCell: (params) => (
        <Select
          value={params.row.customer_status}
          onChange={(event) => handleStatusChange(event, params.row)}
          fullWidth
          style={{ height: "60%", width: "100%" }}
        >
          <MenuItem value={""}></MenuItem>
          {["Confirmed", "NotConfirmed", "Exchange", "Refund"].map((status) => (
            <MenuItem key={status} value={status}>
              {status}
            </MenuItem>
          ))}
        </Select>
      ),
    },
    {
      field: "select",
      headerName: "Select",
      flex: 1,
      className: "order-not-available",
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
    setSelectedOrderNotAvailable([]);
    setSelectedStatus({ id: 0, status: "" });
    fetchOrdersNotAvailableData();
  };

  useEffect(() => {
    fetchFactories();
    fetchOrdersNotAvailableData();
  }, [currentStartIndex, selectedOrderNotAvailable, setSelectedStatus]);

  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          Order Not Available
        </Typography>
      </Box>
      <Box className="d-flex justify-content-end my-3">
        <Button
          variant="outline-success w-20 h4"
          className="fw-semibold me-3"
          onClick={handleGenerateSchedulePo}
        >
          Release Scheduled PO
        </Button>
        <Button
          variant="outline-primary w-15 h4"
          className="fw-semibold"
          onClick={handleUpdateStatus}
        >
          Update Status
        </Button>
      </Box>
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
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="factory-card">
            <img
              src={imageURL || `${require("../../assets/default.png")}`}
              alt="Product"
            />
          </Card>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default OrderNotAvailable;
