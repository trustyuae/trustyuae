import React, { useState, useEffect } from 'react';
import { MDBCheckbox, MDBCard, MDBCardBody, MDBBadge, MDBBtn, MDBTable, MDBTableHead, MDBTableBody } from 'mdb-react-ui-kit';
import { DataGrid } from '@mui/x-data-grid';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const columns = [
    { field: 'name', headerName: 'Product Name', width: 250 },
    { field: 'id', headerName: 'ID', width: 70 },
    { 
        field: 'image', 
        headerName: 'Image', 
        width: 90, 
        height:30,
        renderCell: (params) => (
          <img src={params.value.src} alt="Product" style={{ width: '100%', height: '100%' }} />
        ),
      },
    { field: 'quantity', headerName: 'Quantity', width: 130 },
    
];


function OrderManagementSystem() {
    
    const [orders, setOrders] = useState([]);
    //pagination
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(5);
    const [totalPages, setTotalPages] = useState(0);

    const username = 'ck_176cdf1ee0c4ccb0376ffa22baf84c096d5a155a';
    const password = 'cs_8dcdba11377e29282bd2b898d4a517cddd6726fe';

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await axios.get(`https://ghostwhite-guanaco-836757.hostingersite.com/wp-json/wc/v3/orders?status=processing&page=${page}&per_page=${pageSize}`, {
                    auth: {
                        username: username,
                        password: password
                    }
                });
                let a = response.data.map(order=>order.line_items)
                setOrders([].concat(...a));
                setTotalPages(response.headers['x-wp-totalpages']);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchOrders();
    }, [page, pageSize]);

    const handlePageChange = (newPage) => {
        setPage(newPage);
    };

    const handlePageSizeChange = (newPageSize) => {
        console.log(newPageSize,'newPageSize');
        setPageSize(newPageSize);
    };

    return (
        <Container fluid className='py-3' style={{ maxHeight: "100%", minHeight: "100vh" }}>
            <div className="mb-9">
                <div className="row g-3 mb-4 justify-content-center ">
                    <div className="col-auto">
                        <h2 className="mb-0">Order Management  System</h2>
                    </div>
                </div>
            </div>
            <Row className='mb-4 mt-4'>
                <Form inline>
                    <Row >
                        <Col xs="auto" lg="2">
                            <Form.Group>
                                <Form.Label>Date filter:</Form.Label>
                                <Form.Control
                                    type="date"

                                    className="mr-sm-2"
                                />
                            </Form.Group>
                        </Col>
                        <Col xs="auto" lg="2">
                            <Form.Group>
                                <Form.Label>Dispatch type:</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter Dispatch Type"
                                    className="mr-sm-2"
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                </Form>
            </Row>
            <Row className='mb-4 mt-4'>
                <MDBCard>
                    <MDBCardBody>
                        <div style={{ height: 400, width: '100%' }}>
                            {/* <DataGrid
                                rows={orders}
                                columns={columns}
                                initialState={{
                                    pagination: {
                                        paginationModel: { page: 0, pageSize: 5 },
                                    },
                                }}
                                pageSizeOptions={[5, 10]}
                                checkboxSelection
                            /> */}
                            <DataGrid
                        rows={orders}
                        columns={columns}
                        pagination
                        pageSize={pageSize}
                        rowCount={totalPages * pageSize}
                        paginationMode="server"
                        onPageChange={handlePageChange}
                        onPageSizeChange={handlePageSizeChange}
                    />
                        </div>
                    </MDBCardBody>
                </MDBCard>
            </Row>
            <Row className='mb-4 mt-4'>
                <Form inline>
                    <Row className='mt-4'>
                        <Col xs="auto" lg="3" className=' d-flex  align-items-end'>
                            <Button type="button" className='mr-2 mx-3 w-50' >Select All Orders</Button>
                            <Button type="button" className='mr-2 mx-3 w-50' >Create PO</Button>
                        </Col>
                    </Row>
                </Form>
            </Row>
        </Container>
    )
}

export default OrderManagementSystem
