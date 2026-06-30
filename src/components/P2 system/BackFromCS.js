import React, { useState, useEffect, useMemo } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { SingleInputDateRangeField } from "@mui/x-date-pickers-pro/SingleInputDateRangeField";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import DataTable from "../DataTable";
import EditIcon from "@mui/icons-material/Edit";
import {
  Alert,
  Avatar,
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Typography,
  Select as MuiSelect,
} from "@mui/material";
import Select from "react-select";
import { Card, Modal, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import PoDetailsModal from "./PoDetailsModal";
import ShowAlert from "../../utils/ShowAlert";
import CancelIcon from "@mui/icons-material/Cancel";
import { fetchAllFactories } from "../../Redux2/slices/FactoriesSlice";
import {
  AddManualPO,
  AddPO,
  AddSchedulePO,
  AssignFactoryToMultiProduct,
  AssignFactoryToProduct,
  fetchPreOrderProductOrders,
  ManualOrScheduledPoDetailsData,
  PoDetailsData,
  BackFromCsData,
  pushCsOrder,
} from "../../Redux2/slices/P2SystemSlice";
import Swal from "sweetalert2";

const EstimatedTime = ["1 week", "2 week", "3 week", "1 month", "Out of stock"];

function BackFromCS() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [manualPOorders, setManualPoOrders] = useState([]);
  const [scheduledPOorders, setScheduleOrders] = useState([]);

  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedOrderIdss, setSelectedOrderIdss] = useState([]);
  const [selectedManualOrderIds, setSelectedManualOrderIds] = useState([]);
  const [selectedScheduleOrderIds, setSelectedScheduleOrderIds] = useState([]);
  const [selectedAgainstOrderDetails, setSelectedAgainstOrderDetails] =
    useState([]);
  const [selectedManualOrderDetails, setSelectedManualOrderDetails] = useState(
    []
  );
  const [selectedScheduledOrderDetails, setSelectedScheduledOrderDetails] =
    useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(100);
  const pageSizeOptions = [5, 10, 20, 50, 100];

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedDateRange, setSelectedDateRange] = useState([null, null]);
  const [factories, setFactories] = useState([]);

  //selected  factory filter
  const [selectedFactory, setSelectedFactory] = useState("");

  //selected Product filter
  const [manualProductF, setManualProductF] = useState("");

  const [manualNote, setManualNote] = useState("");

  const [scheduledNote, setScheduledNote] = useState("");
  const [estimatedTime, setEstimatedTime] = useState("");
  const [remainderDate, setRemainderDate] = useState("");
  const [poDetailsModal, setPoDetailsModal] = useState(false);
  const [productId, setProductId] = useState(null);
  const [factoryId, setFactoryId] = useState(null);
  const [variationId, setVariationId] = useState(null);
  const [productName, setProductName] = useState("");
  const [currentStartIndex, setCurrentStartIndex] = useState(1);

  const [selectedMPOquantity, setSelectedMPOquantity] = useState([]);
  const [selectedSPOquantity, setSelectedSPOquantity] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [imageId, setImageId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFactoryName, setSelectedFactoryName] = useState("");
  const [pushToCsModalOpen, setPushToCsModalOpen] = useState(false);
  const [selectedOrderIdForPush, setSelectedOrderIdForPush] = useState("");
  const [pushToCsNote, setPushToCsNote] = useState("");
  const [pushToCsOrderEntries, setPushToCsOrderEntries] = useState([]);
  const [pushToCsOrdersLoading, setPushToCsOrdersLoading] = useState(false);
  const [pushToCsSubmitting, setPushToCsSubmitting] = useState(false);

  const factoryData = useSelector((state) => state?.factory?.factories);

  const poLoader = useSelector((state) => state?.p2System?.isLoading);

  const manualOrScheduledPoLoader = useSelector(
    (state) => state?.p2System?.isLoading
  );

  const poDetailsDataa = useSelector((state) => state?.p2System?.poDetailsData);

  const manualOrScheduledPoDetailsDataa = useSelector(
    (state) => state?.p2System?.manualOrScheduledPoDetailsData
  );

  const addedPoDataa = useSelector((state) => state?.p2System?.addedPoData);
  const addedSchedulePoDataa = useSelector(
    (state) => state?.p2System?.addedSchedulePoData
  );
  const addedManualPoDataa = useSelector(
    (state) => state?.p2System?.addedManualPoData
  );

  useEffect(() => {
    dispatch(fetchAllFactories());
  }, [dispatch]);

  useEffect(() => {
    if (factoryData) {
      const factData = factoryData?.factories?.map((item) => ({ ...item }));

      const filteredData = factData?.filter((item) => item.inactive === "0");

      setFactories(filteredData);
    }
  }, [factoryData]);

  function handleAttributeChange(event, rowIndex, attributeName) {
    const newValue = event.target.value;
    rowIndex.variation_values[attributeName] = newValue;
    if (activeKey === "manual_PO") {
      const updatedData = manualPOorders.map((item) =>
        item.id === rowIndex.id ? { ...item, ...rowIndex } : item
      );
      setManualPoOrders(updatedData);
    }
    if (activeKey === "scheduled_PO") {
      const updatedData = scheduledPOorders.map((item) =>
        item.id === rowIndex.id ? { ...item, ...rowIndex } : item
      );
      setScheduleOrders(updatedData);
    }
  }

  const renderVariationValues = (params) => {
    const variationArray = Object.entries(params?.row?.variation_values).map(
      ([key, value]) => ({ [key]: value })
    );
    const noVariation = params.row.variation_values.length === 0;
    return (
      <Box className="d-flex justify-content-around align-items-center w-100">
        {noVariation ? (
          <Box>No any variation</Box>
        ) : (
          <>
            {variationArray && (
              <div className="container mt-4 mb-4">
                {variationArray.map((item, index) => {
                  const attributeName = Object.keys(item)[0];
                  const attributeValue = Object.values(item)[0];
                  return (
                    <React.Fragment key={index}>
                      <div
                        className={`row mb-${typeof attributeValue === "string" ? "3" : "4"
                          }`}
                      >
                        <div className="col-6 d-flex  justify-content-end align-items-center">
                          <InputLabel
                            id={`customer-color-${params.row.id}-label`}
                            className=" d-flex "
                            style={{ marginRight: "10px", width: "100px" }}
                          >
                            {attributeName}:
                          </InputLabel>
                        </div>
                        <div className="col-6 d-flex justify-content-start align-items-center">
                          {typeof attributeValue === "string" ? (
                            <div className="d-flex" style={{ flex: 1 }}>
                              {attributeValue}
                            </div>
                          ) : (
                            <MuiSelect
                              labelId={`customer-color-${params.row.id}-label`}
                              id={`customer-color-${params.row.id}`}
                              onChange={(event) =>
                                handleAttributeChange(
                                  event,
                                  params.row,
                                  attributeName
                                )
                              }
                              fullWidth
                              style={{
                                height: "40px",
                                width: "279px",
                                marginLeft: "10px",
                              }}
                              value={params.row[attributeName]} // Assuming the value of each attribute is stored in params.row
                            >
                              {attributeValue?.map((value) => (
                                <MenuItem key={value} value={value}>
                                  {value}
                                </MenuItem>
                              ))}
                            </MuiSelect>
                          )}
                        </div>
                      </div>
                    </React.Fragment>
                  );
                })}
              </div>
            )}
          </>
        )}
      </Box>
    );
  };

  const ImageModule = (rowData) => {
    setImageURL(rowData.product_image);
    setImageId(rowData.item_id);
    setShowEditModal(true);
  };

  const handleFactoryChange = (value, event) => {
    const updatedData = orders.map((item) => {
      if (item.item_id === event.item_id) {
        if (item.variation_id == event.variation_id) {
          return { ...item, factory_id: value };
        }
      }
      return item;
    });
    setOrders(updatedData);
  };

  const handleChangeFactoryForMul = (selectedOption) => {
    if (selectedOption) {
      setSelectedFactoryName(selectedOption.value);
    } else {
      setSelectedFactoryName(null);
    }
  };

  const handleUpdateForMultiProd = () => {
    setSelectedFactoryName(null);
    const ProductIds = selectedAgainstOrderDetails.map((order) =>
      parseInt(order.item_id, 10)
    );
    const payload = {
      product_id: ProductIds,
      factory_id: selectedFactoryName,
    };
    dispatch(AssignFactoryToMultiProduct({ payload })).then(({ payload, error }) => {
      setSelectedAgainstOrderDetails([]);
      setSelectedOrderIds([]);
      setSelectedFactoryName("");
      if (error) {
        Swal.fire({
          title: typeof payload === "string" ? payload : (payload?.message || "Failed to update factory"),
          icon: "error",
          showConfirmButton: true,
        });
      } else if (payload) {
        Swal.fire({
          title: payload?.data?.message || "Successfully updated factory",
          icon: payload?.status === 200 || payload?.status === 201 ? "success" : "error",
          showConfirmButton: true,
        });
        fetchOrders();
      }
    });
  };


  const handleUpdate = (rowData) => {
    const id = rowData.item_id;
    const factoryId = rowData.factory_id;
    const payload = {
      factory_id: factoryId,
    };
    dispatch(AssignFactoryToProduct({ id, payload }));
  };

  // po ogainst order colum
  const columns1 = [
    {
      field: "select",
      headerName: "Select",
      flex: 1,
      renderCell: (params) => {
        return (
          <FormGroup>
            <FormControlLabel
              className="mx-auto"
              control={<Checkbox />}
              style={{ justifyContent: "center" }}
              checked={selectedOrderIds.includes(params.row.id)}
              onChange={(event) => handleOrderSelection(params.row)}
            />
          </FormGroup>
        );
      },
    },
    {
      field: "product_name", headerName: "Product names", flex: 1,
      renderCell: (params) => {
        const nameToShow = params.row.product_eng_name || params.row.product_name;
        return nameToShow || "N/A"; // fallback if both are missing
      },
    },
    {
      field: "variation_value",
      headerName: "Variation values",
      flex: 1,
      renderCell: (params) => {
        if (
          params.row.variations &&
          Object.keys(params.row.variations).length !== 0
        ) {
          return variant2(params.row.variations);
        } else if (
          params.row.variation_value &&
          params.row.variation_value !== ""
        ) {
          return variant(params.row.variation_value);
        } else {
          return "No variations available";
        }
      },
    },
    {
      field: "product_images",
      headerName: "Product images",
      flex: 1,
      type: "html",
      renderCell: (value, row) => (
        <Box
          className="h-100 w-100 d-flex align-items-center"
          onClick={() => {
            ImageModule(value.row);
          }}
        >
          <Avatar
            src={value.row.product_image || require("../../assets/default.png")}
            alt={value.row.product_image}
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
      field: "total_quantity",
      headerName: "Total quantity",
      flex: 1,
      renderCell: (params) => {
        return (
          <Box onClick={() => handlePoModal(params.row)}>
            {params.row.total_quantity}
          </Box>
        );
      },
    },
    {
      field: "factory_id",
      headerName: "Factory Name",
      flex: 1,
      renderCell: (params) => {
        console.log(params, "params......");
        const factory = factories?.find(
          (factory) => factory.id === params.row.factory_id
        );
        return (
          <Form.Group className="fw-semibold mb-0">
            <Form.Select
              as="select"
              className="mr-sm-2"
              value={factory ? factory.factory_name : "Please Assign factory"}
              onChange={(e) => handleFactoryChange(e.target.value, params.row)}
            >
              <option value="">
                {factory ? factory.factory_name : "Please Assign factory"}
              </option>
              {factories?.map((factory) => (
                <option key={factory.id} value={factory.id}>
                  {factory.factory_name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        );
      },
    },
    {
      field: "action",
      headerName: "Action",
      flex: 0.5,
      renderCell: (params) => (
        <Box className="text-center">
          <Button
            className="m-2 mx-auto d-flex align-items-center justify-content-center"
            style={{ padding: "5px 5px", fontSize: "16px" }}
            onClick={() => handleUpdate(params.row)}
          >
            <EditIcon fontSize="inherit" />
          </Button>
        </Box>
      ),
    },
  ];
  //MPO
  const columnsMPO = [
    {
      field: "select",
      headerName: "Select",
      flex: 1,
      renderCell: (params) => {
        return (
          <FormGroup>
            <FormControlLabel
              className="mx-auto"
              control={<Checkbox />}
              style={{ justifyContent: "center" }}
              checked={selectedManualOrderIds.includes(params.row.id)}
              onChange={() => handleOrderManualSelection(params.row)}
            />
          </FormGroup>
        );
      },
    },
    {
      field: "factory_id",
      headerName: "Factory Name",
      flex: 1,
      renderCell: (prams) =>
        factories.find((factory) => factory.id === prams.row.factory_id)
          ?.factory_name,
    },
    {
      field: "product_name", headerName: "Product names", flex: 1,
      renderCell: (params) => {
        const nameToShow = params.row.product_eng_name || params.row.product_name;
        return nameToShow || "N/A"; // fallback if both are missing
      },
    },
    {
      field: "product_image",
      headerName: "Product images",
      flex: 1,
      type: "html",
      renderCell: (value, row) => (
        <Box className="h-100 w-100 d-flex align-items-center">
          <Avatar
            src={value.row.product_image || require("../../assets/default.png")}
            alt={value.row.product_image}
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
      field: "variation_values",
      headerName: "Variation values",
      flex: 1,
      // renderCell: (params) => {
      //   return variant2(params.row.variation_values);
      // },
      renderCell: renderVariationValues,
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      flex: 1,
      renderCell: (params) => {
        return (
          <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
            <Form.Control
              style={{ justifyContent: "center" }}
              type="number"
              value={params.row.Quantity}
              placeholder="0"
              onChange={(e) => {
                if (e.target.value >= 0) {
                  handleMOQtyChange(e, params.row);
                }
              }}
            />
          </Form.Group>
        );
      },
    },
  ];
  const columnsSPO = [
    {
      field: "select",
      headerName: "Select",
      flex: 1,
      renderCell: (params) => {
        return (
          <FormGroup>
            <FormControlLabel
              className="mx-auto"
              control={<Checkbox />}
              style={{ justifyContent: "center" }}
              checked={selectedScheduleOrderIds.includes(params.row.id)}
              onChange={() => handleOrderScheduleSelection(params.row)}
            />
          </FormGroup>
        );
      },
    },
    {
      field: "factory_id",
      headerName: "Factory Name",
      flex: 1,
      renderCell: (prams) =>
        factories.find((factory) => factory.id === prams.row.factory_id)
          ?.factory_name,
    },
    {
      field: "product_name", headerName: "Product names", flex: 1,
      renderCell: (params) => {
        const nameToShow = params.row.product_eng_name || params.row.product_name;
        return nameToShow || "N/A"; // fallback if both are missing
      },
    },
    {
      field: "product_image",
      headerName: "Product images",
      flex: 1,
      type: "html",
      renderCell: (value, row) => (
        <Box className="h-100 w-100 d-flex align-items-center">
          <Avatar
            src={value.row.product_image || require("../../assets/default.png")}
            alt={value.row.product_image}
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
      field: "variation_values",
      headerName: "Variation values",
      flex: 1,
      // renderCell: (params) => {
      //   return variant2(params.row.variation_values);
      // },
      renderCell: renderVariationValues,
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      flex: 1,
      renderCell: (params) => (
        <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
          <Form.Control
            style={{ justifyContent: "center" }}
            type="number"
            value={params.row.Quantity}
            placeholder="0"
            onChange={(e) => {
              if (e.target.value >= 0) {
                handleSOQtyChange(e, params.row);
              }
            }}
          />
        </Form.Group>
      ),
    },
  ];

  const handleMOQtyChange = (event, itemData) => {
    const { value } = event.target;
    const dataIndex = selectedMPOquantity?.findIndex(
      (q) => q.id === itemData.id
    );
    if (dataIndex !== -1) {
      const newSelected = [...selectedMPOquantity];
      newSelected[dataIndex].Quantity = value;
      setSelectedMPOquantity(newSelected);
    } else {
      const newSelected = [
        ...selectedMPOquantity,
        { id: itemData.id, Quantity: value },
      ];
      setSelectedMPOquantity(newSelected);
    }
    manualPOorders.forEach((order) => {
      if (order.id === itemData.id) order.Quantity = value;
    });
  };

  const handleSOQtyChange = (event, itemData) => {
    const { value } = event.target;
    const dataIndex = selectedSPOquantity?.findIndex(
      (q) => q.id === itemData.id
    );
    if (dataIndex !== -1) {
      const newSelected = [...selectedSPOquantity];
      newSelected[dataIndex].Quantity = value;
      setSelectedSPOquantity(newSelected);
    } else {
      const newSelected = [
        ...selectedSPOquantity,
        { id: itemData.id, Quantity: value },
      ];
      setSelectedSPOquantity(newSelected);
    }
    scheduledPOorders.forEach((order) => {
      if (order.id === itemData.id) order.Quantity = value;
    });
  };

  useEffect(() => {
    if (activeKey === "against_PO") {
      fetchOrders();
    }
    if (activeKey === "manual_PO") {
      manualPO();
    }
    if (activeKey === "scheduled_PO") {
      scheduledPO();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, pageSize, endDate, selectedFactory, manualProductF]);

  const fetchOrders = async () => {
    try {
      let apiUrl = `wp-json/custom-csorder-products/v1/cs-back-order/?&per_page=${pageSize}&page=${page}`;
      if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
      if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
      dispatch(BackFromCsData(apiUrl)).then(({ payload }) => {
        let items = payload?.cs_back_orders || payload?.pre_orders || payload?.data || [];
        let data = items.map((v, i) => ({
          ...v,
          id: i + currentStartIndex,
        }));
        setOrders(data);
        setTotalPages(payload?.total_pages || 1);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [endDate, selectedFactory, pageSize, page, currentStartIndex]);

  const manualPO = async () => {
    try {
      let apiUrl = `wp-json/custom-manual-po/v1/get-product-manual/?&per_page=${pageSize}&page=${page}`;
      if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
      if (manualProductF) apiUrl += `&product_name=${manualProductF}`;

      let data = await getManualOrScheduledPO(
        apiUrl,
        ManualOrScheduledPoDetailsData,
        setManualPoOrders,
        setTotalPages
      );
      setManualPoOrders(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setManualPoOrders([]);
    }
  };

  const scheduledPO = async () => {
    try {
      let apiUrl = `wp-json/custom-manual-po/v1/get-product-manual/?&per_page=${pageSize}&page=${page}`;
      if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
      if (manualProductF) apiUrl += `&product_name=${manualProductF}`;

      let data = await getManualOrScheduledPO(
        apiUrl,
        ManualOrScheduledPoDetailsData,
        setManualPoOrders,
        setTotalPages
      );
      setScheduleOrders(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setScheduleOrders([]);
    }
  };

  const getManualOrScheduledPO = async (
    apiUrl,
    dispatchFunction,
    setDataFunction,
    setTotalPagesFunction
  ) => {
    let data;
    await dispatch(ManualOrScheduledPoDetailsData({ apiUrl })).then(
      ({ payload }) => {
        data = payload.products.map((v, i) => ({
          ...v,
          id: i + currentStartIndex,
        }));
        const filteredMPOquantity = selectedMPOquantity.filter((order) =>
          selectedManualOrderIds.some((id) => id === order.id)
        );

        const filteredSPOquantity = selectedSPOquantity.filter((order) =>
          selectedScheduleOrderIds.some((id) => id === order.id)
        );
        if (filteredMPOquantity.length > 0) {
          filteredMPOquantity.forEach((order) => {
            data.forEach((o) => {
              if (o.id === order.id) {
                o.Quantity = order.Quantity;
              }
            });
          });
        }

        if (filteredSPOquantity.length > 0) {
          filteredSPOquantity.forEach((order) => {
            data.forEach((o) => {
              if (o.id === order.id) {
                o.Quantity = order.Quantity;
              }
            });
          });
        }

        if (payload.products) {
          setTotalPages(payload.total_pages);
          return data;
        }
      }
    );
    return data;
  };

  const handleOrderSelection = (rowData) => {
    const filteredOrders = orders.filter((order) => order.id === rowData.id);
    const orderIds = filteredOrders.map((order) => order.order_ids);
    const selectedIndex = selectedOrderIds.indexOf(rowData.id);
    const newSelected =
      selectedIndex !== -1
        ? selectedOrderIds.filter((id) => id !== rowData.id)
        : [...selectedOrderIds, rowData.id];

    if (selectedIndex === -1) {
      setSelectedAgainstOrderDetails([...selectedAgainstOrderDetails, rowData]);
    } else {
      setSelectedAgainstOrderDetails(
        selectedAgainstOrderDetails.filter((order) => order.id !== rowData.id)
      );
    }

    const newSelected2 =
      selectedIndex !== -1
        ? selectedOrderIdss
          .filter((id) => id !== rowData.id)
          .flatMap((id) => id.split(","))
        : [...selectedOrderIdss, ...orderIds.flatMap((str) => str.split(","))];

    setSelectedOrderIds(newSelected);
    setSelectedOrderIdss(newSelected2);
  };

  const handleOrderManualSelection = (rowData) => {
    const selectedIndex = selectedManualOrderIds.indexOf(rowData.id);
    const selectedQtyIndex = selectedMPOquantity?.findIndex(
      (qty) => qty.id === rowData.id
    );

    const newSelected =
      selectedIndex === -1
        ? [...selectedManualOrderIds, rowData.id]
        : selectedManualOrderIds.filter((id) => id !== rowData.id);

    if (selectedIndex === -1) {
      setSelectedManualOrderDetails([...selectedManualOrderDetails, rowData]);
    } else {
      setSelectedManualOrderDetails(
        selectedManualOrderDetails.filter((order) => order.id !== rowData.id)
      );
    }

    if (selectedQtyIndex !== -1)
      setSelectedMPOquantity((prevData) =>
        prevData.filter((v) => v.id !== rowData.id)
      );

    if (selectedIndex !== -1) {
      manualPOorders.find((o) => o.id === rowData.id).Quantity = 0;
    }

    // setSelectedMPOquantity(newSelectedQty);
    setSelectedManualOrderIds(newSelected);
  };

  const handleOrderScheduleSelection = (rowData) => {
    const selectedIndex = selectedScheduleOrderIds.indexOf(rowData.id);
    const selectedQtyIndex = selectedSPOquantity?.findIndex(
      (qty) => qty.id === rowData.id
    );

    if (selectedIndex === -1) {
      setSelectedScheduledOrderDetails([
        ...selectedScheduledOrderDetails,
        rowData,
      ]);
    } else {
      setSelectedScheduledOrderDetails(
        selectedScheduledOrderDetails.filter((order) => order.id !== rowData.id)
      );
    }

    const newSelected =
      selectedIndex === -1
        ? [...selectedScheduleOrderIds, rowData.id]
        : selectedScheduleOrderIds.filter((id) => id !== rowData.id);

    if (selectedQtyIndex === -1)
      setSelectedSPOquantity((prevData) =>
        prevData.filter((v) => v.id !== rowData.id)
      );

    if (selectedIndex !== -1) {
      scheduledPOorders.find((o) => o.id === rowData.id).Quantity = 0;
    }

    setSelectedScheduleOrderIds(newSelected);
  };

  const handleSelectAll = () => {
    if (activeKey === "against_PO") handleSelectAllAgainst();
    else if (activeKey === "manual_PO") handleSelectAllManual();
    else if (activeKey === "scheduled_PO") handleSelectAllSchedule();
  };

  const handleSelectAllAgainst = () => {
    const allOrderIds = orders.map((order) => order.id);
    const allOrderIdss = orders.flatMap((order) => order.order_ids);
    const flattenedData = allOrderIdss.flatMap((str) => str.split(","));
    setSelectedOrderIds(
      selectedOrderIds.length === allOrderIds.length ? [] : allOrderIds
    );
    setSelectedOrderIdss(
      selectedOrderIdss.length === flattenedData.length ? [] : flattenedData
    );
  };

  const handleSelectAllManual = () => {
    const allOrderIds = manualPOorders.map((order) => order.id);
    setSelectedManualOrderIds(
      selectedManualOrderIds.length === allOrderIds.length ? [] : allOrderIds
    );
  };
  const handleSelectAllSchedule = () => {
    const allOrderIds = scheduledPOorders.map((order) => order.id);
    setSelectedScheduleOrderIds(
      selectedScheduleOrderIds.length === allOrderIds.length ? [] : allOrderIds
    );
  };

  const handleDateChange = async (newDateRange) => {
    if (newDateRange[0]?.$d && newDateRange[1]?.$d) {
      setSelectedDateRange(newDateRange);
      const isoStartDate = dayjs(newDateRange[0].$d.toDateString()).format(
        "YYYY-MM-DD"
      );
      const isoEndDate = dayjs(newDateRange[1].$d.toDateString()).format(
        "YYYY-MM-DD"
      );
      setStartDate(isoStartDate);
      setEndDate(isoEndDate);
    } else {
      console.error("Invalid date range");
      setStartDate("");
      setEndDate("");
    }
  };

  const handlePoModal = (itemData) => {
    setProductId(itemData.item_id);
    setFactoryId(itemData.factory_id);
    setVariationId(itemData.variation_id);
    setProductName(itemData.product_name);
    setPoDetailsModal(true);
  };

  // PO Generate
  const handleGeneratePO = () => {
    // setIsDisabled(true);
    if (activeKey === "against_PO") handleGenerateAgainstPO();
    else if (activeKey === "manual_PO") handleGenerateManualPO();
    else if (activeKey === "scheduled_PO") handleGenerateScheduledPO();
  };

  const getFilteredData = (poData) => {
    poData.forEach((data) => {
      if (data.variation_details && data.variation_values) {
        const { variation_details, variation_values } = data;
        const matchingKeys = Object.keys(variation_details).filter((key) => {
          const detail = variation_details[key];
          // Check if all properties in variation_values match with detail
          return Object.keys(variation_values).every((prop) => {
            return detail[prop] === variation_values[prop];
          });
        });
        if (matchingKeys.length > 0) {
          data.variation_id = Number(matchingKeys[0]);
        } else {
          data.variation_id = 0;
        }
      }
    });
    return poData;
  };

  const handleGenerateAgainstPO = async () => {
    const factoryIds = [
      ...new Set(selectedAgainstOrderDetails.map((order) => order.factory_id)),
    ];

    if (factoryIds.length === 1) {
      const selectedProductIds = selectedAgainstOrderDetails
        .map((order) => order.item_id)
        .join(",");
      const selectedOrderIdsStr = selectedOrderIdss.join(",");

      const payload = {
        product_ids: selectedProductIds,
        factory_ids: factoryIds.join(","),
        order_ids: selectedOrderIdsStr,
        variation_id:
          selectedAgainstOrderDetails
            .map((order) => order.variation_id)
            .join(",") || 0,
      };
      try {
        dispatch(AddPO(payload)).then(({ payload }) => {
          Swal.fire({
            title: payload.data,
            icon: payload.status === 200 ? "success" : "error",
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/PO_ManagementSystem");
            }
          });
        });
      } catch (error) {
        console.error("Error generating PO IDs:", error);
        setIsDisabled(true);
      }
    } else {
      let errMessage =
        "Selected orders belong to different factories. Please select orders from the same factory.";
      ShowAlert("", errMessage, "error", false, false, "", "", 1000);
      setIsDisabled(false);
    }
  };

  const handleGenerateManualPO = async () => {
    const filteredOrders = getFilteredData(selectedManualOrderDetails);
    const factoryIds = [
      ...new Set(filteredOrders.map((order) => order.factory_id)),
    ];
    if (factoryIds.length === 1) {
      const selectedquantities = filteredOrders.map((order) => order.Quantity);
      const selectedOrderIdsStr = filteredOrders.map(
        (order) => order.product_id
      );

      const payload = {
        quantities: selectedquantities,
        product_ids: selectedOrderIdsStr,
        variation_id: filteredOrders.map((d) => d.variation_id),
        note: manualNote,
      };
      try {
        dispatch(AddManualPO(payload)).then(({ payload }) => {
          Swal.fire({
            title: payload.data,
            icon: payload.status === 200 ? "success" : "error",
            showConfirmButton: true,
          }).then((result) => {
            if (result.isConfirmed) {
              navigate("/PO_ManagementSystem");
            }
          });
        });
      } catch (error) {
        console.error("Error generating PO IDs:", error);
        setIsDisabled(true);
      }
    } else {
      await ShowAlert(
        "",
        "Selected orders belong to different factories. Please select orders from the same factory.",
        "error",
        false,
        false,
        "",
        "",
        1000
      );
      setIsDisabled(true);
    }
  };

  const handleGenerateScheduledPO = async () => {
    if (remainderDate && estimatedTime) {
      const filteredOrders = getFilteredData(selectedScheduledOrderDetails);
      const factoryIds = [
        ...new Set(filteredOrders.map((order) => order.factory_id)),
      ];
      if (factoryIds.length === 1) {
        const selectedquantities = filteredOrders.map(
          (order) => order.Quantity
        );
        const selectedOrderIdsStr = filteredOrders.map(
          (order) => order.product_id
        );

        const payload = {
          quantities: selectedquantities,
          product_ids: selectedOrderIdsStr,
          variation_id: filteredOrders.map((d) => d.variation_id),
          note: scheduledNote,
          estimated_time: estimatedTime,
          reminder_date: remainderDate,
        };
        try {
          dispatch(AddSchedulePO(payload)).then(({ payload }) => {
            Swal.fire({
              title: payload.data,
              icon: payload.status === 200 ? "success" : "error",
              showConfirmButton: true,
            }).then((result) => {
              if (result.isConfirmed) {
                navigate("/PO_ManagementSystem");
              }
            });
          });
        } catch (error) {
          console.error("Error generating PO IDs:", error);
          setIsDisabled(true);
        }
      } else {
        await ShowAlert(
          "",
          "Selected orders belong to different factories. Please select orders from the same factory.",
          "error",
          false,
          false,
          "",
          "",
          1000
        );
      }
    } else {
      await ShowAlert(
        "",
        "Please select remainder Date and Estimated Time",
        "error",
        false,
        false,
        "",
        "",
        1000
      );
    }
  };

  // variant
  const variant = (variations) => {
    const matches = variations.match(
      /"display_key";s:\d+:"([^"]+)";s:\d+:"display_value";s:\d+:"([^"]+)";/
    );
    if (matches) {
      const key = matches[1];
      const value = matches[2].replace(/<[^>]*>/g, ""); // Remove HTML tags
      return `${key}: ${value}`;
    } else {
      return "Variant data not available";
    }
  };

  const variant2 = (variations) => {
    const { Color, Size } = variations;

    if (!Color && !Size) {
      return "Variant data not available";
    }

    let details = [];

    if (Size) {
      details.push(`Size: ${Size}`);
    }

    if (Color) {
      details.push(`Color: ${Color}`);
    }

    return details.join(", ");
  };

  const handleChange = (event, value) => {
    setPage(value);
    let currIndex = value * pageSize - pageSize + 1;
    setCurrentStartIndex(currIndex, "currIndex");
  };

  const [activeKey, setActiveKey] = useState("against_PO");

  const handleTabSelect = (key) => {
    setActiveKey(key);
    if (key === "manual_PO") {
      manualPO();
    } else if (key === "scheduled_PO") {
      scheduledPO();
    } else {
      fetchOrders();
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  const clearDateRange = () => {
    setSelectedDateRange([null, null]);
    setStartDate("");
    setEndDate("");
  };

  const productNamee = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setManualProductF(e.target.value);
    }
  };

  const selectedRowCount =
    activeKey === "against_PO"
      ? selectedOrderIds.length
      : activeKey === "manual_PO"
        ? selectedManualOrderIds.length
        : selectedScheduleOrderIds.length;

  const canPushToCs = selectedRowCount === 1;

  const pushToCsOrderOptions = useMemo(() => {
    if (activeKey === "manual_PO") {
      const ids = new Set();
      selectedManualOrderDetails.forEach((row) => {
        const oid =
          row.order_id != null && row.order_id !== ""
            ? String(row.order_id)
            : row.product_id != null
              ? String(row.product_id)
              : null;
        if (oid) ids.add(oid);
      });
      return Array.from(ids).map((id) => ({
        value: id,
        label: `Order ${id}`,
      }));
    }
    if (activeKey === "scheduled_PO") {
      const ids = new Set();
      selectedScheduledOrderDetails.forEach((row) => {
        const oid =
          row.order_id != null && row.order_id !== ""
            ? String(row.order_id)
            : row.product_id != null
              ? String(row.product_id)
              : null;
        if (oid) ids.add(oid);
      });
      return Array.from(ids).map((id) => ({
        value: id,
        label: `Order ${id}`,
      }));
    }
    return [];
  }, [activeKey, selectedManualOrderDetails, selectedScheduledOrderDetails]);

  const pushToCsOrderSelectOptions =
    activeKey === "against_PO" ? pushToCsOrderEntries : pushToCsOrderOptions;

  useEffect(() => {
    if (!pushToCsModalOpen) return;
    const opts =
      activeKey === "against_PO" ? pushToCsOrderEntries : pushToCsOrderOptions;
    if (opts.length === 1) {
      setSelectedOrderIdForPush(opts[0].value);
    }
  }, [
    pushToCsModalOpen,
    activeKey,
    pushToCsOrderEntries,
    pushToCsOrderOptions,
  ]);

  const handlePushToCS = () => {
    if (!canPushToCs) return;
    setSelectedOrderIdForPush("");
    setPushToCsNote("");
    setPushToCsOrderEntries([]);
    setPushToCsModalOpen(true);

    if (activeKey === "against_PO") {
      const rowsToFetch = selectedAgainstOrderDetails.filter(
        (r) => r.item_id != null && `${r.item_id}`.trim() !== ""
      );
      if (rowsToFetch.length === 0) {
        setPushToCsOrdersLoading(false);
        return;
      }
      setPushToCsOrdersLoading(true);
      Promise.all(
        rowsToFetch.map((row) => {
          const productId = String(row.item_id);
          const payload = {
            factory_id: Number(row.factory_id) || 0,
            variation_id: Number(row.variation_id) || 0,
            product_name:
              row.product_eng_name || row.product_name || "",
          };
          if (endDate) payload.end_date = endDate;
          if (startDate) payload.start_date = startDate;
          return dispatch(
            fetchPreOrderProductOrders({ productId, payload })
          ).unwrap();
        })
      )
        .then((results) => {
          const options = [];
          results.forEach((data, rowIndex) => {
            const row = rowsToFetch[rowIndex];
            const itemId = String(data?.item_id ?? row.item_id);
            const orders = data?.orders ?? [];
            orders.forEach((o, idx) => {
              options.push({
                value: `${itemId}__${rowIndex}__${idx}__${o.order_id}`,
                order_id: String(o.order_id),
                quantity: o.quantity ?? "",
                item_id: itemId,
                variation_id: Number(row.variation_id) || 0,
                label:
                  rowsToFetch.length > 1
                    ? `Item ${itemId} · Order ${o.order_id} (Qty: ${o.quantity})`
                    : `Order ${o.order_id} (Qty: ${o.quantity})`,
              });
            });
          });
          setPushToCsOrderEntries(options);
        })
        .catch(() => {
          ShowAlert(
            "",
            "Failed to load order details for the selected product(s).",
            "error",
            false,
            false,
            "",
            "",
            2000
          );
        })
        .finally(() => setPushToCsOrdersLoading(false));
    } else {
      setPushToCsOrdersLoading(false);
    }
  };

  const handleConfirmPushToCS = async () => {
    if (!selectedOrderIdForPush) return;
    const note = String(pushToCsNote ?? "").trim();
    if (!note) {
      ShowAlert(
        "",
        "Reason note is required.",
        "warning",
        false,
        false,
        "",
        "",
        2500
      );
      return;
    }

    let payload;
    if (activeKey === "against_PO") {
      const entry = pushToCsOrderEntries.find(
        (e) => e.value === selectedOrderIdForPush
      );
      if (!entry) return;
      payload = {
        order_id: Number(entry.order_id),
        item_id: Number(entry.item_id),
        variation_id: Number(entry.variation_id ?? 0),
        note,
      };
    } else if (activeKey === "manual_PO") {
      const row = selectedManualOrderDetails[0];
      if (!row) return;
      payload = {
        order_id: Number(selectedOrderIdForPush),
        item_id: Number(row.product_id ?? row.item_id ?? 0),
        variation_id: Number(row.variation_id ?? 0),
        note,
      };
    } else if (activeKey === "scheduled_PO") {
      const row = selectedScheduledOrderDetails[0];
      if (!row) return;
      payload = {
        order_id: Number(selectedOrderIdForPush),
        item_id: Number(row.product_id ?? row.item_id ?? 0),
        variation_id: Number(row.variation_id ?? 0),
        note,
      };
    } else {
      return;
    }

    setPushToCsSubmitting(true);
    try {
      const data = await dispatch(pushCsOrder(payload)).unwrap();
      const msg =
        (typeof data === "string" ? data : null) ||
        data?.message ||
        data?.data ||
        "Order pushed to customer support successfully.";
      handleClosePushToCsModal();
      Swal.fire({
        title: "Push to CS",
        text: typeof msg === "string" ? msg : JSON.stringify(msg),
        icon: "success",
        showConfirmButton: true,
      });
    } catch (err) {
      ShowAlert(
        "",
        typeof err === "string" ? err : "Failed to push order to CS.",
        "error",
        false,
        false,
        "",
        "",
        2500
      );
    } finally {
      setPushToCsSubmitting(false);
    }
  };

  const handleClosePushToCsModal = () => {
    setPushToCsModalOpen(false);
    setSelectedOrderIdForPush("");
    setPushToCsNote("");
    setPushToCsOrderEntries([]);
    setPushToCsOrdersLoading(false);
    setPushToCsSubmitting(false);
  };

  // ── Download PDF ──────────────────────────────────────────────────────────
  const handleDownloadPDF = async () => {
    // Determine which selected rows to use based on active tab
    let selectedRows = [];
    if (activeKey === "against_PO") {
      selectedRows = selectedAgainstOrderDetails;
    } else if (activeKey === "manual_PO") {
      selectedRows = selectedManualOrderDetails;
    } else if (activeKey === "scheduled_PO") {
      selectedRows = selectedScheduledOrderDetails;
    }

    if (!selectedRows || selectedRows.length === 0) {
      ShowAlert("", "Please select at least one product to download PDF.", "warning", false, false, "", "", 2000);
      return;
    }

    // ── Ensure all selected products have the SAME factory ──
    const firstFactoryId = selectedRows[0].factory_id;
    const allSameFactory = selectedRows.every((row) => row.factory_id === firstFactoryId);

    if (!allSameFactory) {
      ShowAlert("", "Please select products from the same factory to download in a single PDF.", "warning", false, false, "", "", 2500);
      return;
    }

    // ── Block download if factory is not assigned ──
    const factoryObj = factories?.find((f) => f.id === firstFactoryId);
    const factoryName = factoryObj?.factory_name || null;

    if (!factoryName || !firstFactoryId) {
      ShowAlert("", "Cannot download PDF: selected products do not have an assigned factory. Please assign a factory first.", "error", false, false, "", "", 3000);
      return;
    }

    // Helper to convert image URL to base64
    const toBase64 = (url) =>
      new Promise((resolve) => {
        if (!url) { resolve(null); return; }
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.onload = () => {
          try {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0);
            resolve(canvas.toDataURL("image/jpeg"));
          } catch { resolve(null); }
        };
        img.onerror = () => resolve(null);
        img.src = url;
      });

    // Group selected rows by factory (only 1 product now, kept for structure)
    const grouped = {};
    for (const row of selectedRows) {
      const fObj = factories?.find((f) => f.id === row.factory_id);
      const fName = fObj?.factory_name || "Unassigned";
      const fId = row.factory_id || "N/A";
      const key = `${fId}__${fName}`;
      if (!grouped[key]) grouped[key] = { factoryName: fName, rows: [] };
      grouped[key].rows.push(row);
    }

    const doc = new jsPDF({ orientation: "landscape", unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    let isFirstGroup = true;

    for (const [key, group] of Object.entries(grouped)) {
      if (!isFirstGroup) doc.addPage();
      isFirstGroup = false;

      const { factoryName, rows } = group;

      // Derive a PO id label from the first row (use po_id, item_id, or order_ids)
      const firstRow = rows[0];
      const poIdLabel =
        firstRow?.po_id ||
        firstRow?.po_number ||
        (firstRow?.order_ids ? firstRow.order_ids.split(",")[0]?.trim() : null) ||
        "N/A";

      // ── Header ──
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.text(`POId: ${poIdLabel}`, pageW / 2, 15, { align: "center" });
      doc.setFontSize(11);
      doc.text(`Factory Name: ${factoryName}`, pageW / 2, 22, { align: "center" });

      // Pre-load images
      const imageDataList = await Promise.all(
        rows.map((r) => toBase64(r.product_image || r.product_img || null))
      );

      // Build table rows
      const ROW_HEIGHT = 120; // mm – tall row so the product image is large
      const tableBody = rows.map((row, idx) => {
        const productName =
          row.product_eng_name || row.product_name || "N/A";
        const quantity =
          row.total_quantity ?? row.Quantity ?? row.quantity ?? 0;
        const orderIds = row.order_ids
          ? String(row.order_ids).replace(/,/g, ", ")
          : row.order_id
            ? String(row.order_id)
            : "N/A";
        return [
          "", // image placeholder – drawn in didDrawCell
          productName,
          String(quantity),
          orderIds,
        ];
      });

      // Total row
      const totalQty = rows.reduce((sum, r) => {
        const q = r.total_quantity ?? r.Quantity ?? r.quantity ?? 0;
        return sum + Number(q);
      }, 0);
      tableBody.push(["", "Total:", String(totalQty), ""]);

      autoTable(doc, {
        startY: 27,
        head: [["Factory Image", "Product Name", "Quantity Ordered", "Order IDs"]],
        body: tableBody,
        styles: { fontSize: 10, cellPadding: 3, valign: "middle" },
        headStyles: { halign: "center", fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0.3, lineColor: [0, 0, 0] },
        bodyStyles: { lineWidth: 0.3, lineColor: [0, 0, 0], textColor: [0, 0, 0] },
        columnStyles: {
          0: { cellWidth: 70, halign: "center" },
          1: { cellWidth: "auto", halign: "center" },
          2: { cellWidth: 35, halign: "center" },
          3: { cellWidth: 50, halign: "center" },
        },
        rowPageBreak: "avoid",
        didDrawCell: (data) => {
          // Draw product image inside first column cells (body only, not last "total" row)
          if (
            data.column.index === 0 &&
            data.section === "body" &&
            data.row.index < imageDataList.length
          ) {
            const imgData = imageDataList[data.row.index];
            if (imgData) {
              const padding = 2;
              const x = data.cell.x + padding;
              const y = data.cell.y + padding;
              const w = data.cell.width - padding * 2;
              const h = data.cell.height - padding * 2;
              try {
                doc.addImage(imgData, "JPEG", x, y, w, h);
              } catch { }
            }
          }
        },
        // Ensure image rows have enough height
        didParseCell: (data) => {
          if (data.column.index === 0 && data.section === "body" && data.row.index < imageDataList.length) {
            data.cell.styles.minCellHeight = ROW_HEIGHT;
          }
        },
        // Footer: page X of Y
        didDrawPage: (data) => {
          const totalPagesExp = "{total_pages_count_string}";
          const pageNum = doc.internal.getNumberOfPages();
          doc.setFontSize(9);
          doc.setFont("helvetica", "normal");
          doc.text(
            `Page ${pageNum} of ${totalPagesExp}`,
            pageW / 2,
            doc.internal.pageSize.getHeight() - 8,
            { align: "center" }
          );
        },
      });
    }

    // Replace placeholder with actual page count
    if (typeof doc.putTotalPages === "function") {
      doc.putTotalPages("{total_pages_count_string}");
    }

    doc.save(`products_${new Date().toISOString().slice(0, 10)}.pdf`);
  };
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <Container
      fluid
      className="py-3"
      style={{ maxHeight: "100%", minHeight: "100vh" }}
    >
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          Back from CS
        </Typography>
      </Box>
      <Card>
        <Card.Body>
          <Tabs
            defaultActiveKey="against_PO"
            id="fill-tab-example"
            className="mb-3"
            justify
            onSelect={handleTabSelect}
          >
            <Tab
              eventKey="against_PO"
              title={
                <span
                  style={{
                    backgroundColor:
                      activeKey === "against_PO" ? "blue" : "inherit",
                    color: activeKey === "against_PO" ? "white" : "inherit",
                    display: "block",
                    borderRadius: "5px",
                  }}
                >
                  Order against PO
                </span>
              }
            ></Tab>
            <Tab
              eventKey="manual_PO"
              title={
                <span
                  style={{
                    backgroundColor:
                      activeKey === "manual_PO" ? "blue" : "inherit",
                    color: activeKey === "manual_PO" ? "white" : "inherit",
                    display: "block",
                    borderRadius: "5px",
                  }}
                >
                  Manual PO
                </span>
              }
            ></Tab>
            <Tab
              eventKey="scheduled_PO"
              title={
                <span
                  style={{
                    backgroundColor:
                      activeKey === "scheduled_PO" ? "blue" : "inherit",
                    color: activeKey === "scheduled_PO" ? "white" : "inherit",
                    display: "block",
                    borderRadius: "5px",
                  }}
                >
                  Scheduled PO
                </span>
              }
            ></Tab>
          </Tabs>
          <Row className="mb-4 mt-4">
            <Form inline>
              <Row>
                {activeKey === "against_PO" ? (
                  <Col xs="auto" lg="4">
                    <Form.Group style={{ position: "relative" }}>
                      <Form.Label className="fw-semibold mb-0">
                        Date filter:
                      </Form.Label>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer
                          components={["SingleInputDateRangeField"]}
                        >
                          <DateRangePicker
                            sx={{
                              "& .MuiInputBase-root": {
                                paddingRight: 0,
                              },
                              "& .MuiInputBase-input": {
                                padding: ".5rem .75rem .5rem .75rem",
                                "&:hover": {
                                  borderColor: "#dee2e6",
                                },
                              },
                            }}
                            value={selectedDateRange}
                            onChange={handleDateChange}
                            slots={{ field: SingleInputDateRangeField }}
                          />
                        </DemoContainer>
                      </LocalizationProvider>
                      {selectedDateRange[0] && selectedDateRange[1] && (
                        <CancelIcon
                          style={{
                            position: "absolute",
                            right: "0",
                            top: "39px",
                          }}
                          onClick={clearDateRange}
                        />
                      )}
                    </Form.Group>
                  </Col>
                ) : null}

                <Col xs="auto" lg="4">
                  <Form.Group className="fw-semibold mb-0">
                    <Form.Label>Factory Filter:</Form.Label>
                    <Form.Select
                      as="select"
                      className="mr-sm-2"
                      value={selectedFactory}
                      onChange={(e) => setSelectedFactory(e.target.value)}
                    >
                      <option value="">All Factory</option>
                      <option value="Please Assign Factory">
                        Please Assign Factory
                      </option>
                      {factories?.map((factory) => (
                        <option key={factory.id} value={factory.id}>
                          {factory.factory_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>

                {activeKey === "manual_PO" || activeKey === "scheduled_PO" ? (
                  <Col xs="auto" lg="4">
                    <Form.Group className="fw-semibold mb-0">
                      <Form.Label>Product Filter:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Product"
                        // value={manualProductF}
                        // onChange={(e) => setManualProductF(e.target.value)}
                        onKeyDown={(e) => productNamee(e)}
                      />
                    </Form.Group>
                  </Col>
                ) : null}

                <Col xs="auto" lg="4">
                  <Form.Group>
                    <Form.Label className="fw-semibold">Page Size:</Form.Label>
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
                </Col>
              </Row>
              <Row className="mt-3">
                <Box className="d-flex justify-content-end">
                  {/* <Form.Group className="fw-semibold mb-0">
                    <Form.Select
                      as="select"
                      className="mr-sm-2"
                      value={selectedFactoryName} // Keep track of the selected factory
                      onChange={(e) => setSelectedFactoryName(e.target.value)}
                    >
                      <option value="">{"Please Assign factory"}</option>
                      {factories?.map((factory) => (
                        <option key={factory.id} value={factory.id}>
                          {factory.factory_name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group> */}
                  <Select
                    options={factories?.map((factory) => ({
                      label: factory.factory_name,
                      value: factory.id,
                    }))}
                    value={
                      selectedFactoryName
                        ? factories?.find(
                          (option) => option.value === selectedFactoryName
                        )
                        : null
                    }
                    onChange={handleChangeFactoryForMul}
                    isClearable
                    placeholder="Select Factory"
                    noOptionsMessage={() => "No Factory found"}
                    getOptionLabel={(option) => option.label}
                    getOptionValue={(option) => option.value}
                    closeMenuOnSelect={false}
                  />

                  <Button
                    className="ms-2"
                    onClick={() => handleUpdateForMultiProd()}
                  >
                    Update Factory
                  </Button>
                </Box>
              </Row>
            </Form>
          </Row>
          <Box className="mt-2">
            {activeKey === "against_PO" &&
              (poLoader ? (
                <Loader />
              ) : (
                <>
                  {orders && orders.length !== 0 ? (
                    <DataTable
                      columns={columns1}
                      rows={orders}
                      page={page}
                      pageSize={pageSize}
                      totalPages={totalPages}
                      handleChange={handleChange}
                      paginationPosition="both"
                    />
                  ) : (
                    <Alert
                      severity="warning"
                      sx={{ fontFamily: "monospace", fontSize: "18px" }}
                    >
                      Records is not Available for above filter
                    </Alert>
                  )}
                </>
              ))}
            {activeKey === "manual_PO" &&
              (manualOrScheduledPoLoader ? (
                <Loader />
              ) : (
                <>
                  {manualPOorders && manualPOorders.length !== 0 ? (
                    <DataTable
                      columns={columnsMPO}
                      rows={manualPOorders}
                      page={page}
                      pageSize={pageSize}
                      totalPages={totalPages}
                      handleChange={handleChange}
                      rowHeight="auto"
                      paginationPosition="top"
                    />
                  ) : (
                    <Alert
                      severity="warning"
                      sx={{ fontFamily: "monospace", fontSize: "18px" }}
                    >
                      Records is not Available for above filter
                    </Alert>
                  )}
                </>
              ))}
            {activeKey === "scheduled_PO" &&
              (manualOrScheduledPoLoader ? (
                <Loader />
              ) : (
                <>
                  {scheduledPOorders && scheduledPOorders.length !== 0 ? (
                    <DataTable
                      columns={columnsSPO}
                      rows={scheduledPOorders}
                      page={page}
                      pageSize={pageSize}
                      totalPages={totalPages}
                      handleChange={handleChange}
                      rowHeight="auto"
                      paginationPosition="top"
                    />
                  ) : (
                    <Alert
                      severity="warning"
                      sx={{ fontFamily: "monospace", fontSize: "18px" }}
                    >
                      Records is not Available for above filter
                    </Alert>
                  )}
                </>
              ))}
          </Box>
          {activeKey === "manual_PO" ? (
            <Row>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Add Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  onChange={(e) => setManualNote(e.target.value)}
                />
              </Form.Group>
            </Row>
          ) : null}
          {activeKey === "scheduled_PO" ? (
            <Row>
              <Form.Group
                className="mb-3"
                controlId="exampleForm.ControlTextarea1"
              >
                <Form.Label>Add Note</Form.Label>
                <Form.Control
                  as="textarea"
                  rows={2}
                  onChange={(e) => setScheduledNote(e.target.value)}
                />
              </Form.Group>
            </Row>
          ) : null}
          {activeKey === "scheduled_PO" ? (
            <Row>
              <Col xs="auto" lg="4">
                <Form.Group controlId="duedate">
                  <Form.Label>Estimated time</Form.Label>
                  <Form.Control
                    as="select"
                    className="mr-sm-2"
                    value={estimatedTime}
                    onChange={(e) => setEstimatedTime(e.target.value)}
                  >
                    <option value="">select time</option>
                    {EstimatedTime.map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col xs="auto" lg="4">
                <Form.Group controlId="duedate">
                  <Form.Label>Remainder date</Form.Label>
                  <Form.Control
                    type="date"
                    name="duedate"
                    placeholder="Due date"
                    onChange={(e) => setRemainderDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
          ) : null}

          <Box className="d-flex justify-content-end align-items-center pt-3 my-4">
            <Button
              variant="outline-primary"
              className="me-2 fw-semibold"
              onClick={handleSelectAll}
            >
              Select All Orders
            </Button>

            <Button
              variant="outline-success"
              className="me-2 fw-semibold"
              disabled={selectedRowCount === 0}
              onClick={handleDownloadPDF}
              title={selectedRowCount === 0 ? "Select at least one product to download PDF" : `Download PDF for ${selectedRowCount} selected product(s)`}
            >
              ⬇ Download PDF
            </Button>

            <Button
              variant="primary"
              className="ms-2 fw-semibold"
              disabled={isDisabled}
              onClick={handleGeneratePO}
            >
              Create PO
            </Button>
          </Box>
        </Card.Body>
      </Card>
      {PoDetailsModal && (
        <PoDetailsModal
          show={poDetailsModal}
          poDetailsModal={poDetailsModal}
          productId={productId}
          productName={productName}
          variationId={variationId}
          factoryId={factoryId}
          startD={startDate}
          endD={endDate}
          handleClosePoDetailsModal={() => setPoDetailsModal(false)}
        />
      )}
      <Modal
        show={showEditModal}
        // onHide={handleCloseEditModal}
        onHide={() => setShowEditModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Product ID - {imageId}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Card className="factory-card">
            <img src={imageURL} alt="Product" />
          </Card>
        </Modal.Body>
      </Modal>

      <Modal show={pushToCsModalOpen} onHide={handleClosePushToCsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Push to CS</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeKey === "against_PO" && pushToCsOrdersLoading ? (
            <Box className="d-flex justify-content-center py-4">
              <Loader />
            </Box>
          ) : (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Order ID</Form.Label>
                <Form.Select
                  value={selectedOrderIdForPush}
                  onChange={(e) => setSelectedOrderIdForPush(e.target.value)}
                  disabled={pushToCsOrderSelectOptions.length === 0}
                >
                  <option value="">Select order ID</option>
                  {pushToCsOrderSelectOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>
                  Reason note <span className="text-danger">*</span>
                </Form.Label>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Enter why this order is being pushed to customer support"
                  value={pushToCsNote}
                  onChange={(e) => setPushToCsNote(e.target.value)}
                  disabled={pushToCsSubmitting}
                  required
                />
              </Form.Group>
              {pushToCsOrderSelectOptions.length === 0 &&
                !pushToCsOrdersLoading && (
                  <Alert severity="warning" sx={{ py: 1 }}>
                    No order IDs found for the current selection.
                  </Alert>
                )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleClosePushToCsModal}
            disabled={pushToCsSubmitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            disabled={
              !selectedOrderIdForPush ||
              !String(pushToCsNote ?? "").trim() ||
              pushToCsOrdersLoading ||
              pushToCsSubmitting
            }
            onClick={handleConfirmPushToCS}
          >
            {pushToCsSubmitting ? "Sending…" : "Confirm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default BackFromCS;
