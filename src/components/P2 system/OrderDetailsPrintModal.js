import React, { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import * as XLSX from "xlsx"; // Import all functions from xlsx library
import { Avatar, Box } from "@mui/material";
import DataTable from "../DataTable";
import { saveAs } from "file-saver";

const OrderDetailsPrintModal = ({
  show,
  handleClosePrintModal,
  PO_OrderList,
  factoryName,
  poId,
}) => {
  const orderDetailsRef = useRef(null);
  const [isDownloadPdf, setIsDownloadPdf] = useState(false);

  const handleExport = async () => {
    setIsDownloadPdf(true);
    const input = orderDetailsRef.current;
    html2canvas(input).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "p",
        unit: "mm",
        format: "a4",
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();

      let widthToFit, heightToFit;

      if (imgProps.width > pdfWidth) {
        widthToFit = pdfWidth;
        heightToFit = (imgProps.height * pdfWidth) / imgProps.width;
      } else {
        widthToFit = imgProps.width;
        heightToFit = imgProps.height;
      }

      pdf.addImage(imgData, "PNG", 5, 5, widthToFit - 10, heightToFit - 5);
      pdf.save(`PoDetails-invoice.pdf`);
      setIsDownloadPdf(false);
    });
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      PO_OrderList.map((item) => ({
        "Product Name": item.product_name,
        "Quantity Ordered": item.quantity,
      }))
    );
    XLSX.utils.book_append_sheet(wb, ws, "PO Orders");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `PoDetails-invoice.xlsx`);
  };

  const printModalContent = () => {
    window.print();
  };

  const columns = [
    {
      field: "product_image",
      headerName: "Factory Image",
      renderCell: (value, row) => {
        return (
          <Box className="h-100 w-100 d-flex align-items-center">
            <Avatar
              src={value.row.image || require("../../assets/default.png")}
              alt="Product Image"
              sx={{
                height: "45px",
                width: "45px",
                borderRadius: "2px",
                margin: "0 auto",
                "& .MuiAvatar-img": {
                  height: "100%",
                  width: "100%",
                  borderRadius: "2px",
                },
              }}
            />
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

  return (
    <>
      <Modal show={show} onHide={handleClosePrintModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Invoice</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Box
            ref={orderDetailsRef}
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
          <Button variant="primary" onClick={handleExport}>
            {isDownloadPdf ? "Downloading..." : "Download PDF"}
          </Button>
          <Button variant="success" onClick={handleExportExcel}>
            Download Excel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderDetailsPrintModal;
