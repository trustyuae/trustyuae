import React, { useState, useEffect } from "react";
import Container from "react-bootstrap/Container";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  MenuItem,
  Select,
  Typography,
} from "@mui/material";
import DataTable from "../DataTable";
import { ButtonGroup, Card, Modal, ToggleButton } from "react-bootstrap";
import { API_URL } from "../../redux/constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/Loader";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import { MDBRow } from "mdb-react-ui-kit";
import axios from "axios";
import ShowAlert from "../../utils/ShowAlert";
import { useTranslation } from "react-i18next";

function ExchangeAndReturn() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [orders, setOrders] = useState([]);
  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedFactory, setSelectedFactory] = useState("");
  const [selectedPOType, setSelectedPOType] = useState("");
  const [factories, setFactories] = useState([]);
  const [allPoTypes, setAllPoTypes] = useState([]);
  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectPOId, setSelectPOId] = useState("");
  const [imageURL, setImageURL] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [lang, setLang] = useState("En");

  const loader = useSelector((state) => state?.orderSystemData?.isOrders);
  const dispatch = useDispatch();

  const token = JSON.parse(localStorage.getItem("token"));
  const headers = {
    Authorization: `Live ${token}`,
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };
  const ReturnType = ["Exchange", "Return "];

  const radios = [
    { name: "English", value: "En" },
    { name: "中國人", value: "Zn" },
  ];

  const handleLanguageChange = async (language) => {
    setLang(language);
    i18n.changeLanguage(language);
  };

  const columns = [
    {
      field: "product_name",
      headerName: t("POManagement.ProductName"),
      flex: 1,
    },
    {
      field: "factory_image",
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
      field: "quantity",
      headerName: t("POManagement.QtyOrdered"),
      flex: 1,
    },
    {
      field: "return_qty",
      headerName: t("POManagement.ReturnQty"),
      type: "string",
      flex: 1,
      renderCell: (params) => {
        const isDisabled = !selectedOrderIds.includes(params.row.id);
        return (
          <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
            <Form.Control
              style={{ justifyContent: "center" }}
              type="number"
              value={params.row.return_qty}
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
      renderCell: (params) => {
        const isDisabled = !selectedOrderIds.includes(params.row.id);

        return (
          <Select
            labelId={`customer-status-${params.row.id}-label`}
            id={`customer-status-${params.row.id}`}
            value={params.row.return_type}
            onChange={(event) => handleStatusChange(event, params.row)}
            disabled={isDisabled}
            fullWidth
            style={{ height: "70%", width: "100%" }}
          >
            {ReturnType.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        );
      },
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
        return (
          <FormGroup>
            <FormControlLabel
              className="mx-auto"
              control={<Checkbox />}
              style={{ justifyContent: "center" }}
              checked={selectedOrderIds.includes(params.row.id)}
              onChange={(event) => handleOrderManualSelection(params.row.id)}
            />
          </FormGroup>
        );
      },
    },
  ];

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

  const handleDateChange = (index, event) => {
    console.log(index, event, "======");
    console.log(index.target.value, "======");
    const updatedData = orders.map((item) => {
      if (item.id === event.id) {
        return { ...item, expected_delivery_date: index.target.value };
      }
      return item;
    });
    console.log(updatedData, "updatedData");
    setOrders(updatedData);
  };
  const handleAvailableQtyChange = (event, rowData) => {
    console.log(event, rowData, "======");
    if (event.target.value >= 0 && event.target.value <= rowData.quantity) {
      const updatedData = orders.map((item) => {
        if (item.id === rowData.id) {
          return { ...item, return_qty: event.target.value };
        }
        return item;
      });
      console.log(updatedData, "updatedData");
      setOrders(updatedData);
    }
  };

  const handleStatusChange = (index, event) => {
    const updatedData = orders.map((item) => {
      if (item.id === event.id) {
        return { ...item, return_type: index.target.value };
      }
      return item;
    });
    setOrders(updatedData);
  };

  const handleChange = (event, value) => {
    setPage(value);
  };
  // ======
  const handleFactoryChange = (e) => {
    setSelectedFactory(e.target.value);
  };
  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );

  useEffect(() => {
    dispatch(AllFactoryActions());
  }, [dispatch]);

  useEffect(() => {
    if (allFactoryDatas && allFactoryDatas.factories) {
      let data = allFactoryDatas.factories.map((item) => ({ ...item }));
      setFactories(data);
    }
  }, [allFactoryDatas]);

  const selectPOType = async () => {
    try {
      const response = await axios.get(
        `${API_URL}wp-json/custom-er-api/v1/fetch-products-po/`,
        { headers },
        {
          params: {
            factory_id: selectedFactory,
            po_type: selectedPOType,
          },
        }
      );
      console.log(response.data, "response");
      setAllPoTypes(response.data);
      // selectPO(response.data[0])
      if (response.data.length === 0) {
        setOrders([]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const selectPO = async (id) => {
    console.log(id, "e");
    try {
      setSelectPOId(id);
      const response = await axios.get(
        `${API_URL}wp-json/custom-er-po/v1/fetch-orders-po/${id}`,
        { headers }
      );
      console.log(response, "response");
      let data2 = [
        ...response.data.items_with_variations,
        ...response.data.items_without_variations,
      ];
      console.log(data2, "data====");
      let data = data2.map((v, i) => ({ ...v, id: i }));
      console.log(data, "data");
      setOrders(data);
    } catch (error) {
      console.error(error);
    }
  };

  const submit = async () => {
    console.log(selectedOrderIds, "selectedOrderIds");
    const selectedOrders = orders.filter((order) =>
      selectedOrderIds.includes(order.id)
    );
    console.log(selectedOrders.map((d) => d.return_type));
    const payload = {
      factory_id: Number(selectedFactory),
      po_id: selectPOId,
      product_id: selectedOrders.map((d) => d.product_id),
      return_qty: selectedOrders.map((d) => d.return_qty),
      return_type: selectedOrders.map((d) => d.return_type),
      expected_date: selectedOrders.map((d) => d.expected_delivery_date),
      variation_id: selectedOrders.map((d) => d.variation_id),
    };
    console.log(payload, "payload");
    try {
      const response = await axios.post(
        `${API_URL}wp-json/custom-er-generate/v1/create-er/`,
        payload,
        { headers }
      );
      console.log(response, "response");
      if (response.data.message) {
        const result = await ShowAlert(
          `${response.data.message} ${response.data.er_no}`,
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

    console.log(payload, "payload");
  };

  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };

  useEffect(() => {
    if (selectedPOType) {
      selectPOType();
    }
  }, [selectedPOType, selectedFactory]);

  useEffect(() => {
    // Set the initial language to 'En' when component mounts
    i18n.changeLanguage(lang);
  }, []);

  return (
    <Container fluid className="py-3">
      <Box className="d-flex mb-4 justify-content-between">
        <Typography variant="h4" className="fw-semibold">
          {t("POManagement.ExchangeAndReturn")}
        </Typography>
        <ButtonGroup>
          {radios.map((radio, idx) => (
            <ToggleButton
              key={idx}
              id={`radio-${idx}`}
              type="radio"
              variant={idx % 2 ? "outline-success" : "outline-danger"}
              name="radio"
              value={radio.value}
              checked={lang === radio.value}
              onClick={() => handleLanguageChange(radio.value)}
            >
              {radio.name}
            </ToggleButton>
          ))}
        </ButtonGroup>
      </Box>
      <Row className="mb-4 mt-4">
        <Form inline>
          <Row className="mb-4 align-items-center">
            <Col xs="auto" lg="4">
              <Form.Group className="fw-semibold mb-0">
                <Form.Label>{t("POManagement.Factory")}</Form.Label>
                <Form.Select
                  className="mr-sm-2"
                  value={selectedFactory}
                  onChange={handleFactoryChange}
                >
                  <option value="">All Factory</option>
                  {factories.map((factory) => (
                    <option key={factory.id} value={factory.id}>
                      {factory.factory_name}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs="auto" lg="4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  {t("POManagement.POtype")}
                </Form.Label>
                <Form.Select
                  className="mr-sm-2 py-2"
                  value={selectedPOType}
                  onChange={(e) => setSelectedPOType(e.target.value)}
                >
                  <option value="all">{t("POManagement.All")}</option>
                  <option value="General PO">
                    {t("POManagement.GeneralPO")}
                  </option>
                  <option value="Manual PO">
                    {t("POManagement.ManualPO")}
                  </option>
                  <option value="Schedule PO">
                    {t("POManagement.ScheduledPO")}
                  </option>
                </Form.Select>
              </Form.Group>
            </Col>
            <Col xs="auto" lg="4">
              <Form.Group>
                <Form.Label className="fw-semibold">
                  {t("POManagement.SelectPO")}
                </Form.Label>
                <Form.Select
                  className="mr-sm-2 py-2"
                  disabled={!allPoTypes || allPoTypes.length === 0}
                  // value={selectedPOType}
                  onChange={(e) => selectPO(e.target.value)}
                >
                  <option value="">{t("POManagement.Select")}...</option>
                  {allPoTypes?.map((po) => (
                    <option key={po} value={po}>
                      {po}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col xs="auto" lg="12">
              <Box className="d-flex justify-content-end">
                <Form.Group className="d-flex mx-1 align-items-center">
                  <Form.Label className="fw-semibold mb-0 me-2">
                    {t("POManagement.PageSize")}
                  </Form.Label>
                  <Form.Control
                    as="select"
                    className="w-auto"
                    value={pageSize}
                    onChange={handlePageSizeChange}
                  >
                    {pageSizeOptions.map((size) => (
                      <option key={size} value={size}>
                        {size}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Box>
            </Col>
          </Row>
        </Form>
      </Row>
      {loader ? (
        <Loader />
      ) : orders.length !== 0 ? (
        <div className="mt-2">
          <DataTable
            columns={columns}
            rows={orders}
            // page={page}
            // pageSize={pageSize}
            // totalPages={totalPages}
            // handleChange={handleChange}
          />
        </div>
      ) : (
        <Alert
          severity="warning"
          sx={{ fontFamily: "monospace", fontSize: "18px" }}
        >
          {t("POManagement.PleaseSelectFactoryPOtypeAndPO")}
        </Alert>
      )}
      <MDBRow className="justify-content-end px-3">
        <Button
          variant="primary"
          style={{ width: "100px", marginTop: "10px" }}
          disabled={selectedOrderIds.length === 0}
          onClick={submit}
        >
          {t("POManagement.submit")}
        </Button>
      </MDBRow>
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{t("POManagement.ProductImage")}</Modal.Title>
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
}
export default ExchangeAndReturn;
