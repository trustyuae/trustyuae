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
  fetchFactoriesByFilterParam,
} from "../../Redux2/slices/FactoriesSlice";

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
  // const [loading, setLoading] = useState(false);

  const loading = useSelector((state) => state?.factory?.isLoading);

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

  const handleChange = (event, value) => {
    setPage(value);
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

  const columns = [
    { field: "factory_name", headerName: "Factory Name", flex: 1 },
    { field: "address", headerName: "Address", flex: 1 },
    { field: "contact_person", headerName: "Contact Person", flex: 1 },
    { field: "contact_number", headerName: "Contact Number", flex: 1 },
    { field: "contact_email", headerName: "Contact email", flex: 1 },
    {
      field: "bank_account_details",
      headerName: "Bank Account Details",
      flex: 1,
    },
    {
      field: "",
      headerName: "View Item",
      flex: 1,
      className: "order-system",
      type: "html",
      renderCell: (value, row) => {
        return (
          <Button
            type="button"
            className="w-auto w-auto bg-transparent border-0 text-secondary fs-5"
            onClick={() => handleEdit(row?.id)}
          >
            <FaEye className="mb-1" />
          </Button>
        );
      },
    },
  ];

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
