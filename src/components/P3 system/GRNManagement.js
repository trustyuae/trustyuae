import React, { useState } from "react";
import { MDBCol, MDBRow } from "mdb-react-ui-kit";
import Table from "react-bootstrap/Table";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";

const product = [
    {
        grnNO: 'GRN001',
        CDate: '2024-4-26',
        CBy: 'demo',
        TItem: 60,
        status: 'All Processed',
    },
    {
        grnNO: 'GRN002',
        CDate: '2024-4-30',
        CBy: 'demo2',
        TItem: 60,
        status: 'Partially Processed ',
    }
];

function GRNManagement() {
    const [dateFilter, setDateFilter] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const handleDateChange = (e) => {
        setDateFilter(e.target.value);
    };

    const handleStatusChange = (e) => {
        setStatusFilter(e.target.value);
    };

    const filteredProducts = product.filter((item) => {
      return  item.CDate.includes(dateFilter) &&
        item.status.toLowerCase().includes(statusFilter.toLowerCase())}
    );

    const availabilityStatus = ['All Processed', 'Partially Processed'];

    return (
        <Container fluid className="px-5" style={{ backgroundColor: "#fff", height: "98vh" }}>
            <h3 className="fw-bold text-center py-3 ">GRN Management</h3>
            <MDBRow className="d-flex justify-content-start align-items-center mb-3">
                <MDBCol md="2">
                    <Form.Label className="me-2">Date Filter:</Form.Label>
                    <Form.Control type="date" value={dateFilter} onChange={handleDateChange} />
                </MDBCol>
                <MDBCol md="2">
                    <Form.Label className="me-2">Filter by Status:</Form.Label>
                    <Form.Select onChange={handleStatusChange} value={statusFilter}>
                        {availabilityStatus.map(status => (
                            <option key={status} value={status}>{status}</option>
                        ))}
                    </Form.Select>
                </MDBCol>
            </MDBRow>

            <MDBRow className="d-flex justify-content-center align-items-center">
                <Table striped bordered hover style={{ boxShadow: "4px 4px 11px 0rem rgb(0 0 0 / 25%)" }}>
                    <thead>
                        <tr className="table-headers">
                            <th style={{ backgroundColor: "#DEE2E6", padding: "8px", textAlign: "center" }}>GRN NO</th>
                            <th style={{ backgroundColor: "#DEE2E6", padding: "8px", textAlign: "center" }}>Date Created</th>
                            <th style={{ backgroundColor: "#DEE2E6", padding: "8px", textAlign: "center" }}>Created By</th>
                            <th style={{ backgroundColor: "#DEE2E6", padding: "8px", textAlign: "center" }}>Total Items</th>
                            <th style={{ backgroundColor: "#DEE2E6", padding: "8px", textAlign: "center" }}>Status</th>
                            <th style={{ backgroundColor: "#DEE2E6", padding: "8px", textAlign: "center" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => (
                            <tr key={index}>
                                <td className="text-center">{product.grnNO}</td>
                                <td className="text-center">{product.CDate}</td>
                                <td className="text-center">{product.CBy}</td>
                                <td className="text-center">{product.TItem}</td>
                                <td className="text-center">{product.status}</td>
                                <td className="text-center">
                                    <button
                                        type="button"
                                        className="btn btn-success mr-2"

                                    >
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </MDBRow>
        </Container>
    )
}

export default GRNManagement;
