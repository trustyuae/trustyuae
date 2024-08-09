import React, { useEffect, useRef, useState } from "react";
import { MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import { Button, Card, Col, Modal, Row } from "react-bootstrap";
import {
  Avatar,
  Box,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  Typography,
} from "@mui/material";
import DataTable from "../DataTable";
import { API_URL } from "../../redux/constants/Constants";
import { useDispatch, useSelector } from "react-redux";
import { AddGrn, GetProductManual } from "../../redux/actions/P3SystemActions";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CompressImage } from "../../utils/CompressImage";
import axios from "axios";

import Select from "react-select";
import Swal from "sweetalert2";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";

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
  const [userName, setuserName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const [selectedOption, setSelectedOption] = useState(null);
  const [optionsArray, setoptionsArray] = useState([]);

  const [selectedFactory, setSelectedFactory] = useState("");
  const [selectedPOId, setSelectedPOId] = useState("");
  const [factories, setFactories] = useState([]);

  const [allPoIds, setAllPoIds] = useState([]);

  const [poId, setPoId] = useState("");

  const [pageSize, setPageSize] = useState(10);
  const pageSizeOptions = [5, 10, 20, 50, 100];
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentStartIndex, setCurrentStartIndex] = useState(1);

  const token = JSON.parse(localStorage.getItem("token"));

  const headers = {
    Authorization: `Live ${token}`,
  };

  useEffect(() => {
    dispatch(AllFactoryActions());
  }, [dispatch]);

  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );

  const getall = async () => {
    let url = `${API_URL}wp-json/custom-api-product/v1/get-product/?`;
    const response = await axios.get(url, { headers });
    setoptionsArray(
      response.data.products.map((user) => ({
        label: user.product_name,
        value: user.product_id,
      }))
    );
  };

  useEffect(() => {
    getall();
  }, []);

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
            onChange={(e) => handleQtyChange(params.row, e)}
            style={{ width: "50%",textAlign: "center" }}
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
      renderCell: (params) => (
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
              value={params.row.Quantity}
              placeholder="0"
              onChange={(e) => handleQtyChange(e, params.row)}
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
      ),
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
    let apiUrl = `${API_URL}wp-json/custom-api-product/v1/get-product/?`;
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
        const response = await dispatch(GetProductManual({ apiUrl }));
        const data = response.data.products.map((v, i) => ({ ...v, id: i }));
        const modifiedData = data.map((item) => ({
          ...item,
          variationColor: item.variation_values.length === 0 ? "" : "",
          variationSize: item.variation_values.length === 0 ? "" : "",
        }));
        setSingleProductD(modifiedData);
        inputRef.current.value = "";
      } else if (productNameF && productIDF) {
        const response = await dispatch(GetProductManual({ apiUrl }));
        if (response.data.products) {
          setSelectedOption(null);
        }
        const data = response.data.products.map((v, i) => ({ ...v, id: i }));
        const modifiedData = data.map((item) => ({
          ...item,
          variationColor: item.variation_values.length === 0 ? "" : "",
          variationSize: item.variation_values.length === 0 ? "" : "",
        }));
        setSingleProductD(modifiedData);
        inputRef.current.value = "";
      }
    } catch (error) {
      console.error(error);
      // setSingleProductD([]);
    }
  };

  useEffect(() => {
    handalADDProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [singleProductD]);

  useEffect(() => {
    getAllProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productNameF, productIDF, tableData]);

  useEffect(() => {
    let info = JSON.parse(localStorage.getItem("user_data"));
    setuserName(info.first_name + " " + info.last_name);
  }, []);

  const handalADDProduct = () => {
    let data = [...tableData, ...singleProductD];
    let Updatedata = data.map((v, i) => ({
      ...v,
      id: i,
      Quantity: v.Quantity !== "" ? v.Quantity : 1,
      variationColor:
        v.variation_values.attribute_color !== undefined
          ? v.variation_values.attribute_color
          : "",
      variationSize:
        v.variation_values.attribute_size !== undefined
          ? v.variation_values.attribute_size
          : "",
    }));
    validateForm(Updatedata);

    const mergedData = Updatedata.reduce((acc, item) => {
      // Create a unique key based on product_name and variation_values
      const key = JSON.stringify({
        product_name: item.product_id,
        variation_values: item.variation_values,
      });

      // Check if the key is in the accumulator
      const existingIndex = acc.findIndex(
        (entry) =>
          JSON.stringify({
            product_name: entry.product_id,
            variation_values: entry.variation_values,
          }) === key
      );

      if (existingIndex === -1) {
        // If the key is not in the accumulator, add it to the start of the array
        acc.unshift({ ...item, Quantity: item.Quantity });
      } else {
        // If the key exists, increase the Quantity by 1 and move the item to the start of the array
        acc[existingIndex].Quantity = String(
          Number(acc[existingIndex].Quantity) + 1
        );
        const updatedItem = acc.splice(existingIndex, 1)[0];
        acc.unshift(updatedItem);
      }
      return acc;
    }, []);
    setTableData(mergedData);
    setProductName("");
    setProductID("");
  };

  const handalonChangeProductId = (e) => {
    if (e.key === "Enter") {
      setProductName("");
      setProductID(e.target.value);
    }
  };

  const validateForm = (data) => {
    let dataa = data.filter(
      (o) => o.variation_values && Object.keys(o.variation_values).length > 0
    );
    const isAllVariationsString = data.every((item) => {
      const values = Object.values(item.variation_values);
      return values.every((value) => typeof value === "string");
    });

    const isQuantityAvailable = data.every((item) => item.Quantity !== "");
    setIsValid(isAllVariationsString && isQuantityAvailable);
  };

  const handleSubmit = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    // tableData.forEach((data) => {
    //   if (data.variation_details && data.variation_values) {
    //     const { variation_details, variation_values } = data;
    //     const matchingKeys = Object.keys(variation_details).filter((key) => {
    //       const detail = variation_details[key];
    //       // Check if all properties in variation_values match with detail
    //       return Object.keys(variation_values).every((prop) => {
    //         return detail[prop] === variation_values[prop];
    //       });
    //     });
    //     if (matchingKeys.length > 0) {
    //       data.variation_id = Number(matchingKeys[0]);
    //     }
    //   }
    // });
    // const convertedData = tableData.map((item) => ({
    //   product_id: parseInt(item.product_id),
    //   product_name: item.product_name,
    //   product_image: item.product_image,
    //   variation_id: item.variation_id ? item.variation_id : 0,
    //   variations: item.variation_values,
    //   qty_remain: parseInt(item.Quantity),
    //   updated_date: currentDate,
    // }));

    const variationIds = tableData.flatMap((item) => {
      return Array.isArray(item.variation_id)
        ? item.variation_id.map((id) => id.toString())
        : [""];
    });

    const payload = {
      product_id: tableData.map((item) => item.product_id),
      variation_id: variationIds,
      received_qty: tableData.map((item) => item.Quantity),
      created_date: currentDate,
      verified_by: userName,
      status: "Pending for process",
    };
    try {
      dispatch(AddGrn(payload, navigate));
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateGrn = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    console.log(poTableData,'poTableData in console')
    const payload = {
      po_id: poId || "",
      product_id: poTableData.map((item) => item.product_id),
      variation_id: poTableData.map((item) => item.variation_id),
      received_qty: poTableData.map((item) => item.received_quantity),
      created_date: currentDate,
      verified_by: userName || "",
      status: "Processing",
    };
    try {
      console.log(payload,'payload')
      await dispatch(AddGrn(payload, navigate)); // Make sure dispatch is async if it returns a promise
    } catch (error) {
      console.error("Error submitting data:", error);
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
      const response = await axios.get(
        `${API_URL}wp-json/get-po-ids/v1/show-po-id/${selectedFactory}`,
        { headers }
      );
      let data = response.data;
      setAllPoIds(data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchPoProductData = async () => {
    try {
      const response = await axios.get(
        `${API_URL}wp-json/custom-po-details/v1/po-order-details/${selectedPOId}/?page=${page}&per_page=${pageSize}`,
        { headers }
      );

      // Ensure each row has a unique 'id'
      const data = response.data.line_items.map((item, i) => ({
        ...item,
        id: i + currentStartIndex, // or use another unique property
      }));

      setPoTableData(data);
      setTotalPages(response.data.total_pages);
      setPoId(response.data.po_id);
    } catch (error) {
      console.error("Error fetching PO product data:", error);
    }
  };

  const handleQtyChange = (index, event) => {
    const newQuantity = parseFloat(event?.target?.value);
    if (!isNaN(newQuantity) && index.target.value >= 0) {
      const updatedRecivedQtyData = poTableData.map((item) => {
        if (item?.product_id == event?.product_id) {
          if (item.variation_id == event.variation_id) {
            return { ...item, received_quantity: index?.target?.value };
          }
        }
        return item;
      });
      setPoTableData(updatedRecivedQtyData);
    }
  };


  const handleChange = (event, value) => {
    setPage(value);
    let currIndex = value * pageSize - pageSize + 1;
    setCurrentStartIndex(currIndex, "currIndex");
  };

  useEffect(() => {
    if (allFactoryDatas && allFactoryDatas?.factories) {
      let data = allFactoryDatas?.factories?.map((item) => ({ ...item }));
      setFactories(data);
    }
  }, [allFactoryDatas]);

  useEffect(() => {
    selectPOId();
  }, [selectedFactory]);

  useEffect(() => {
    if (selectedPOId) {
      fetchPoProductData();
    }
  }, [selectedPOId, selectedFactory, poId]);

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
                value={userName}
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
                  // onChange={handlePageSizeChange}
                >
                  {pageSizeOptions.map((size) => (
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
              <Col xs="auto" lg="4">
                <Form.Group className="fw-semibold mb-0">
                  <Form.Label>PageSize</Form.Label>
                  <Form.Control
                    as="select"
                    className="w-auto"
                    value={pageSize}
                    // onChange={handlePageSizeChange}
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
                  page={page}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  handleChange={handleChange}
                  rowHeight="auto"
                />
              </div>
              <MDBRow className="justify-content-end px-3">
                <Button
                  variant="primary"
                  disabled={!isValid}
                  style={{ width: "100px" }}
                  onClick={handleSubmit}
                >
                  submit
                </Button>
              </MDBRow>
            </>
          )}

          {selectedFactory.length > 0 && (
            <>
              <div className="mt-2">
                <DataTable
                  columns={poColumns}
                  rows={poTableData}
                  page={page}
                  pageSize={pageSize}
                  totalPages={totalPages}
                  handleChange={handleChange}
                  rowHeight="auto"
                  // getRowId={(row) => row.product_id + "-" + row.variation_id} // or another unique property
                />
              </div>
              <MDBRow className="justify-content-end px-3">
                <Button
                  variant="primary"
                  disabled={!isValid}
                  style={{ width: "130px" }}
                  onClick={handleCreateGrn}
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
    </Container>
  );
}

export default OnHoldManegementSystem;
