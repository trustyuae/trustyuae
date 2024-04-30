import React from 'react';
import {
    MDBContainer,
    MDBCol,
    MDBRow
}
    from 'mdb-react-ui-kit';

const PO_Details = () => {
    const tableHeaders = [
        "Product Name",
        "Image",
        "Qty Ordered",
        "Estimated Cost(RMB)",
        "Estimated Cost(AED)",
        "Availability Status"
    ];
    const PODetails = [{
        productName: "Product A",
        image: "product_a.jpg",
        qtyOrdered: 10,
        estimatedCostRMB: 100,
        estimatedCostAED: 50,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product B",
        image: "product_b.jpg",
        qtyOrdered: 5,
        estimatedCostRMB: 200,
        estimatedCostAED: 100,
        availabilityStatus: "Out of Stock"
    },
    {
        productName: "Product C",
        image: "product_c.jpg",
        qtyOrdered: 8,
        estimatedCostRMB: 150,
        estimatedCostAED: 75,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product D",
        image: "product_d.jpg",
        qtyOrdered: 3,
        estimatedCostRMB: 120,
        estimatedCostAED: 60,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product E",
        image: "product_e.jpg",
        qtyOrdered: 6,
        estimatedCostRMB: 180,
        estimatedCostAED: 90,
        availabilityStatus: "Out of Stock"
    },
    {
        productName: "Product F",
        image: "product_f.jpg",
        qtyOrdered: 12,
        estimatedCostRMB: 250,
        estimatedCostAED: 125,
        availabilityStatus: "In Stock"
    },
    {
        productName: "Product G",
        image: "product_g.jpg",
        qtyOrdered: 4,
        estimatedCostRMB: 90,
        estimatedCostAED: 45,
        availabilityStatus: "Out of Stock"
    }];
    let PONumber = '001';
    const totalQty = PODetails.reduce((acc, cur) => acc + cur.qtyOrdered, 0);
    const totalEstdCostRMB = PODetails.reduce((acc, cur) => acc + (cur.qtyOrdered * cur.estimatedCostRMB), 0);
    const totalEstdCostAED = PODetails.reduce((acc, cur) => acc + (cur.qtyOrdered * cur.estimatedCostAED), 0);

    return (
        <MDBContainer>
            <h3 className='fw-bold text-center my-3'>PO Details</h3>
            <h6 className='fw-bold text-center'>XYZ Guangzhon</h6>
            <p className='text-center my-3'>PO Number: {PONumber}</p>

            <div className="d-flex justify-content-start align-items-center my-3">
                <h6 className=''>Payment Status:</h6>
                <select className="form-select w-25 ms-3" name="" id="">
                    <option value=''>Paid</option>
                    <option value=''>Unpaid</option>
                    <option value=''>Hold</option>
                    <option value=''>Cancelled</option>
                </select>
            </div>

            <MDBRow className='d-flex justify-content-center align-items-center'>
                <MDBCol col='10' md='12' sm='12'></MDBCol>
                <table class="table-responsive table-bordered">
                    <thead>
                        <tr className='table-headers'>
                            {tableHeaders.map((header, index) => (
                                <th style={{ backgroundColor: '#dee2e6', padding: '8px' }} key={index}>{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {PODetails.map((rowData, rowIndex) => (
                            <tr key={rowIndex}>
                                <td>{rowData.productName}</td>
                                <td><img src={rowData.image} alt={rowData.productName} /></td>
                                <td>{rowData.qtyOrdered}</td>
                                <td>{rowData.estimatedCostRMB}</td>
                                <td>{rowData.estimatedCostAED}</td>
                                <td>{rowData.availabilityStatus}</td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr>
                            <td colSpan={1}></td>
                            <td><strong>Total:</strong></td>
                            <td>{totalQty}</td>
                            <td>{totalEstdCostRMB}</td>
                            <td>{totalEstdCostAED}</td>
                        </tr>
                    </tfoot>
                </table>
            </MDBRow>
        </MDBContainer>
    )
}
export default PO_Details;