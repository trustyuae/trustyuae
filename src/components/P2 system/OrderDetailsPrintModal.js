import React, { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Box } from "@mui/material";
import DataTable from "../DataTable";

const OrderDetailsPrintModal = ({
  show,
  handleClosePrintModal,
  PO_OrderList,
  factoryName,
  poId,
}) => {
  const dailyReportRef = useRef(null);
  const [isDownloadPdf, setIsDownloadPdf] = useState(false);

  const handleExport = async () => {
    setIsDownloadPdf(true);

    const input = dailyReportRef.current;

    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "l", // Landscape orientation for a wider page
        unit: "mm",
        format: "a4",
      });

      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, imgWidth, imgHeight);

      pdf.save(`PoDetails-invoice.pdf`);

      setIsDownloadPdf(false);
    });
  };

  const columns = [
    {
      field: "product_image",
      headerName: "Factory Image",
      renderCell: (value, row) => {
        console.log(value,'valueeeeeeee')
        return (
          <Box style={{ display: "flex", alignItems: "center" }}>
            {value && (
              <img
                src={value.row.image}
                alt="" 
                style={{ maxWidth: "100px", marginRight: "10px" }}
              />
            )}
          </Box>
        );
      },
    },
    {
      field: "product_name",
      headerName: "Product Name",
      flex: 1,
    },
    {
      field: "quantity",
      headerName: "Qty Ordered",
      flex: 1,
      valueGetter: (value, row) => {
        if (row.id === "TAX") {
          return `${row.taxRate}`;
        }
        return value;
      },
    },
  ];

  const printModalContent = () => {
    window.print();
  };


  return (
    <Modal show={show} onHide={handleClosePrintModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Box
          ref={dailyReportRef}
          sx={{ display: "flex", flexDirection: "column" }}
        >
          <Box>
            <strong>POId:</strong> {poId}
          </Box>
          <Box>
            <strong>Factory Name:</strong> {factoryName}
          </Box>
          <Box className="mt-2">
            <DataTable columns={columns} rows={PO_OrderList} />
          </Box>
        </Box>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClosePrintModal}>
          Close
        </Button>
        <Button variant="primary" onClick={printModalContent}>
          Print
        </Button>
        <Button
          variant="primary"
          onClick={handleExport}
          disabled={isDownloadPdf}
        >
          {isDownloadPdf ? "Downloading..." : "Download PDF"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default OrderDetailsPrintModal;
