import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { OrderNotAvailableData } from "../../redux/actions/P2SystemActions";
import DataTable from "../DataTable";
import ReleaseSchedulePoModal from "./ReleaseSchedulePoModal";
import { Avatar } from "@mui/material";
import { API_URL } from "../../redux/constants/Constants";

function OrderNotAvailable() {
  const dispatch = useDispatch();
  const [checkedItems, setCheckedItems] = useState([]);
  const [ordersNotAvailableData, setOrdersNotAvailableData] = useState([])
  const [showModal, setShowModal] = useState(false);
  const [orderStatusMap, setOrderStatusMap] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [OrderNotAvailable, setOrderNotAvailable]=useState(null)

  console.log()
//   const handleCheckboxChange = (orderID) => {
//     const newCheckedItems = checkedItems.includes(orderID)
//       ? checkedItems.filter((item) => item !== orderID)
//       : [...checkedItems, orderID];
//     setCheckedItems(newCheckedItems);
//   };

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

// const handlePageSizeChange = (e) => {
//   setPageSize(parseInt(e.target.value));
//   setPage(1);
// };


  const columns = [
    { field: "id", headerName: "ID", flex: 1 }, // Added ID column
    { field: "order_id", headerName: "Order ID", flex: 1 },
    { field: "product_name", headerName: "Item Name", flex: 1 },
    {
      field: "product_image",
      headerName: "Image",
      flex: 1,
      renderCell: (params) => (
        <Avatar src={params.value} alt="Product Image" />
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
      field: "select",
      headerName: "Select",
      flex: 1,
    },
  ];

  const handleShowModal = (OrderNotAvaId) => {
    const OrderNotAvailable = ordersNotAvailableData?.find((o) => o.id === OrderNotAvaId);
    setOrderNotAvailable(OrderNotAvailable)
    setShowModal(true);
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  useEffect(() => {
    fetchOrdersNotAvailableData();
  }, [pageSize, page]);

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <h3 className="fw-bold text-center py-3">Order Not Available</h3>
      <div className="d-flex justify-content-start align-items-center my-3">
        <Button variant="primary w-25" onClick={handleShowModal}>
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
          OrderNotAvailable={OrderNotAvailable}
          ordersNotAvailable={ordersNotAvailableData}
          checkedItems={checkedItems}
          orderStatusMap={orderStatusMap}
        />
    </Container>
  );
}

export default OrderNotAvailable;
