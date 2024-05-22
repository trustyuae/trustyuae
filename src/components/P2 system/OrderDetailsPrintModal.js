import React, { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Avatar, Box } from "@mui/material";
import DataTable from "../DataTable";

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

      const imgProps = pdf.getImageProperties(imgData)
      const pdfWidth = pdf.internal.pageSize.getWidth()

      let widthToFit,
        heightToFit

      if (imgProps.width > pdfWidth) {
        widthToFit = pdfWidth
        heightToFit = (imgProps.height * pdfWidth) / imgProps.width
      } else {
        widthToFit = imgProps.width
        heightToFit = imgProps.height
      }

      pdf.addImage(imgData, "PNG", 5, 5, widthToFit - 10, heightToFit - 5);
      pdf.save(`PoDetails-invoice.pdf`);
      setIsDownloadPdf(false);
    });
  };

  // async function getBase64ImageFromUrl(imageUrl) {
  // var res = await fetch(imageUrl);
  // var blob = await res.blob();

  // return new Promise((resolve, reject) => {
  //   var reader = new FileReader();
  //   reader.addEventListener("load", function () {
  //     resolve(reader.result);
  //   }, false);

  //   reader.onerror = () => {
  //     return reject(this);
  //   };
  //   reader.readAsDataURL(blob);
  // })  
  // }

  const columns = [
    {
      field: "product_image",
      headerName: "Factory Image",
      renderCell: (value, row) => {
        console.log(value.row.image, 'valueeeeeeee')
        // getBase64ImageFromUrl(''https://graph.facebook.com/3938027626271800/picture?type=normal'')
        // getBase64ImageFromUrl('https://ghostwhite-guanaco-836757.hostingersite.com/wp-content/uploads/2024/04/4E2837DDA3_worn_2.webp')
        //   .then(result => console.log(result, 'result'))
        //   .catch(err => console.error(err));
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

  const printModalContent = () => {
    window.print();
  };


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
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={isDownloadPdf}
          >
            {isDownloadPdf ? "Downloading..." : "Download PDF"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderDetailsPrintModal;
