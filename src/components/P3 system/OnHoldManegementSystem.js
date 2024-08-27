import React, { useEffect, useMemo, useRef, useState } from "react";
import { MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import {
  Alert,
  Avatar,
  Box,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Typography,
} from "@mui/material";
import DataTable from "../DataTable";
import { useDispatch, useSelector } from "react-redux";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/AxiosInstance";

import Select from "react-select";
import Swal from "sweetalert2";
import { fetchAllFactories } from "../../Redux2/slices/FactoriesSlice";
import {
  AddGrn,
  FetchPoProductData,
  GetAllProducts,
  GetProductManual,
} from "../../Redux2/slices/P3SystemSlice";
import ShowAlert from "../../utils/ShowAlert";
import { AddMessage } from "../../Redux2/slices/OrderSystemSlice";
import { MergeRounded } from "@mui/icons-material";
import { getUserData } from "../../utils/StorageUtils";

function OnHoldManegementSystem() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = (today.getMonth() + 1).toString().padStart(2, "0");
    const day = today.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const [productNameF, setProductName] = useState("");
  const [productIDF, setProductID] = useState("");
  const [singleProductD, setSingleProductD] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [poTableData, setPoTableData] = useState([]);
  const [date, setDate] = useState(getTodayDate());
  const [isValid, setIsValid] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const [selectedOption, setSelectedOption] = useState(null);
  const [optionsArray, setoptionsArray] = useState([]);

  const [selectedFactory, setSelectedFactory] = useState("");
  const [selectedPOId, setSelectedPOId] = useState("");
  const [factories, setFactories] = useState([]);

  const [allPoIds, setAllPoIds] = useState([]);

  const [poId, setPoId] = useState("");

  const [pageSize, setPageSize] = useState(100);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentStartIndex, setCurrentStartIndex] = useState(1);

  const factoryData = useSelector((state) => state?.factory?.factories);
  const [userData, setUserData] = useState(null);
  const [showMessageModal, setshowMessageModal] = useState(false);
  const [message, setMessage] = useState("");

  const allProducts = useSelector(
    (state) => state?.p3System?.allProducts?.products
  );

  useEffect(() => {
    dispatch(fetchAllFactories());
  }, [dispatch]);

  useEffect(() => {
    if (factoryData) {
      const factData = factoryData?.factories?.map((item) => ({ ...item }));
      setFactories(factData);
    }
  }, [factoryData]);

  async function fetchUserData() {
    try {
      const userdata = await getUserData();
      setUserData(userdata || {});
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  }

  useEffect(() => {
    fetchUserData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMemo(() => {
    if (Array.isArray(allProducts)) {
      // Ensure allProducts is an array
      setoptionsArray(
        allProducts.map((user) => ({
          label: user?.product_name,
          value: user?.product_id,
        }))
      );
    }
  }, [allProducts]);

  useEffect(() => {
    dispatch(GetAllProducts());
  }, [dispatch]);

  useEffect(() => {
    if (selectedOption) {
      setProductName(selectedOption.label);
      setProductID(selectedOption.value);
    }
  }, [selectedOption]);

  const renderVariationValues = (params) => {
    const variationArray = Object.entries(params.row.variation_values).map(
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

  const renderVariationValuesPoColumn = (params) => {
    // Check if params.row and params.row.variation_values are defined
    const variationValues = params.row?.variation_values;

    // Handle case where variationValues is undefined or null
    if (!variationValues || typeof variationValues !== "object") {
      return (
        <Box className="d-flex justify-content-around align-items-center w-100">
          <Box>No any variation</Box>
        </Box>
      );
    }

    // Convert variationValues object to an array of objects
    const variationArray = Object.entries(variationValues).map(
      ([key, value]) => ({ [key]: value })
    );

    const noVariation = variationArray.length === 0;
    return (
      <Box className="d-flex justify-content-around align-items-center w-100">
        {noVariation ? (
          <Box>No any variation</Box>
        ) : (
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
                    <div className="col-6 d-flex justify-content-end align-items-center">
                      <InputLabel
                        id={`customer-color-${params.row.id}-label`}
                        className="d-flex"
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
                          value={params.row[attributeName] || ""}
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
      </Box>
    );
  };

  const columns = [
    {
      field: "product_name",
      headerName: "product name",
      flex: 1,
      className: " d-flex justify-content-center align-items-center",
    },
    {
      field: "product_image",
      headerName: "product image",
      flex: 1,
      type: "html",
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
                height: "90%",
                width: "100%",
                borderRadius: "2px",
              },
            }}
          />
        </Box>
      ),
    },
    {
      field: "Quantity",
      headerName: "Quantity",
      flex: 1,
      renderCell: (params) => (
        <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
          <Form.Control
            type="number"
            min="0"
            step="1"
            value={params.row.Quantity || 0}
            placeholder="0"
            // onChange={(e) => handleQtyChange(params.row, e)}
            style={{ width: "50%", textAlign: "center" }}
          />
        </Form.Group>
      ),
    },
    {
      field: "variation_values",
      headerName: "Variation Values",
      flex: 1,
      renderCell: renderVariationValues,
    },
    {
      field: "",
      headerName: "Action",
      flex: 1,
      type: "html",
      renderCell: (params) => (
        <Button
          type="button"
          className="w-auto w-auto bg-transparent border-0 text-secondary fs-5"
          onClick={() => handleDelete(params.row.id)}
        >
          <MdDelete className="mb-1" />
        </Button>
      ),
    },
  ];

  const poColumns = [
    {
      field: "product_id",
      headerName: "product id",
      flex: 0.5,
      className: " d-flex justify-content-center align-items-center",
    },
    {
      field: "image",
      headerName: "product image",
      flex: 1,
      className: " d-flex justify-content-center align-items-center",
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
                height: "90%",
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
      headerName: "Variation Values",
      flex: 1.5,
      renderCell: renderVariationValuesPoColumn,
    },
    {
      field: "quantity",
      headerName: "Quantity",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.row.quantity}
        </Box>
      ),
    },
    {
      field: "received_quantity",
      headerName: "received quantity",
      flex: 1,
      renderCell: (params) => {
        return (
          <Form.Group className="fw-semibold d-flex align-items-center justify-content-center h-100">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100%",
              }}
            >
              <Form.Control
                type="number"
                value={params.row.received_quantity}
                placeholder="0"
                onChange={(e) => handleRecievedQtyChange(e, params.row)}
                style={{
                  textAlign: "center",
                  height: "40px",
                  lineHeight: "40px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />
            </div>
          </Form.Group>
        );
      },
    },
  ];

  function handleAttributeChange(event, rowIndex, attributeName) {
    const newValue = event.target.value;
    rowIndex.variation_values[attributeName] = newValue;
    const updatedData = tableData.map((item) =>
      item.id === rowIndex.id ? { ...item, ...rowIndex } : item
    );
    setTableData(updatedData);
    validateForm(updatedData);
  }

  // const handleQtyChange = (index, event) => {
  //   const newQuantity = parseFloat(event?.target?.value);
  //   if (!isNaN(newQuantity) && index.target.value >= 0) {
  //     const updatedRecivedQtyData = poTableData.map((item) => {
  //       if (item?.product_id === event?.product_id) {
  //         if (item.variation_id == event.variation_id) {
  //           return { ...item, received_quantity: index?.target?.value };
  //         }
  //       }
  //       return item;
  //     });
  //     setPoTableData(updatedRecivedQtyData);
  //   }
  // };

  const handleFieldChange = (id, field, value) => {
    const updatedData = tableData.map((item) => {
      if (item.id === value.id) {
        return {
          ...item,
          [field]: id,
          ...(field === "variationColor" && {
            variation_values: {
              attribute_color: id,
              ...(value.variation_values.size === undefined
                ? { attribute_size: value.variationSize }
                : { size: value.variation_values.size }),
            },
          }),
          ...(field === "variationSize" && {
            variation_values: {
              attribute_size: id,
              ...(value.variation_values.color === undefined
                ? { attribute_color: value.variationColor }
                : { color: value.variation_values.color }),
            },
          }),
        };
      }
      return item;
    });
    setTableData(updatedData);
    validateForm(updatedData);
  };

  const handleDelete = (id) => {
    const updatedData = tableData.filter((item) => item.id !== id);
    setTableData(updatedData);
  };

  const getAllProducts = async () => {
    let apiUrl = `wp-json/custom-api-product/v1/get-product/?`;
    if (productNameF && productIDF) {
      apiUrl += `product_name=${productNameF}&product_id=${productIDF}`;
    } else if (productNameF) {
      apiUrl += `product_name=${productNameF}`;
    } else if (productIDF) {
      apiUrl += `product_id=${productIDF}`;
    }
    try {
      if (productIDF) {
        setSelectedOption(null);
        dispatch(GetProductManual(apiUrl)).then(({ payload }) => {
          const data = payload?.products?.map((v, i) => ({
            ...v,
            id: i,
          }));
          const modifiedData = data?.map((item) => ({
            ...item,
            variationColor: item?.variation_values.length === 0 ? "" : "",
            variationSize: item?.variation_values.length === 0 ? "" : "",
          }));
          setSingleProductD(modifiedData);
          inputRef.current.value = "";
        });
      } else if (productNameF && productIDF) {
        dispatch(GetProductManual(apiUrl)).then(({ payload }) => {
          if (payload.products) {
            setSelectedOption(null);
          }
          const data = payload.products.map((v, i) => ({ ...v, id: i }));
          const modifiedData = data.map((item) => ({
            ...item,
            variationColor: item.variation_values.length === 0 ? "" : "",
            variationSize: item.variation_values.length === 0 ? "" : "",
          }));
          setSingleProductD(modifiedData);
          inputRef.current.value = "";
        });
      }
    } catch (error) {
      console.error("Error occurred:", error);
      setSingleProductD([]);
    }
  };

  const handlePageSizeChange = (e) => {
    setPageSize(parseInt(e.target.value));
    setPage(1);
  };

  useEffect(() => {
    handalADDProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleProductD]);

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productNameF, productIDF, tableData]);

  // const handalADDProduct = () => {
  //   let data = [...tableData, ...singleProductD];
  //   let Updatedata = data.map((v, i) => ({
  //     ...v,
  //     id: i,
  //     Quantity: v.Quantity !== "" ? v.Quantity : 1,
  //     variationColor:
  //       v.variation_values.attribute_color !== undefined
  //         ? v.variation_values.attribute_color
  //         : "",
  //     variationSize:
  //       v.variation_values.attribute_size !== undefined
  //         ? v.variation_values.attribute_size
  //         : "",
  //   }));
  //   validateForm(Updatedata);

  //   const mergedData = Updatedata.reduce((acc, item) => {
  //     // Create a unique key based on product_name and variation_values
  //     const key = JSON.stringify({
  //       product_name: item.product_id,
  //       variation_values: item.variation_values,
  //     });

  //     // Check if the key is in the accumulator
  //     const existingIndex = acc.findIndex(
  //       (entry) =>
  //         JSON.stringify({
  //           product_name: entry.product_id,
  //           variation_values: entry.variation_values,
  //         }) === key
  //     );

  //     if (existingIndex === -1) {
  //       // If the key is not in the accumulator, add it to the start of the array
  //       acc.unshift({ ...item, Quantity: item.Quantity });
  //     } else {
  //       // If the key exists, increase the Quantity by 1 and move the item to the start of the array
  //       acc[existingIndex].Quantity = String(
  //         Number(acc[existingIndex].Quantity) + 1
  //       );
  //       const updatedItem = acc.splice(existingIndex, 1)[0];
  //       acc.unshift(updatedItem);
  //     }
  //     return acc;
  //   }, []);
  //   setTableData(mergedData);
  //   setProductName("");
  //   setProductID("");
  // };

  const handalADDProduct = () => {
    const itemMap = new Map();

    tableData.forEach((item) => {
      const key = JSON.stringify({
        product_id: item.product_id,
        variation_values: item.variation_values,
      });
      itemMap.set(key, item);
    });

    // Track items that are updated or new
    const updatedItems = [];

    // Add or update new items in the map
    singleProductD.forEach((item) => {
      const key = JSON.stringify({
        product_id: item.product_id,
        variation_values: item.variation_values,
      });

      if (itemMap.has(key)) {
        // Update existing item quantity
        const existingItem = itemMap.get(key);
        existingItem.Quantity = String(Number(existingItem.Quantity) + 1);
        itemMap.set(key, existingItem);

        // Add to updated items
        updatedItems.push(existingItem);
      } else {
        // Add new item with an updated id
        const newItem = {
          ...item,
          id: Date.now(), // Use a timestamp or other unique identifier for sorting
          Quantity: item.Quantity !== "" ? item.Quantity : 1,
          variationColor:
            item.variation_values.attribute_color !== undefined
              ? item.variation_values.attribute_color
              : "",
          variationSize:
            item.variation_values.attribute_size !== undefined
              ? item.variation_values.attribute_size
              : "",
        };
        itemMap.set(key, newItem);
        updatedItems.push(newItem);
      }
    });

    // Convert map to an array
    const remainingItems = Array.from(itemMap.values());

    // Remove updated items from remaining items to avoid duplicates
    const remainingItemsWithoutUpdates = remainingItems.filter(
      (item) =>
        !updatedItems.some(
          (updatedItem) =>
            JSON.stringify({
              product_id: updatedItem.product_id,
              variation_values: updatedItem.variation_values,
            }) ===
            JSON.stringify({
              product_id: item.product_id,
              variation_values: item.variation_values,
            })
        )
    );

    // Combine updated items at the top with remaining items
    const updatedData = [...updatedItems, ...remainingItemsWithoutUpdates];

    // Update state with sorted data
    setTableData(updatedData);
    setProductName("");
    setProductID("");
  };

  const handalonChangeProductId = (e) => {
    if (e.key === "Enter") {
      setProductName("");
      setProductID(e.target.value);
    }
  };

  const validateForm = async (data) => {
    try {
      let dataa = data.filter(
        (o) =>
          o?.variation_values && Object?.keys(o?.variation_values)?.length > 0
      );

      const isAllVariationsString = dataa?.every((item) => {
        const values = Object?.values(item?.variation_values);
        return values.every((value) => typeof value == "string");
      });

      const isQuantityAvailable = dataa?.every((item) => item.Quantity != "");
      console.log(isAllVariationsString, "isAllVariationsString");
      console.log(isQuantityAvailable, "isQuantityAvailable");
      // Set the validation state
      setIsValid(isAllVariationsString && isQuantityAvailable);
    } catch (error) {
      console.error("Error during validation:", error);
      setIsValid(false); // or handle the error as needed
    }
  };

  const handleSubmit = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const variationIds = tableData.flatMap((item) => {
      if (Array.isArray(item.variation_id) && item.variation_id.length > 0) {
        return item.variation_id.map((id) => id.toString());
      } else {
        return ["0"];
      }
    });

    const payload = {
      product_id: tableData.map((item) => item.product_id),
      variation_id: variationIds,
      received_qty: tableData.map((item) => item.Quantity),
      created_date: currentDate,
      verified_by: userData?.first_name + " " + userData?.last_name,
      note: message,
      status: "Pending for process",
    };
    try {
      dispatch(AddGrn(payload)).then(({ payload }) => {
        Swal.fire({
          title: payload.data,
          icon: payload.status === 200 ? "success" : "error",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/GRN_Management");
          }
        });
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleFactoryChange = (e) => {
    setSelectedFactory(e.target.value);
  };

  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };

  const selectPOId = async () => {
    try {
      const response = await axiosInstance.get(
        `wp-json/get-po-ids/v1/show-po-id/${selectedFactory}`
      );
      let data = response.data;
      setAllPoIds(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPoProductData = async () => {
    try {
      dispatch(FetchPoProductData({ selectedPOId })).then(({ payload }) => {
        const data = payload?.line_items?.map((item, i) => ({
          ...item,
          id: i + currentStartIndex,
        }));
        setPoTableData(data);
        setTotalPages(payload.total_pages);
        setPoId(payload.po_id);
      });
    } catch (error) {
      console.error("Error fetching PO product data:", error);
    }
  };

  const handleRecievedQtyChange = (index, event) => {
    if (index.target.value >= 0) {
      const updatedRecivedQtyData = poTableData.map((item) => {
        if (item.product_id === event.product_id) {
          if (item.variation_id == event.variation_id) {
            return { ...item, received_quantity: index.target.value };
          }
        }
        return item;
      });
      setPoTableData(updatedRecivedQtyData);
    }
  };

  const handleCreateGrn = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    const payload = {
      po_id: poId || "",
      product_id: poTableData.map((item) => item.product_id),
      variation_id: poTableData.map((item) => item.variation_id),
      received_qty: poTableData.map((item) => item.received_quantity),
      created_date: currentDate,
      verified_by: userData?.first_name + " " + userData?.last_name || "",
      note: message,
      status: "Processing",
    };

    try {
      await dispatch(AddGrn(payload)).then(({ payload }) => {
        Swal.fire({
          title: payload.data,
          icon: payload.status === 200 ? "success" : "error",
          showConfirmButton: true,
        }).then((result) => {
          if (result.isConfirmed) {
            navigate("/GRN_Management");
          }
        });
      });
      const updatedPoTableData = poTableData.map((item) => ({
        ...item,
        received_quantity: 0,
      }));
      setPoTableData(updatedPoTableData);
    } catch (error) {
      console.error("Error submitting data:", error);
    }
  };

  const handleChange = (event, value) => {
    setPage(value);
    let currIndex = value * pageSize - pageSize + 1;
    setCurrentStartIndex(currIndex, "currIndex");
  };

  useEffect(() => {
    if (selectedFactory) {
      selectPOId();
    }
  }, [selectedFactory]);

  useEffect(() => {
    if (selectedPOId) {
      fetchPoProductData();
    }
  }, [selectedPOId, selectedFactory, poId, pageSize, page]);

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          On-hold Management System
        </Typography>
      </Box>
      <Form inline className="mb-4">
        <Row className="align-items-center px-1">
          <Col xs="auto" lg="3">
            <Form.Group controlId="duedate">
              <Form.Label className="fw-semibold">Date filter:</Form.Label>
              <Form.Control
                type="date"
                name="duedate"
                placeholder="Due date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Form.Group>
          </Col>
          <Col xs="auto" lg="3">
            <Form.Group>
              <Form.Label className="fw-semibold">Verified By:</Form.Label>

              <Form.Control
                type="text"
                placeholder="Enter No of received boxes"
                value={userData?.first_name + " " + userData?.last_name}
                readOnly
                disabled
                className="mr-sm-2 py-2"
              />
            </Form.Group>
          </Col>
          <Col xs="auto" lg="3">
            <Form.Group className="fw-semibold mb-0">
              <Form.Label>Factory Filter</Form.Label>
              <Form.Select
                className="mr-sm-2"
                value={selectedFactory}
                onChange={(e) => handleFactoryChange(e)}
              >
                <option value="">All Factory</option>
                {factories?.map((factory) => (
                  <option key={factory?.id} value={factory?.id}>
                    {factory?.factory_name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
          <Col xs="auto" lg="3">
            <Form.Group>
              <Form.Label className="fw-semibold">Select PO ID</Form.Label>
              <Form.Select
                className="mr-sm-2 py-2"
                value={selectedPOId}
                onChange={(e) => setSelectedPOId(e.target.value)} // Update this to set the selected PO type
              >
                <option value="">Select...</option>
                {allPoIds?.map((po) => (
                  <option key={po.id} value={po.id}>
                    {po}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>
        {selectedFactory.length > 0 && (
          <Row className="align-items-center py-3">
            <Box className="d-flex justify-content-end">
              <Form.Group className="d-flex mx-1 align-items-center">
                <Form.Label className="fw-semibold mb-0 me-2">
                  PageSize
                </Form.Label>
                <Form.Control
                  as="select"
                  className="w-auto"
                  value={pageSize}
                  onChange={handlePageSizeChange}
                >
                  {pageSizeOptions?.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </Box>
          </Row>
        )}
      </Form>
      {selectedFactory.length <= 0 && (
        <MDBRow className="px-3">
          <Card className="py-3">
            <Row className=" justify-content-start">
              <Col xs="auto" lg="4">
                <Form.Group className="fw-semibold mb-0">
                  <Form.Label>Product Name:</Form.Label>
                  <Select
                    value={selectedOption}
                    onChange={(option) => setSelectedOption(option)}
                    options={optionsArray}
                  />
                </Form.Group>
              </Col>
              <Col xs="auto" lg="4">
                <Form.Group className="fw-semibold mb-0">
                  <Form.Label>Product ID:</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter Product ID"
                    ref={inputRef}
                    onKeyDown={(e) => handalonChangeProductId(e)}
                  />
                </Form.Group>
              </Col>
              {/* <Col xs="auto" lg="4">
                <Form.Group className="fw-semibold mb-0">
                  <Form.Label>PageSize</Form.Label>
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
              </Col> */}
            </Row>
          </Card>
        </MDBRow>
      )}
      <MDBRow className="px-3">
        <Card className="py-3">
          {tableData.length > 0 && selectedFactory.length <= 0 && (
            <>
              <div className="mt-2">
                <DataTable
                  columns={columns}
                  rows={tableData}
                  // rowHeight={'auto'}
                  // page={page}
                  // pageSize={pageSize}
                  // totalPages={totalPages}
                  // handleChange={handleChange}
                  showAllRows={true}
                  rowHeight="auto"
                  hidePagination={true}
                />
              </div>
              <MDBRow className="justify-content-end px-3 py-2">
                <Button
                  variant="primary"
                  disabled={
                    !isValid && poTableData.length == 0 && tableData.length == 0
                  }
                  style={{ width: "130px" }}
                  onClick={() => setshowMessageModal(true)}
                >
                  submit
                </Button>
              </MDBRow>
            </>
          )}

          {selectedFactory.length > 0 && (
            <>
              <div className="mt-2">
                {poTableData && poTableData.length != 0 ? (
                  <>
                    <DataTable
                      columns={poColumns}
                      rows={poTableData}
                      page={page}
                      pageSize={pageSize}
                      totalPages={totalPages}
                      handleChange={handleChange}
                      rowHeight="auto"
                      showAllRows={true}
                      // getRowId={(row) => row.product_id + "-" + row.variation_id} // or another unique property
                      hidePagination={true}
                    />
                  </>
                ) : (
                  <>
                    <Alert
                      severity="warning"
                      sx={{ fontFamily: "monospace", fontSize: "18px" }}
                    >
                      Records is not Available for above filter
                    </Alert>
                  </>
                )}
              </div>
              <MDBRow className="justify-content-end px-3 py-2">
                <Button
                  variant="primary"
                  disabled={
                    !isValid && poTableData.length == 0 && tableData.length == 0
                  }
                  style={{ width: "130px" }}
                  // onClick={handleCreateGrn}
                  onClick={() => setshowMessageModal(true)}
                >
                  Create GRN
                </Button>
              </MDBRow>
            </>
          )}
        </Card>
      </MDBRow>

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
      <Modal
        show={showMessageModal}
        onHide={() => setshowMessageModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add Remark</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            as="textarea"
            placeholder="Enter your message here..."
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <Box className="text-end my-3">
            <Button
              variant="primary"
              className="mt-2 fw-semibold"
              disabled={poTableData.length == 0 && tableData.length == 0}
              onClick={
                selectedFactory.length > 0 ? handleCreateGrn : handleSubmit
              }
            >
              Create GRN
            </Button>
          </Box>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default OnHoldManegementSystem;
