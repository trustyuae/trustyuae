import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";
import { API_URL } from "../../redux/constants/Constants";
import DataTable from "../DataTable";
import { Col, Row } from "react-bootstrap";
import { Avatar, Box, Typography } from "@mui/material";
import { CompressImage } from "../../utils/CompressImage";

function AllProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState("");
  const [selectFile, setFile] = useState(null);

  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [totalPages, setTotalPages] = useState(1);

  // useEffect(()=>{
  //   setItemsPerPage(5)
  // },[])
  const username = "ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a";
  const password = "cs_8dcdba11377e29282bd2b898d4a517cddd6726fe";

  const fetchProducts = async () => {
    let apiUrl = `${API_URL}wp-json/custom-products-api/v1/fetch-products/?`;
    // ?product_id=123&product_name=example
    if (searchId) apiUrl += `&product_id=${searchId}`;
    if (searchName) apiUrl += `&product_name=${searchName}`;
    try {
      const response = await axios.get(
        // `${API_URL}wp-json/custom-products-api/v1/fetch-products`,
        `${apiUrl}&page=${currentPage}&per_page=${itemsPerPage}`,
        {
          auth: {
            username: username,
            password: password,
          },
        }
      );
      if (response.data.products) {
        setProducts(response?.data?.products);
        setTotalPages(response.data.total_pages)
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchName, searchId, itemsPerPage]);

  const fetchFactories = async () => {
    try {
      const response = await axios.get(
        `${API_URL}wp-json/custom-factory/v1/fetch-factories`
      );
      setFactories(response.data);
    } catch (error) {
      console.error("Error fetching factories:", error);
    }
  };
  useEffect(() => {
    fetchFactories();
  }, []);

  const handleEdit = (productId) => {
    const product = products.find((p) => p.id === productId);
    console.log(product, 'product');
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveEdit = async () => {
    try {
      console.log("Product saved:", selectedProduct);
      const data = {
        ...selectedProduct,
        factory_image: selectFile
      }
      console.log("Product selectFile:", selectFile);
      console.log("Product data 2222:", data);


      const formData = new FormData();
      const formData2 = new FormData();

      formData.append("factory_id", selectedProduct.factory_id);
      formData.append("id", selectedProduct.id);
      formData.append("product_id", selectedProduct.product_id);
      formData.append("product_image", selectedProduct.product_image);
      formData.append("product_name", selectedProduct.product_name);
      formData.append("stock_quantity", selectedProduct.stock_quantity);
      formData.append("stock_status", selectedProduct.stock_status);
      formData2.append("name", selectedProduct?.product_name);

      if (selectFile) {
        formData.append("factory_image", selectFile);
      } else {
        console.log(selectedProduct.factory_image, 'selectedProduct.factory_image');
        formData.append("factory_image", selectedProduct.factory_image);
      }


      const response1 = await axios.post(
        `${API_URL}wp-json/wc/v3/products/${selectedProduct?.product_id}`,
        formData2, {
        auth: {
          username: username,
          password: password
        },
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const response = await axios.post(
        `${API_URL}wp-json/custom-proimage-update/v1/update-product/${selectedProduct.product_id}`,
        formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
      );

      setShowEditModal(false);
      fetchProducts();
      fetchFactories()
    } catch (error) {
      console.error('Error saving product:', error);
    }

  };

  const handleFileChange = async (e) => {
    if (e.target.files[0]) {
      const file = await CompressImage(e?.target?.files[0])
      setFile(file);
    }
  };

  const handlePageSizeChange = (e) => {
    setCurrentPage(1); // Reset to first page when page size changes
    setItemsPerPage(parseInt(e.target.value));
  };

  const columns = [
    { field: "product_id", headerName: "product id", flex: 1 },
    { field: "product_name", headerName: "product name", flex: 1 },
    {
      field: "product_image", headerName: "Factory Image", flex: 1,
      type: "html",
      renderCell: (value, row) => {
        return (
          <Box className="h-100 w-100 d-flex align-items-center"


          >
            <Avatar
              src={value.row.product_image}
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
      field: "factory_id", headerName: "factory", flex: 1,
      renderCell: (params) => {
        return factories.find((factory) => factory.id === params.row.factory_id)
          ?.factory_name;
      },
    },
    { field: "stock_quantity", headerName: "Quntity", flex: 1 },
    { field: "stock_status", headerName: "Status", flex: 1 },
    {
      field: "action", headerName: "Action", flex: 1,
      type: "html",
      renderCell: (value, row) => {
        return (

          <Button type="button" className="btn btn-primary mr-2" onClick={() => handleEdit(value.row.id)}>
            Edit
          </Button>


        );
      },
    },
  ]

  const handleChange = (event, value) => {
    setCurrentPage(value);
  };

  return (
    <Container
      fluid className="py-3" style={{ maxHeight: "100%" }}
    >
      <Box className="mb-4">
        <Typography variant="h4" className="fw-semibold">
          All Product List
        </Typography>
      </Box>
      <MDBRow className="d-flex justify-content-start align-items-center mb-3">
        <Col xs="auto" lg="4">
          <Form.Group>
            <Form.Label className="me-2">Product ID:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by Product ID"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </Form.Group>
        </Col>
        <Col xs="auto" lg="4">
          <Form.Group>
            <Form.Label className="me-2">Product Name:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Search by Product Name"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
          </Form.Group>
        </Col>
        <MDBCol md="1">
          <Form.Label className="me-2">Page Size:</Form.Label>
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
      </Row>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} style={{ marginTop: '130px' }}>
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
              {/* <Form.Check
                type="checkbox"
                className="me-2"
              /> */}
              {/* <Form.Control type="text" value={selectedProduct?.factoryImage} onChange={(e) => setSelectedProduct({ ...selectedProduct, factoryImage: e.target.value })} /> */}
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="factory_id">
              <Form.Label>Factory</Form.Label>
              <Form.Control
                as="select"
                defaultValue={selectedProduct?.factory_id}
                onChange={(e) => setSelectedProduct({

                  ...selectedProduct,
                  factory_id: e.target.value
                })}
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
