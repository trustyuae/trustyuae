import React, { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import * as XLSX from "xlsx";
import autoTable from "jspdf-autotable";
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
  
    // Initialize jsPDF document
    const doc = new jsPDF();
  
    // Set font styles for header text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
  
    // Calculate center position for POId and Factory Name
    const pageWidth = doc.internal.pageSize.width;
    const textWidth = doc.getStringUnitWidth(`${poId}`);
    const textHeight = 10;
    const textX = (pageWidth - textWidth * doc.internal.getFontSize() / 2) / 2;
    const textY = 5;
  
    // Add POId and Factory Name to PDF
    doc.text(`POId: ${poId}`, textX, textY, { align: 'center' });
    doc.text(`Factory Name: ${factoryName}`, textX, textY + textHeight, { align: 'center' });
  
    // Default image for products without an image
    const defaultImage = require("../../assets/default.png");
  
    // Define table columns
    const tableColumn = ["Product Image", "Product Name", "Quantity Ordered"];
    const tableRows = [];
  
    // Populate table rows with data
    for (const item of PO_OrderList) {
      let imgData = null;
      if (item.image) {
        try {
          imgData = await loadImageToDataURL(item.image);
        } catch (error) {
          console.error('Error loading image:', error);
        }
      }
  
      tableRows.push([
        { imgData: imgData || defaultImage, content: '' },
        item.product_name,
        item.quantity,
      ]);
    }
    
    autoTable(doc, {
      startY: textY + textHeight + 5, 
      headStyles: {
        fillColor: [71, 183, 223], 
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: 'bold',
        halign: 'center',
      },
      bodyStyles: {
        textColor: [0, 0, 0], 
        fontSize: 10,
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245], 
      },
      rowPageBreak: 'avoid', 
      rowHeight: 70, 
      columnStyles: {
        0: { cellWidth: 60, halign: 'center', cellPadding: 2 },
        1: { cellWidth: 100, halign: 'center', cellPadding: 2 },
        2: { cellWidth: 30, halign: 'center', cellPadding: 2 },
      },
      head: [tableColumn],
      body: tableRows,
      didDrawCell: (data) => {
        if (data.column.index === 0 && data.cell.section === 'body') {
          if (data.cell.raw.imgData) {
            const imgWidth = data.cell.width - data.cell.padding('horizontal');
            const imgHeight = data.cell.height - data.cell.padding('vertical');
            doc.addImage(data.cell.raw.imgData, 'PNG', data.cell.x + data.cell.padding('left'), data.cell.y + data.cell.padding('top'), imgWidth, imgHeight);
          } else {
            // Draw default image if no imgData is available
            const imgWidth = data.cell.width - data.cell.padding('horizontal');
            const imgHeight = data.cell.height - data.cell.padding('vertical');
            doc.addImage(defaultImage, 'PNG', data.cell.x + data.cell.padding('left'), data.cell.y + data.cell.padding('top'), imgWidth, imgHeight);
          }
        }
      },
      margin: { top: 10 },
      theme: 'grid',
      tableWidth: 'auto', 
      columnWidth: 'wrap',
      styles: {
        lineWidth: 0.5, 
        lineColor: [0, 0, 0], 
      },
    });
  
    // Save PDF file
    doc.save('PoDetails-invoice.pdf');
    setIsDownloadPdf(false);
  };
  
  
  const loadImageToDataURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      };
      img.onerror = (error) => {
        console.error('Error loading image:', error);
        reject(error);
      };
      img.src = url;
    });
  };

  const handleExportExcel = () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(
      PO_OrderList.map((item) => ({
        "Product Name": item.product_name,
        "Quantity Ordered": item.quantity,
        "Image URL": item.image || 'N/A',
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
            sx={{
              display: "flex",
              flexDirection: "column",
              padding: "20px",
              backgroundColor: "#f9f9f9",
              borderRadius: "10px",
              color: "#333",
              fontSize: "14px",
              lineHeight: "1.5",
            }}
          >
            <Box sx={{ marginBottom: "10px" }}>
              <strong>POId:</strong> {poId}
            </Box>
            <Box sx={{ marginBottom: "10px" }}>
              <strong>Factory Name:</strong> {factoryName}
            </Box>
            <Box className="mt-2">
              <DataTable columns={columns} rows={PO_OrderList} className="custom-data-table" />
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
