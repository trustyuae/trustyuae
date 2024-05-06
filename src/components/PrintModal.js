import React, { useRef } from 'react';
import { Button, Modal } from 'react-bootstrap';
import jsPDF from 'jspdf';

const PrintModal = ({ show, handleClosePrintModal, orderData }) => {
  
  const customerData = orderData && orderData[0]?.billing;
  const modalRef = useRef(null);

  const downloadPDF = () => {
    const doc = new jsPDF();

    // Print the modal content
    doc.text(`Customer Name: ${customerData?.first_name} ${customerData?.last_name}`, 10, 10);
    doc.text(`Contact Number: ${customerData?.phone}`, 10, 20);
    doc.text(`Address: ${customerData?.address_1} ${customerData?.city}`, 10, 30);

    // Save the PDF
    doc.save('invoice.pdf');
  };

  const printModalContent = () => {
    window.print();
  };

  return (
    <Modal show={show} onHide={handleClosePrintModal} centered backdrop="static" ref={modalRef}>
      <Modal.Header closeButton>
        <Modal.Title>Invoice</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div>
          {customerData && (
            <>
              <h5>Customer Name: {customerData.first_name} {customerData.last_name}</h5>
              <h5>Contact Number: {customerData.phone}</h5>
              <h5>Address: {customerData.address_1} {customerData.city}</h5>
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
}

export default PrintModal;
