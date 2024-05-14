import React from "react";
import { Button, Modal, Table } from "react-bootstrap";

const ReleaseSchedulePoModal = ({
  handleCloseReleaseSchedulePoModal,
  showModal,
  ordersNotAvailable,
  checkedItems,
  orderStatusMap
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
            {console.log(ordersNotAvailable,'ordersNotAvailableeeee')}
              {ordersNotAvailable &&
                ordersNotAvailable
                  .filter((order) => checkedItems.includes(order.id))
                  .map((item, index) => (
                    <tr key={index}>
                      <td>{item.order_id}</td>
                      <td>{item.product_name}</td>
                      <td>{item.quantity}</td>
                      <td>{orderStatusMap[item.order_id]}</td>
                    </tr>
                  ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseReleaseSchedulePoModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReleaseSchedulePoModal;
