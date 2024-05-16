import { Box } from "@mui/material";
import React, { useState } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
import { useDispatch } from "react-redux";
import { OrderNotAvailableDataPo } from "../../redux/actions/P2SystemActions";

const ReleaseSchedulePoModal = ({
  handleCloseReleaseSchedulePoModal,
  showModal,
  OrderNotAvailable,
}) => {
  const [dateFilter, setDateFilter] = useState("");
  const dispatch = useDispatch()

  const handleDateChange = (e) => {
    setDateFilter(e.target.value);
  };

  // const reminderDatee =
  // const handleFinishButtonClick = async () => {
  //   try {
  //     const { user_id } = userData ?? {};

  //     await dispatch(CustomOrderFinish({ user_id, id }))
  //       .then((response) => {
  //         if (response.data.status == "Completed") {
  //           Swal.fire({
  //             text: response.data?.message,
  //           }).then((result) => {
  //             if (result.isConfirmed) {
  //               navigate("/ordersystem");
  //             }
  //           });
  //         }
  //         if (response.data.status == "Dispatch Image") {
  //           Swal.fire({
  //             text: response.data?.message,
  //           });
  //         }
  //         if (response.data.status == "P2") {
  //           Swal.fire({
  //             text: response.data?.message,
  //           });
  //         }
  //       })
  //       .catch((error) => {
  //         console.error(error);
  //       });
  //   } catch (error) {
  //     console.error("Error while attaching file:", error);
  //   }
  // };

  const handleSubmitReleaseSchedulePoModal=async()=>{
    try {
    const poId = OrderNotAvailable.map((order) =>order.po_id)
  const orderId = OrderNotAvailable.map(order => order.order_id);
  const productId =  OrderNotAvailable.map(order => order.product_id);
  const productQuantity =  OrderNotAvailable.map(order => order.quantity);
  const customerStatus = OrderNotAvailable.map(order => order.customer_status);
  const reminder = dateFilter;
  await dispatch(OrderNotAvailableDataPo({
    po_id:poId,
    order_id:orderId,
    product_id:productId,
    quantity:productQuantity,
    customer_status:customerStatus,
    reminder_date:reminder
  }))
    }catch{

    }

  }
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
          <Box md="2" className="d-flex justify-content-center">
            <Form.Label className="me-2">Reminder Date</Form.Label>
            <Form.Control
              type="date"
              value={dateFilter}
              onChange={handleDateChange}
            />
          </Box>
          <Button
            variant="secondary"
            onClick={handleCloseReleaseSchedulePoModal}
          >
            Close
          </Button>
          <Button
            variant="secondary"
            onClick={handleSubmitReleaseSchedulePoModal}
          >
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReleaseSchedulePoModal;
