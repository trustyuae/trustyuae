import React, { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import styled from "styled-components";

const PrintModal = ({ show, handleClosePrintModal, orderData, backdrop }) => {
  const customerData = orderData && orderData[0]?.billing;
  const modalRef = useRef(null);

  const downloadPDF = () => {
    const doc = new jsPDF();
  
    // Calculate center of the page
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
  
    // Start card content
    const cardWidth = 120; // Width of the card
    const cardHeight = 50; // Height of the card
    const cardX = (pageWidth - cardWidth) / 2; // Centering horizontally
    const cardY = (pageHeight - cardHeight) / 2; // Centering vertically
    doc.setFillColor(200, 200, 200); // Card background color
    doc.rect(cardX, cardY, cardWidth, cardHeight, "F"); // Draw card background
    const cardContentX = cardX + 5; // Padding for card content
    const cardContentY = cardY + 10; // Padding for card content
  
    // Set font color
    doc.setTextColor(0, 0, 0); // Black color
  
    // Print the modal content in the card
    doc.text(`Customer Name: ${customerData?.first_name} ${customerData?.last_name}`, cardContentX, cardContentY);
    doc.text(`Contact Number: ${customerData?.phone}`, cardContentX, cardContentY + 10); // Adjusting y position for the next line
    doc.text(`Address: ${customerData?.address_1} ${customerData?.city}`, cardContentX, cardContentY + 20); // Adjusting y position for the next line
  
    // Save the PDF
    doc.save('invoice.pdf');
  };
  
  

  const printModalContent = () => {
    window.print();
  };

  return (
    <Modal show={show} onHide={handleClosePrintModal} centered ref={modalRef}>
      <Modal.Header closeButton>
        <Modal.Title className="text-center">Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div className="justify-content-center">
          {customerData && (
            <>
              <Name>
                Customer Name:
                <span style={{ color: "black" }}>
                  {" "}
                  {customerData.first_name} {customerData.last_name}{" "}
                </span>
              </Name>
              <PhoneNu>
                Contact Number:
                <span style={{ color: "black" }}> {customerData.phone} </span>
              </PhoneNu>
              <Address>
                Address:
                <span style={{ color: "black" }}>
                  {" "}
                  {customerData.address_1} {customerData.city}
                </span>{" "}
              </Address>
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

const Name = styled.h1`
  font-size: 1.5em;
  text-align: center;
  color: #bf4f74;
`;

const PhoneNu = styled.h2`
  font-size: 1.5em;
  text-align: center;
  color: #bf4f74;
`;

const Address = styled.h3`
  font-size: 1.5em;
  text-align: center;
  color: #bf4f74;
`;
