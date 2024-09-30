import React, { useState, useEffect } from "react";
import { Alert, Button, Card, Modal } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/Loader";
import { FetchPendingItemsData } from "../../Redux2/slices/P3SystemSlice";
import DataTable from "../DataTable";
import { Avatar, Box } from "@mui/material";

const PendingItemsDataModal = ({
  show,
  handleClosePoDetailsModal,
  orderId,
  pendingItemsDataModal,
}) => {
  const dispatch = useDispatch();
  const [factories, setFactories] = useState([]);
  const [pendingItemsData, setPendingItemsData] = useState([]);
  const [imageURL, setImageURL] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);

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

  const variant = (variations) => {
    const matches = variations.match(
      /"display_key";s:\d+:"([^"]+)";s:\d+:"display_value";s:\d+:"([^"]+)";/
    );
    if (matches) {
      const key = matches[1];
      const value = matches[2].replace(/<[^>]*>/g, ""); // Remove HTML tags
      return `${key}: ${value}`;
    } else {
      return "Variant data not available";
    }
  };

  const variant2 = (variations) => {
    const { Color, Size } = variations;

    if (!Color && !Size) {
      return "Variant data not available";
    }

    let details = [];

    if (Size) {
      details.push(`Size: ${Size}`);
    }

    if (Color) {
      details.push(`Color: ${Color}`);
    }

    return details.join(", ");
  };

  const ImageModule = (rowData) => {
    setImageURL(rowData.product_image);
    setShowEditModal(true);
  };

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
      field: "variation_value",
      headerName: "Variation values",
      flex: 1,
      renderCell: (params) => {
        if (
          params.row.variations &&
          Object.keys(params.row.variations).length !== 0
        ) {
          return variant2(params.row.variations);
        } else if (
          params.row.variation_value &&
          params.row.variation_value !== ""
        ) {
          return variant(params.row.variation_value);
        } else {
          return "No variations available";
        }
      },
    },
    {
      field: "product_images",
      headerName: "Product images",
      flex: 1,
      type: "html",
      renderCell: (value, row) => (
        <Box
          className="h-100 w-100 d-flex align-items-center"
          onClick={() => {
            ImageModule(value.row);
          }}
        >
          <Avatar
            src={value.row.product_image || require("../../assets/default.png")}
            alt={value.row.product_image}
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
      <Modal
        show={showEditModal}
        // onHide={handleCloseEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="factory-card">
            <img src={imageURL} alt="Product" />
          </Card>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default PendingItemsDataModal;
