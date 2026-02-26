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

const OnHoldProductDetailsPrintModal = ({
  show,
  handleClosePrintModal,
  poTableData,
  factoryName,
  poId,
  //   poRaiseDate,
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

    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(0, 0, 0);

    const pageWidth = doc.internal.pageSize.width;
    const textX = pageWidth / 2;
    const textY = 15;
    doc.text(`POId: ${poId || "N/A"}`, textX, textY, { align: "center" });
    doc.text(`Factory Name: ${factoryName || "N/A"}`, textX, textY + 7, {
      align: "center",
    });

    // Group products by product_id and variation_value
    const groupedProducts = {};
    
    for (const item of poTableData) {
      // Create a unique key based on product_id and variation_value
      const variationKey = item?.variation_value 
        ? (typeof item.variation_value === 'string' 
            ? item.variation_value 
            : JSON.stringify(item.variation_value))
        : 'no_variation';
      const groupKey = `${item.product_id}_${variationKey}`;
      
      if (!groupedProducts[groupKey]) {
        groupedProducts[groupKey] = {
          product_id: item.product_id,
          product_name: item.product_eng_name || item.product_name || "N/A",
          variation_value: item.variation_value,
          image: item.factory_image || item.image,
          order_ids: [],
          quantity: 0,
        };
      }
      
      // Aggregate order_ids
      if (item.order_ids) {
        if (Array.isArray(item.order_ids)) {
          groupedProducts[groupKey].order_ids.push(...item.order_ids);
        } else if (typeof item.order_ids === 'string') {
          // Handle comma-separated string
          const ids = item.order_ids.split(',').map(id => id.trim()).filter(id => id);
          groupedProducts[groupKey].order_ids.push(...ids);
        }
      }
      
      // Sum quantities
      groupedProducts[groupKey].quantity += item.quantity || 0;
    }

    // Remove duplicate order IDs and sort
    Object.keys(groupedProducts).forEach(key => {
      groupedProducts[key].order_ids = [...new Set(groupedProducts[key].order_ids)]
        .sort((a, b) => {
          const numA = parseInt(a) || 0;
          const numB = parseInt(b) || 0;
          return numA - numB;
        });
    });

    // Get all product keys
    const productKeys = Object.keys(groupedProducts);
    const totalProducts = productKeys.length;

    // Process each grouped product - one per page
    for (let productIndex = 0; productIndex < productKeys.length; productIndex++) {
      const groupKey = productKeys[productIndex];
      const product = groupedProducts[groupKey];
      
      // Add new page for each product (except the first one)
      if (productIndex > 0) {
        doc.addPage();
      }

      // Get current page number for this product
      const currentPageNumber = productIndex + 1;

      // Add header on each page
      doc.setFont("helvetica", "bold");
      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`POId: ${poId || "N/A"}`, textX, textY, { align: "center" });
      doc.text(`Factory Name: ${factoryName || "N/A"}`, textX, textY + 7, {
        align: "center",
      });
      
      // Load image
      let imgData = defaultImage;
      if (product.image) {
        try {
          imgData = await loadImageToDataURL(product.image);
        } catch (error) {
          console.error("Error loading image:", error);
          imgData = defaultImage;
        }
      }

      // Format variation if exists
      let variationText = "";
      if (product.variation_value) {
        try {
          const variationValue = typeof product.variation_value === 'string' 
            ? JSON.parse(product.variation_value) 
            : product.variation_value;
          
          if (variationValue && typeof variationValue === 'object' && Object.keys(variationValue).length > 0) {
            variationText = Object.keys(variationValue)
              .map((key) => `${key}: ${variationValue[key]}`)
              .join(", ");
          }
        } catch (error) {
          // If parsing fails, check if it's a valid string (not null/undefined)
          if (product.variation_value && 
              product.variation_value !== "null" && 
              product.variation_value !== "undefined" &&
              product.variation_value !== null &&
              product.variation_value !== undefined) {
            variationText = product.variation_value;
          }
        }
      }

      // Format product name - remove any "- null" suffix and only add variation if it exists
      let fullProductName = product.product_name || product.product_eng_name || "N/A";
      
      // Remove "- null" or " - null" from product name if it exists
      fullProductName = fullProductName.replace(/\s*-\s*null\s*$/i, "").trim();
      
      // Only add variation if it's not empty and not null/undefined
      if (variationText && 
          variationText.trim() !== "" && 
          variationText !== "null" && 
          variationText !== "undefined" &&
          variationText !== null &&
          variationText !== undefined) {
        fullProductName = `${fullProductName} - ${variationText}`;
      }

      // Format order IDs - one per line
      const orderIdsText = product.order_ids.length > 0 
        ? product.order_ids.join("\n") 
        : "N/A";

      // Create horizontal table with 4 columns
      const tableColumn = [
        "Product Image",
        "Product Name",
        "Quantity Ordered",
        "Order IDs",
      ];

      // Calculate column widths based on page width (landscape - more width available)
      const availableWidth = pageWidth - 40; // Leave margins
      const columnWidths = {
        0: availableWidth * 0.40,  // Product Image: 40%
        1: availableWidth * 0.30,  // Product Name: 30%
        2: availableWidth * 0.15,  // Quantity: 15%
        3: availableWidth * 0.15,  // Order IDs: 15%
      };

      // Create table with single product row
      // Use empty strings for columns we'll draw manually to prevent double rendering
      const tableRows = [
        [
          { image: imgData, width: 100 },
          "", // Empty - will be drawn manually in didDrawCell
          product.quantity.toString(),
          orderIdsText,
        ],
      ];

      const startY = textY + 15;

      autoTable(doc, {
        startY: startY,
        headStyles: {
          fillColor: [71, 183, 223],
          textColor: [255, 255, 255],
          fontSize: 12,
          fontStyle: "bold",
          halign: "center",
          valign: "middle",
        },
        bodyStyles: {
          textColor: [0, 0, 0],
          fontSize: 10,
          halign: "left",
          valign: "top",
        },
        alternateRowStyles: {
          fillColor: [245, 245, 245],
        },
        didParseCell: (data) => {
          // Set minimum row height to accommodate image
          if (data.section === 'body' && data.column.index === 0) {
            data.row.height = Math.max(data.row.height || 0, 120);
          }
        },
        columnStyles: {
          0: {
            cellWidth: columnWidths[0],
            halign: "center",
            valign: "middle",
            cellPadding: { top: 10, bottom: 10, left: 10, right: 10 },
          },
          1: {
            cellWidth: columnWidths[1],
            halign: "left",
            valign: "middle",
            cellPadding: { top: 10, bottom: 10, left: 10, right: 10 },
          },
          2: {
            cellWidth: columnWidths[2],
            halign: "center",
            valign: "middle",
            cellPadding: { top: 10, bottom: 10, left: 5, right: 5 },
          },
          3: {
            cellWidth: columnWidths[3],
            halign: "center",
            valign: "middle",
            cellPadding: { top: 10, bottom: 10, left: 5, right: 5 },
            minCellHeight: 50,
          },
        },
        head: [tableColumn],
        body: tableRows,
        didDrawCell: (data) => {
          // Column 0: Draw Product Image only
          if (data.column.index === 0 && data.cell.section === "body") {
            const cellContent = data.cell.raw;
            
            // Check if cell content is an object with image property
            if (cellContent && typeof cellContent === 'object' && cellContent.image) {
              // Calculate available space in cell
              const cellPaddingLeft = data.cell.padding("left");
              const cellPaddingRight = data.cell.padding("right");
              const cellPaddingTop = data.cell.padding("top");
              const cellPaddingBottom = data.cell.padding("bottom");
              const availableWidth = data.cell.width - cellPaddingLeft - cellPaddingRight;
              const availableHeight = data.cell.height - cellPaddingTop - cellPaddingBottom;
              
              // Set image size to fit within cell (max 100px, but respect cell boundaries)
              const maxImageSize = Math.min(cellContent.width || 100, 100, availableHeight, availableWidth);
              const imgWidth = maxImageSize;
              const imgHeight = imgWidth; // Keep it square
              
              // Calculate positions - center image both horizontally and vertically
              const imgX = data.cell.x + (data.cell.width - imgWidth) / 2;
              const imgY = data.cell.y + (data.cell.height - imgHeight) / 2;
              
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
          }
          
          // Column 1: Draw Product Name text only
          if (data.column.index === 1 && data.cell.section === "body") {
            doc.setFont("helvetica", "normal");
            doc.setFontSize(10);
            doc.setTextColor(0, 0, 0);
            
            const cellX = data.cell.x + data.cell.padding("left");
            const cellY = data.cell.y + data.cell.height / 2;
            const maxWidth = columnWidths[1] - data.cell.padding("horizontal");
            
            // Use fullProductName directly instead of cell content to avoid duplication
            if (fullProductName && maxWidth > 0) {
              const lines = doc.splitTextToSize(fullProductName, maxWidth);
              // Calculate line height and center text vertically
              const lineHeight = 5;
              const totalTextHeight = lines.length * lineHeight;
              const textStartY = cellY - totalTextHeight / 2 + lineHeight;
              
              doc.text(lines, cellX, textStartY, {
                align: "left",
              });
            }
          }
        },
        margin: {
          top: 10,
          bottom: 20,
          left: 20,
          right: 20,
        },
        theme: "grid",
        tableWidth: "auto",
        styles: {
          lineWidth: 0.5,
          lineColor: [0, 0, 0],
        },
        addPageContent: function (data) {
          const pageHeight =
            doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
          const text = `Page ${currentPageNumber} of ${totalProducts}`;
          const textWidth =
            (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
            doc.internal.scaleFactor;
          const textX = (pageWidth - textWidth) / 2;
          doc.text(textX, pageHeight - 10, text);
        },
      });
    }

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
        reject(defaultImage);
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
        link.download = `${factoryName}-${poId}.png`;
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
      const chunkData = poTableData
        .slice(startIndex, endIndex)
        .map((item) => {
          return {
            "Product ID": item?.product_id || "N/A",
            "variation ID": item?.variation_id || "N/A",
            "Product Name": item?.product_eng_name || item?.product_name || "N/A",
            "Quantity Ordered": item?.quantity || 0,
            "Image URL": item?.image || "N/A",
            "Order IDs": Array.isArray(item.order_ids)
              ? item.order_ids.join(", ")
              : typeof item.order_ids === "string"
              ? item.order_ids
              : "N/A",
          };
        })
        .filter((item) => item !== undefined);

      data = data.concat(chunkData);
    };

    for (let i = 0; i < poTableData.length; i += CHUNK_SIZE) {
      const end = Math.min(i + CHUNK_SIZE, poTableData.length);
      processChunk(i, end);
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
      headerName: "Product Image",
      flex: 1,
      renderCell: (params) => {
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
        return nameToShow || "N/A"; // fallback if both are missing
      },
      renderCell: (params) => {
        return (
          <div className="wrap-text" style={{ fontSize: "1rem" }}>
            {params.value}
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
        return (
          <strong style={{ fontWeight: "bold", fontSize: "1.1rem" }}>
            {params.value}
          </strong>
        );
      },
    },
  ];

  const rows = poTableData.map((item) => ({
    id: item.id,
    product_name:
      item.id === "total" ? "Total:" : item.product_eng_name || item.product_name,
    quantity: item.quantity || 0,
    order_ids: Array.isArray(item.order_ids)
      ? item.order_ids.join(", ")
      : typeof item.order_ids === "string"
      ? item.order_ids
      : "N/A",
    colspan: 2,
    factory_image: item.factory_image || item.image || defaultImage,
  }));

  useEffect(() => {
    // Effect to handle changes in poTableData, if needed
  }, [poTableData]);

  return (
    <>
      <Modal show={show} onHide={handleClosePrintModal} centered size="xl">
        <Modal.Header closeButton>
          <Modal.Title
            className="d-flex justify-content-center w-100"
            style={{ fontWeight: "bolder", fontSize: "1.8rem" }}
          >
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
            disabled={!poTableData.length || isDownloadPng}
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

export default OnHoldProductDetailsPrintModal;
