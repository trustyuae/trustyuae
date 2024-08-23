import React, { useEffect, useState } from "react";
import { MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Alert, Box, Typography } from "@mui/material";
import { Button, Card, Col, Row } from "react-bootstrap";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { FaEye } from "react-icons/fa";
import DataTable from "../DataTable";
import { API_URL } from "../../redux/constants/Constants";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GetGRNList } from "../../redux/actions/P3SystemActions";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import CancelIcon from "@mui/icons-material/Cancel";


function GRNManagement() {
  const dispatch = useDispatch();
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [pageSize, setPageSize] = useState(5);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [grnList, setGrnList] = useState([]);
  const loader = useSelector((state) => state?.managementSystem?.isGrnList);

  const handleStatusChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const availabilityStatus = [
    "All Processed",
    "Partially Processed",
    "Pending for Process",
  ];

  const handleDateChange = async (newDateRange) => {
    if (newDateRange[0]?.$d && newDateRange[1]?.$d) {
      setSelectedDateRange(newDateRange);
      const isoStartDate = dayjs(newDateRange[0].$d.toDateString()).format('YYYY-MM-DD');
      const isoEndDate = dayjs(newDateRange[1].$d.toDateString()).format('YYYY-MM-DD');
      setStartDate(isoStartDate);
      setEndDate(isoEndDate);
    } else {
      console.error("Invalid date range");
      setStartDate("");
      setEndDate("");
    }
  };

  const columns = [
    { field: "grn_no", headerName: "GRN NO", flex: 1 },
    { field: "created_date", headerName: "Date Created", flex: 1 },
    { field: "verified_by", headerName: "Created By", flex: 1 },
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
      field: "",
      headerName: "Action",
      flex: 1,
      type: "html",
      renderCell: (value, row) => {
        return (
          <Link to={`/GRN_View/${value?.row?.grn_no}`}>
            <Button
              type="button"
              className="w-auto bg-transparent border-0 text-secondary fs-5"
            >
              <FaEye className="mb-1" />
            </Button>
          </Link>
        );
      },
    },
  ];

  const handlGetGRNList = async () => {
    try {
      let apiUrl;
      apiUrl = `${API_URL}wp-json/custom-api/v1/get-grns/?per_page=${pageSize}&page=${page}`;
      if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
      if (statusFilter) apiUrl += `&status=${statusFilter}`;
      await dispatch(GetGRNList({ apiUrl })).then((response) => {
        let data = response.data.data.map((v, i) => ({ ...v, id: i }));
        setGrnList(data);
        setTotalPages(response.data.total_pages);
      });
    } catch (error) {
      console.error(error);
      setGrnList([]);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  const clearDateRange = () => {
    setSelectedDateRange([null, null]);
    setStartDate("")
    setEndDate("")
  };

  useEffect(() => {
    handlGetGRNList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [endDate, selectedDateRange, statusFilter, page,pageSize]);

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          GRN Management
        </Typography>
      </Box>
      <Form inline className="mb-4">
        <Row className="align-items-center">
          <Col xs="auto" lg="3">
            <Form.Group style={{ position: "relative" }}>
              <Form.Label className="fw-semibold mb-0">Date filter:</Form.Label>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DemoContainer
                  sx={{
                    "& .MuiFormControl-root": {
                      minWidth: "unset !important",
                    },
                  }}
                  components={["SingleInputDateRangeField"]}
                >
                  <DateRangePicker
                    sx={{
                      "& .MuiInputBase-root": {
                        paddingRight: 0,
                      },
                      "& .MuiInputBase-input": {
                        padding: ".5rem .75rem .5rem .75rem",
                        "&:hover": {
                          borderColor: "#dee2e6",
                        },
                      },
                    }}
                    value={selectedDateRange}
                    onChange={handleDateChange}
                    slots={{ field: SingleInputDateRangeField }}
                  />
                </DemoContainer>
              </LocalizationProvider>
              {selectedDateRange[0] && selectedDateRange[1] && (
                  <CancelIcon style={{ position: "absolute", right: "0", top: "39px" }} onClick={clearDateRange} />
                )}
            </Form.Group>
          </Col>
          <Col xs="auto" lg="3">
            <Form.Group>
              <Form.Label className="fw-semibold">Filter by Status:</Form.Label>
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
      </Form>
      <MDBRow className="px-3">
        <Card className="py-3">
          {loader ? (
            <Loader />
          ) : (
            <>
              {
                grnList && grnList.length !== 0 ? (
                  <div className="mt-2">
                    <DataTable
                      columns={columns}
                      rows={grnList}
                      page={page}
                      pageSize={pageSize}
                      totalPages={totalPages}
                      handleChange={handleChange}
                    />
                  </div>
                ) : (
                  <Alert
                    severity="warning"
                    sx={{ fontFamily: "monospace", fontSize: "18px" }}
                  >
                    Records is not Available for above filter
                  </Alert>
                )
              }
            </>
          )}
        </Card>
      </MDBRow>
    </Container>
  );
}
export default GRNManagement;
