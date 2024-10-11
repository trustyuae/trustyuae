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
    const doc = new jsPDF();
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
    doc.text(`POId: ${poId}`, textX, textY, { align: "center" });
    doc.text(`Factory Name: ${factoryName}`, textX, textY + 7, {
      align: "center",
    });

    const tableColumn = [
      "Product ID",
      "Product Image",
      "Product Variations",
      //   "Quantity Ordered",
      "Order IDs",
    ];
    const tableRows = [];

    for (const item of poTableData) {
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

      tableRows.push([
        item.product_id || "N/A",
        { image: imgData, width: 48 },
        productName || "N/A",
        item.quantity || 0,
        item.order_ids?.join(", ") || "N/A",
      ]);
    }

    const startY = textY + 15; // Initial startY position

    autoTable(doc, {
      startY: startY,
      headStyles: {
        fillColor: [71, 183, 223],
        textColor: [255, 255, 255],
        fontSize: 12,
        fontStyle: "bold",
        halign: "center",
      },
      bodyStyles: {
        textColor: [0, 0, 0],
        fontSize: 10,
        halign: "center",
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      rowPageBreak: "avoid",
      rowHeight: 80,
      columnStyles: {
        0: {
          cellWidth: 30,
          halign: "center",
          valign: "center",
          cellPadding: 2,
          minCellHeight: 38,
        },
        1: {
          cellWidth: 52,
          halign: "middle",
          valign: "middle",
          cellPadding: 2,
          minCellHeight: 38,
        },
        2: {
          cellWidth: 40,
          halign: "center",
          valign: "center",
          cellPadding: 2,
          minCellHeight: 38,
        },
        3: {
          cellWidth: 30,
          halign: "center",
          valign: "center",
          cellPadding: 2,
          minCellHeight: 38,
        },
        4: {
          cellWidth: 48,
          halign: "center",
          valign: "center",
          cellPadding: 2,
          minCellHeight: 38,
        },
      },

      head: [tableColumn],
      body: tableRows,
      didDrawCell: (data) => {
        if (
          data?.column?.index === 1 &&
          data?.cell?.section === "body" &&
          data.cell.raw?.image
        ) {
          const imgWidth = data?.cell?.raw?.width || 40;
          const imgHeight =
            data?.cell?.height - data?.cell?.padding("vertical");
          doc.addImage(
            data?.cell?.raw?.image,
            "PNG",
            data?.cell?.x + data?.cell?.padding("left"),
            data.cell.y + data.cell.padding("top"),
            imgWidth,
            imgHeight
          );
        }
      },
      margin: {
        top: 10,
        bottom: 10,
        left: (pageWidth - tableColumn.length * 40) / 2,
        right: (pageWidth - tableColumn.length * 40) / 2,
      },
      theme: "grid",
      tableWidth: "auto",
      columnWidth: "wrap",
      styles: {
        lineWidth: 0.5,
        lineColor: [0, 0, 0],
      },
      addPageContent: function (data) {
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
            "Product Name": item?.product_name || "N/A",
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

  //   const printModalContent = () => {
  //     window.print();
  //   };

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
    product_name: item.id === "total" ? "Total:" : item.product_name,
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
          {/* <Button variant="primary" onClick={printModalContent}>
            Print
          </Button> */}
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
