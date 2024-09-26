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
  const [userData, setUserData] = useState(null);
  const loader = useSelector((state) => state?.p3System?.isLoading);
  const [message, setMessage] = useState("");
  const [selectedGrnNo, setSelectedGrnNo] = useState(null);
  const [showMessageModal, setshowMessageModal] = useState(false);
  const [showRemarkModal, setShowRemarkModal] = useState(false);
  const [remark, setRemark] = useState(null);
  const [factories, setFactories] = useState([]);
  const [searchOrderID, setSearchOrderID] = useState("");

  const factoryData = useSelector((state) => state?.factory?.factories);
  const currentPage = useSelector((state) => state.pagination.currentPage);
  const grnListData = useSelector(
    (state) => state?.p3System?.grnListOnOrderIds?.orders[0]
  );

  console.log(grnList, "grnList");

  useEffect(() => {
    if (factoryData) {
      const factData = factoryData?.factories?.map((item) => ({ ...item }));
      setFactories(factData);
    }
  }, [factoryData]);

  useEffect(() => {
    console.log(grnListData,'grnListData')
    if (currentPage) {
      setPage(currentPage);
    }
    if (grnListData) {
      const grnData = grnListData?.items?.map((v, i) => ({ ...v, id: i }));
      console.log(grnData, "grnData");
      setGrnList(grnData);
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

  const availabilityStatus = [
    "All Processed",
    "Partially Processed",
    "Pending for Process",
  ];

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
              // checked={selectedItemIds.includes(params.row.id)}
              // onChange={() => handleItemSelection(params.row)}
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
      field: "total_qty",
      headerName: "Total Items",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      type: "string",
    },
    {
      field: "po_id",
      headerName: "Po Ref No.",
      flex: 1,
      renderCell: (params) => {
        const poId = params.row.po_id;
        return <div>{poId ? poId : "No PO ref"}</div>;
      },
    },
    {
      field: "factory_id",
      headerName: "Factory Name",
      flex: 1,
      renderCell: (params) => {
        const factory = factories.find(
          (factory) => factory.id == params.row.factory_id
        );
        return <Box>{factory?.factory_name}</Box>;
      },
    },
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
        const handleShowMessageModal = () => {
          setSelectedGrnNo(value?.row?.grn_no);
          setshowMessageModal(true);
        };
        return (
          <Box>
            <Link to={`/GRN_View/${value?.row?.grn_no}`}>
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
      if (selectedOrderDate) apiUrl += `&order_created_date=${selectedOrderDate}`;
      if (selectedGrnDate) apiUrl += `&grn_date=${selectedGrnDate}`;
      if (statusFilter) apiUrl += `&status=${statusFilter}`;
      dispatch(GetGRNListOnBasisOrderId({ apiUrl }));
    } catch (error) {
      console.error(error);
      setGrnList([]);
    }
  };

  const handleChange = (event, value) => {
    dispatch(setCurrentPage(value));
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

  useEffect(() => {
    handlGetGRNList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchOrderID,statusFilter, page, pageSize,selectedGrnDate,selectedOrderDate]);

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
                <Form.Label className="fw-semibold">
                  Filter by Status:
                </Form.Label>
                <Form.Select
                  className="mr-sm-2 py-2"
                  onChange={handleStatusChange}
                  value={statusFilter}
                >
                  <option value="">Select Status</option>
                  {availabilityStatus.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
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
              {grnListData && grnListData.length !== 0 && grnList && grnList.length !== 0 ? (
                <div className="mt-2">
                  <DataTable
                    columns={columns}
                    rows={grnList}
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
    </Container>
  );
}
export default GRNManagement_OrderIds;
