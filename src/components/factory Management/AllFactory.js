import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import EditFactoryModal from "./EditFactoryModal";
import { Button, Row } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import DataTable from "../DataTable";
import { Alert, Box, Typography } from "@mui/material";
import Loader from "../../utils/Loader";
import {
  factoryEdit,
  FactoryStatus,
  fetchFactoriesByFilterParam,
} from "../../Redux2/slices/FactoriesSlice";
import { clearStoreData, setCurrentPage } from "../../Redux2/slices/PaginationSlice";
import Swal from "sweetalert2";
import ShowAlert from "../../utils/ShowAlert";

function AllFactory() {
  const dispatch = useDispatch();
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [factoryName, setFactoryName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [factoryType, setFactoryType] = useState("");

  const loading = useSelector((state) => state?.factory?.isLoading);

  // const currentPage = useSelector((state) => state.pagination.currentPage);
  const currentPage =
    useSelector((state) => state.pagination.currentPage["AllFactory"]) || 1;

  const factoryData = useSelector(
    (state) => state?.factory?.factoriesWithParams
  );

  useEffect(() => {
    if (factoryData) {
      const factData = factoryData?.factories?.map((item) => ({ ...item }));
      setFactories(factData);
      setTotalPages(factoryData.total_pages);
    }
  }, [factoryData]);

  useEffect(() => {
    if (currentPage) {
      dispatch(clearStoreData({ tableId: 'AllFactory' }));
      setPage(currentPage);
    }
  }, [currentPage]);

  async function fetchFactories() {
    try {
      let apiUrl = `wp-json/custom-factory/v1/fetch-factories/?page=${page}&per_page=${pageSize}`;
      const params = {
        factory_name: factoryName,
        address: address,
        contact_person: contactPerson,
        contact_number: contactNumber,
        contact_email: email,
      };
      const response = dispatch(
        fetchFactoriesByFilterParam({ apiUrl, params })
      );
    } catch (error) {
      throw error;
    }
  }

  useEffect(() => {
    fetchFactories();
  }, [
    pageSize,
    page,
    factoryName,
    address,
    contactPerson,
    contactNumber,
    email,
  ]);

  const handleEdit = (factoryId) => {
    const factory = factories.find((f) => f.id === factoryId);
    setSelectedFactory(factory);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveEdit = async () => {
    const data = {
      factory_name: selectedFactory.factory_name,
      address: selectedFactory.address,
      contact_person: selectedFactory.contact_person,
      contact_number: selectedFactory.contact_number,
      contact_email: selectedFactory.contact_email,
      bank_account_details: selectedFactory.bank_account_details,
    };
    try {
      await dispatch(factoryEdit(selectedFactory, data));
      setFactories((prevFactories) => {
        return prevFactories.map((factory) => {
          if (factory.id === selectedFactory.id) {
            return { ...factory, ...data };
          }
          return factory;
        });
      });
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating factory:", error);
    }
  };

  const handleStatus = async (Data) => {
    const confirmation = await Swal.fire({
      title: `Are you sure, you want to Update Factory Status?`,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
      allowOutsideClick: false,
      allowEscapeKey: false,
    });

    if (confirmation.isConfirmed) {
      dispatch(FactoryStatus(Data.id)).then(({ payload }) => {
        if (payload?.status == 200) {
          ShowAlert(
            "Factory Status Updated Successfully!",
            "",
            "success",
            false,
            false,
            "",
            "",
            2000
          );
          fetchFactories();
        } else {
          ShowAlert(
            "Error while updating Factory Status",
            "",
            "error",
            false,
            false,
            "",
            "",
            2000
          );
        }
      });
    } else if (confirmation.isDismissed) {
      return;
    }
  };

  const columns = [
    {
      field: "factory_name",
      headerName: "Factory Name",
      flex: 1,
      className: "factory-status",
    },
    {
      field: "address",
      headerName: "Address",
      flex: 1,
      className: "factory-status",
    },
    {
      field: "contact_person",
      headerName: "Contact Person",
      flex: 1,
      className: "factory-status",
    },
    {
      field: "contact_number",
      headerName: "Contact Number",
      flex: 1,
      className: "factory-status",
    },
    {
      field: "contact_email",
      headerName: "Contact email",
      flex: 1,
      className: "factory-status",
    },
    {
      field: "bank_account_details",
      headerName: "Bank Account Details",
      flex: 1,
      className: "factory-status",
    },
    {
      field: "",
      headerName: "View Item",
      flex: 1,
      className: "factory-status",
      type: "html",
      renderCell: (params, row) => {
        console.log(params.row,"params.row")
        const FactoryStatus = params.row.inactive;
        return (
          <Box display="flex" justifyContent="center" alignItems="center">
            <Button
              type="button"
              className="w-auto w-auto bg-transparent border-0 text-secondary fs-5"
              onClick={() => handleEdit(row?.id)}
            >
              <FaEye className="mb-1" />
            </Button>
            {FactoryStatus && FactoryStatus === "0" ? (
              <Button
                size="small"
                variant="primary"
                color="primary"
                onClick={() => handleStatus(params.row)}
                className="buttonStyle"
              >
                InActive
              </Button>
            ) : (
              <Button
                size="small"
                variant="secondary"
                color="primary"
                onClick={() => handleStatus(params.row)}
                className="buttonStyle"
              >
                Active
              </Button>
            )}
          </Box>
        );
      },
    },
  ];

  const searchFactoryTypeFilter = (e) => {
    setFactoryType(e);
    setPage(1);
  };

  const handleChange = (event, value) => {
    // dispatch(setCurrentPage(value));
    dispatch(setCurrentPage({ tableId: "AllFactory", page: value }));
  };

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          All Factory List
        </Typography>
      </Box>
      <MDBRow className="d-flex justify-content-start align-items-center mb-3">
        <MDBCol md="2">
          <Form.Label className="me-2 fw-semibold">Factory Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search Factory Name"
            value={factoryName}
            onChange={(e) => setFactoryName(e.target.value)}
            className="custom-placeholder"
          />
        </MDBCol>
        <MDBCol md="3">
          <Form.Label className="me-2 fw-semibold">Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="custom-placeholder"
          />
        </MDBCol>
        <MDBCol md="2">
          <Form.Label className="me-2 fw-semibold">Contact person</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search Contact Person"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
            className="custom-placeholder"
          />
        </MDBCol>
        <MDBCol md="2">
          <Form.Label className="me-2 fw-semibold">Contact Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search Contact Number"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
            className="custom-placeholder"
          />
        </MDBCol>
        <MDBCol md="3">
          <Form.Label className="me-2 fw-semibold">Contact email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="custom-placeholder"
          />
        </MDBCol>
      </MDBRow>
      <MDBRow className="d-flex justify-content-end align-items-center mb-3">
        <MDBCol md="3">
          <Form.Group>
            <Form.Label className="fw-semibold">Factory type:</Form.Label>
            <Form.Select
              className="mr-sm-2 py-2"
              onChange={(e) => searchFactoryTypeFilter(e.target.value)}
            >
              <option value="">Select Factory Type</option>
              <option value="all">Active</option>
              <option value="dispatch">InActive</option>
            </Form.Select>
          </Form.Group>
        </MDBCol>
      </MDBRow>
      <Row>
        <div className="mt-2">
          {loading ? (
            <Loader />
          ) : factories && factories.length !== 0 ? (
            <div className="mt-2">
              <DataTable
                columns={columns}
                rows={factories}
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
              Factory Records are not Available
            </Alert>
          )}
        </div>
      </Row>
      <EditFactoryModal
        show={showEditModal}
        handleCloseEditModal={handleCloseEditModal}
        selectedFactory={selectedFactory}
        handleSaveEdit={handleSaveEdit}
        setSelectedFactory={setSelectedFactory}
      />
    </Container>
  );
}

export default AllFactory;
