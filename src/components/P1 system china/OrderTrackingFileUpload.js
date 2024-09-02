import React, { useRef, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DriveFolderUploadTwoToneIcon from "@mui/icons-material/DriveFolderUploadTwoTone";
import { useDispatch } from "react-redux";
import { TrackIDFileUpload } from "../../Redux2/slices/OrderSystemChinaSlice";
import ShowAlert from "../../utils/ShowAlert";

const OrderTrackingFileUpload = ({
  show,
  handleClosePrintModal,
  onFileUpload,
}) => {
  const dispatch = useDispatch();
  const [s3Loading, sets3Loading] = useState(false);
  const [fileNotSupported, setFileNotSupported] = useState(false);
  const modalRef = useRef(null);
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      console.log("No file selected.");
      return;
    }
    const isCsv = file.type === "text/csv";
    if (!isCsv) {
      setFileNotSupported(true);
      console.log("Unsupported file type. Please upload a CSV file.");
      return;
    } else {
      setFileNotSupported(false);
    }

    try {
      sets3Loading(true);
      const payload = new FormData();
      payload.append("csv_file", file);
      dispatch(TrackIDFileUpload(payload)).then(({ payload }) => {
        handleClosePrintModal();
        if (payload) {
          ShowAlert(
            "File uploaded Successfully!",
            `Not Updated Ids: ${payload?.not_updated_ids}`,
            "success",
            false,
            false,
            "OK",
            "",
            1000
          );
        } else {
          ShowAlert(
            "failed to upload file!",
            "",
            "error",
            false,
            false,
            "OK",
            "",
            1000
          );
        }
        onFileUpload();
      });
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      sets3Loading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClosePrintModal} centered ref={modalRef}>
      <Modal.Header closeButton>
        <Modal.Title>Upload File</Modal.Title>
      </Modal.Header>
      <Modal.Body
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100px" }}
      >
        <Button
          type="button"
          className="bg-transparent border-0 text-secondary"
          style={{ width: "auto", height: "auto" }}
          onClick={handleButtonClick}
        >
          <DriveFolderUploadTwoToneIcon
            style={{ fontSize: "60px" }} // Increased size
          />
        </Button>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileUpload}
          accept=".csv" // Only allow CSV files
          style={{ display: "none" }}
          ref={fileInputRef}
        />
      </Modal.Body>
      {fileNotSupported && (
        <Modal.Footer>
          <div className="text-danger">
            Unsupported file type. Please upload a CSV file.
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
};

export default OrderTrackingFileUpload;
