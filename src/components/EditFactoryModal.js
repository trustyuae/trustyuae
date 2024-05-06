import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

function EditFactoryModal({ show, handleCloseEditModal, selectedFactory, setSelectedFactory, handleSaveEdit }) {
  return (
    <Modal show={show} onHide={handleCloseEditModal} className="d-flex justify-content-center" >
      <Modal.Header closeButton>
        <Modal.Title>Edit Product</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form style={{ width: '466px' }}>
          <Form.Group className="mb-3" controlId="factory_name">
            <Form.Label>Factory Name</Form.Label>
            <Form.Control
              type="text"
              defaultValue={selectedFactory?.factory_name}
              onChange={(e) =>
                setSelectedFactory({
                  ...selectedFactory,
                  factory_name: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="address">
            <Form.Label>Address</Form.Label>
            <Form.Control
              type="text"
              defaultValue={selectedFactory?.address}
              onChange={(e) =>
                setSelectedFactory({
                  ...selectedFactory,
                  address: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="contact_person">
            <Form.Label>Contact Person</Form.Label>
            <Form.Control
              type="text"
              defaultValue={selectedFactory?.contact_person}
              onChange={(e) =>
                setSelectedFactory({
                  ...selectedFactory,
                  contact_person: e.target.value,
                })
              }
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="contact_person">
              <Form.Label>contact person</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedFactory?.contact_person}
                onChange={(e) =>
                  setSelectedFactory({
                    ...selectedFactory,
                    contact_person: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contact_number">
              <Form.Label>contact number</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedFactory?.contact_number}
                onChange={(e) =>
                  setSelectedFactory({
                    ...selectedFactory,
                    contact_number: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contact_email">
              <Form.Label>contact email</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedFactory?.contact_email}
                onChange={(e) =>
                  setSelectedFactory({
                    ...selectedFactory,
                    contact_email: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="bank_account_details">
              <Form.Label>bank account details</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedFactory?.bank_account_details}
                onChange={(e) =>
                  setSelectedFactory({
                    ...selectedFactory,
                    bank_account_details: e.target.value,
                  })
                }
              />
            </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseEditModal}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSaveEdit}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default EditFactoryModal;