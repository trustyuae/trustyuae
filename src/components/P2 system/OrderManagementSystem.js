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
  ManualOrScheduledPoDetailsData,
  PoDetailsData,
} from "../../Redux2/slices/P2SystemSlice";
import Swal from "sweetalert2";

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
  const [selectedAgainstOrderDetails, setSelectedAgainstOrderDetails] =
    useState([]);
  const [selectedManualOrderDetails, setSelectedManualOrderDetails] = useState(
    []
  );
  const [selectedScheduledOrderDetails, setSelectedScheduledOrderDetails] =
    useState([]);

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
  const [isDisabled, setIsDisabled] = useState(false);
  const [imageURL, setImageURL] = useState("");
  const [imageId, setImageId] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedFactoryName, setSelectedFactoryName] = useState("");

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
    dispatch(AssignFactoryToMultiProduct({ payload })).then(({ payload }) => {
      setSelectedAgainstOrderDetails([]);
      setSelectedOrderIds([]);
      setSelectedFactoryName("");
      if (payload) {
        Swal.fire({
          title: payload.data.message,
          icon: payload.status === 200 ? "success" : "error",
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
        const factory = factories.find(
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
      let apiUrl = `wp-json/custom-preorder-products/v1/pre-order/?&per_page=${pageSize}&page=${page}`;
      if (endDate) apiUrl += `&start_date=${startDate}&end_date=${endDate}`;
      if (selectedFactory) apiUrl += `&factory_id=${selectedFactory}`;
      dispatch(PoDetailsData(apiUrl)).then(({ payload }) => {
        let data = payload?.pre_orders?.map((v, i) => ({
          ...v,
          id: i + currentStartIndex,
        }));
        setOrders(data);
        setTotalPages(payload.total_pages);
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
    </Container>
  );
}

export default OrderManagementSystem;
