import React, { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import countries from "iso-3166-1-alpha-2";
import { Box, Typography } from "@mui/material";

const PrintModal = ({ show, handleClosePrintModal, orderData, backdrop }) => {
  const customerData = orderData && orderData[0]?.billing;
  const orderId = orderData && orderData[0].id;
  console.log(orderId, "OrderId");
  const modalRef = useRef(null);

  const getCountryName = (code) => {
    const country = countries.getCountry(code);
    return country ? country : "Unknown";
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Calculate center of the page
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Start card content
    const cardWidth = 120; // Width of the card
    const cardHeight = 60; // Height of the card
    const cardX = (pageWidth - cardWidth) / 2; // Centering horizontally
    const cardY = (pageHeight - cardHeight) / 2; // Centering vertically
    doc.setFillColor(200, 200, 200); // Card background color
    doc.rect(cardX, cardY, cardWidth, cardHeight, "F"); // Draw card background
    const cardContentX = cardX + 5; // Padding for card content
    const cardContentY = cardY + 10; // Padding for card content

    // Set font color
    doc.setTextColor(0, 0, 0); // Black color

    // Print the modal content in the card
    doc.text(`Order Id: ${orderId}`, cardContentX, cardContentY);
    doc.text(
      `Customer Name: ${customerData?.first_name} ${customerData?.last_name}`,
      cardContentX,
      cardContentY + 10
    );
    doc.text(
      `Contact Number: ${customerData?.phone}`,
      cardContentX,
      cardContentY + 20
    ); // Adjusting y position for the next line
    doc.text(
      `Country: ${getCountryName(customerData.country)}`,
      cardContentX,
      cardContentY + 30
    );
    doc.text(
      `Address: ${customerData?.address_1} ${customerData?.city}`,
      cardContentX,
      cardContentY + 40
    ); // Adjusting y position for the next line

    // Save the PDF
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
          {customerData && orderId && (
            <>
              <Box>
                <Typography variant="label" style={{ color: '#bf4f74' }} className="fw-semibold fs-5">
                  Order Id:{" "}
                </Typography>
                <Typography variant="label" className="fw-semibold fs-5">
                  {orderId}
                </Typography>
              </Box><Box>
                <Typography variant="label" style={{ color: '#bf4f74' }} className="fw-semibold fs-5">
                  Customer Name:{" "}
                </Typography>
                <Typography variant="label" className="fw-semibold fs-5">
                  {customerData.first_name} {customerData.last_name}
                </Typography>
              </Box><Box>
                <Typography variant="label" style={{ color: '#bf4f74' }} className="fw-semibold fs-5">
                  Contact Number:{" "}
                </Typography>
                <Typography variant="label" className="fw-semibold fs-5">
                  {customerData.phone}
                </Typography>
              </Box><Box>
                <Typography variant="label" style={{ color: '#bf4f74' }} className="fw-semibold fs-5">
                  Country:{" "}
                </Typography>
                <Typography variant="label" className="fw-semibold fs-5">
                  {getCountryName(customerData.country)}
                </Typography>
              </Box><Box>
                <Typography variant="label" style={{ color: '#bf4f74' }} className="fw-semibold fs-5">
                  Address:{" "}
                </Typography>
                <Typography variant="label" className="fw-semibold fs-5">
                  {customerData.address_1} {customerData.city}
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
