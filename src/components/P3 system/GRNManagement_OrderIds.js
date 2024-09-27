import React, { useEffect, useRef, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import {
  Alert,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { FaEye } from "react-icons/fa";
import DataTable from "../DataTable";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  AddRemark,
  GetGRNList,
  GetGRNListOnBasisOrderId,
} from "../../Redux2/slices/P3SystemSlice";
import AddCommentOutlinedIcon from "@mui/icons-material/AddCommentOutlined";
import { getUserData } from "../../utils/StorageUtils";
import ShowAlert from "../../utils/ShowAlert";
import { AddMessage } from "../../Redux2/slices/OrderSystemSlice";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { RiMessage2Line } from "react-icons/ri";
import { setCurrentPage } from "../../Redux2/slices/PaginationSlice";
import { DatePicker } from "@mui/x-date-pickers-pro";
import PendingItemsDataModal from "./PendingItemsDataModal";

function GRNManagement_OrderIds() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrderDate, setSelectedOrderDate] = useState("");
  const [selectedGrnDate, setSelectedGrnDate] = useState("");
  const [pageSize, setPageSize] = useState(50);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [grnList, setGrnList] = useState([]);
  const [grnListOverAllData, setGrnListOverAllData] = useState([]);
  const [userData, setUserData] = useState(null);
  const loader = useSelector((state) => state?.p3System?.isLoading);
  const [message, setMessage] = useState("");
  const [selectedGrnNo, setSelectedGrnNo] = useState(null);
  const [showMessageModal, setshowMessageModal] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remark, setRemark] = useState(null);
  const [factories, setFactories] = useState([]);
  const [searchOrderID, setSearchOrderID] = useState("");

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectedItemIds, setSelectedItemIds] = useState([]);
  const [pendingItemsDataModal, setPendingItemsDataModal] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [pendingItemType, setPendingItemType] = useState("all");

  const factoryData = useSelector((state) => state?.factory?.factories);
  const currentPage =
    useSelector(
      (state) => state.pagination.currentPage["GRNManagementOnOrder"]
    ) || 1;

  // const grnListData = useSelector(
  //   (state) => state?.p3System?.grnListOnOrderIds?.orders[0]
  // );

  const grnListData = useSelector(
    (state) => state?.p3System?.grnListOnOrderIds
  );

  useEffect(() => {
    if (factoryData) {
      const factData = factoryData?.factories?.map((item) => ({ ...item }));
      setFactories(factData);
    }
  }, [factoryData]);

  useEffect(() => {
    console.log(grnListData, "grnListData");
    if (currentPage) {
      setPage(currentPage);
    }
    if (grnListData) {
      // const grnData = grnListData?.items?.map((v, i) => ({ ...v, id: i }));
      const grnData = grnListData?.orders?.map((v, i) => ({ ...v, id: i }));
      setGrnListOverAllData(grnData);
      // setGrnList(grnData);
      setTotalPages(grnListData?.total_pages);
    }
  }, [grnListData, currentPage]);

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

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleDateChangeForOrder = async (newDateRange) => {
    if (newDateRange?.$d) {
      const isoDate = dayjs(newDateRange.$d.toDateString()).format(
        "YYYY-MM-DD"
      );
      setSelectedOrderDate(isoDate);
    } else {
      console.error("Invalid date range");
    }
  };

  const handleDateChangeForGrn = async (newDateRange) => {
    if (newDateRange?.$d) {
      const isoDate = dayjs(newDateRange.$d.toDateString()).format(
        "YYYY-MM-DD"
      );
      setSelectedGrnDate(isoDate);
    } else {
      console.error("Invalid date range");
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

  const columns = [
    {
      field: "select",
      headerName: "Select",
      flex: 0.5,
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
    { field: "order_id", headerName: "Order Ids", flex: 1 },
    { field: "order_created_date", headerName: "Order Created Date", flex: 1 },
    {
      field: "pending_items",
      headerName: "Pending Items",
      flex: 1,
      renderCell: (params) => {
        console.log(params, "params");
        return (
          <Box onClick={() => handlePoModal(params.row)}>
            {params.row.pending_items}
          </Box>
        );
      },
    },
    {
      field: "aging_days",
      headerName: "Aging Days",
      flex: 1,
      renderCell: (params) => {
        const orderCreatedOn = new Date(params.row.order_created_date);
        const todaysDate = new Date();
        // Calculate the difference in time between the two dates (in milliseconds)
        const timeDifference = Math.abs(todaysDate - orderCreatedOn);

        // Convert the difference from milliseconds to days (1 day = 24*60*60*1000 ms)
        const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));

        // Return the difference in days as a React component
        return <Box>{dayDifference} days</Box>;
      },
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 1,
    //   type: "string",
    // },
    // {
    //   field: "po_id",
    //   headerName: "Po Ref No.",
    //   flex: 1,
    //   renderCell: (params) => {
    //     const poId = params.row.po_id;
    //     return <div>{poId ? poId : "No PO ref"}</div>;
    //   },
    // },
    // {
    //   field: "factory_id",
    //   headerName: "Factory Name",
    //   flex: 1,
    //   renderCell: (params) => {
    //     const factory = factories.find(
    //       (factory) => factory.id == params.row.factory_id
    //     );
    //     return <Box>{factory?.factory_name}</Box>;
    //   },
    // },
    {
      field: "grn_note",
      headerName: "Remark",
      flex: 0.5,
      type: "html",
      renderCell: (value) => {
        const GRNnote = value?.row?.grn_note;
        const handleShowRemark = () => {
          setRemark(GRNnote);
          setShowRemarkModal(true);
        };
        return (
          <Box>
            {GRNnote && GRNnote != "" ? (
              <Button
                variant="outline-secondary"
                className="p-1 bg-transparent text-secondary"
                onClick={handleShowRemark}
              >
                <RiMessage2Line />
              </Button>
            ) : null}
          </Box>
        );
      },
    },
    {
      field: "",
      headerName: "Action",
      flex: 1,
      type: "html",
      renderCell: (value, row) => {
        console.log(value.row,'value.row')
        const handleShowMessageModal = () => {
          setSelectedGrnNo(value?.row?.grn_no);
          setshowMessageModal(true);
        };
        return (
          <Box>
            <Link to={`/Order_View/${value.row.order_id}`}>
              <Button
                type="button"
                className="w-auto bg-transparent border-0 text-secondary fs-5"
              >
                <FaEye className="mb-1" />
              </Button>
            </Link>
            <Button
              variant="outline-secondary"
              className="p-1 me-3 bg-transparent text-secondary"
              onClick={handleShowMessageModal}
            >
              <AddCommentOutlinedIcon />
            </Button>
          </Box>
        );
      },
    },
  ];

  const handlGetGRNList = async () => {
    try {
      let apiUrl;
      apiUrl = `wp-json/custom-grn-order/v1/order-by-grn/?per_page=${pageSize}&page=${page}`;
      if (searchOrderID) apiUrl += `&orderid=${searchOrderID}`;
      if (selectedOrderDate)
        apiUrl += `&order_created_date=${selectedOrderDate}`;
      if (selectedGrnDate) apiUrl += `&grn_date=${selectedGrnDate}`;
      if (statusFilter) apiUrl += `&status=${statusFilter}`;
      dispatch(GetGRNListOnBasisOrderId({ apiUrl }));
    } catch (error) {
      console.error(error);
      // setGrnList([]);
      grnListOverAllData([]);
    }
  };

  const handleChange = (event, value) => {
    // dispatch(setCurrentPage(value));
    dispatch(setCurrentPage({ tableId: "GRNManagementOnOrder", page: value }));
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  const handleAddRemark = async (e) => {
    const requestedMessage = {
      message: message,
      name: userData.first_name,
    };
    await dispatch(AddRemark({ selectedGrnNo, requestedMessage })).then(
      async ({ payload }) => {
        if (payload) {
          setMessage("");
          setshowMessageModal(false);
          ShowAlert("", payload, "success", null, null, null, null, 2000);
        }
        await handlGetGRNList();
      }
    );
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      setSearchOrderID(inputRef.current.value);
    }
  };

  const handlePoModal = (itemData) => {
    console.log(itemData, "itemData");
    setOrderId(itemData.order_id);
    setPendingItemsDataModal(true);
  };

  const searchPendingItemTypeFilter = (e) => {
    setPendingItemType(e);
    setPage(1);
  };

  useEffect(() => {
    handlGetGRNList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    searchOrderID,
    statusFilter,
    page,
    pageSize,
    selectedGrnDate,
    selectedOrderDate,
  ]);

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <MDBRow className="my-3">
        <MDBCol className="d-flex justify-content-start align-items-center">
          <Button
            variant="outline-secondary"
            className="p-1 me-2 bg-transparent text-secondary"
            onClick={() => navigate("/On_Hold_Manegement_System")}
          >
            <ArrowBackIcon className="me-1" />
          </Button>
          <Box></Box>
        </MDBCol>
      </MDBRow>
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          GRN Management
        </Typography>
      </Box>
      <Form inline className="mb-4">
        <Row className="align-items-center">
          <Row>
            <Col xs="auto" lg="3">
              <Form.Group>
                <Form.Label className="fw-semibold">Order ID:</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Order ID"
                  ref={inputRef}
                  // value={searchOrderID}
                  onKeyDown={handleKeyDown}
                  className="mr-sm-2 py-2"
                />
              </Form.Group>
            </Col>
            <Col xs="auto" lg="3">
              <Form.Group className="fw-semibold mb-0">
                <Form.Label>Order Created Date</Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={dayjs(selectedOrderDate)}
                    onChange={(e) => handleDateChangeForOrder(e)}
                    sx={{
                      display: "block",
                      verticalAlign: "unset",
                      "& .MuiInputBase-input": {
                        padding: ".5rem .75rem .5rem .75rem",
                        "&:hover": {
                          borderColor: "#dee2e6",
                        },
                      },
                    }}
                    renderInput={(props) => (
                      <TextField {...props} helperText="valid mask" />
                    )}
                  />
                </LocalizationProvider>
              </Form.Group>
            </Col>
            <Col xs="auto" lg="3">
              <Form.Group className="fw-semibold mb-0">
                <Form.Label>Grn Created Date</Form.Label>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    format="YYYY-MM-DD"
                    value={dayjs(selectedGrnDate)}
                    onChange={(e) => handleDateChangeForGrn(e)}
                    sx={{
                      display: "block",
                      verticalAlign: "unset",
                      "& .MuiInputBase-input": {
                        padding: ".5rem .75rem .5rem .75rem",
                        "&:hover": {
                          borderColor: "#dee2e6",
                        },
                      },
                    }}
                    renderInput={(props) => (
                      <TextField {...props} helperText="valid mask" />
                    )}
                  />
                </LocalizationProvider>
              </Form.Group>
            </Col>
            <Col xs="auto" lg="3">
              <Form.Group>
                <Form.Label className="fw-semibold">Pending Item type:</Form.Label>
                <Form.Select
                  className="mr-sm-2 py-2"
                  onChange={(e) => searchPendingItemTypeFilter(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="zero">Zero</option>
                  {/* <option value="reserve">Reserve</option> */}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row className="d-flex justify-content-end mt-2">
            <Col xs="auto" lg="1">
              <Form.Group>
                <Form.Label>PageSize </Form.Label>
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
            </Col>
          </Row>
        </Row>
      </Form>
      <MDBRow className="px-3">
        <Card className="py-3">
          {loader ? (
            <Loader />
          ) : (
            <>
              {grnListOverAllData && grnListOverAllData.length !== 0 ? (
                <div className="mt-2">
                  <DataTable
                    columns={columns}
                    rows={grnListOverAllData}
                    page={page}
                    pageSize={pageSize}
                    totalPages={totalPages}
                    handleChange={handleChange}
                    paginationPosition="top"
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
            </>
          )}
        </Card>
      </MDBRow>
      <Modal
        show={showMessageModal || showRemarkModal}
        onHide={() => {
          setshowMessageModal(false);
          setShowRemarkModal(false);
        }}
        centered={false}
        style={{
          position: "fixed",
          top: "10px",
          right: "10px",
          margin: 0,
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title
            style={{
              fontWeight: showMessageModal ? "normal" : "bold",
              color: showMessageModal ? "inherit" : "black",
            }}
          >
            {showMessageModal ? "Add Remark" : "Remark"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            placeholder="Enter your message here..."
            rows={3}
            style={{
              fontWeight: showMessageModal ? "normal" : "bold",
              color: showMessageModal ? "inherit" : "black",
            }}
            value={showMessageModal ? message : remark}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Box className="text-end my-3">
            {showMessageModal ? (
              <Button
                variant="primary"
                className="mt-2 fw-semibold"
                onClick={handleAddRemark}
              >
                Add Message
              </Button>
            ) : null}
          </Box>
        </Modal.Body>
      </Modal>
      {pendingItemsDataModal && (
        <PendingItemsDataModal
          show={pendingItemsDataModal}
          pendingItemsDataModal={pendingItemsDataModal}
          orderId={orderId}
          handleClosePoDetailsModal={() => setPendingItemsDataModal(false)}
        />
      )}
    </Container>
  );
}
export default GRNManagement_OrderIds;
