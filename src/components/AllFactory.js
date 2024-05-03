import React, { useState, useEffect } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import axios from "axios";
import Pagination from "react-bootstrap/Pagination";

function AllFactory() {

  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [factories, setFactories] = useState([]);
  const [selectedFactory, setSelectedFactory] = useState("");
  const [selectFile, setFile] = useState({
    factoryImage: null,
  });

  const [factoryName, setfactoryName] = useState("");
  const [address, setaddress] = useState("");
  const [contactperson, setContactperson] = useState("");
  const [contactnumber, setcontactnumber] = useState("");
  const [email, setemail] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);

  const filteredProducts = products.filter(
    (product) =>
      product.factory_name.toLowerCase().includes(factoryName.toLowerCase()) &&
      (product.address
        ? product.address.toLowerCase().includes(address.toLowerCase())
        : true) &&
      (product.contact_person
        ? product.contact_person.toLowerCase().includes(contactperson.toLowerCase())
        : true) &&
      (product.contact_person
        ? product.contact_number.toLowerCase().includes(contactnumber.toLowerCase())
        : true) &&
      (product.contact_email
        ? product.contact_email.toLowerCase().includes(email.toLowerCase())
        : true)
  );

  const username = "ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a";
  const password = "cs_8dcdba11377e29282bd2b898d4a517cddd6726fe";

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-factory/v1/fetch-factories",
        {
          auth: {
            username: username,
            password: password,
          },
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };
  useEffect(() => {
    fetchProducts();
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
      const response = await axios.post(
        `https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-factory/v1/update-factory/${selectedProduct.id}`,
        {
          factory_name: selectedProduct.factory_name,
          address: selectedProduct.address,
          contact_person: selectedProduct.contact_person,
          contact_number: selectedProduct.contact_number,
          contact_email: selectedProduct.contact_email,
          bank_account_details: selectedProduct.bank_account_details
        },
        // {
        //   auth: {
        //     username: username,
        //     password: password
        //   }
        // }
      );
      console.log('Updated factory:', response.data);
      setShowEditModal(false);
      fetchProducts()
    } catch (error) {
      console.error('Error updating factory:', error);
    }
  };

  const handleFileChange = (e) => {
    setFile({ ...selectFile, factoryImage: e.target.files[0] });
    console.log(selectFile, "selectFile");
  };

  const handlePageSizeChange = (e) => {
    setCurrentPage(1); // Reset to first page when page size changes
    setItemsPerPage(parseInt(e.target.value));
  };


  return (
    <Container
      fluid
      className="px-5"
      style={{ height: "98vh" }}
    >
      <h3 className="fw-bold text-center py-3 ">All Factory List</h3>
      <MDBRow className="d-flex justify-content-start align-items-center mb-3">
        <MDBCol md="2">
          <Form.Label className="me-2">Factory Name:</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product ID"
            value={factoryName}
            onChange={(e) => setfactoryName(e.target.value)}
          />
        </MDBCol>
        <MDBCol md="2">
          <Form.Label className="me-2">Address</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product Name"
            value={address}
            onChange={(e) => setaddress(e.target.value)}
          />
        </MDBCol>
        <MDBCol md="2">
          <Form.Label className="me-2">Contact person</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product Name"
            value={contactperson}
            onChange={(e) => setContactperson(e.target.value)}
          />
        </MDBCol>
        <MDBCol md="2">
          <Form.Label className="me-2">Contact Number</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product Name"
            value={contactnumber}
            onChange={(e) => setcontactnumber(e.target.value)}
          />
        </MDBCol>
        <MDBCol md="2">
          <Form.Label className="me-2">Contact email</Form.Label>
          <Form.Control
            type="text"
            placeholder="Search by Product Name"
            value={email}
            onChange={(e) => setemail(e.target.value)}
          />
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
                factory name
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                address
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                contact person
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                contact number
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                contact_email
              </th>
              <th
                style={{
                  backgroundColor: "#DEE2E6",
                  padding: "8px",
                  textAlign: "center",
                }}
              >
                bank_account_details
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
            {filteredProducts.map((product, index) => (
              <tr key={index}>
                <td className="text-center">{product.factory_name}</td>
                <td className="text-center">{product.address}</td>
                <td className="text-center">{product.contact_person}</td>
                <td className="text-center">{product.contact_number}</td>
                <td className="text-center">{product.contact_email}</td>
                <td className="text-center">{product.bank_account_details}</td>
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
      {/* <MDBRow className="d-flex justify-content-center align-items-center">
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
      </MDBRow> */}

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={handleCloseEditModal} className="d-flex  justify-content-center" style={{ marginTop: '130px' }}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form style={{ width: '466px' }}>
            {/* <Form.Group className="mb-3 " controlId="factory_name">
              <Form.Label>Factory Name</Form.Label>
              <Form.Control
                type="text"
                value={selectedProduct?.factory_name}
              />
            </Form.Group> */}
            <Form.Group className="mb-3 " controlId="factory_name">
              <Form.Label>Factory Name</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedProduct?.factory_name}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    factory_name: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="address">
              <Form.Label>address</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedProduct?.address}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    address: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contact_person">
              <Form.Label>contact person</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedProduct?.contact_person}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    contact_person: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contact_number">
              <Form.Label>contact number</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedProduct?.contact_number}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    contact_number: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="contact_email">
              <Form.Label>contact email</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedProduct?.contact_email}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    contact_email: e.target.value,
                  })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="bank_account_details">
              <Form.Label>bank account details</Form.Label>
              <Form.Control
                type="text"
                defaultValue={selectedProduct?.bank_account_details}
                onChange={(e) =>
                  setSelectedProduct({
                    ...selectedProduct,
                    bank_account_details: e.target.value,
                  })
                }
              />
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
  )
}

export default AllFactory;
