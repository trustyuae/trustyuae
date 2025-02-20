import React, { useState, useEffect } from "react";
import { Alert, Button, Card, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/Loader";
import {
  RefundPoDetailsForModalInView,
} from "../../Redux2/slices/P2SystemSlice";
import DataTable from "../DataTable";
import { Avatar, Box} from "@mui/material";

const PoRefundModal = ({
  show,
  handleClosePoDetailsModal,
  poId,
  poDetailsModal,
}) => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);
  const loader = useSelector((state) => state?.p2System?.isLoading);
  const [imageURL, setImageURL] = useState("");
  const [imageId, setImageId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSizeOptions = [5, 10, 20, 50, 100];

  useEffect(() => {
    const fetchData = () => {
      dispatch(RefundPoDetailsForModalInView({ poId }))
        .then(({ payload }) => {
          const data = payload?.map((v, id) => ({
            ...v,
            id,
          }));
          setProductData(data);
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    };

    if (show) {
      fetchData();
    }
  }, [show, dispatch, poId]);

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
    setImageURL(rowData?.image);
    setImageId(rowData?.product_id);
    setShowEditModal(true);
  };

  const columns = [
    {
      field: "product_name",
      headerName: 'Name',
      className: "order-details-in-china",
      flex: 1.5,
    },
    {
      field: "variant_details",
      headerName: 'Variation Details',
      className: "order-details-in-china",
      flex: 1.5,
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
      field: "product_image",
      headerName: 'Image',
      flex: 1,
      className: "order-details-in-china",
      renderCell: (params) => {
        return (
          <Box
            className="h-100 w-100 d-flex align-items-center"
            onClick={() => {
              ImageModule(params?.row);
            }}
          >
            <Avatar
              src={params?.row?.image || require("../../assets/default.png")}
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
        );
      },
    },
    {
      field: "quantity",
      headerName: 'QTY',
      flex: 0.5,
      className: "order-details-in-china",
    },
    {
      field: "order_id",
      headerName: 'Order Id',
      className: "order-details-in-china",
      flex: 0.5,
    },
  ];

  return (
    <>
      <Modal show={poDetailsModal} onHide={handleClosePoDetailsModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Refund Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mt-2">
            <DataTable
              columns={columns}
              rows={productData}
              page={page}
              pageSize={pageSize}
              totalPages={totalPages}
              // handleChange={handleChange}
            />
          </div>
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
          <Modal.Title>Product ID - {imageId}</Modal.Title>
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

export default PoRefundModal;
