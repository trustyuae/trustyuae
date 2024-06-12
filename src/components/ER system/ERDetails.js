import React, { useEffect, useState } from "react";
import {
  Button,
  ButtonGroup,
  Card,
  Col,
  Container,
  Form,
  Modal,
  Row,
  ToggleButton,
} from "react-bootstrap";
import DataTable from "../DataTable";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import { Alert, Avatar, Box, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { API_URL } from "../../redux/constants/Constants";
import { PerticularPoDetails } from "../../redux/actions/P2SystemActions";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { GridActionsCellItem } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import axios from "axios";
import ShowAlert from "../../utils/ShowAlert";
import { useTranslation } from "react-i18next";

const ERDetails = () => {
  const params = useParams();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [ERviewList, setERviewList] = useState([]);
  const navigate = useNavigate();
  const [status, setStatus] = useState("");
  const [factories, setFactories] = useState([]);
  const [factoryName, setFactoryName] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [addNote, setNote] = useState("");

  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );
  useEffect(() => {
    dispatch(AllFactoryActions());
  }, [dispatch]);

  useEffect(() => {
    setFactories(allFactoryDatas);
  }, [allFactoryDatas]);

  const radios = [
    { name: "English", value: "En" },
    { name: "Chinese", value: "Zn" },
  ];

  const handleLanguageChange = (language) => {
    i18n.changeLanguage(language);
  };

  const fetchER = async () => {
    try {
      let apiUrl = `${API_URL}wp-json/custom-er-record/v1/fetch-er-record/${params.er_no}/`;
      await dispatch(PerticularPoDetails({ apiUrl })).then((response) => {
        setStatus(response.data.er_status);
        setFactoryName(response.data.factory_id);
        let data = response.data.line_items.map((v, i) => ({ ...v, id: i }));
        setNote(response.data.er_note);
        data = data.map((d) => {
          if (d.returned_qty == d.received_qty) {
            return {
              ...d,
              received_qty: d.received_qty,
              received_status: "Received",
            };
          }
          if (0 >= d.received_qty) {
            return {
              ...d,
              received_qty: d.received_qty,
              received_status: "Not Received",
            };
          }
          if (d.returned_qty >= d.received_qty) {
            return {
              ...d,
              received_qty: d.received_qty,
              received_status: "Partially received",
            };
          }
          return d;
        });
        setERviewList(data);
      });
    } catch {
      console.error("Error fetching PO:");
    }
  };

  const ReturnType = ["Received", "Partially received ", "Not Received "];
  const columns = [
    {
      field: "product_name",
      headerName: t("POManagement.ProductName"),
      flex: 1,
    },
    {
      field: "product_image",
      headerName: t("POManagement.Image"),
      flex: 1,
      renderCell: (params) => (
        <Box
          className="h-100 w-100 d-flex align-items-center"
          onClick={() => ImageModule(params.value)}
        >
          <Avatar
            src={params.value || require("../../assets/default.png")}
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
      ),
    },
    {
      field: "returned_qty",
      headerName: t("POManagement.ERQty"),
      flex: 1,
    },

    {
      field: "received_qty",
      headerName: t("POManagement.ReceivedQty"),
      type: "string",
      flex: 1,
      renderCell: (params) => {
        const isDisabled = !selectedOrderIds.includes(params.row.id);
        return (
          <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
            <Form.Control
              style={{ justifyContent: "center" }}
              type="number"
              value={params.row.received_qty}
              placeholder="0"
              disabled={isDisabled}
              onChange={(e) => handleAvailableQtyChange(e, params.row)}
            />
          </Form.Group>
        );
      },
    },
    {
      field: "return_type",
      headerName: t("POManagement.ReturnType"),
      flex: 1,
    },
    {
      field: "received_status",
      headerName: t("POManagement.ReceivedStatus"),
      flex: 1,
    },
    {
      field: "expected_delivery_date",
      headerName: t("POManagement.ExpectedDeliveryDate"),
      flex: 1,
      type: "html",
      renderCell: (params) => {
        const isDisabled = !selectedOrderIds.includes(params.row.id);
        return (
          <input
            type="date"
            value={params.row.expected_delivery_date}
            disabled={isDisabled}
            onChange={(event) => handleDateChange(event, params.row)}
            style={{ height: "70%", width: "100%" }}
          />
        );
      },
    },
    {
      field: "select",
      headerName: t("POManagement.Select"),
      flex: 1,
      renderCell: (params) => {
        const isInSaveMode = selectedOrderIds.includes(params.row.id);
        if (isInSaveMode) {
          return [
            <GridActionsCellItem
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={(event) => handleOrderManualSelection(params.row.id)}
            />,
          ];
        }

        return [
          <GridActionsCellItem
            icon={<EditIcon />}
            label="Edit"
            className="textPrimary"
            disabled={selectedOrderIds.includes(params.row.id)}
            color="inherit"
            onClick={(event) => handleOrderManualSelection(params.row.id)}
          />,
        ];
      },
    },
  ];

  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };

  const handleAvailableQtyChange = (index, event) => {
    if (index.target.value >= 0 && event.returned_qty >= index.target.value) {
      const updatedData = ERviewList.map((item) => {
        if (item.id === event.id) {
          if (event.returned_qty == index.target.value) {
            return {
              ...item,
              received_qty: index.target.value,
              received_status: "Received",
            };
          }
          if (0 >= index.target.value) {
            return {
              ...item,
              received_qty: index.target.value,
              received_status: "Not Received",
            };
          }
          if (event.returned_qty >= index.target.value) {
            return {
              ...item,
              received_qty: index.target.value,
              received_status: "Partially received",
            };
          }

          //else if(event.order_qty>=index.target.value){
          //     return { ...item, returned_qty: index.target.value,received_status:'Partially received' }
          // }else if(index.target.value===0){
          //     return { ...item, returned_qty: index.target.value,received_status:'Not Received' }
          // }
          return { ...item, returned_qty: index.target.value };
        }
        return item;
      });
      setERviewList(updatedData);
    }
  };

  const handleStatusChange = (index, event) => {
    const updatedData = ERviewList.map((item) => {
      if (item.id === event.id) {
        return { ...item, received_status: index.target.value };
      }
      return item;
    });
    setERviewList(updatedData);
  };

  const handleDateChange = (index, event) => {
    const updatedData = ERviewList.map((item) => {
      if (item.id === event.id) {
        return { ...item, expected_delivery_date: index.target.value };
      }
      return item;
    });
    setERviewList(updatedData);
  };

  const handleOrderManualSelection = (orderId) => {
    const selectedIndex = selectedOrderIds.indexOf(orderId);
    let newSelected = [];
    if (selectedIndex === -1) {
      newSelected = [...selectedOrderIds, orderId];
    } else {
      newSelected = selectedOrderIds.filter((id) => id !== orderId);
    }
    setSelectedOrderIds(newSelected);
  };

  const handalBackButton = () => {
    navigate("/ER_Management_System");
  };

  const handleUpdate = async () => {
    const payload = {
      er_no: params.er_no,
      er_note: addNote,
      er_status: status,
      product_id: ERviewList.map((d) => Number(d.product_id)),
      received_qty: ERviewList.map((d) => Number(d.received_qty)),
      received_status: ERviewList.map((d) => d.received_status),
      expected_date: ERviewList.map((d) => d.expected_delivery_date),
      variation_id: ERviewList.map((d) => d.variation_id),
    };
    try {
      const response = await axios.post(
        `${API_URL}wp-json/custom-er-update/v1/update-er-item/`,
        payload
      );
      if (response.data.message) {
        const result = await ShowAlert(
          response.data.message,
          "",
          "success",
          true,
          false,
          "OK"
        );
        if (result.isConfirmed) navigate("/ER_Management_System");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const handleStatusFilter = (e) => {
    setStatus(e.target.value);
  };

  useEffect(() => {
    fetchER();
  }, []);

  return (
    <Container fluid className="px-5">
      <MDBRow className="my-3">
        <MDBCol className="d-flex justify-content-between align-items-center">
          <Button
            variant="outline-secondary"
            className="p-1 me-2 bg-transparent text-secondary"
            onClick={handalBackButton}
          >
            <ArrowBackIcon className="me-1" />
          </Button>
          <ButtonGroup>
            {radios.map((radio, idx) => (
              <ToggleButton
                key={idx}
                id={`radio-${idx}`}
                type="radio"
                variant={idx % 2 ? "outline-success" : "outline-danger"}
                name="radio"
                value={radio.value}
                checked={i18n.language === radio.value}
                onClick={() => handleLanguageChange(radio.value)}
              >
                {radio.name}
              </ToggleButton>
            ))}
          </ButtonGroup>
        </MDBCol>
      </MDBRow>
      <Card className="p-3 mb-3">
        <Box className="d-flex align-items-center justify-content-between">
          <Box>
            <Typography variant="h6" className="fw-bold mb-3">
              {t('POManagement.ERview')}
            </Typography>
            <Box>
              <Typography className="fw-bold"># {params.er_no}</Typography>
            </Box>
            <Typography
              className=""
              sx={{
                fontSize: 14,
              }}
            ></Typography>
          </Box>
          <Box>
            <Typography variant="h6" className="fw-bold mb-3">
              {
                factories.find((factory) => factory.id == factoryName)
                  ?.factory_name
              }
            </Typography>
          </Box>
        </Box>
      </Card>
      <Card className="p-3 mb-3">
        <Row className="mb-3">
          <Col xs="auto" lg="4">
            <Form.Group className="fw-semibold mb-0">
              <Form.Label>{t('POManagement.StatusFilter')}</Form.Label>
              <Form.Select
                className="mr-sm-2"
                value={status}
                onChange={(e) => handleStatusFilter(e)}
              >
                <option value="In Progress">In Progress </option>
                <option value="Closed">Closed </option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol col="10" md="12" sm="12"></MDBCol>
          {ERviewList && ERviewList.length ? (
            <div className="mt-2">
              <DataTable
                columns={columns}
                rows={ERviewList}
                // page={pageSO}
                // pageSize={pageSizeSO}
                // totalPages={totalPagesSO}
                // rowHeight={100}
                // handleChange={handleChangeSO}
                // // onCellEditStart={handleCellEditStart}
                // processRowUpdate={handleSOQtyChange}
              />
            </div>
          ) : (
            <Alert
              severity="warning"
              sx={{ fontFamily: "monospace", fontSize: "18px" }}
            >
             {t('POManagement.NoExachangeandReturnManagementDataAvailable')}
            </Alert>
          )}
          <Row>
            <Form.Group
              className="mb-3"
              controlId="exampleForm.ControlTextarea1"
            >
              <Form.Label>{t('POManagement.AddNote')}</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                value={addNote}
                onChange={(e) => setNote(e.target.value)}
              />
            </Form.Group>
          </Row>
          <Row>
            <Button type="button" className="w-auto" onClick={handleUpdate}>
             {t('POManagement.Update')}
            </Button>
          </Row>
        </MDBRow>
      </Card>
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Product Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="factory-card">
            <img
              src={imageURL || `${require("../../assets/default.png")}`}
              alt="Product"
            />
          </Card>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ERDetails;
