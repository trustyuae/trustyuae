import React from "react";
import { Button, Modal, Table } from "react-bootstrap";

const ReleaseSchedulePoModal = ({
  handleCloseReleaseSchedulePoModal,
  showModal,
  OrderNotAvailable,
}) => {
  return (
    <div>
      <Modal show={showModal} onHide={handleCloseReleaseSchedulePoModal}>
        <Modal.Header closeButton>
          <Modal.Title>Selected Products</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Item Name</th>
                <th>Qty</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {OrderNotAvailable &&
                OrderNotAvailable.map((item, index) => (
                  <tr key={index}>
                    <td>{item.order_id}</td>
                    <td>{item.product_name || "NA"}</td>
                    <td>{item.quantity}</td>
                    <td>{item.customer_status}</td>
                  </tr>
                ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseReleaseSchedulePoModal}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReleaseSchedulePoModal;
