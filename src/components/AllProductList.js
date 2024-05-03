import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";

function AllProductList() {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState("");
  const [selectFile, setFile] = useState({
    factoryImage: null,
  });

  const [searchId, setSearchId] = useState("");
  const [searchName, setSearchName] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredProducts = products.filter(
    (product) =>
      product.product_id.toLowerCase().includes(searchId.toLowerCase()) &&
      (product.product_name
        ? product.product_name.toLowerCase().includes(searchName.toLowerCase())
        : true)
    //  &&
    // (product.label_name ? product.label_name.toLowerCase().includes(searchLabel.toLowerCase()) : true)
  );

  const username = "ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a";
  const password = "cs_8dcdba11377e29282bd2b898d4a517cddd6726fe";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-products-api/v1/fetch-products",
          {
            auth: {
              username: username,
              password: password,
            },
          }
        );
        console.log(response.data,'response.data');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchFactories = async () => {
      try {
        const response = await axios.get(
          "https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-factory/v1/fetch-factories"
        );
        setFactories(response.data);
      } catch (error) {
        console.error("Error fetching factories:", error);
      }
    };
    fetchFactories();
  }, []);

  const handleEdit = (productId) => {
    const product = products.find((p) => p.id === productId);
    setSelectedProduct(product);
    setShowEditModal(true);
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  const handleSaveEdit = () => {
    // Logic to save edited product
    console.log("Product saved:", selectedProduct);
    setShowEditModal(false);
  };

  const handleFileChange = (e) => {
    setFile({ ...selectFile, factoryImage: e.target.files[0] });
    console.log(selectFile, "selectFile");
  };

  const handlePageSizeChange = (e) => {
    setCurrentPage(1); // Reset to first page when page size changes
    setItemsPerPage(parseInt(e.target.value));
  };

  // Pagination logic (same as before)
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredProducts.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(filteredProducts.length / itemsPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <Container
      fluid
      className="px-5"
      style={{  height: "98vh" }}
    >
      <h3 className="fw-bold text-center py-3 ">All Product List</h3>
      <MDBRow className="d-flex justify-content-start align-items-center mb-3">
        <MDBCol md="2">
          <Form.Label className="me-2">Product ID:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product ID"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
          />
        </MDBCol>
        <MDBCol md="2">
          <Form.Label className="me-2">Product Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product Name"
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
        </MDBCol>
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

      <MDBRow className="d-flex justify-content-center align-items-center">
        <MDBCol col="10" md="12" sm="12"></MDBCol>
        <Table
          striped
          bordered
          hover
          style={{ boxShadow: "4px 4px 11px 0rem rgb(0 0 0 / 25%)" }}
        >
          <thead>
            <tr className="table-headers">
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Product ID
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Product Name
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Factory Image
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Factory
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Quantity
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Status
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((product, index) => (
              <tr key={index}>
                <td className="text-center">{product.product_id}</td>
                <td className="text-center">{product.product_name}</td>
                <td className="text-center">
                  <img
                    src={product.product_image}
                    alt={product.product_name}
                    style={{ maxWidth: "100px" }}
                  />
                </td>
                <td className="text-center">
                  {
                    // product.factory_id
                    factories.find(
                      (factory) => factory.id === product.factory_id
                    )?.factory_name
                  }
                </td>
                <td className="text-center">{product.quantity}</td>
                <td className="text-center">{product.quantity}</td>
                <td className="text-center">
                  <button
                    type="button"
                    className="btn btn-primary mr-2"
                    onClick={() => handleEdit(product.id)}
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </MDBRow>
      <MDBRow className="d-flex justify-content-center align-items-center">
        <Pagination>
          <Pagination.Prev />
          {pageNumbers.map((number) => (
            <Pagination.Item
              key={number}
              active={number === currentPage}
              onClick={() => setCurrentPage(number)}
            >
              {number}
            </Pagination.Item>
          ))}
          <Pagination.Next />
        </Pagination>
      </MDBRow>

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
                value={selectedProduct?.product_name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="factoryImage">
              <Form.Label>Factory Image</Form.Label>
              {/* <Form.Control type="text" value={selectedProduct?.factoryImage} onChange={(e) => setSelectedProduct({ ...selectedProduct, factoryImage: e.target.value })} /> */}
              <Form.Control type="file" onChange={handleFileChange} />
            </Form.Group>
            <Form.Group className="mb-3" controlId="factory">
              <Form.Label>Factory</Form.Label>
              <Form.Control
                as="select"
                value={selectedFactory}
                onChange={(e) => setSelectedFactory(e.target.value)}
              >
                <option value="">Select Factory</option>
                {factories.map((factory) => (
                  <option key={factory.id} value={factory.factory_name}>
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
