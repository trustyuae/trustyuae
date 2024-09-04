import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetOrderIdsData } from "../../Redux2/slices/P3SystemSlice";
import { Button, Modal } from "react-bootstrap";
import DataTable from "../DataTable";

const OrdersModal = ({
  showOrdersModalOpen,
  handleClosePoDetailsModal,
  productIDD,
  variationID,
  poId,
}) => {
  const dispatch = useDispatch();
  const [ordersData, setOrdersData] = useState([]);
  const OrderIds = useSelector((state) => state?.p3System?.ordersData);

  console.log(OrderIds, "orderIds");

  useEffect(() => {
    if (showOrdersModalOpen) {
      fetchOrderIds();
    }
  }, [showOrdersModalOpen]);

  useEffect(() => {
    if (OrderIds) {
      setOrdersData(OrderIds);
    }
  }, [OrderIds]);

  const fetchOrderIds = () => {
    const payload = {
      product_id: Number(productIDD),
      variation_id:
        Array.isArray(variationID) && variationID.length > 0
          ? Number(variationID)
          : 0,
      po_id: poId ? poId : "",
    };

    dispatch(GetOrderIdsData({ payload })).then(({ payload }) => {
      console.log(payload, "payload");
    });
  };

  const columns = [
    {
      field: "product_name",
      headerName: "Select Order",
      flex: 4,
    },
    {
      field: "variation_value",
      headerName: "Order Ids",
      flex: 4,
      // renderCell: variant2,
    },
  ];

  return (
    <div>
      <Modal show={showOrdersModalOpen} onHide={handleClosePoDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-2">
            <DataTable
              columns={columns}
              rows={ordersData} // Bind data to DataTable
              rowHeight="auto"
              showAllRows={true}
              // hidePagination={true}
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePoDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrdersModal;
