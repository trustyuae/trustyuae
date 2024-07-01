import React, { isValidElement, useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Card, Container } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { FactoryAdd } from "../../redux/actions/AllFactoryActions";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../../utils/validation";
import { Box, Typography } from "@mui/material";

function FactoryForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [factory, setFactory] = useState({
    factory_name: "",
    address: "",
    contact_person: "",
    contact_number: "",
    contact_email: "",
    bank_account_details: "",
  });
  const [validated, setValidated] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFactory((prevFactory) => ({
      ...prevFactory,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault()
    const form = event?.currentTarget;
    if (form?.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    if (factory.contact_email && !isValidEmail(factory.contact_email)) {
      return
    }

    setValidated(true);
    const factData = {
      factory_name: factory.factory_name,
      address: factory.address,
      contact_person: factory.contact_person,
      contact_number: factory.contact_number,
      contact_email: factory.contact_email,
      bank_account_details: factory.bank_account_details,
    };
    try {
      if (form?.checkValidity()) {
        dispatch(FactoryAdd(factData, navigate));
        setFactory({
          factory_name: "",
          address: "",
          contact_person: "",
          contact_number: "",
          contact_email: "",
          bank_account_details: "",
        });
      }
    } catch (error) {
      console.error("Error adding factory:", error);
    }
  };

  return (
    <>
      <Container fluid className="py-3" style={{ maxHeight: "100%",height:'85vh' }}>
        <Box className="mb-4">
          <Typography variant="h4" className="fw-semibold">
            Add New Factory
          </Typography>
        </Box>
        <Card className="p-3 mb-3">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col xs="auto" lg="4">
                <Form.Group className="mb-3" controlId="formFactoryName">
                  <Form.Label className="fw-semibold">Factory Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter factory name"
                    name="factory_name"
                    value={factory.factory_name}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                  <Form.Control.Feedback type="invalid">Please enter factory name.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs="auto" lg="4">
                <Form.Group className="mb-3" controlId="formFactoryAddress">
                  <Form.Label className="fw-semibold">Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter factory address"
                    name="address"
                    value={factory.address}
                    onChange={handleChange}
                    className="form-control"
                  />
                  <Form.Control.Feedback type="invalid">Please enter factory address.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs="auto" lg="4">
                <Form.Group
                  className="mb-3"
                  controlId="formFactoryContactPerson"
                >
                  <Form.Label className="fw-semibold">Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact person"
                    name="contact_person"
                    value={factory.contact_person}
                    onChange={handleChange}
                    className="form-control"
                  />
                  <Form.Control.Feedback type="invalid">Please enter cntact person.</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-3">
              <Col xs="auto" lg="4">
                <Form.Group
                  className="mb-3"
                  controlId="formFactoryContactNumber"
                >
                  <Form.Label className="fw-semibold">Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact number"
                    name="contact_number"
                    value={factory.contact_number}
                    onChange={handleChange}
                    className="form-control"
                  />
                  <Form.Control.Feedback type="invalid">Please enter cpntact number.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs="auto" lg="4">
                <Form.Group
                  className="mb-3"
                  controlId="formFactoryContactEmail"
                >
                  <Form.Label className="fw-semibold">Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter contact email"
                    name="contact_email"
                    value={factory.contact_email}
                    onChange={handleChange}
                    className="form-control"
                  />
                  <Form.Control.Feedback type="invalid">Please entercontact email.</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col xs="auto" lg="4">
                <Form.Group
                  className="mb-3"
                  controlId="formFactoryBankAccountDetails"
                >
                  <Form.Label className="fw-semibold">Bank Account Details</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter bank account details"
                    name="bank_account_details"
                    value={factory.bank_account_details}
                    onChange={handleChange}
                    className="form-control"
                  />
                  <Form.Control.Feedback type="invalid">Please enter bank account details.</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md="12" className="d-flex justify-content-end">
                <Button
                  variant="primary"
                  type="submit"
                  className="btn-submit py-2 fw-bold"
                >
                  Add Factory
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
      </Container>
    </>
    
  );
}
export default FactoryForm;
