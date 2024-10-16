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
import { useDispatch } from "react-redux";
import { AddGrn, GetProductManual } from "../../redux/actions/P3SystemActions";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { CompressImage } from "../../utils/CompressImage";
import axios from "axios";

import Select from "react-select";
import Swal from "sweetalert2";

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

  const [receivedBoxes, setReceivedBoxes] = useState(0);
  const [productNameF, setProductName] = useState("");
  const [productIDF, setProductID] = useState("");
  const [singleProductD, setSingleProductD] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [date, setDate] = useState(getTodayDate());
  const [selectFile, setFile] = useState(null);
  const [userName, setuserName] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [imageURL, setImageURL] = useState("");

  const [selectedOption, setSelectedOption] = useState(null);
  const [optionsArray, setoptionsArray] = useState([]);

  const token = JSON.parse(localStorage.getItem("token"));
  const headers = {
    Authorization: `Live ${token}`,
  };

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
            style={{ justifyContent: "center" }}
            type="number"
            value={params.row.Quantity}
            placeholder="0"
            onChange={(e) => handleQtyChange(e, params.row)}
          />
        </Form.Group>
      ),
    },
    {
      field: "variation_values",
      headerName: "Variation Values",
      flex: 3,
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

  function handleAttributeChange(event, rowIndex, attributeName) {
    const newValue = event.target.value;
    rowIndex.variation_values[attributeName] = newValue;
    const updatedData = tableData.map((item) =>
      item.id === rowIndex.id ? { ...item, ...rowIndex } : item
    );
    console.log(updatedData, "updatedData");
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
  const handleQtyChange = (id, event) => {
    const value = id.target.value;
    if (value >= 0) {
      handleFieldChange(id.target.value, "Quantity", event);
    }
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
        console.log(response, "response");
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

  const handleFileChange = async (e) => {
    if (e.target.files[0]) {
      const file = await CompressImage(e?.target?.files[0]);
      setFile(file);
    }
  };

  const validateForm = (data) => {
    let dataa = data.filter(
      (o) => o.variation_values && Object.keys(o.variation_values).length > 0
    );
    console.log(dataa, "dataa");
    const isAllVariationsString = data.every((item) => {
      const values = Object.values(item.variation_values);
      return values.every((value) => typeof value === "string");
    });

    const isQuantityAvailable = data.every((item) => item.Quantity !== "");
    setIsValid(isAllVariationsString && isQuantityAvailable);
  };

  const handleSubmit = async () => {
    if (receivedBoxes === 0) {
      Swal.fire({
        icon: "error",
        title: "please note received boxes quantity",
        showConfirmButton: true,
      });
    } else {
      const currentDate = new Date().toISOString().split("T")[0];
      tableData.forEach((data) => {
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
          }
        }
      });
      const convertedData = tableData.map((item) => ({
        product_id: parseInt(item.product_id),
        product_name: item.product_name,
        product_image: item.product_image,
        variation_id: item.variation_id ? item.variation_id : 0,
        variations: item.variation_values,
        qty_received: parseInt(item.Quantity),
        qty_remain: parseInt(item.Quantity),
        updated_date: currentDate,
      }));
      // const convertedData = tableData
      const payload = {
        created_date: date,
        verified_by: userName,
        boxes_received: receivedBoxes,
        attachment_bill_image: selectFile,
        status: "Pending for process",
        products: convertedData,
      };
      try {
        dispatch(AddGrn(payload, navigate));
      } catch (error) {
        console.error(error);
      }
    }
  };

  const ImageModule = (url) => {
    setImageURL(url);
    setShowEditModal(true);
  };

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
            <Form.Group>
              <Form.Label className="fw-semibold">Boxes Received:</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter No of received boxes"
                value={receivedBoxes}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value >= 0) {
                    setReceivedBoxes(e.target.value);
                  }
                }}
                className="mr-sm-2 py-2"
              />
            </Form.Group>
          </Col>
          <Col xs="auto" lg="3">
            <Form.Group>
              <Form.Label className="fw-semibold">
                Attach the Delivery Bill:
              </Form.Label>
              <Form.Control
                type="file"
                className="mr-sm-2 py-2"
                onChange={handleFileChange}
              />
            </Form.Group>
          </Col>
        </Row>
      </Form>
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
          </Row>
          {tableData.length > 0 && (
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
