import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useParams } from "react-router-dom";
import { Card } from "react-bootstrap";
import PrintModal from "./PrintModal";
import countries from 'iso-3166-1-alpha-2';

function OrderDetails() {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const apiUrl = `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/wc/v3/orders/${id}`;
  const username = "ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a";
  const password = "cs_8dcdba11377e29282bd2b898d4a517cddd6726fe";

  const getCountryName = code => {
    const country = countries.getCountry(code);
    return country ? country : 'Unknown';
  };
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(apiUrl, {
          auth: {
            username: username,
            password: password,
          },
        });
        setOrderData([response.data]);
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

  const handleAttachButtonClick = () => {
    const fileInput = document.getElementById("imageFile");
    if (fileInput) {
      fileInput.click();
    } else {
      console.error("File input element not found.");
    }
  };

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
            <Button variant="success">Start</Button>
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
                  Address
                </th>
                <th
                  style={{
                    backgroundColor: "#DEE2E6",
                    padding: "8px",
                    textAlign: "center",
                  }}
                >
                  City
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
                  <td className="text-center">{order.billing?.address_1}</td>
                  <td className="text-center">{order.billing?.city}</td>
                  <td className="text-center">{getCountryName(order.billing?.country)}</td>
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
              {orderData?.map((order, index) =>
                order.line_items?.map((item, subIndex) => {
                  const sizeObject = item.meta_data?.find(
                    (meta) => meta.key === "pa_size"
                  );
                  const size = sizeObject ? sizeObject.value : "N/A";
                  const reducedStockObject = item.meta_data?.find(
                    (meta) => meta.key === "_reduced_stock"
                  );
                  const reducedStock = reducedStockObject
                    ? reducedStockObject.value
                    : "N/A";
                  return (
                    <tr key={`${index}-${subIndex}`}>
                      <td className="text-center">{item.name}</td>
                      <td className="text-center">
                        Size:{size} , Reduced Stock:{reducedStock}{" "}
                      </td>
                      <td className="text-center">
                        {item.image.src && (
                          <span onClick={() => ImageModule(item.image.src)}>
                            <img
                              src={item.image.src}
                              alt={item.name}
                              style={{ maxWidth: "100px", cursor: "pointer" }}
                            />
                          </span>
                        )}
                      </td>
                      <td className="text-center">{item.quantity}</td>
                      <td className="text-center"></td>
                    </tr>
                  );
                })
              )}
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
            <Button variant="danger">Finish</Button>
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
