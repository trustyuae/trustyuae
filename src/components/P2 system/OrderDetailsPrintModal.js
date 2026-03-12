import React, { useRef, useState, useEffect } from "react";
import { Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { Box } from "@mui/material";
import DataTable from "../DataTable";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import defaultImage from "../../assets/default.png"; // Assuming you have a default image
import html2canvas from "html2canvas";

const OrderDetailsPrintModal = ({
  show,
  handleClosePrintModal,
  PO_OrderList,
  factoryName,
  poId,
  poRaiseDate,
}) => {
  const orderDetailsRef = useRef(null);
  const [isDownloadPdf, setIsDownloadPdf] = useState(false);
  const [isDownloadPng, setIsDownloadPng] = useState(false);

  const handleExport = async () => {
    setIsDownloadPdf(true);
    // Create PDF in landscape orientation
    const doc = new jsPDF("landscape", "mm", "a4");
    doc.setProperties({
      title: "Purchase Order Details",
      subject: "PO Details",
      author: "Your Name",
      keywords: "PO, Purchase Order, Invoice",
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);

    const pageWidth = doc.internal.pageSize.width;
    const textX = pageWidth / 2;
    const textY = 15;
    doc.text(`POId: ${poId || "N/A"}`, textX, textY, { align: "center" });
    doc.text(`Factory Name: ${factoryName || "N/A"}`, textX, textY + 7, {
      align: "center",
    });

    const tableColumn = [
      "Factory Image",
      "Product ID",
      "Product Variations",
      "Quantity Ordered",
      "Order IDs",
    ];
    const tableRows = [];

    for (const item of PO_OrderList) {
      if (item?.id !== "TAX") {
        let imgData = defaultImage;
        if (item?.factory_image || item?.image) {
          try {
            imgData = await loadImageToDataURL(
              item?.factory_image || item?.image
            );
          } catch (error) {
            console.error("Error loading image:", error);
            imgData = defaultImage;
          }
        }

        let productName = "";
        if (item?.variation_value) {
          try {
            const variationValue = JSON.parse(item.variation_value);
            productName = Object.keys(variationValue)
              .map((key) => `${key}: ${variationValue[key]}`)
              .join(", ");
          } catch (error) {
            console.error("Error parsing variation_value:", error);
          }
        }

        // Handle order_ids - check if it's an array, string, or other type
        let orderIdsText = "N/A";
        if (item.order_ids) {
          if (Array.isArray(item.order_ids)) {
            orderIdsText = item.order_ids.join(", ");
          } else if (typeof item.order_ids === "string") {
            orderIdsText = item.order_ids;
          }
        }

        tableRows.push([
          { image: imgData, width: 100 }, // Width will be calculated to fill cell
          item.product_id || "N/A",
          productName || "N/A",
          item.quantity || 0,
          orderIdsText,
        ]);
      }
    }

    const totalItem = PO_OrderList.find((item) => item?.id === "TAX");
    if (totalItem) {
      tableRows.push([
        {
          content: "Total:",
          colSpan: 3, // Span across all columns
          styles: { halign: "center", fontStyle: "bold" },
        },
        {
          content: totalItem?.total_quantity || 0,
          styles: { halign: "center", fontStyle: "bold" },
        },
      ]);
    }

    const startY = textY + 15; // Initial startY position

    // Calculate column widths based on page width (landscape - more width available)
    const availableWidth = pageWidth - 20; // Leave margins (10mm each side)
    const columnWidths = {
      0: availableWidth * 0.45,  // Factory Image: 35% (now first)
      1: availableWidth * 0.12,  // Product ID: 12% (now second)
      2: availableWidth * 0.15,  // Product Variations: 25%
      3: availableWidth * 0.13,  // Quantity: 13%
      4: availableWidth * 0.15,  // Order IDs: 15%
    };

    autoTable(doc, {
      startY: startY,
      headStyles: {
        fillColor: [255, 255, 255], // White background instead of blue
        textColor: [0, 0, 0], // Black text instead of white
        fontSize: 9, // Smaller font size
        fontStyle: "normal", // Normal instead of bold
        halign: "center",
        valign: "middle",
        cellPadding: { top: 5, bottom: 2, left: 5, right: 5 }, // Minimal padding for headers
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 9, // Smaller font size
        halign: "left",
        valign: "top",
        fontStyle: "normal", // Ensure normal font weight
      },
      alternateRowStyles: {
        fillColor: [255, 255, 255], // White background for all rows
      },
      rowPageBreak: "avoid",
      didParseCell: (data) => {
        // Set minimum row height to accommodate image
        if (data.section === 'body' && data.column.index === 0) {
          data.row.height = Math.max(data.row.height || 0, 150); // Increased height
        }
      },
      columnStyles: {
        0: {
          cellWidth: columnWidths[0],
          halign: "center",
          valign: "middle",
          // No padding so the image can fully occupy the cell
          cellPadding: { top: 0, bottom: 0, left: 0, right: 0 },
        },
        1: {
          cellWidth: columnWidths[1],
          halign: "center",
          valign: "middle",
          cellPadding: { top: 5, bottom: 2, left: 5, right: 5 }, // Minimal padding
        },
        2: {
          cellWidth: columnWidths[2],
          halign: "left",
          valign: "middle",
          cellPadding: { top: 5, bottom: 2, left: 5, right: 5 }, // Minimal padding
        },
        3: {
          cellWidth: columnWidths[3],
          halign: "center",
          valign: "middle",
          cellPadding: { top: 5, bottom: 2, left: 5, right: 5 }, // Minimal padding
        },
        4: {
          cellWidth: columnWidths[4],
          halign: "center",
          valign: "middle",
          cellPadding: { top: 5, bottom: 2, left: 5, right: 5 }, // Minimal padding
          minCellHeight: 50,
        },
      },

      head: [tableColumn],
      body: tableRows,
      didDrawCell: (data) => {
        // Column 0: Draw Factory Image only (now first column)
        if (
          data?.column?.index === 0 &&
          data?.cell?.section === "body" &&
          data.cell.raw?.image
        ) {
          const cellContent = data.cell.raw;
          
          // Calculate available space in cell
          const cellPaddingLeft = data.cell.padding("left");
          const cellPaddingRight = data.cell.padding("right");
          const cellPaddingTop = data.cell.padding("top");
          const cellPaddingBottom = data.cell.padding("bottom");
          const availableWidth = data.cell.width - cellPaddingLeft - cellPaddingRight;
          const availableHeight = data.cell.height - cellPaddingTop - cellPaddingBottom;
          
          // Fill the entire cell area
          const imgWidth = Math.max(0, availableWidth);
          const imgHeight = Math.max(0, availableHeight);

          // Draw from the top-left inside padding (padding is 0 for this column)
          const imgX = data.cell.x + cellPaddingLeft;
          const imgY = data.cell.y + cellPaddingTop;
          
          // Draw image if it fits within cell boundaries
          if (imgWidth > 0 && imgHeight > 0 && 
              imgX + imgWidth <= data.cell.x + data.cell.width - cellPaddingRight &&
              imgY + imgHeight <= data.cell.y + data.cell.height - cellPaddingBottom) {
            try {
              doc.addImage(
                cellContent.image,
                "PNG",
                imgX,
                imgY,
                imgWidth,
                imgHeight
              );
            } catch (error) {
              console.error("Error adding image to PDF:", error);
            }
          }
        }
      },
      margin: {
        top: 5, // Minimal top margin
        bottom: 5, // Reduced bottom margin
        left: 10, // Minimal left margin
        right: 10, // Minimal right margin
      },
      theme: "plain", // Smooth borders instead of grid
      tableWidth: "auto",
      styles: {
        lineWidth: 0.3, // Thinner lines for smoother appearance
        lineColor: [200, 200, 200], // Soft greyish color instead of black
      },
      addPageContent: function (data) {
        doc.setFont("helvetica", "normal");
        doc.setFontSize(9); // Smaller font size for page number
        const totalPages = doc.internal.getNumberOfPages();
        const pageHeight =
          doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        const text = `Page ${data.pageNumber} of ${totalPages}`;
        const textWidth =
          (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
          doc.internal.scaleFactor;
        const textX = (pageWidth - textWidth) / 2;
        doc.text(textX, pageHeight - 10, text);
      },
    });

    doc.save("PoDetails-invoice.pdf");
    setIsDownloadPdf(false);
  };

  const loadImageToDataURL = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = (error) => {
        console.error("Error loading image:", error);
        reject(defaultImage); // Fallback to default image on error
      };
      img.src = url;
    });
  };

  const handleExportPNG = async () => {
    setIsDownloadPng(true);
    const element = orderDetailsRef.current;

    if (element) {
      try {
        const scale = 3;
        const canvas = await html2canvas(element, {
          scale: scale,
          useCORS: true,
          allowTaint: true,
          logging: true,
        });

        const imgData = canvas.toDataURL("image/png", 1.0);
        const link = document.createElement("a");
        link.href = imgData;
        link.download = `${factoryName}-${poId}-${poRaiseDate}.png`;
        link.click();
      } catch (error) {
        console.error("Error exporting PNG:", error);
      }
    }
    setIsDownloadPng(false);
  };

  const handleExportExcel = (e) => {
    const wb = XLSX.utils.book_new();
    let data = [];
    const CHUNK_SIZE = 1000;
    const processChunk = (startIndex, endIndex) => {
      const chunkData = PO_OrderList.slice(startIndex, endIndex)
        .map((item) => {
          if (item?.id !== "TAX") {
            return {
              "Product ID": item?.product_id || "N/A",
              "variation ID": item?.variation_id || "N/A",
              "Product Name": item?.product_name || "N/A",
              "Quantity Ordered": item?.quantity || 0,
              "Image URL": item?.image || "N/A",
              "Order IDs": Array.isArray(item.order_ids)
                ? item.order_ids.join(", ")
                : typeof item.order_ids === "string"
                ? item.order_ids
                : "N/A",
            };
          }
        })
        .filter((item) => item !== undefined);

      data = data.concat(chunkData);
    };

    for (let i = 0; i < PO_OrderList.length; i += CHUNK_SIZE) {
      const end = Math.min(i + CHUNK_SIZE, PO_OrderList.length);
      processChunk(i, end);
    }

    const totalItem = PO_OrderList.find((item) => item?.id === "TAX");
    if (totalItem) {
      data.push({
        "Product Name": "Total:",
        "Quantity Ordered": totalItem?.total_quantity || 0,
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
      field: "factory_image",
      headerName: "Factory Image",
      flex: 1,
      colSpan: (value, row) => {
        if (row.id === "TAX") {
          return 3;
        }
        return undefined;
      },
      renderCell: (params) => {
        if (params.row.content) {
          return (
            <strong style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
              {params.row.content}
            </strong>
          );
        }
        return (
          <img
            src={params.value || defaultImage}
            alt="Product"
            style={{ width: 190, height: 190 }}
          />
        );
      },
    },
    {
      field: "product_name",
      headerName: "Product Name",
      flex: 1,
      renderCell: (params) => {
        const nameToShow = params.row.product_eng_name || params.row.product_name;
        return (
          <div className="wrap-text" style={{ fontSize: "1rem" }}>
            {nameToShow || "N/A"}
          </div>
        );
      },
    },
    {
      field: "order_ids",
      headerName: "Order ID",
      flex: 1,
      renderCell: (params) => {
        console.log(params, "params from order_ids");

        if (params.row.content) {
          return null;
        }
        const orderIds = params?.row?.order_ids.split(",");
        const numRows = 5;
        const numColumns = Math.ceil(orderIds.length / numRows);

        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              fontWeight: "bold",
              fontSize: "1rem",
              textAlign: "center",
              whiteSpace: "normal",
              wordWrap: "break-word",
              lineHeight: "1.5",
              padding: "5px 0",
              height: "100%",
              overflowX: "auto",
              overflowY: "hidden",
              width: "100%",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${numColumns}, auto)`,
                gridAutoRows: "auto",
                gap: "10px",
                width: "fit-content",
                padding: "5px",
              }}
            >
              {orderIds.map((id, index) => (
                <div key={index} style={{ padding: "5px" }}>
                  {id}
                </div>
              ))}
            </div>
          </div>
        );
      },
    },
    {
      field: "quantity",
      headerName: "Qty Ordered",
      flex: 0.5,
      renderCell: (params) => {
        if (params.row.content) {
          return (
            <strong style={{ fontWeight: "bold", fontSize: "1.4rem" }}>
              {params.value}
            </strong>
          );
        }
        return (
          <strong style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            {params.value}
          </strong>
        );
      },
    },
  ];

  const rows = PO_OrderList.map((item) => {
    if (item.id === "TAX") {
      return {
        id: item.id,
        content: "Total:",
        quantity: item.total_quantity,
        colspan: 2, // Add colspan property for Total row
      };
    } else {
      return {
        id: item.id,
        product_name: item.id === "total" ? "Total:" : (item.product_eng_name || item.product_name),
        product_eng_name: item.product_eng_name,
        quantity: item.quantity || 0,
        order_ids: Array.isArray(item.order_ids)
          ? item.order_ids.join(", ")
          : typeof item.order_ids === "string"
          ? item.order_ids
          : "N/A",
        colspan: 2,
        factory_image: item.factory_image
          ? item.factory_image
          : item.image
          ? item.image
          : defaultImage,
      };
    }
  });

  useEffect(() => {
    // Effect to handle changes in PO_OrderList, if needed
  }, [PO_OrderList]);

  return (
    <>
      <Modal show={show} onHide={handleClosePrintModal} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title className="d-flex justify-content-center w-100" style={{fontWeight:'bolder',fontSize:'1.8rem'}}>
            Invoice
          </Modal.Title>
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
                fontSize: "1.4rem",
              }}
            >
              <strong>POId:</strong>{" "}
              <div style={{ fontWeight: "initial", marginLeft: "5px" }}>
                {poId}
              </div>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                marginBottom: "10px",
                fontSize: "1.4rem",
              }}
            >
              <strong>PO Generated Date:</strong>{" "}
              <div style={{ fontWeight: "initial", marginLeft: "5px" }}>
                {poRaiseDate}
              </div>
            </Box>
            <Box className="mt-2 po-details-table">
              <DataTable columns={columns} rows={rows} rowHeight={200} />
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
          <Button
            variant="primary"
            onClick={handleExportPNG}
            disabled={!PO_OrderList.length || isDownloadPng}
          >
            {isDownloadPng ? "Generating PNG..." : "Export to PNG"}
          </Button>
          <Button variant="success" onClick={(e) => handleExportExcel(e)}>
            Download Excel
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderDetailsPrintModal;
