import React, { useState, useEffect } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/Loader";
import { FetchPendingItemsData } from "../../Redux2/slices/P3SystemSlice";
import DataTable from "../DataTable";
import { Box } from "@mui/material";

const PendingItemsDataModal = ({
  show,
  handleClosePoDetailsModal,
  orderId,
  pendingItemsDataModal,
}) => {
  const dispatch = useDispatch();
  const [factories, setFactories] = useState([]);
  const [pendingItemsData, setPendingItemsData] = useState([]);

  const factoryData = useSelector((state) => state?.factory?.factories);
  const loader = useSelector((state) => state?.p3System?.isLoading);

  useEffect(() => {
    if (factoryData) {
      const factData = factoryData?.factories?.map((item) => ({ ...item }));
      setFactories(factData);
    }
  }, [factoryData]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await dispatch(FetchPendingItemsData({ orderId }));
        const { payload } = result;
        const dataWithIds = payload.map((v, index) => ({
          ...v,
          id: v.item_id || index,
        }));

        setPendingItemsData(dataWithIds);
      } catch (error) {
        console.error(error);
      }
    };

    if (show) {
      fetchData();
    }
  }, [show, dispatch, orderId]);

  const columns = [
    {
      field: "item_id",
      headerName: "Item Id",
      flex: 0.5,
    },
    {
      field: "product_name",
      headerName: "Product Name",
      flex: 1,
    },
    {
      field: "po_number",
      headerName: "PO No",
      flex: 0.5,
    },
    {
      field: "quantity",
      headerName: "Qty",
      flex: 0.5,
    },
    {
      field: "factory_id",
      headerName: "Factory Name",
      flex: 1,
      renderCell: (params) => {
        const factory = factories?.find(
          (factory) => factory.id === params.row.factory_id
        );
        return <Box>{factory?.factory_name || "Please assign factory"}</Box>;
      },
    }
  ];

  return (
    <>
      <Modal
        show={pendingItemsDataModal}
        onHide={handleClosePoDetailsModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title>Pending Item Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pendingItemsData && pendingItemsData.length !== 0 ? (
            <div className="mt-2">
              <DataTable
                columns={columns}
                rows={pendingItemsData}
                rowHeight="auto"
                getRowId={(row) => row.id} // Use custom ID from the modified data
              />
            </div>
          ) : (
            <Alert
              severity="warning"
              sx={{ fontFamily: "monospace", fontSize: "18px" }}
            >
              Records are not available for the above filter
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePoDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PendingItemsDataModal;
