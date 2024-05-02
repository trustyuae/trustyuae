import React, { useState, useEffect } from 'react';
import { MDBCol, MDBRow } from 'mdb-react-ui-kit';
import Table from 'react-bootstrap/Table';
import Container from 'react-bootstrap/Container';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

function AllProductList() {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [factories, setFactories] = useState([]);
    const [selectedFactory, setSelectedFactory] = useState('');

    const username = 'ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a';
    const password = 'cs_8dcdba11377e29282bd2b898d4a517cddd6726fe';

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/wc/v3/products?status=publish', {
                    auth: {
                        username: username,
                        password: password
                    }
                });
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
            }
        };
        fetchProducts();
    }, []);

    useEffect(() => {
        const fetchFactories = async () => {
            try {
                const response = await axios.get('https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/custom-factory/v1/fetch-factories');
                setFactories(response.data);
            } catch (error) {
                console.error('Error fetching factories:', error);
            }
        };
        fetchFactories();
    }, []);

    const handleEdit = (productId) => {
        const product = products.find(p => p.id === productId);
        setSelectedProduct(product);
        setShowEditModal(true);
    };

    const handleCloseEditModal = () => {
        setShowEditModal(false);
    };

    const handleSaveEdit = () => {
        // Logic to save edited product
        console.log('Product saved:', selectedProduct);
        setShowEditModal(false);
    };

    return (
        <Container fluid className='px-5' style={{ backgroundColor: '#F6F1EB', height: '98vh' }}>
            <h3 className='fw-bold text-center py-3 '>All Product List</h3>
            <MDBRow className='d-flex justify-content-center align-items-center'>
                <MDBCol col='10' md='12' sm='12'></MDBCol>
                <Table striped bordered hover style={{ boxShadow: '4px 4px 11px 0rem rgb(0 0 0 / 25%)' }}>
                    <thead>
                        <tr className='table-headers'>
                            <th style={{ backgroundColor: '#DEE2E6', padding: '8px', textAlign: 'center' }}>Product ID</th>
                            <th style={{ backgroundColor: '#DEE2E6', padding: '8px', textAlign: 'center' }}>Product Name</th>
                            <th style={{ backgroundColor: '#DEE2E6', padding: '8px', textAlign: 'center' }}>Factory Image</th>
                            <th style={{ backgroundColor: '#DEE2E6', padding: '8px', textAlign: 'center' }}>Factory</th>
                            <th style={{ backgroundColor: '#DEE2E6', padding: '8px', textAlign: 'center' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map((product, index) => (
                            <tr key={index}>
                                <td className='text-center'>{product.id}</td>
                                <td className='text-center'>{product.name}</td>
                                <td className='text-center'><img src={product.factoryImage} alt={product.name} style={{ maxWidth: '100px' }} /></td>
                                <td className='text-center'>{product.factory}</td>
                                <td className='text-center'>
                                    <button type="button" className='btn btn-primary mr-2' onClick={() => handleEdit(product.id)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
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
                            <Form.Control type="text" readOnly disabled value={selectedProduct?.id} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="productName">
                            <Form.Label>Product Name</Form.Label>
                            <Form.Control type="text" value={selectedProduct?.name} onChange={(e) => setSelectedProduct({ ...selectedProduct, name: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="factoryImage">
                            <Form.Label>Factory Image</Form.Label>
                            <Form.Control type="text" value={selectedProduct?.factoryImage} onChange={(e) => setSelectedProduct({ ...selectedProduct, factoryImage: e.target.value })} />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="factory">
                            <Form.Label>Factory</Form.Label>
                            <Form.Control as="select" value={selectedFactory} onChange={(e) => setSelectedFactory(e.target.value)}>
                                <option value="">Select Factory</option>
                                {factories.map(factory => (
                                    <option key={factory.id} value={factory.factory_name}>{factory.factory_name}</option>
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
