import React, { useState, useEffect } from "react";
import { Alert, Button, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
// import { QuantityPoDetailsForModalInView } from "../../redux/actions/P2SystemActions";
import Loader from "../../utils/Loader";
import { QuantityPoDetailsForModalInView } from "../../Redux2/slices/P2SystemSlice";

const   PoDetailsModalInView = ({
  show,
  handleClosePoDetailsModal,
  productId,
  variationId,
  poId,
  poDetailsModal,
}) => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);
  const loader = useSelector(
    (state) => state?.p2System?.isLoading
  );

  useEffect(() => {
    const fetchData = () => {
      dispatch(QuantityPoDetailsForModalInView(productId, variationId, poId))
        .then(({ payload }) => {
          const data = payload?.orders.map((v, id) => ({
            ...v,
            id,
          }));
          setProductData(data);
        })
        .catch(error => {
          console.error("Error fetching data:", error);
        });
    };
  
    if (show) {
      fetchData();
    }
  }, [show, dispatch, productId, variationId, poId]);
  

  return (
    <div>
      <Modal show={poDetailsModal} onHide={handleClosePoDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Product ID: {productId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Table striped bordered hover>
              <thead style={{ textAlign: "center" }}>
                <tr>
                  <th>Order ID</th>
                  <th>Qty</th>
                  <th>Status</th>
                </tr>
              </thead>
              {loader ? (
                <Loader />
              ) : (
                <tbody style={{ textAlign: "center" }}>
                  {productData && productData.length !== 0 ? (
                    productData.map((item) => (
                      <tr key={item.id}>
                        <td>{item.order_id}</td>
                        <td>{item.quantity}</td>
                        <td>{item.order_status}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2">
                        <Alert
                          severity="warning"
                          sx={{ fontFamily: "monospace", fontSize: "18px" }}
                        >
                          Above product doesn't have any orders yet!
                        </Alert>
                      </td>
                    </tr>
                  )}
                </tbody>
              )}
            </Table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClosePoDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PoDetailsModalInView;
