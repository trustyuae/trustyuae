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

    // Page and card dimensions
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const cardWidth = 85;
    const cardHeight = 100;
    const borderWidth = 0.7;

    const cardX = (pageWidth - cardWidth) / 2;
    const cardY = (pageHeight - cardHeight) / 2;

    // Draw card border
    doc.setLineWidth(borderWidth);
    doc.setDrawColor(0); // Black border color
    doc.rect(cardX, cardY, cardWidth, cardHeight);

    // Fill card background
    doc.setFillColor(255, 255, 255); // White background
    doc.rect(
      cardX + borderWidth,
      cardY + borderWidth,
      cardWidth - 2 * borderWidth,
      cardHeight - 2 * borderWidth,
      "F"
    );

    // Title: "Shipping Label"
    const titleX = cardX + cardWidth / 2;
    const titleY = cardY + 10;
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0); // Black text color
    doc.text("Shipping Label", titleX, titleY, { align: "center" });

    // Horizontal separator below title
    doc.setLineWidth(0.3);
    doc.line(cardX + 5, titleY + 5, cardX + cardWidth - 5, titleY + 5);

    // Content starting position
    let contentX = cardX + 5;
    let contentY = titleY + 10; // Start below the title and separator
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    // Utility function to add text line-by-line for comma-separated values
    const addMultiLineText = (label, value) => {
      // Draw the label
      doc.text(`${label}:`, contentX, contentY);

      // Calculate the starting position of the value text
      const valueX = contentX + doc.getTextWidth(`${label}: `);

      // Define maximum width for wrapping text
      const maxWidth = cardX + cardWidth - valueX - 5; // Ensure it fits within the card

      // Split the value by commas and wrap each part if necessary
      const lines = value.split(",").flatMap((part) => {
        return doc.splitTextToSize(part.trim(), maxWidth); // Wrap text if it's too long
      });

      // Render each line, aligning it properly
      lines.forEach((line, index) => {
        const lineY = contentY + index * 6; // Adjust vertical spacing for each line
        doc.text(line, valueX, lineY);
      });

      // Update contentY for the next section
      contentY += lines.length * 6 + 2; // Add extra spacing after the multi-line section
    };

    // Utility function to add simple text
    const addText = (label, value) => {
      doc.text(`${label}: ${value}`, contentX, contentY);
      contentY += 6; // Move down after each line
    };

    // Print customer details
    addText("Order ID", customerData.order_id || "N/A");
    addText(
      "Customer Name",
      `${customerData.customer_name || "N/A"} ${customerData.last_name || ""}`
    );
    addText("Contact Number", customerData.contact_no || "N/A");
    addText("Country", getCountryName(customerData.shipping_country) || "N/A");

    // Add multi-line fields
    addMultiLineText("Emirates Address", customerData.emirates_add || "N/A");
    addMultiLineText(
      "Address",
      customerData.customer_shipping_address || "N/A"
    );
    addMultiLineText("Shipping Method", customerData.shipping_method || "N/A");

    // Add Order Total
    addText(
      "Order Collection",
      customerData.order_total ? `${customerData.order_total} AED` : "N/A"
    );

    // Draw bottom separator
    doc.setLineWidth(0.3);
    doc.line(cardX + 5, contentY, cardX + cardWidth - 5, contentY);

    // Save the PDF
    doc.save("shipping_label.pdf");
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
              {/* <Box>
                <Typography
                  variant="label"
                  style={{
                    color: "#000000",
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  Emirates Adress:{" "}
                  <span
                    style={{
                      color: "#7d6c71",
                      fontSize: "20px",
                      fontWeight: "500",
                    }}
                  >
                    {customerData?.emirates_add
                      ?.split(",")
                      ?.slice(1)
                      ?.map((line, index) => (
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
              </Box> */}
              <Box>
                <Typography
                  variant="label"
                  style={{
                    color: "#000000",
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  Emirates Adress:{" "}
                  <span
                    style={{
                      color: "#7d6c71",
                      fontSize: "20px",
                      fontWeight: "500",
                    }}
                  >
                    {customerData?.emirates_add?.split(",")[0]}
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
                  {customerData.emirates_add
                    ?.split(",")
                    ?.slice(1)
                    ?.map((line, index) => (
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
              <Box>
                <Typography
                  variant="label"
                  style={{
                    color: "#000000",
                    fontSize: "22px",
                    fontWeight: "700",
                  }}
                >
                  Order Collection :{" "}
                </Typography>
                <Typography
                  variant="label"
                  style={{
                    color: "#7d6c71",
                    fontSize: "20px",
                    fontWeight: "500",
                  }}
                >
                  {customerData.order_total
                    ? `${customerData.order_total} AED`
                    : "N/A"}
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
