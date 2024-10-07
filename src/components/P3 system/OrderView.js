import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Badge, Card, Form } from "react-bootstrap";
import DataTable from "../DataTable";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/Loader";
import {
  AddProductOrderForPre,
  GetGRNListOnBasisOrderId,
} from "../../Redux2/slices/P3SystemSlice";
import ShowAlert from "../../utils/ShowAlert";
import ShowAlert2 from "../../utils/ShowAlert2";
import Swal from "sweetalert2";

const OrderView = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const loader = useSelector((state) => state?.p3System?.isLoading);
  const [pageSize, setPageSize] = useState(50);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [verifiedName, setVerifiedName] = useState("");
  const [grnList, setGrnList] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [selectedInstores, setSelectedInstores] = useState([]);

  const grnListData = useSelector(
    (state) => state?.p3System?.grnListOnOrderIds?.orders[0]
  );

  useEffect(() => {
    if (grnListData) {
      const grnData = grnListData?.items?.map((v, i) => ({ ...v, id: i }));
      setGrnList(grnData);
      setTotalPages(grnListData?.total_pages);
    }
  }, [grnListData]);

  console.log(grnList, "grnList");

  const fetchItems = async () => {
    try {
      let apiUrl;
      apiUrl = `wp-json/custom-grn-order/v1/order-by-grn/?orderid=${id}&per_page=${pageSize}&page=${page}`;
      dispatch(GetGRNListOnBasisOrderId({ apiUrl }));
    } catch (error) {
      console.error(error);
      setGrnList([]);
    }
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

  // const handleItemSelectionforinstore = (rowData) => {
  //   console.log(rowData, "rowData");
  //   const selectedIndex1 = grnList.indexOf(rowData.id);
  //   const updatedRowData = {
  //     ...rowData,
  //     instore: selectedIndex1 === -1 ? 1 : 0,
  //   };

  //   const updatedProductData = grnList.map((grn) =>
  //     grn.id === rowData.id ? updatedRowData : grn
  //   );
  //   console.log(updatedProductData,"updatedProductData")

  //   setGrnList(updatedProductData);
  // };

  const handleItemSelectionforinstore = (rowData) => {
    const selectedIndex1 = grnList.indexOf(rowData.id);
    rowData.instore = 1;
    setSelectedInstores((prevSelectedOrders) => [
      ...prevSelectedOrders,
      rowData,
    ]);

    const updatedRowData = {
      ...rowData,
      instore: selectedIndex1 === -1 ? 1 : 0,
    };

    const updatedProductData = grnList.map((grn) =>
      grn.id === rowData.id ? updatedRowData : grn
    );

    setGrnList(updatedProductData);
  };

  const handleUpdatedValues = async () => {
    setSelectedItems([]);
    setSelectedInstores([]);
    fetchItems();
  };

  useEffect(() => {
    handleUpdatedValues();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const handleOrderPerp = async () => {
    console.log(grnList, "selectedItems");
    console.log(selectedItems, "selectedItems");
    const orderId = [grnListData.order_id];
    const grnNo = selectedItems.map((item) => item.grn_no);
    const productIdd = selectedItems.map((item) =>
      parseInt(item.product_id, 10)
    );
    const variationIdd = selectedItems.map((item) =>
      parseInt(item.variation_id, 10)
    );
    const poIdd = selectedItems.map((item) => item.po_id);
    const instoreValues = selectedInstores.map((order) =>
      order.instore
    );

    if (selectedItems.length === 0) {
      await ShowAlert(
        "Please select products for fulfilling orders",
        "",
        "error",
        false,
        false,
        "",
        "",
        "",
        0
      );
      return;
    }

    const systemSelection = await ShowAlert2(
      "Please select the system to send data",
      "",
      "info",
      true,
      false,
      "P1 System UAE",
      "P1 System China",
      "Cancel",
      0,
      1,
      2,
      {
        allowOutsideClick: false, // Disable clicking outside
        allowEscapeKey: false, // Disable closing on Escape key
      }
    );

    if (systemSelection === "Cancel") {
      return;
    }

    const confirmation = await Swal.fire({
      title: `Are you sure you want to send the data to ${systemSelection}?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      allowOutsideClick: false, // Disable clicking outside
      allowEscapeKey: false, // Disable escape key
    });

    if (confirmation.isConfirmed) {
      const requestedDataP = {
        product_id: productIdd,
        po_id: poIdd,
        order_id: orderId,
        grn_no: grnNo,
        variation_id: variationIdd,
        instore: instoreValues,
        warehouse: systemSelection === "P1 System UAE" ? "" : "China",
      };


      try {
        console.log(requestedDataP,"requestedDataP")
        await dispatch(AddProductOrderForPre({ requestedDataP })).then(
          ({ payload }) => {
            console.log(payload, "payload from AddProductOrderForPre");
            if (payload?.status_code === 200) {
              ShowAlert(
                "Items sent for prep successfully!",
                "",
                "success",
                false,
                false,
                "",
                "",
                2000
              );
              setSelectedItems([]);
              setSelectedItemIds([])
              fetchItems();
            } else {
              ShowAlert(
                "error while sending items for prep!",
                "",
                "error",
                false,
                false,
                "",
                "",
                2000
              );
            }
          }
        );
        // setSelectedItems([]);
      } catch (error) {
        console.error("Error occurred:", error);
      }
    } else if (confirmation.isDismissed) {
      return;
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageSize, page]);

  const columns = [
    {
      field: "select",
      headerName: "Select",
      flex: 1,
      renderCell: (params) => (
        <FormGroup>
          <FormControlLabel
            className="mx-auto"
            control={
              <Checkbox
                checked={selectedItemIds.includes(params.row.id)}
                onChange={() => handleItemSelection(params.row)}
              />
            }
            style={{ justifyContent: "center" }}
          />
        </FormGroup>
      ),
    },
    {
      field: "product_name",
      headerName: "Product Name",
      flex: 2,
    },
    {
      field: "product_image",
      headerName: "Product images",
      flex: 2,
      type: "html",
      renderCell: (value, row) => {
        return (
          <>
            <img
              src={value.row.product_image}
              alt={value.row.product_name}
              className="img-fluid "
              width={100}
            />
          </>
        );
      },
    },
    {
      field: "variation_value",
      headerName: "Variation",
      flex: 2,
      renderCell: (params) => {
        if (params?.row?.variations != "") {
          return formatVariations(params.row.variations);
        } else {
          return "No any variations";
        }
      },
    },
    { field: "qty_received", headerName: "Qty Received", flex: 2 },
    { field: "qty_remain", headerName: "Qty Remain", flex: 2 },
    {
      field: "select_for_store",
      headerName: "In Store",
      flex: 0.5,
      renderCell: (params) => {
        let productInstore = grnList?.find(
          (grn) => grn.id === params.row.id
        );
        return (
          <FormGroup>
            <FormControlLabel
              className="mx-auto"
              control={
                <Checkbox
                  checked={productInstore.instore == 1 ? true : false}
                  onChange={() => handleItemSelectionforinstore(params.row)}
                />
              }
              style={{ justifyContent: "center" }}
            />
          </FormGroup>
        );
      },
    },
  ];

  const handalBackButton = () => {
    navigate("/GRN_Management_On_OrderIds");
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  const formatVariations = (variations) => {
    if (!variations) {
      return "No variations";
    }

    try {
      const data = JSON.parse(variations);

      if (Object.keys(data).length === 0) {
        return "No variations";
      } else {
        return Object.entries(data)
          .map(([key, value]) => `${key}: ${value}`)
          .join(", ");
      }
    } catch (e) {
      return "Invalid variations data";
    }
  };

  return (
    <Container fluid className="px-5">
      <MDBRow className="my-3">
        <MDBCol
          md="5"
          className="d-flex justify-content-start align-items-center"
        >
          <Button
            variant="outline-secondary"
            className="p-1 me-2 bg-transparent text-secondary"
            onClick={handalBackButton}
          >
            <ArrowBackIcon className="me-1" />
          </Button>
          <Box></Box>
        </MDBCol>
      </MDBRow>
      <Card className="p-3 mb-3">
        <Box className="d-flex align-items-center justify-content-between">
          <Box className="d-flex">
            <Box>
              <Typography variant="h6" className="fw-bold">
                Order View
              </Typography>
            </Box>
            <Box
              className="ms-5"
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                textAlign: "center",
                borderRadius: 1,
              }}
            >
              <Typography className="fw-bold">#{verifiedName}</Typography>
              <Typography>
                <Badge bg="success">Verified by</Badge>
              </Typography>
            </Box>
          </Box>
          <Box>
            <Form.Group className="d-flex align-items-baseline ">
              <Form.Label className="me-3">PageSize </Form.Label>
              <Form.Control
                as="select"
                className="w-auto"
                value={pageSize}
                onChange={handlePageSizeChange}
              >
                {pageSizeOptions.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Box>
        </Box>
      </Card>

      <Card className="p-3 mb-3">
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol col="10" md="12" sm="12"></MDBCol>
          <div>
            {loader ? (
              <Loader />
            ) : grnList && grnList.length != 0 ? (
              <div className="mt-2">
                <DataTable
                  columns={columns}
                  rows={grnList}
                  page={page}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  handleChange={handleChange}
                  rowHeight={100}
                  paginationPosition="top"
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
          </div>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="d-flex justify-content-end mt-3">
            {/* {productData?.length === 0 ? (
            <Button variant="success" disabled onClick={handleOrderStock}>
              Send For InStock
            </Button>
          ) : ( */}
            <Button variant="success" onClick={handleOrderPerp}>
              Send for Preparation
            </Button>
            {/* )} */}
          </MDBCol>
        </MDBRow>
      </Card>
    </Container>
  );
};
export default OrderView;
