import React, { useRef, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Box } from "@mui/material";
import DataTable from "../DataTable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";

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
    setIsDownloadPdf(true); // Assuming this manages UI state for download progress
  
    const doc = new jsPDF();
  
    // Set document properties
    doc.setProperties({
      title: 'Purchase Order Details',
      subject: 'PO Details',
      author: 'Your Name',
      keywords: 'PO, Purchase Order, Invoice',
    });
  
    // Set default font and size
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);
  
    // Header text
    const pageWidth = doc.internal.pageSize.width;
    const textX = pageWidth / 2;
    const textY = 15;
    doc.text(`POId: ${poId}`, textX, textY, { align: 'center' });
    doc.text(`Factory Name: ${factoryName}`, textX, textY + 10, { align: 'center' });
  
    // Table data
    const tableColumn = ["Product Image", "Product Name", "Quantity Ordered"];
    const tableRows = [];
  
    for (const item of PO_OrderList) {
      if (item?.id !== "TAX") {
        let imgData = null;
        if (item?.image) {
          try {
            imgData = await loadImageToDataURL(item.image);
          } catch (error) {
            console.error('Error loading image:', error);
          }
        }
  
        tableRows.push([
          { image: imgData, width: 40 }, // Adjust width as needed
          item?.product_name || 'N/A',
          item?.quantity || 0,
        ]);
      }
    }
  
    // Adding the total row at the end
    const totalItem = PO_OrderList.find(item => item?.id === "TAX");
    if (totalItem) {
      tableRows.push([
        { content: "Total:", colSpan: 2, styles: { halign: 'right' } },
        totalItem?.totals || 0,
      ]);
    }
  
    // Generate table
    autoTable(doc, {
      startY: textY + 20,
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
      rowHeight: 40,
      columnStyles: {
        0: { cellWidth: 40, halign: 'center', cellPadding: 2 },
        1: { cellWidth: 80, halign: 'center', cellPadding: 2 },
        2: { cellWidth: 30, halign: 'center', cellPadding: 2 },
      },
      head: [tableColumn],
      body: tableRows,
      didDrawCell: (data) => {
        if (data.column.index === 0 && data.cell.section === 'body' && data.cell.raw?.image) {
          const imgWidth = data.cell.raw.width || 40; // Adjust width as needed
          const imgHeight = data.cell.height - data.cell.padding('vertical');
          doc.addImage(data.cell.raw.image, 'PNG', data.cell.x + data.cell.padding('left'), data.cell.y + data.cell.padding('top'), imgWidth, imgHeight);
        }
      },
      margin: { top: 30 },
      theme: 'grid',
      tableWidth: 'auto',
      columnWidth: 'wrap',
      styles: {
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
    });
  
    // Save PDF
    doc.save('PoDetails-invoice.pdf');
  
    setIsDownloadPdf(false); // Reset UI state
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
    const data = PO_OrderList.map((item) => {
      if (item?.id !== "TAX") {
        return {
          "Product Name": item?.product_name || 'N/A',
          "Quantity Ordered": item?.quantity || 0,
          "Image URL": item?.image || 'N/A',
        };
      }
    }).filter(item => item !== undefined);

    // Adding the total row at the end
    const totalItem = PO_OrderList.find(item => item?.id === "TAX");
    if (totalItem) {
      data.push({
        "Product Name": "Total:",
        "Quantity Ordered": totalItem?.totals || 0,
        "Image URL": '',
      });
    }

    const ws = XLSX.utils.json_to_sheet(data);
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
      field: "image",
      headerName: "Product Image",
      flex: 1,
      renderCell: (params) => {
        if (params.row.content) {
          return null; // Render nothing for the "Total" row
        }
        return <img src={params.value} alt="Product" style={{ width: 50, height: 50 }} />;
      },
    },
    {
      field: "product_name",
      headerName: "Product Name",
      flex: 1,
      renderCell: (params) => {
        if (params.row.content) {
          return <strong>{params.row.content}</strong>; // Render the "Total" label
        }
        return params.value;
      },
    },
    {
      field: "quantity",
      headerName: "Qty Ordered",
      flex: 1,
      renderCell: (params) => {
        if (params.row.content) {
          return <strong>{params.value}</strong>; // Render the total value
        }
        return params.value;
      },
    },
  ];

  const rows = PO_OrderList.map((item) => {
    if (item.id === "TAX") {
      return {
        id: item.id,
        content: "Total:",
        quantity: item.totals,
      };
    }
    return {
      id: item.id,
      image: item.image || require("../../assets/default.png"),
      product_name: item.product_name || 'N/A',
      quantity: item.quantity || 0,
    };
  });

  useEffect(() => {
    // This effect runs when PO_OrderList changes, e.g., on initial load or updates
  }, [PO_OrderList]);

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
              <DataTable columns={columns} rows={rows} className="custom-data-table" />
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
