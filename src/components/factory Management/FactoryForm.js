import React, { useEffect, useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { Card } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { FactoryAdd } from "../../redux/actions/AllFactoryActions";

function FactoryForm() {
  const dispatch = useDispatch();
  const [factory, setFactory] = useState({
    factory_name: "",
    address: "",
    contact_person: "",
    contact_number: "",
    contact_email: "",
    bank_account_details: "",
  });

  useEffect(() => {
    handleSubmit();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFactory((prevFactory) => ({
      ...prevFactory,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    const factData = {
      factory_name: factory.factory_name,
      address: factory.address,
      contact_person: factory.contact_person,
      contact_number: factory.contact_number,
      contact_email: factory.contact_email,
      bank_account_details: factory.bank_account_details,
    };
    try {
      dispatch(FactoryAdd(factData));
      setFactory({
        factory_name: "",
        address: "",
        contact_person: "",
        contact_number: "",
        contact_email: "",
        bank_account_details: "",
      });
    } catch (error) {
      console.error("Error adding factory:", error);
    }
  };

  return (
    <div>
      <style>
        {`
                    .factory-card {
                        border: 1px solid #E0E0E0;
                        border-radius: 10px;
                        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.1);
                        background-color: #F9F9F9;
                    }
                    .factory-card-header {
                        background-color: #007BFF;
                        color: #fff;
                    }
                    .form-control {
                        border-radius: 5px;
                        border-color: #CED4DA;
                    }
                    .btn-submit {
                        margin-top: 20px;
                        background-color: #007BFF;
                        border-color: #007BFF;
                    }
                    .btn-submit:hover {
                        background-color: #0056B3;
                        border-color: #0056B3;
                    }
                `}
      </style>
      <Row className="justify-content-center mt-5">
        <Col md={6}>
          <Card className="factory-card">
            <Card.Header as="h5" className="factory-card-header">
              Add New Factory
            </Card.Header>
            <Card.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="formFactoryName">
                  <Form.Label>Factory Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter factory name"
                    name="factory_name"
                    value={factory.factory_name}
                    onChange={handleChange}
                    className="form-control"
                  />
                </Form.Group>
                <Form.Group className="mb-3" controlId="formFactoryAddress">
                  <Form.Label>Address</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter factory address"
                    name="address"
                    value={factory.address}
                    onChange={handleChange}
                    className="form-control"
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formFactoryContactPerson"
                >
                  <Form.Label>Contact Person</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact person"
                    name="contact_person"
                    value={factory.contact_person}
                    onChange={handleChange}
                    className="form-control"
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formFactoryContactNumber"
                >
                  <Form.Label>Contact Number</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter contact number"
                    name="contact_number"
                    value={factory.contact_number}
                    onChange={handleChange}
                    className="form-control"
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formFactoryContactEmail"
                >
                  <Form.Label>Contact Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter contact email"
                    name="contact_email"
                    value={factory.contact_email}
                    onChange={handleChange}
                    className="form-control"
                  />
                </Form.Group>
                <Form.Group
                  className="mb-3"
                  controlId="formFactoryBankAccountDetails"
                >
                  <Form.Label>Bank Account Details</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter bank account details"
                    name="bank_account_details"
                    value={factory.bank_account_details}
                    onChange={handleChange}
                    className="form-control"
                  />
                </Form.Group>
                <div className="text-center">
                  <Button
                    variant="primary"
                    type="submit"
                    className="btn-submit"
                  >
                    Add Factory
                  </Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
    // </Container>
  );
}
export default FactoryForm;
