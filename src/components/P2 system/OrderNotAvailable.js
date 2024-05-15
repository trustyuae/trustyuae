import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useDispatch, useSelector } from "react-redux";
import { OrderNotAvailableData } from "../../redux/actions/P2SystemActions";
import DataTable from "../DataTable";
import ReleaseSchedulePoModal from "./ReleaseSchedulePoModal";
import { Avatar } from "@mui/material";

function OrderNotAvailable() {
  const dispatch = useDispatch();
  const [checkedItems, setCheckedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [orderStatusMap, setOrderStatusMap] = useState({});
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [ordersNotAvailable, setOrdersNotAvailable] = useState([]);
  const [OrderNotAvailable, setOrderNotAvailable]=useState(null)

//   const handleCheckboxChange = (orderID) => {
//     const newCheckedItems = checkedItems.includes(orderID)
//       ? checkedItems.filter((item) => item !== orderID)
//       : [...checkedItems, orderID];
//     setCheckedItems(newCheckedItems);
//   };

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
    const OrderNotAvailable = ordersNotAvailable?.find((o) => o.id === OrderNotAvaId);
    setOrderNotAvailable(OrderNotAvailable)
    setShowModal(true);
  };


  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  useEffect(() => {
    dispatch(OrderNotAvailableData());
  }, [dispatch]);

  const handleChange = (event, value) => {
    setPage(value);
  };

  const OrderNotAvailabledata = useSelector(
    (state) => state?.orderNotAvailable?.ordersNotAvailable?.orders
  );

  const TotalPages = useSelector(
    (state) => state?.orderNotAvailable?.ordersNotAvailable?.total_pages
  );

  useEffect(() => {
    // Initialize orderStatusMap when OrderNotAvailabledata changes
    const statusMap = {};
    OrderNotAvailabledata?.forEach((item) => {
      statusMap[item.order_id] = item.customerStatus;
    });
    setOrderStatusMap(statusMap);
  }, [OrderNotAvailabledata]);

  useEffect(() => {
    if (OrderNotAvailabledata) {
      // Add ID field to each item
      const ordersWithIds = OrderNotAvailabledata.map((item, index) => ({
        ...item,
        id: index + 1, // Assuming index + 1 as ID
      }));
      setOrdersNotAvailable(ordersWithIds);
      setTotalPages(TotalPages);
    }
  }, [OrderNotAvailabledata, TotalPages]);

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
          rows={ordersNotAvailable}
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
          ordersNotAvailable={ordersNotAvailable}
          checkedItems={checkedItems}
          orderStatusMap={orderStatusMap}
        />
    </Container>
  );
}

export default OrderNotAvailable;
