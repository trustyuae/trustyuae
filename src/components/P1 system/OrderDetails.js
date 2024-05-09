import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import PrintModal from "./PrintModal";
import { getCountryName } from "../../utils/GetCountryName";
import Swal from "sweetalert2";

function OrderDetails() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  // const orderProcess = orderData && orderData.length > 0 ? orderData[0]?.order_process : null;
  // console.log(orderProcess,'orderD')
  const [orderProcess, setOrderProcess] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const navigate = useNavigate();

  const apiUrl = `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-orders-new/v1/orders/?orderid=${id}`;
  const username = "ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a";
  const password = "cs_8dcdba11377e29282bd2b898d4a517cddd6726fe";

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(apiUrl, {
          auth: {
            username: username,
            password: password,
          },
        });
        console.log(response.data.orders, 'response');
        setOrderData(response.data.orders);
        const order = response.data.orders[0];
        if (order) {
          setOrderProcess(order.order_process); // Update order process state
        }
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchOrder();
  }, [apiUrl]);
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };
  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };
  const handlePrint = (orderId) => {
    const order = orderData?.find((o) => o.id === orderId);
    setSelectedOrder(order);
    setShowModal(true);
  };
  const handleClosePrintModal = () => {
    setShowModal(false);
  };
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  useEffect(() => {
    if (selectedFile !== null) {
      handleAttachButtonClick();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedFile])

  const handleAttachButtonClick = async () => {
    try {
      const fileInput = document.getElementById("imageFile");
      if (fileInput) {
        fileInput.click();
      } else {
        console.error("File input element not found.");
      }
      const { user_id } = userData ?? {};
      if (!selectedFile) {
        console.error("No file selected.");
        return;
      }
      // Prepare request data
      const requestData = new FormData();
      requestData.append("dispatch_image", selectedFile);
      const response = await axios.post(
        `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-order-attachment/v1/insert-attachment/${user_id}/${id}`, requestData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response.data, "Attachment API response");
      setSelectedFile(null)
    } catch (error) {
      console.error("Error while attaching file:", error);
    }
  };
  const userData = JSON.parse(localStorage.getItem('user_data')) ?? {}; // Set default value to an empty object if userData is null

  const handleClick = async () => {
    const currentDate = new Date();
    const currentDateTimeString = currentDate.toISOString().slice(0, 19).replace('T', ' ');
    const { user_id } = userData;
    const orderId = parseInt(id, 10);
    const started = "started"
    const requestData = {
      order_id: orderId,
      user_id: user_id,
      start_time: currentDateTimeString,
      end_time: '',
      order_status: started
    };
    axios.post('https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-order-pick/v1/insert-order-pickup/', requestData)
      .then(response => {
        console.log(response, 'response');
        console.log('API request successful');
      })
      .catch(error => {
        console.error('There was a problem with the API request:', error);
      });
  };

  const handleFinishButtonClick = async () => {
    try {
      // Swal.fire({
      //   text: "error",
      // });
      const { user_id } = userData ?? {};
      const response = await axios.post(
        `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-order-finish/v1/finish-order/${user_id}/${id}`);
      console.log(response.data, "finish API response");
      if (response.data.status == "Completed") {
        Swal.fire({
          text: response.data?.message
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/ordersystem");
          }
        });
      }
      if (response.data.status == "Dispatch Image") {
        Swal.fire({
          text: response.data?.message
        });
      }
      if (response.data.status == "P2") {
        Swal.fire({
          text: response.data?.message
        });
      }
    } catch (error) {
      console.error("Error while attaching file:", error);
    }
  }

  const variant = (e) => {
    const matches = e.match(/"display_key";s:\d+:"([^"]+)";s:\d+:"display_value";s:\d+:"([^"]+)";/);
    if (matches) {
      const key = matches[1];
      const value = matches[2].replace(/<[^>]*>/g, ''); // Remove HTML tags
      return `${key}: ${value}`;
    } else {
      return "Variant data not available";
    }
  } 

  return (
    <>
      <Container fluid className="px-5" style={{ height: "98vh" }}>
        <h3 className="fw-bold text-center py-3 ">Order ID -{id}</h3>
        <MDBRow>
          <MDBCol md="12" className="d-flex justify-content-end">
            <button
              type="button"
              className="btn btn-primary me-3"
              onClick={handlePrint}
            >
              Print
            </button>
            {orderProcess === "started" ? (
              <Button variant="success" disabled>Start</Button>
            ) : (
              <Button variant="success" onClick={handleClick}>Start</Button>
            )}
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="d-flex justify-content-start">
            <h3 className="fw-bold text-center py-3 ">Shipping Address</h3>
          </MDBCol>
        </MDBRow>
        <MDBRow className="d-flex justify-content-center align-items-center">
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
                  Customer name
                </th>
                <th
                  style={{
                    backgroundColor: "#DEE2E6",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Address
                </th>
                <th
                  style={{
                    backgroundColor: "#DEE2E6",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Country
                </th>
              </tr>
            </thead>
            <tbody>
              {orderData?.map((order, index) => (
                <tr key={index}>
                  <td className="text-center">{order.customer_name}</td>
                  <td className="text-center">{order.customer_shipping_address}</td>
                  <td className="text-center">{getCountryName(order.shipping_country)}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </MDBRow>
        <MDBRow>
          <MDBCol md="4">
            <h3 className="fw-bold text-center py-3 ">Order Details</h3>
          </MDBCol>
        </MDBRow>
        <MDBRow className="d-flex justify-content-center align-items-center">
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
                  Name
                </th>
                <th
                  style={{
                    backgroundColor: "#DEE2E6",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Variant Details
                </th>
                <th
                  style={{
                    backgroundColor: "#DEE2E6",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Image
                </th>
                <th
                  style={{
                    backgroundColor: "#DEE2E6",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Qty
                </th>
                <th
                  style={{
                    backgroundColor: "#DEE2E6",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  Dispatch type
                </th>
              </tr>
            </thead>
            <tbody>
              {orderData?.map((order, index) => (
                order?.items.map((product, index1) => (
                  <tr key={`${index}-${index1}`}>
                    <td className="text-center">{product.product_name}</td>
                    <td className="text-center">{variant(product.variation_value)}</td>
                    
                    <td className="text-center">
                      <span onClick={() => ImageModule(product.product_image)}>
                        <img
                          src={product.product_image}
                          alt={product.product_name}
                          style={{ maxWidth: "100px", cursor: "pointer" }}
                        />
                      </span>
                    </td>
                    <td className="text-center">{product.quantity}</td>
                    <td className="text-center">{product.dispatch_type}</td>
                  </tr>
                ))
              ))}
            </tbody>
          </Table>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="d-flex ">
            <div className="alert alert-primary z-0" role="alert">
              <label>Customer Note:-</label>
              "There is a customer note!"
            </div>
          </MDBCol>
        </MDBRow>
        <MDBRow>
          <MDBCol md="12" className="d-flex justify-content-end">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileSelect}
              capture
              style={{ display: "none" }}
              id="imageFile"
            />
            <Button
              variant="primary"
              className="  me-3"
              onClick={handleAttachButtonClick}
            >
              Attach
            </Button>
            <Button variant="danger" onClick={handleFinishButtonClick}>Finish</Button>
          </MDBCol>
        </MDBRow>
        <Modal
          show={showEditModal}
          onHide={handleCloseEditModal}
          style={{ marginTop: "130px" }}
        >
          <Modal.Header closeButton>
            <Modal.Title>Product Image</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card className="factory-card">
              <img src={imageURL} alt="Product" />
            </Card>
          </Modal.Body>
        </Modal>
        <PrintModal
          show={showModal}
          handleClosePrintModal={handleClosePrintModal}
          showModal={showModal}
          selectedOrder={selectedOrder}
          orderData={orderData}
        />
      </Container>
    </>
  );
}
export default OrderDetails;