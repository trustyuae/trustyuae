import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
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
import { Card, Modal } from "react-bootstrap";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import Loader from "../../utils/Loader";
import ShowAlert from "../../utils/ShowAlert";

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

  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );

  const orderNotAvailableLoader = useSelector(
    (state) => state?.orderNotAvailable?.isOrdersNotAvailable
  );

  useEffect(() => {
    dispatch(AllFactoryActions());
    setFactories(allFactoryDatas);
  }, [dispatch, allFactoryDatas]);

  const handleStatusChange = (event, itemData) => {
    const { value } = event.target;
    setSelectedStatus({ id: itemData.id, status: itemData.customer_status });
    ordersNotAvailableData.forEach((order) => {
      if (order.id === itemData.id) order.customer_status = value;
    });
  };

  const handleCheckboxChange = async (e, rowData) => {
    if (!rowData.customer_status) {
      await ShowAlert("please confirm your customer status first!", '', "error");
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

  const handleGenerateSchedulePo = async () => {
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
      await ShowAlert("please select products for generating schedule po", '', "error");
    } else if (customerStatus.length < selectedOrderNotAvailable.length) {
      await ShowAlert("Only for confirmed items we can raise the scheduled PO!", '', "error");
    } else if (new Set(estimatedTime).size !== 1) {
      await ShowAlert("Purchase order items are on separate schedules. Do you want to proceed with the action?!", '', "error");
    } else if (new Set(factoryNames).size !== 1) {
      await ShowAlert("Factory name should be the same for all selected items!", '', "error");
    } else {
      setShowModal(true);
    }
  };

  const handleUpdateStatus = async () => {
    const poIds = selectedOrderNotAvailable.map((order) => order.po_id);
    const orderIds = selectedOrderNotAvailable.map((order) => order.order_id);
    const productIds = selectedOrderNotAvailable.map(
      (order) => order.product_id
    );
    const customerStatuses = selectedOrderNotAvailable.map(
      (order) => order.customer_status
    );

    if (selectedOrderNotAvailable.length === 0) {
      await ShowAlert("Please select products you want to update status for!", '', "error");
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
      const result = await ShowAlert("Are you sure you want to refund this order?", '', 'question', true, true, "Yes, refund it!", "Cancel");
      if (result.isConfirmed) {
        try {
          const username = "ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a";
          const password = "cs_8dcdba11377e29282bd2b898d4a517cddd6726fe";
          const requestedInfo = {
            amount: selectedOrderNotAvailable.reduce(
              (acc, order) => acc + order.total_price,
              0
            ),
          };
          const response = await dispatch(
            OrderNotAvailableRefund(
              requestedInfo,
              orderIds,
              username,
              password
            )
          );
          await ShowAlert('', "Refund process completed successfully!", "success");
        } catch (error) {
          console.error("Error in refund process:", error);
          ShowAlert('', "Error in refund process!", "error");
        }
      } else {
        console.error("Refund cancelled");
      }
    } else {
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
            src={params.value || require("../../assets/default.png")}
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
    let currIndex = value * pageSize - pageSize + 1;
    setCurrentStartIndex(currIndex, "currIndex");
  };
  const handleUpdatedValues = () => {
    setSelectedOrderNotAvailable([]);
    setSelectedStatus({ id: 0, status: "" });
    fetchOrdersNotAvailableData();
  };

  useEffect(() => {
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
      {orderNotAvailableLoader ? (
        <Loader />
      ) : (
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
      )}
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
