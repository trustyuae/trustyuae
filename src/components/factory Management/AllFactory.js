import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import EditFactoryModal from "./EditFactoryModal";
import { AllFactoryActions, FactoryEdit } from "../../redux/actions/AllFactoryActions";
import { Button, Row } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import DataTable from "../DataTable";
import { Box, Typography } from "@mui/material";

function AllFactory() {
  const dispatch = useDispatch();
  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );

  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const [factoryName, setFactoryName] = useState("");
  const [address, setAddress] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    dispatch(AllFactoryActions());
  }, [dispatch]);

  useEffect(() => {
    if (Array.isArray(allFactoryDatas)) {
      console.log(allFactoryDatas,'allFactoryDatas=====');
      let data = allFactoryDatas.map((v, i) => ({ ...v, id: i }));
      setFactories(data);
    }
  }, [allFactoryDatas]);

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
      await dispatch(FactoryEdit(selectedFactory, data));
      setFactories(prevFactories => {
        return prevFactories.map(factory => {
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

  const filteredProducts = factories.filter(
    (factory) =>
      factory.factory_name.toLowerCase().includes(factoryName.toLowerCase()) &&
      (factory?.address
        ? factory.address.toLowerCase().includes(address.toLowerCase())
        : true) &&
      (factory?.contact_person
        ? factory.contact_person.toLowerCase().includes(contactPerson.toLowerCase())
        : true) &&
      (factory?.contact_person
        ? factory.contact_number.toLowerCase().includes(contactNumber.toLowerCase())
        : true) &&
      (factory?.contact_email
        ? factory.contact_email.toLowerCase().includes(email.toLowerCase())
        : true)
  );

  const columns = [
    { field: "factory_name", headerName: "factory name", flex: 1 },
    { field: "address", headerName: "address", flex: 1 },
    { field: "contact_person", headerName: "contact person", flex: 1 },
    { field: "contact_number", headerName: "contact Number", flex: 1 },
    { field: "contact_email", headerName: "contact email", flex: 1 },
    { field: "bank_account_details", headerName: "bank account details", flex: 1 },
    {
      field: "view_item",
      headerName: "View Item",
      flex: 1,
      className: "order-system",
      type: "html",
      renderCell: (value, row) => {
        console.log(value,'value');
        return (
            <Button type="button" className="w-auto w-auto bg-transparent border-0 text-secondary fs-5"
            onClick={() => handleEdit(value.row.id)}
            >
              <FaEye className="mb-1" />
            </Button>
        );
      },
    },
  ];
  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%"}}>
      <Box className="mb-4">
          <Typography variant="h4" className="fw-semibold">
          All Factory List
          </Typography>
        </Box>
      <MDBRow className="d-flex justify-content-start align-items-center mb-3">
        <MDBCol md="2">
          <Form.Label className="me-2">Factory Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product ID"
            value={factoryName}
            onChange={(e) => setFactoryName(e.target.value)}
          />
        </MDBCol>
        <MDBCol md="2">
          <Form.Label className="me-2">Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product Name"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </MDBCol>
        <MDBCol md="2">
          <Form.Label className="me-2">Contact person</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product Name"
            value={contactPerson}
            onChange={(e) => setContactPerson(e.target.value)}
          />
        </MDBCol>
        <MDBCol md="2">
          <Form.Label className="me-2">Contact Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product Name"
            value={contactNumber}
            onChange={(e) => setContactNumber(e.target.value)}
          />
        </MDBCol>
        <MDBCol md="2">
          <Form.Label className="me-2">Contact email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product Name"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </MDBCol>
      </MDBRow>

      {/* <MDBRow className="d-flex justify-content-center align-items-center">
        <MDBCol col="10" md="12" sm="12"></MDBCol>
        <Table
          striped
          bordered
          hover
          style={{ boxShadow: "4px 4px 11px 0rem rgb(0 0 0 / 25%)" }}
        >
          <thead>
            <tr className="table-headers">
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                factory name
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                address
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                contact person
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                contact number
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                contact_email
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                bank_account_details
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((factory, index) => (
              <tr key={index}>
                <td className="text-center">{factory.factory_name}</td>
                <td className="text-center">{factory.address}</td>
                <td className="text-center">{factory.contact_person}</td>
                <td className="text-center">{factory.contact_number}</td>
                <td className="text-center">{factory.contact_email}</td>
                <td className="text-center">{factory.bank_account_details}</td>
                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-primary mr-2"
                    onClick={() => handleEdit(factory.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </MDBRow> */}
      <Row>
      <div className="mt-2">
        <DataTable
          columns={columns}
          rows={filteredProducts}
          // rows={factories}
          // page={page}
          // pageSize={pageSize}
          // totalPages={totalPages}
          // handleChange={handleChange}
        />
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
