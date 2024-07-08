import React, { useRef } from "react";
import { Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import { Box, Typography } from "@mui/material";
import { getCountryName } from "../../utils/GetCountryName";
import styled from "styled-components";

const PrintModal = ({ show, handleClosePrintModal, orderData }) => {
  const customerData = orderData && orderData[0];
  const modalRef = useRef(null);

  const downloadPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const cardWidth = 85;
    const cardHeight = 85;
    const borderWidth = 0.5; // Border width

    const cardX = (pageWidth - cardWidth) / 2;
    const cardY = (pageHeight - cardHeight) / 2;

    // Draw outer border of the card
    doc.setLineWidth(borderWidth);
    doc.setDrawColor(0); // Black border color
    doc.rect(cardX, cardY, cardWidth, cardHeight);

    // Fill background with light gray
    doc.setFillColor(255, 255, 255);
    doc.rect(
      cardX + borderWidth,
      cardY + borderWidth,
      cardWidth - 2 * borderWidth,
      cardHeight - 2 * borderWidth,
      "F"
    );

    const cardContentX = cardX + 5;
    const cardContentY = cardY + 10;

    const titleX = cardX + cardWidth / 2;
    const titleY = cardY + 10; // Adjust for vertical centering
    doc.setFontSize(16);
    doc.setTextColor(0); // Black text color

    // Print "Shipping Label" with bold font weight
    // doc.setFontStyle("bold");
    doc.text("Shipping Label", titleX, titleY, { align: "center" });

    // Draw horizontal line below "Shipping Label"
    doc.setLineWidth(0.3); // Set line width for the separator
    doc.line(cardX, titleY + 5, cardX + cardWidth, titleY + 5);

    
    doc.setFontSize(12); // Reduce font size for details// Reset font style
    // doc.setFontStyle("normal");

    // Draw horizontal line above address
    // doc.line(cardX, addressY - 5, cardX + cardWidth, addressY - 5);

    // Print customer details
    doc.text(`Order Id : ${customerData.order_id}`, cardContentX, titleY + 10);
    doc.text(
      `Customer Name :${customerData.customer_name} ${customerData?.last_name}`,
      cardContentX,
      titleY + 18
    );
    doc.text(
      `Contact Number : ${customerData.contact_no}`,
      cardContentX,
      titleY + 26
    );
    doc.text(
      `Country : ${getCountryName(customerData.shipping_country)}`,
      cardContentX,
      titleY + 34
    );

    doc.text(
      `Address : ${customerData.customer_shipping_address}`,
      cardContentX,
      titleY + 42
    );

    doc.text(
      `Shipping Method : ${customerData.shipping_method}`,
      cardContentX,
      titleY + 50
    );

    doc.setLineWidth(0.3); // Set line width for the separator
    doc.line(cardX, titleY + 55, cardX + cardWidth, titleY + 55);

    // Draw bottom border of the card
    doc.setLineWidth(borderWidth);
    doc.line(cardX, cardY + cardHeight, cardX + cardWidth, cardY + cardHeight);

    // Save the PDF with the name "invoice.pdf"
    doc.save("invoice.pdf");
  };

  const printModalContent = () => {
    window.print();
  };

  return (
    <Modal show={show} onHide={handleClosePrintModal} centered ref={modalRef}>
      <Modal.Header closeButton>
        <Box
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
          }}
        >
          <Title>Shipping Lable</Title>
        </Box>
      </Modal.Header>
      <Modal.Body>
        <div>
          {customerData && (
            <>
              <Box>
                <Typography
                  variant="label"
                  style={{
                    color: "#000000",
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  Order Id :{" "}
                </Typography>
                <Typography
                  variant="label"
                  style={{
                    color: "#7d6c71",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  {customerData.order_id}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="label"
                  style={{
                    color: "#000000",
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  Customer Name :{" "}
                </Typography>
                <Typography
                  variant="label"
                  style={{
                    color: "#7d6c71",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  {customerData.customer_name}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="label"
                  style={{
                    color: "#000000",
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  Contact Number :{" "}
                </Typography>
                <Typography
                  variant="label"
                  style={{
                    color: "#7d6c71",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  {customerData.contact_no}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="label"
                  style={{
                    color: "#000000",
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  Country :{" "}
                </Typography>
                <Typography
                  variant="label"
                  style={{
                    color: "#7d6c71",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  {getCountryName(customerData.shipping_country)}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="label"
                  style={{
                    color: "#000000",
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  Address:{" "}
                  <span
                    style={{
                      color: "#7d6c71",
                      fontSize: "20px",
                      fontWeight: "500",
                    }}
                  >
                    {customerData.customer_shipping_address.split(",")[0]}
                  </span>
                </Typography>
                <Typography
                  variant="label"
                  style={{
                    color: "#7d6c71",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  {customerData.customer_shipping_address
                    .split(",")
                    .slice(1)
                    .map((line, index) => (
                      <span
                        key={index}
                        style={{
                          display: "block",
                          marginLeft: "102px",
                        }}
                      >
                        {line.trim()}
                      </span>
                    ))}
                </Typography>
              </Box>
              <Box>
                <Typography
                  variant="label"
                  style={{
                    color: "#000000",
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  Shipping Method :{" "}
                </Typography>
                <Typography
                  variant="label"
                  style={{
                    color: "#7d6c71",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  {customerData.shipping_method}
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

const Title = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  font-size: 35px;
  font-weight: 700;
  color: #000000;
  align-self: "center";
`;
