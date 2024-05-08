import React, { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import { Box, Typography } from "@mui/material";
import { getCountryName } from "../../utils/GetCountryName";

const PrintModal = ({ show, handleClosePrintModal, orderData, backdrop }) => {
  const customerData = orderData && orderData[0]
  console.log(orderData, "orderDataaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa////////////");
  const modalRef = useRef(null);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight(); 
    const cardWidth = 140; 
    const cardHeight = 60; 
    const cardX = (pageWidth - cardWidth) / 2; 
    const cardY = (pageHeight - cardHeight) / 2; 
    doc.setFillColor(200, 200, 200); 
    doc.rect(cardX, cardY, cardWidth, cardHeight, "F"); 
    const cardContentX = cardX + 5; 
    const cardContentY = cardY + 10; 

    doc.setTextColor(0, 0, 0); 
    doc.text(`Order Id: ${customerData.order_id}`, cardContentX, cardContentY);
    doc.text(
      `Customer Name: ${customerData.customer_name} ${customerData?.last_name}`,
      cardContentX,
      cardContentY + 10
    );
    doc.text(
      `Contact Number: ${customerData.contact_no}`,
      cardContentX,
      cardContentY + 20
    ); 
    doc.text(
      `Country: ${getCountryName(customerData.shipping_country)}`,
      cardContentX,
      cardContentY + 30
    );
    doc.text(
      `Address: ${customerData.customer_shipping_address}`,
      cardContentX,
      cardContentY + 40
    );
    doc.save("invoice.pdf");
  };

  const printModalContent = () => {
    window.print();
  };

  return (
    <Modal
      show={show}
      onHide={handleClosePrintModal}
      centered
      ref={modalRef}
    >
      <Modal.Header closeButton>
        <Modal.Title>Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {customerData && (
            <>
              <Box>
                <Typography variant="label" style={{ color: '#bf4f74' }} className="fw-semibold fs-5">
                  Order Id:{" "}
                </Typography>
                <Typography variant="label" className="fw-semibold fs-5">
                  {customerData.order_id}
                </Typography>
              </Box><Box>
                <Typography variant="label" style={{ color: '#bf4f74' }} className="fw-semibold fs-5">
                  Customer Name:{" "}
                </Typography>
                <Typography variant="label" className="fw-semibold fs-5">
                  {customerData.customer_name}
                </Typography>
              </Box><Box>
                <Typography variant="label" style={{ color: '#bf4f74' }} className="fw-semibold fs-5">
                  Contact Number:{" "}
                </Typography>
                <Typography variant="label" className="fw-semibold fs-5">
                  {customerData.contact_no}
                </Typography>
              </Box><Box>
                <Typography variant="label" style={{ color: '#bf4f74' }} className="fw-semibold fs-5">
                  Country:{" "}
                </Typography>
                <Typography variant="label" className="fw-semibold fs-5">
                  {getCountryName(customerData.shipping_country)}
                </Typography>
              </Box><Box>
                <Typography variant="label" style={{ color: '#bf4f74' }} className="fw-semibold fs-5">
                  Address:{" "}
                </Typography>
                <Typography variant="label" className="fw-semibold fs-5">
                  {customerData.customer_shipping_address}
                </Typography>
              </Box>
            </>
          )}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClosePrintModal}>
          Close
        </Button>
        <Button variant="primary" onClick={printModalContent}>
          Print
        </Button>
        <Button variant="primary" onClick={downloadPDF}>
          Download PDF
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PrintModal;
