import React, { useEffect, useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import Container from "react-bootstrap/Container";
import { useNavigate, useParams } from "react-router-dom";
import { API_URL } from "../../redux/constants/Constants";
import { Badge, ButtonGroup, Card, Col, ToggleButton } from "react-bootstrap";
import DataTable from "../DataTable";
import { Alert, Box, MenuItem, Select, Typography } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Swal from "sweetalert2";
import OrderDetailsPrintModal from "./OrderDetailsPrintModal";
import LocalPrintshopOutlinedIcon from "@mui/icons-material/LocalPrintshopOutlined";
import { useDispatch, useSelector } from "react-redux";
import {
  PerticularPoDetails,
  UpdatePODetails,
} from "../../redux/actions/P2SystemActions";
import Loader from "../../utils/Loader";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import PoDetailsModalInView from "./PoDetailsModalInView";
import { useTranslation } from "react-i18next";

const PoDetails = () => {
  const { id } = useParams();
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch();
  const [PO_OrderList, setPO_OrderList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState("");
  const paymentS = ["Paid", "Unpaid", "Hold", "Cancelled"];
  const POStatusFilter = ["Open", "Checking with factory", "Closed"];
  const [PoStatus, setPoStatus] = useState("");
  const [factories, setFactories] = useState([]);
  const [factorieName, setFactorieName] = useState("");
  const [printModal, setPrintModal] = useState(false);
  const [poDetailsModal, setPoDetailsModal] = useState(false);
  const [productId, setProductId] = useState(null);
  const [erId, setERId] = useState(null);

  const navigate = useNavigate();
  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );

  const perticularOrderDetailsLoader = useSelector(
    (state) => state?.orderNotAvailable?.isPerticularPoDetailsData
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

  const fetchPO = async () => {
    try {
      let apiUrl = `${API_URL}wp-json/custom-po-details/v1/po-order-details/${id}`;
      await dispatch(PerticularPoDetails({ apiUrl })).then((response) => {
        let data = response.data.line_items.map((v, i) => ({ ...v, id: i }));
        data = data.map((v, i) => ({ ...v, dispatch_status: "Dispatched" }));
        const row = [
          ...data,
          {
            id: "TAX",
            label: "Total:",
            taxRate: response.data.total_count,
            taxTotal: 8100,
            totals: response.data.total_cost,
          },
        ];
        setPO_OrderList(row);
        setERId(response.data.er_no);
        setFactorieName(response.data.factory_id);
        setPoStatus(response.data.po_status);
        setPaymentStatus(response.data.payment_status);
      });
    } catch {
      console.error("Error fetching PO:");
    }
  };

  useEffect(() => {
    fetchPO();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const availabilityStatus = [
    "Confirmed",
    "1 week",
    "2 week",
    "3 weeks",
    "1 month",
    "Out of Stock",
  ];
  const dispatchedStatus = ["Dispatched", "Not Dispatched"];

  const handleStatusChange = (index, event) => {
    const updatedData = PO_OrderList.map((item) => {
      if (item.product_id === event.product_id) {
        return { ...item, availability_status: index.target.value };
      }
      return item;
    });
    setPO_OrderList(updatedData);
  };

  const handleDispatchStatusChange = (index, event) => {
    const updatedData = PO_OrderList.map((item) => {
      if (item.product_id === event.product_id) {
        return { ...item, dispatch_status: index.target.value };
      }
      return item;
    });
    setPO_OrderList(updatedData);
  };

  const validateAvailabilityStatuses = (statuses) => {
    if (statuses.length === 0 || statuses.every((status) => status === "")) {
      return "Availability status is empty.";
    }
    if (statuses.some((status) => status === "")) {
      return "Availability status is empty.";
    }
    return "Successful";
  };

  const handleUpdate = async () => {
    let updatelist = PO_OrderList.slice(0, -1);
    console.log(updatelist, "updatelist");
    const availabilityStatuses =
      updatelist?.map((item) => item.availability_status) || [];
    const flattenedStatuses = availabilityStatuses.flat();
    const validationMessage = validateAvailabilityStatuses(flattenedStatuses);
    if (validationMessage == "Availability status is empty.") {
      Swal.fire({
        icon: "error",
        title: validationMessage,
        showConfirmButton: true,
      });
    }

    const updatedData = {
      po_number: id,
      availability_status: updatelist?.map((item) => item.availability_status),
      request_quantity: updatelist?.map((item) => item.available_quantity),
      product_ids: updatelist?.map((item) => item.product_id),
      po_status: PoStatus,
      payment_status: paymentStatus,
    };
    if (validationMessage == "Successful") {
      let apiUrl = `${API_URL}wp-json/custom-available-status/v1/estimated-status/${id}`;
      await dispatch(UpdatePODetails({ apiUrl }, updatedData, navigate));
    }
  };

  const handlepayMentStatus = (e) => {
    setPaymentStatus(e.target.value);
  };

  const handlePOStatus = (e) => {
    setPoStatus(e.target.value);
  };

  const handleAvailableQtyChange = (index, event) => {
    if (index.target.value >= 0) {
      const updatedData = PO_OrderList.map((item) => {
        if (item.product_id === event.product_id) {
          return { ...item, available_quantity: index.target.value };
        }
        return item;
      });
      setPO_OrderList(updatedData);
    }
  };

  const handlePrint = () => {
    setPrintModal(true);
  };

  const handlePoModal = (itemId) => {
    setProductId(itemId);
    setPoDetailsModal(true);
  };

  const variant2 = (variations) => {
    console.log(variations.row.variation_value, "variations");

    const variationArray = Object.entries(
      JSON.parse(variations.row.variation_value)
    ).map(([key, value]) => ({ [key]: value }));
    console.log(variationArray, "variationArray");

    return (
      <div className="container mt-4 mb-4">
        {variationArray.length === 0 ? (
          <div>Variations not available</div>
        ) : (
          <div>
            {variationArray.map((item, index) => {
              const attributeName = Object.keys(item)[0];
              const attributeValue = Object.values(item)[0];
              return (
                <span key={index}>
                  {`${attributeName}: ${attributeValue}`}
                  {index < variationArray.length - 1 ? ", " : ""}
                </span>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const columns = [
    {
      field: "product_name",
      headerName: t("POManagement.ProductName"),
      flex: 4,
      colSpan: (value, row) => {
        if (row.id === "TAX") {
          return 3;
        }
        return undefined;
      },
      valueGetter: (value, row) => {
        if (row.id === "TAX") {
          return row.label;
        }
        return value;
      },
    },
    {
      field: "variation_value",
      headerName: t("POManagement.Variation"),
      flex: 4,
      renderCell: variant2,
    },
    {
      field: "image",
      headerName: t("POManagement.Image"),
      flex: 4,
      type: "html",
      renderCell: (value, row) => {
        return (
          <>
            <img
              src={value.row.image}
              alt={value.row.product_name}
              className="img-fluid"
              width={100}
            />
          </>
        );
      },
    },

    {
      field: "quantity",
      headerName: t("POManagement.QtyOrdered"),
      flex: 2.5,
      renderCell: (params) => {
        const handleClick = () => {
          handlePoModal(params.row.product_id);
        };

        if (params.row.id === "TAX") {
          return params.row.taxRate;
        }

        return (
          <Box variant="outline-primary" onClick={handleClick}>
            {params.value}
          </Box>
        );
      },
    },
    {
      field: "",
      headerName: (t("POManagement.RMBPrice")),
      flex: 3,
      valueGetter: (value, row) => {
        if (row.id === "TAX") {
          return row.taxTotal;
        }
        return value;
      },
    },

    {
      field: "total_price",
      headerName: (t("POManagement.AEDPrice")),
      flex: 3,
      colSpan: (value, row) => {
        if (row.id === "TAX") {
          return 4;
        }
        return undefined;
      },
      valueGetter: (value, row) => {
        if (row.id === "TAX") {
          return `${row.totals}`;
        }
        return value;
      },
    },

    {
      field: "available_quantity",
      headerName: t("POManagement.AvlQty"),
      flex: 2.5,
      renderCell: (params) => {
        return (
          <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
            <Form.Control
              style={{ justifyContent: "center" }}
              type="number"
              value={params.row.available_quantity}
              placeholder="0"
              onChange={(e) => handleAvailableQtyChange(e, params.row)}
            />
          </Form.Group>
        );
      },
    },

    {
      field: "availability_status",
      headerName: t("POManagement.AvlStatus"),
      flex: 3,
      renderCell: (params) => {
        console.log(params.row.variation_value, "params");
        return (
          <Select
            labelId={`customer-status-${params.row.id}-label`}
            id={`customer-status-${params.row.id}`}
            value={
              params.row.availability_status !== "" &&
              params.row.availability_status !== "0"
                ? params.row.availability_status
                : params.row.estimated_production_time
            }
            onChange={(event) => handleStatusChange(event, params.row)}
            fullWidth
            style={{ height: "40%", width: "100%" }}
          >
            {availabilityStatus.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },

    {
      field: "dispatch_status",
      headerName: t("POManagement.DispatchStatus"),
      flex: 3,
      renderCell: (params) => {
        return (
          <Select
            labelId={`customer-status-${params.row.id}-label`}
            id={`customer-status-${params.row.id}`}
            value={params.row.dispatch_status}
            onChange={(event) => handleDispatchStatusChange(event, params.row)}
            fullWidth
            style={{ height: "40%", width: "100%" }}
          >
            {dispatchedStatus.map((status) => (
              <MenuItem key={status} value={status}>
                {status}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
  ];
  const handalBackButton = () => {
    navigate("/PO_ManagementSystem");
  };

  const POTypes = (id) => {
    const getPOType = id.substring(0, 2);
    if (getPOType == "PO") {
      return "PO against Orders";
    } else if (getPOType == "MO") {
      return "Manual PO";
    } else if (getPOType == "SO") {
      return "Scheduled PO";
    }
  };
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
          <Box>
            <Button
              variant="outline-primary"
              className="p-1 me-3 bg-transparent text-primary"
              onClick={handlePrint}
            >
              <LocalPrintshopOutlinedIcon className="me-1" />
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
          </Box>
        </MDBCol>
      </MDBRow>
      <Card className="p-3 mb-3">
        <Box className="d-flex align-items-center justify-content-between">
          <Box>
            <Typography variant="h6" className="fw-bold mb-3">
              {t('POManagement.PODetails')}
            </Typography>
            <Box className="d-flex justify-content-between">
              <Box>
                <Box>
                  <Typography className="fw-bold"># {id}</Typography>
                </Box>
                <Typography
                  className=""
                  sx={{
                    fontSize: 14,
                  }}
                >
                  <Badge bg="success">{POTypes(id)}</Badge>
                </Typography>
              </Box>
              <Box style={{ marginLeft: "20px" }}>
                <Box>
                  {erId ? (
                    <div>
                      <Typography className="fw-bold"># {erId}</Typography>
                      <Typography
                        className=""
                        sx={{
                          fontSize: 14,
                        }}
                      >
                        <Badge bg="success">Exchange & Return ID</Badge>
                      </Typography>
                    </div>
                  ) : (
                    <Alert
                      severity="warning"
                      sx={{ fontFamily: "monospace", fontSize: "18px" }}
                    >
                      {t("POManagement.ER")}
                    </Alert>
                  )}
                </Box>
              </Box>
            </Box>
          </Box>
          <Box>
            <Typography variant="h6" className="fw-bold mb-3">
              {
                factories.find((factory) => factory.id == factorieName)
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
              <Form.Label>{t('POManagement.PaymentStatus')}</Form.Label>
              <Form.Control
                as="select"
                className="mr-sm-2"
                value={paymentStatus}
                onChange={(e) => handlepayMentStatus(e)}
              >
                {paymentStatus && (
                  <option key={paymentStatus} value={paymentStatus}>
                    {paymentStatus}
                  </option>
                )}
                {paymentS.map(
                  (po) =>
                    paymentStatus !== po && (
                      <option key={po} value={po}>
                        {po}
                      </option>
                    )
                )}
              </Form.Control>
            </Form.Group>
          </Col>
          <Col xs="auto" lg="4">
            <Form.Group className="fw-semibold mb-0">
              <Form.Label>{t('POManagement.POStatus')}</Form.Label>
              <Form.Control
                as="select"
                className="mr-sm-2"
                value={PoStatus}
                onChange={(e) => handlePOStatus(e)} // Ensure you call the function correctly
              >
                {PoStatus && (
                  <option key={PoStatus} value={PoStatus}>
                    {PoStatus}
                  </option>
                )}
                {POStatusFilter.map(
                  (po) =>
                    PoStatus !== po && (
                      <option key={po} value={po}>
                        {po}
                      </option>
                    )
                )}
              </Form.Control>
            </Form.Group>
          </Col>
        </Row>
        <MDBRow className="d-flex justify-content-center align-items-center">
          <MDBCol col="10" md="12" sm="12"></MDBCol>

          {perticularOrderDetailsLoader ? (
            <Loader />
          ) : (
            <div className="mt-2">
              <DataTable
                columns={columns}
                rows={PO_OrderList}
                // page={pageSO}
                // pageSize={pageSizeSO}
                // totalPages={totalPagesSO}
                rowHeight={100}
                // handleChange={handleChangeSO}
                // // onCellEditStart={handleCellEditStart}
                // processRowUpdate={processRowUpdateSPO}
              />
            </div>
          )}

          <Row>
            <Button type="button" className="w-auto" onClick={handleUpdate}>
              {t("POManagement.Update")}
            </Button>
          </Row>
        </MDBRow>
      </Card>
      <OrderDetailsPrintModal
        show={printModal}
        poId={id}
        factoryName={
          factories.find((factory) => factory.id == factorieName)?.factory_name
        }
        PO_OrderList={PO_OrderList}
        handleClosePrintModal={() => setPrintModal(false)}
        // showModal={printModal}
      />
      {poDetailsModal && (
        <PoDetailsModalInView
          show={poDetailsModal}
          poDetailsModal={poDetailsModal}
          productId={productId}
          handleClosePoDetailsModal={() => setPoDetailsModal(false)}
          poId={id}
        />
      )}
    </Container>
  );
};
export default PoDetails;
