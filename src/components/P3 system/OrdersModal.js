import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  AssignOrders,
  GetOrderIdsData,
} from "../../Redux2/slices/P3SystemSlice";
import { Button, Modal } from "react-bootstrap";
import DataTable from "../DataTable";
import { Alert, Checkbox, FormControlLabel, FormGroup } from "@mui/material";
import ShowAlert from "../../utils/ShowAlert";

const OrdersModal = ({
  showOrdersModalOpen,
  handleClosePoDetailsModal,
  productIDD,
  variationID,
  poId,
}) => {
  const dispatch = useDispatch();
  const [ordersData, setOrdersData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);

  useEffect(() => {
    if (showOrdersModalOpen) {
      fetchOrderIds();
    }
  }, [showOrdersModalOpen]);

  const fetchOrderIds = () => {
    const payload = {
      product_id: Number(productIDD),
      variation_id:
        Array.isArray(variationID) && variationID.length > 0
          ? Number(variationID)
          : 0,
      po_id: poId ? poId : "",
    };

    dispatch(GetOrderIdsData({ payload }))
      .then(({ payload }) => {
        const dataWithId = payload.order_ids.map((orderId, index) => ({
          id: index,
          order_id: orderId,
        }));
        setOrdersData(dataWithId);
      })
      .catch((error) => {
        console.error("Error fetching order IDs:", error);
        setOrdersData([]);
      });
  };

  const handleItemSelection = (rowData) => {
    const selectedIndex = selectedItemIds.indexOf(rowData.id);
    const newSelected =
      selectedIndex !== -1
        ? selectedItemIds.filter((id) => id !== rowData.id)
        : [...selectedItemIds, rowData.id];

    if (selectedIndex === -1) {
      setSelectedItems([...selectedItems, rowData]);
    } else {
      setSelectedItems(selectedItems.filter((item) => item.id !== rowData.id));
    }
    setSelectedItemIds(newSelected);
  };

  const handleAssignOrders = async () => {
    const orderIds = selectedItems.map((item) => item.order_id);
    const payload = {
      product_id: productIDD,
      variation_id: variationID,
      order_id: orderIds,
    };
    dispatch(AssignOrders({ payload })).then(({ payload }) => {
      if (payload.status === 200) {
        ShowAlert(
          "",
          "Order Assigned Successfully!",
          "success",
          null,
          null,
          null,
          null,
          2000
        );
      }else{
        ShowAlert(
          "",
          "assign order process failed",
          "error",
          null,
          null,
          null,
          null,
          2000
        );
      }
      handleClosePoDetailsModal();
    });
  };

  const columns = [
    {
      field: "select",
      headerName: "select",
      flex: 0.5,
      renderCell: (params) => {
        // const selectButtonOff = params.row.exist_item === "1" ? true : false;
        return (
          <FormGroup>
            <FormControlLabel
              className="mx-auto"
              control={<Checkbox />}
              // disabled={selectButtonOff}
              style={{ justifyContent: "center" }}
              checked={selectedItemIds.includes(params.row.id)}
              onChange={(event) => handleItemSelection(params.row)}
            />
          </FormGroup>
        );
      },
    },
    {
      field: "order_id",
      headerName: "Order ID",
      flex: 1,
    },
  ];

  return (
    <div>
      <Modal show={showOrdersModalOpen} onHide={handleClosePoDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>Orders</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {ordersData && ordersData.length !== 0 ? (
            <div className="mt-2">
              <DataTable
                columns={columns}
                rows={ordersData}
                rowHeight="auto"
                getRowId={(row) => row.id}
              />
            </div>
          ) : (
            <Alert
              severity="warning"
              sx={{ fontFamily: "monospace", fontSize: "18px" }}
            >
              Records is not Available for above filter
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleAssignOrders}>
            Assign Orders
          </Button>
          <Button variant="secondary" onClick={handleClosePoDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OrdersModal;
