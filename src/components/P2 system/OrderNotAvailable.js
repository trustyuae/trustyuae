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
import getFactoryNameById from "../../utils/GetFactoryName";
import { Image } from "@material-ui/icons";

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

  const FactoryNameColumn = ({ factoryId }) => {
    const [factoryName, setFactoryName] = React.useState("");

    React.useEffect(() => {
      const fetchFactoryName = async () => {
        const name = await getFactoryNameById(factoryId);
        setFactoryName(name);
      };
      fetchFactoryName();
    }, [factoryId]);

    return <>{factoryName}</>;
  };

  const handleStatusChange = (event, itemData) => {
    const { value } = event.target;
    ordersNotAvailableData.forEach((order) => {
      if (order.id === itemData.id) order.customer_status = value;
    });
  };
  console.log(OrderNotAvailable, "OrderNotAvailable");

  const handleCheckboxChange = (e, rowData) => {
    const index = selectedOrderNotAvailable?.findIndex(
      (order) => order?.id == rowData.id
    );
    if (index === -1 && e.target.checked) {
      setSelectedOrderNotAvailable((prevSelectedOrders) => [
        ...prevSelectedOrders,
        rowData,
      ]);
    } else if (index !== -1 && !e.target.checked) {
      const updatedSelectedOrders = [...selectedOrderNotAvailable];
      updatedSelectedOrders.splice(index, 1);
      setSelectedOrderNotAvailable(updatedSelectedOrders);
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
        let data = response.data.orders.map((v, i) => ({ ...v, id: i }));
        setOrdersNotAvailableData(data);
        setTotalPages(response.data.total_pages);
      })
      .catch((error) => {
        console.error(error);
      });
  }

  const columns = [
    { field: "id", headerName: "ID", flex: 1 },
    { field: "order_id", headerName: "Order ID", flex: 1 },
    {
      field: "factory_id",
      headerName: "Factory Name",
      flex: 1,
      renderCell: (params) => <FactoryNameColumn factoryId={params.value} />,
    },
    { field: "product_name", headerName: "Item Name", flex: 1 },
    {
      field: "product_image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <Box
          className="h-100 w-100 d-flex align-items-center"
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

  useEffect(() => {
    fetchOrdersNotAvailableData();
  }, [pageSize, page]);

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <h3 className="fw-bold text-center py-3">Order Not Available</h3>
      <div className="d-flex justify-content-start my-3">
        <Button
          variant="primary w-25 h4"
          className="fw-semibold"
          onClick={() => setShowModal(true)}
        >
          Release Scheduled PO
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
        handleCloseReleaseSchedulePoModal={() => setShowModal(false)}
        showModal={showModal}
        OrderNotAvailable={selectedOrderNotAvailable}
      />
    </Container>
  );
}

export default OrderNotAvailable;
