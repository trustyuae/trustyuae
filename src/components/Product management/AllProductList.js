import React, { useState, useEffect, useRef } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { API_URL } from "../../redux/constants/Constants";
import DataTable from "../DataTable";
import { Col, Row } from "react-bootstrap";
import { Avatar, Box, Typography } from "@mui/material";
import { CompressImage } from "../../utils/CompressImage";
import EditIcon from "@mui/icons-material/Edit";
import { useDispatch, useSelector } from "react-redux";
import {
  EditProductsList,
  GetAllProductsList,
} from "../../redux/actions/ProductManagementActions";
import { AllFactoryActions } from "../../redux/actions/AllFactoryActions";
import Loader from "../../utils/Loader";
import defaultImage from "../../assets/default.png";

function AllProductList() {
  const inputRef = useRef(null);
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [factories, setFactories] = useState([]);
  const [selectFile, setFile] = useState(null);
  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const allFactoryDatas = useSelector(
    (state) => state?.allFactoryData?.factory
  );
  const loader = useSelector((state) => state?.allProducts?.isAllProducts);

  useEffect(() => {
    dispatch(AllFactoryActions());
  }, [dispatch]);

  useEffect(() => {
    if (allFactoryDatas && allFactoryDatas.factories) {
      let data = allFactoryDatas?.factories?.map((item) => ({ ...item }));
      setFactories(data);
    }
  }, [allFactoryDatas]);

  const fetchProducts = async () => {
    let apiUrl = `${API_URL}wp-json/custom-products-api/v1/fetch-products/?page=${currentPage}&per_page=${itemsPerPage}`;
    if (searchId) apiUrl += `&product_id=${searchId}`;
    if (searchName) apiUrl += `&product_name=${searchName}`;
    try {
      const response = await dispatch(GetAllProductsList({ apiUrl }));
      if (response && response.data && response.data.products) {
        setProducts(response.data.products);
        setTotalPages(response.data.total_pages);
      } else {
        console.error("No products found in the response");
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchName, searchId, itemsPerPage]);

  const handleEdit = (productId) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveEdit = async () => {
    try {
      const id = selectedProduct?.product_id;
      const formData = new FormData();
      formData.append("factory_id", selectedProduct.factory_id);
      formData.append("id", selectedProduct.id);
      formData.append("product_image", selectedProduct.product_image);
      formData.append("product_id", selectedProduct.product_id);
      formData.append("product_name", selectedProduct.product_name);
      formData.append("stock_quantity", selectedProduct.stock_quantity);
      formData.append("stock_status", selectedProduct.stock_status);
      formData.append("name", selectedProduct?.product_name);

      if (selectFile) {
        formData.append("factory_image", selectFile);
      } else {
        formData.append("factory_image", selectedProduct.factory_image);
      }
      await dispatch(EditProductsList(formData, id));
      setShowEditModal(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const handleFileChange = async (e) => {
    if (e.target.files[0]) {
      const file = await CompressImage(e?.target?.files[0]);
      setFile(file);
    }
  };

  const handlePageSizeChange = (e) => {
    setCurrentPage(1);
    setItemsPerPage(parseInt(e.target.value));
  };

  const columns = [
    { field: "product_id", headerName: "Product id", flex: 1 },
    { field: "product_name", headerName: "Product name", flex: 1 },
    {
      field: "factory_image",
      headerName: "Factory Image",
      flex: 1,
      type: "html",
      renderCell: (value, row) => {
        return (
          <Box className="h-100 w-100 d-flex align-items-center">
            <Avatar
              src={
                value?.row?.factory_image || value?.row?.product_image
                  ? value?.row?.factory_image || value?.row?.product_image
                  : defaultImage
              }
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
        );
      },
    },
    {
      field: "factory_id",
      headerName: "Factory",
      flex: 1,
      renderCell: (params) => {
        return factories.find((factory) => factory.id === params.row.factory_id)
          ?.factory_name;
      },
    },
    { field: "stock_quantity", headerName: "Quntity", flex: 1 },
    { field: "stock_status", headerName: "Status", flex: 1 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      type: "html",
      renderCell: (value) => {
        return (
          <Box className="text-center">
            <Button
              className="m-2 mx-auto d-flex align-items-center justify-content-center"
              style={{ padding: "5px 5px", fontSize: "16px" }}
              onClick={() => handleEdit(value.row.id)}
            >
              <EditIcon fontSize="inherit" />
            </Button>
          </Box>
        );
      },
    },
  ];

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  const searchIdd = (e) => {
    if (e.key === "Enter") {
      setSearchId(e.target.value);
    }
  }

  const searchNamee = (e) => {
    if (e.key === "Enter") {
      setSearchName(e.target.value);
    }
  }

  return (
    <Container fluid className="py-3" style={{ maxHeight: "100%" }}>
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          All Product List
        </Typography>
      </Box>
      <MDBRow className="d-flex justify-content-start align-items-center mb-3">
        <Col xs="auto" lg="4">
          <Form.Group>
            <Form.Label className="me-2 fw-semibold">Product ID:</Form.Label>
            <Form.Control
              type="text"
              ref={inputRef}
              placeholder="Search by Product ID"
              onKeyDown={(e) => searchIdd(e)}
              // onChange={(e) => setSearchId(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs="auto" lg="4">
          <Form.Group>
            <Form.Label className="me-2 fw-semibold">Product Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by Product Name"
              ref={inputRef}
              onKeyDown={(e) => searchNamee(e)}
            />
          </Form.Group>
        </Col>
        <MDBCol md="2">
          <Form.Label className="me-2 fw-semibold">Page Size:</Form.Label>
          <Form.Control
            as="select"
            value={itemsPerPage}
            onChange={handlePageSizeChange}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            {/* Add more options as needed */}
          </Form.Control>
        </MDBCol>
      </MDBRow>

      <Row>
        {loader ? (
          <Loader />
        ) : (
          <div className="mt-2">
            <DataTable
              columns={columns}
              rows={products}
              // rows={factories}
              // page={page}
              // pageSize={pageSize}
              // totalPages={totalPages}
              // handleChange={handleChange}
              page={currentPage}
              pageSize={itemsPerPage}
              totalPages={totalPages}
              handleChange={handleChange}
            />
          </div>
        )}
      </Row>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="productId">
              <Form.Label>Product ID</Form.Label>
              <Form.Control
                type="text"
                readOnly
                disabled
                value={selectedProduct?.product_id}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="productName">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedProduct?.product_name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    product_name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="stock_quantity">
              <Form.Label>Quantity</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedProduct?.stock_quantity}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    stock_quantity: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="factoryImage">
              <Form.Label>Factory Image</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="factory_id">
              <Form.Label>Factory</Form.Label>
              <Form.Control
                as="select"
                defaultValue={selectedProduct?.factory_id}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    factory_id: e.target.value,
                  })
                }
              >
                <option value="">Select Factory</option>
                {factories.map((factory) => (
                  <option key={factory.id} value={factory.id}>
                    {factory.factory_name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseEditModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSaveEdit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AllProductList;
