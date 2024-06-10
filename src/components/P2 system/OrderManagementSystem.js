import React, { useState, useEffect } from "react";
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
import { API_URL } from "../../redux/constants/Constants";
import { Card, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import {
  AddManualPO,
  AddPO,
  AddSchedulePO,
  ManualOrScheduledPoDetailsData,
  PoDetailsData,
} from "../../redux/actions/P2SystemActions";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import Loader from "../../utils/Loader";
import dayjs from "dayjs";
import PoDetailsModal from "./PoDetailsModal";
import ShowAlert from "../../utils/ShowAlert";

const EstimatedTime = ["1 week", "2 week", "3 week", "1 month", "Out of stock"];

function OrderManagementSystem() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [manualPOorders, setManualPoOrders] = useState([]);
  const [scheduledPOorders, setScheduleOrders] = useState([]);

  const [selectedOrderIds, setSelectedOrderIds] = useState([]);
  const [selectedOrderIdss, setSelectedOrderIdss] = useState([]);
  const [selectedManualOrderIds, setSelectedManualOrderIds] = useState([]);
  const [selectedScheduleOrderIds, setSelectedScheduleOrderIds] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(5);
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


  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );

  const poLoader = useSelector(
    (state) => state?.orderNotAvailable?.isPoDetailsData
  );

  const manualOrScheduledPoLoader = useSelector(
    (state) => state?.orderNotAvailable?.isManualOrScheduledPoDetailsData
  );

  function handleAttributeChange(event, rowIndex, attributeName) {
    const newValue = event.target.value;
    rowIndex.variation_values[attributeName] = newValue;
    if (activeKey === "manual_PO") {
      const updatedData = manualPOorders.map((item) =>
        item.id === rowIndex.id ? { ...item, ...rowIndex } : item
      );
      console.log(updatedData, "updatedData");
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
                  console.log(attributeValue, "attributeValue");
                  console.log(typeof attributeValue, "attributeValue===");
                  return (
                    <React.Fragment key={index}>
                      <div
                        className={`row mb-${
                          typeof attributeValue === "string" ? "3" : "4"
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
              onChange={(event) => handleOrderSelection(params.row.id)}
            />
          </FormGroup>
        );
      },
    },
    { field: "product_name", headerName: "Product names", flex: 1 },
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
      field: "total_quantity",
      headerName: "Total quantity",
      flex: 1,
      renderCell: (params) => {
        console.log(params,'paruuussusus')
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
        const factory = factories.find(
          (factory) => factory.id === params.row.factory_id
        );
        return factory ? factory.factory_name : "Please Assign factory";
      },
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
              onChange={() => handleOrderManualSelection(params.row.id)}
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
    { field: "product_name", headerName: "Product names", flex: 1 },
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
                if(e.target.value>=0){
                  handleMOQtyChange(e, params.row)}}
                }
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
              onChange={() =>
                handleOrderScheduleSelection(params.row.id)
              }
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
    { field: "product_name", headerName: "Product names", flex: 1 },
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
            onChange={(e) =>{ 
              if(e.target.value>=0){
                handleSOQtyChange(e, params.row)}}
              }
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

  useEffect(() => {
    dispatch(AllFactoryActions());
  }, [dispatch]);

  useEffect(() => {
    setFactories(allFactoryDatas);
  }, [allFactoryDatas]);

  const fetchOrders = async () => {
    try {
      let apiUrl = `${API_URL}wp-json/custom-preorder-products/v1/pre-order/?&per_page=${pageSize}&page=${page}`;
      if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
      if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
      await dispatch(PoDetailsData({ apiUrl })).then((response) => {
        let data = response.data.pre_orders.map((v, i) => ({
          ...v,
          id: i + currentStartIndex,
        }));
        setOrders(data);
        setTotalPages(response.data.total_pages);
      });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const manualPO = async () => {
    try {
      let apiUrl = `${API_URL}wp-json/custom-manual-po/v1/get-product-manual/?&per_page=${pageSize}&page=${page}`;
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
      let apiUrl = `${API_URL}wp-json/custom-manual-po/v1/get-product-manual/?&per_page=${pageSize}&page=${page}`;
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
      (response) => {
        data = response.data.products.map((v, i) => ({
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

        if (response.data.products) {
          setTotalPages(response.data.total_pages);
          return data;
        }
      }
    );
    return data;
  };

  const handleOrderSelection = (selectedId) => {
    const filteredOrders = orders.filter((order) => order.id === selectedId);
    const orderIds = filteredOrders.map((order) => order.order_ids);

    const isSelected = selectedOrderIds.includes(selectedId);
    const newSelected = isSelected
      ? selectedOrderIds.filter((id) => id !== selectedId)
      : [...selectedOrderIds, selectedId];
    const newSelected2 = isSelected
      ? selectedOrderIdss
          .filter((id) => id !== selectedId)
          .flatMap((id) => id.split(","))
      : [...selectedOrderIdss, ...orderIds.flatMap((str) => str.split(","))];

    setSelectedOrderIds(newSelected);
    setSelectedOrderIdss(newSelected2);
  };

  const handleOrderManualSelection = (selectedId) => {
    const selectedIndex = selectedManualOrderIds.indexOf(selectedId);
    const selectedQtyIndex = selectedMPOquantity?.findIndex(
      (qty) => qty.id === selectedId
    );

    const newSelected =
      selectedIndex === -1
        ? [...selectedManualOrderIds, selectedId]
        : selectedManualOrderIds.filter((id) => id !== selectedId);

    if (selectedQtyIndex === -1)
      setSelectedMPOquantity((prevData) =>
        prevData.filter((v) => v.id !== selectedId)
      );

    if (selectedIndex !== -1) {
      manualPOorders.find((o) => o.id === selectedId).Quantity = 0;
    }

    // setSelectedMPOquantity(newSelectedQty);
    setSelectedManualOrderIds(newSelected);
  };

  const handleOrderScheduleSelection = (selectedId) => {
    const selectedIndex = selectedScheduleOrderIds.indexOf(selectedId);
    const selectedQtyIndex = selectedSPOquantity?.findIndex(
      (qty) => qty.id === selectedId
    );

    const newSelected =
      selectedIndex === -1
        ? [...selectedScheduleOrderIds, selectedId]
        : selectedScheduleOrderIds.filter((id) => id !== selectedId);

    if (selectedQtyIndex === -1)
      setSelectedSPOquantity((prevData) =>
        prevData.filter((v) => v.id !== selectedId)
      );

    if (selectedIndex !== -1) {
      scheduledPOorders.find((o) => o.id === selectedId).Quantity = 0;
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
    setVariationId(itemData.variation_id)
    setProductName(itemData.product_name)
    setPoDetailsModal(true);
  };

  // PO Generate
  const handleGeneratePO = () => {
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
    const selectedOrders = orders.filter((order) =>
      selectedOrderIds.includes(order.id)
    );
    const factoryIds = [
      ...new Set(selectedOrders.map((order) => order.factory_id)),
    ];

    if (factoryIds.length === 1) {
      const selectedProductIds = selectedOrders
        .map((order) => order.item_id)
        .join(",");
      const selectedOrderIdsStr = selectedOrderIdss.join(",");

      const payload = {
        product_ids: selectedProductIds,
        factory_ids: factoryIds.join(","),
        order_ids: selectedOrderIdsStr,
      };
      try {
        await dispatch(AddPO(payload, navigate));
      } catch (error) {
        console.error("Error generating PO IDs:", error);
      }
    } else {
      let errMessage =
        "Selected orders belong to different factories. Please select orders from the same factory.";
      ShowAlert("", errMessage, "error", false, false, "", "", 1000);
    }
  };
  const handleGenerateManualPO = async () => {
    const selectedOrders = manualPOorders.filter((order) =>
      selectedManualOrderIds.includes(order.id)
    );
    const filteredOrders = getFilteredData(selectedOrders);
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
        await dispatch(AddManualPO(payload, navigate));
      } catch (error) {
        console.error("Error generating PO IDs:", error);
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
  };

  const handleGenerateScheduledPO = async () => {
    if(remainderDate&&estimatedTime){
      const selectedOrders = scheduledPOorders.filter((order) =>
        selectedScheduleOrderIds.includes(order.id)
      );
  
      const filteredOrders = getFilteredData(selectedOrders);
  
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
          note: scheduledNote,
          estimated_time: estimatedTime,
          reminder_date: remainderDate,
        };
        try {
          await dispatch(AddSchedulePO(payload, navigate));
        } catch (error) {
          console.error("Error generating PO IDs:", error);
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
    }else{
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

  return (
    <Container
      fluid
      className="py-3"
      style={{ maxHeight: "100%", minHeight: "100vh" }}
    >
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          Order Management System
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
                    <Form.Group>
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
                    </Form.Group>
                  </Col>
                ) : null}

                <Col xs="auto" lg="4">
                  <Form.Group className="fw-semibold mb-0">
                    <Form.Label>Factory Filter:</Form.Label>
                    <Form.Control
                      as="select"
                      className="mr-sm-2"
                      value={selectedFactory}
                      onChange={(e) => setSelectedFactory(e.target.value)}
                    >
                      <option value="">All Factory</option>
                      {factories.map((factory) => (
                        <option key={factory.id} value={factory.id}>
                          {factory.factory_name}
                        </option>
                      ))}
                    </Form.Control>
                  </Form.Group>
                </Col>

                {activeKey === "manual_PO" || activeKey === "scheduled_PO" ? (
                  <Col xs="auto" lg="4">
                    <Form.Group className="fw-semibold mb-0">
                      <Form.Label>Product Filter:</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Product"
                        value={manualProductF}
                        onChange={(e) => setManualProductF(e.target.value)}
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
              variant="primary"
              className="ms-2 fw-semibold"
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
    </Container>
  );
}

export default OrderManagementSystem;
