import React, { useEffect, useMemo, useRef, useState } from "react";
import { MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import {
  Alert,
  Avatar,
  Box,
  Select as MuiSelect,
  Typography,
} from "@mui/material";
import DataTable from "../DataTable";
import { useDispatch, useSelector } from "react-redux";
import axiosInstance from "../../utils/AxiosInstance";

import Select from "react-select";
import { fetchAllFactories } from "../../Redux2/slices/FactoriesSlice";
import { FetchPoProductData } from "../../Redux2/slices/P3SystemSlice";
import OrderModal from "./OrdersModal";
import OnHoldProductDetailsPrintModal from "./OnHoldProductDetailsPrintModal";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { getUserData } from "../../utils/StorageUtils";

function GRNOrderPending() {
  const dispatch = useDispatch();
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [poTableData, setPoTableData] = useState([]);
  const [date, setDate] = useState(getTodayDate());
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const [optionsArray, setoptionsArray] = useState([]);

  const [selectedFactory, setSelectedFactory] = useState("");
  const [selectedPOId, setSelectedPOId] = useState(null);
  const [factories, setFactories] = useState([]);

  const [allPoIds, setAllPoIds] = useState([]);

  const [poId, setPoId] = useState("");

  const [pageSize, setPageSize] = useState(100);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentStartIndex, setCurrentStartIndex] = useState(1);

  const factoryData = useSelector((state) => state?.factory?.factories);
  const [userData, setUserData] = useState(null);

  const [showOrdersModalOpen, setShowOrdersModalOpen] = useState(false);
  const [productIDD, setProductIDD] = useState(null);
  const [variationID, setVariationID] = useState(null);

  const [printModal, setPrintModal] = useState(false);

  const loading = useSelector((state) => state?.p3System.isLoading);

  useEffect(() => {
    dispatch(fetchAllFactories());
  }, [dispatch]);

  useEffect(() => {
    if (factoryData) {
      const factData = factoryData?.factories?.map((item) => ({ ...item }));
      setFactories(factData);
    }
  }, [factoryData]);

  async function fetchUserData() {
    try {
      const userdata = await getUserData();
      setUserData(userdata || {});
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderVariationValuesPoColumn = (params) => {
    const variationValues = params.row?.variation_value;

    if (!variationValues || typeof variationValues !== "object") {
      return (
        <Box className="d-flex justify-content-around align-items-center w-100">
          <Box>No variation available</Box>
        </Box>
      );
    }

    const variationArray = Object.entries(variationValues);

    return (
      <Box className="d-flex justify-content-around align-items-center w-100">
        {variationArray.length === 0 ? (
          <Box>No variation available</Box>
        ) : (
          <Box>
            {variationArray.map(([key, value], index) => (
              <div key={index}>
                {key}: {value}
              </div>
            ))}
          </Box>
        )}
      </Box>
    );
  };

  const poColumns = [
    {
      field: "product_id",
      headerName: "product id",
      flex: 0.5,
      className: " d-flex justify-content-center align-items-center",
    },
    {
      field: "image",
      headerName: "product image",
      flex: 1,
      className: " d-flex justify-content-center align-items-center",
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
                height: "90%",
                width: "100%",
                borderRadius: "2px",
              },
            }}
          />
        </Box>
      ),
    },
    {
      field: "product_name",
      headerName: "product Name",
      flex: 1,
      className: " d-flex justify-content-center align-items-center",
    },
    {
      field: "order_ids",
      headerName: "Order ID's",
      flex: 1,
      className: "d-flex justify-content-center align-items-center",
      renderCell: (params) => {
        const orders = params?.row?.order_ids?.map((order) => order).join(", ");
        return <Box>{orders}</Box>;
      },
    },
    {
      field: "variation_values",
      headerName: "Variation Values",
      flex: 1.5,
      renderCell: renderVariationValuesPoColumn,
    },
    {
      field: "po_id",
      headerName: "PO ID",
      flex: 1,
      className: " d-flex justify-content-center align-items-center",
    },
    {
      field: "date_created",
      headerName: "Date Created",
      flex: 1,
      renderCell: (params) => {
        console.log(params,'params')
        return (
          null
        );
      },
    },
    {
      field: "factory",
      headerName: "Factory Name",
      flex: 1,
      renderCell: (params) => {
        console.log(params,'params')
        return (
          null
        );
      },
    },
  ];

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  const handleFactoryChange = (e) => {
    setSelectedPOId(null);
    setSelectedFactory(e.target.value);
  };

  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };

  const selectPOId = async () => {
    try {
      const response = await axiosInstance.get(
        `wp-json/get-po-ids/v1/show-po-id/`,
        {
          params: {
            factory_id: selectedFactory,
            po_id: selectedPOId,
          },
        }
      );
      const formattedPoIds = response.data.map((poId) => ({
        value: poId,
        label: poId,
      }));
      setAllPoIds(formattedPoIds);
    } catch (error) {
      console.error("Error fetching PO IDs:", error);
    }
  };

  const fetchPoProductData = async () => {
    const apiUrl = `wp-json/fetch-po-details/v1/get-product-under-po/${selectedPOId}/?per_page=${pageSize}&page=${page}`;
    try {
      dispatch(FetchPoProductData({ apiUrl })).then(({ payload }) => {
        const data = payload?.line_items?.map((item, i) => ({
          ...item,
          id: i + currentStartIndex,
        }));
        setPoTableData(data);
        setTotalPages(payload.total_pages);
        setPoId(payload.po_id);
      });
    } catch (error) {
      console.error("Error fetching PO product data:", error);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
    let currIndex = value * pageSize - pageSize + 1;
    setCurrentStartIndex(currIndex, "currIndex");
  };

  const handleChangePoID = (selectedOption) => {
    if (selectedOption) {
      setSelectedPOId(selectedOption.value);
    } else {
      setSelectedPOId(null);
    }
  };

  const handleReset = () => {
    setSelectedPOId(null);
    setSelectedFactory("");
  };

  const handlePrint = () => {
    setPrintModal(true);
  };

  useEffect(() => {
    selectPOId();
  }, [selectedFactory]);

  useEffect(() => {
    if (selectedPOId) {
      fetchPoProductData();
    }
  }, [selectedPOId, selectedFactory, pageSize, page]);

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
         Grn Order Pending System
        </Typography>
      </Box>
      <Form inline className="mb-4">
        <Row className="align-items-center px-1">
          <Col xs="auto" lg="4">
            <Form.Group className="fw-semibold mb-0">
              <Form.Label>Factory Filter</Form.Label>
              <Form.Select
                className="mr-sm-2"
                value={selectedFactory}
                onChange={(e) => handleFactoryChange(e)}
              >
                <option value="">All Factory</option>
                {factories?.map((factory) => (
                  <option key={factory?.id} value={factory?.id}>
                    {factory?.factory_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs="auto" lg="4">
            <Form.Label className="fw-semibold">Select PO ID</Form.Label>
            <Select
              options={allPoIds}
              value={
                selectedPOId
                  ? allPoIds.find((option) => option.value === selectedPOId)
                  : null
              }
              onChange={handleChangePoID}
              isClearable
              placeholder="Select PO ID"
              noOptionsMessage={() => "No PO IDs found"}
              getOptionLabel={(option) => option.label}
              getOptionValue={(option) => option.value}
              closeMenuOnSelect={false}
            />
          </Col>
          <Col className="d-flex" xs="auto" lg="4">
            <Form.Group className="fw-semibold mb-0">
              <Form.Label>PageSize</Form.Label>
              <Form.Control
                as="select"
                className="w-auto"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions?.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button
              type="button"
              className="mt-4 ms-5"
              onClick={handleReset}
            >
              Reset filter
            </Button>
          </Col>
        </Row>
      </Form>
      <MDBRow className="px-3">
        <Card className="py-3">
          <>
            <div className="mt-2">
              {poTableData &&
              poTableData?.length != 0 &&
              (selectedPOId?.length != 0 || selectedPOId) ? (
                <>
                  <DataTable
                    columns={poColumns}
                    rows={poTableData}
                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    handleChange={handleChange}
                    rowHeight="auto"
                    // showAllRows={true}
                    // getRowId={(row) => row.product_id + "-" + row.variation_id} // or another unique property
                    // hidePagination={true}
                  />
                </>
              ) : (
                <>
                  <Alert
                    severity="warning"
                    sx={{ fontFamily: "monospace", fontSize: "18px" }}
                  >
                    Records is not Available for above filter
                  </Alert>
                </>
              )}
            </div>
            <MDBRow className="justify-content-end px-3 py-2">
              <Box className="d-flex justify-content-end px-3 py-2">
                <Button
                  variant="outline-primary"
                  className="p-1 me-3 bg-transparent text-primary"
                  onClick={handlePrint}
                >
                  <LocalPrintshopOutlinedIcon className="me-1" />
                </Button>
              </Box>
            </MDBRow>
          </>
        </Card>
      </MDBRow>
      <OnHoldProductDetailsPrintModal
        show={printModal}
        poId={selectedPOId}
        // poRaiseDate={poRaiseDate}
        factoryName={
          factories.find((factory) => factory.id == selectedFactory)
            ?.factory_name
        }
        poTableData={poTableData}
        handleClosePrintModal={() => setPrintModal(false)}
      />
      {showOrdersModalOpen && (
        <OrderModal
          show={showOrdersModalOpen}
          showOrdersModalOpen={showOrdersModalOpen}
          productIDD={productIDD}
          variationID={variationID}
          poId={poId}
          // productId={productId}
          // variationId={variationId}
          handleClosePoDetailsModal={() => setShowOrdersModalOpen(false)}
          // poId={id}
        />
      )}
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

export default GRNOrderPending;
