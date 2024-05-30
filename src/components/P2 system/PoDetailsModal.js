import React, { useState, useEffect } from "react";
import { Alert, Button, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { QuantityPoDetails } from "../../redux/actions/P2SystemActions";
import Loader from "../../utils/Loader";

const PoDetailsModal = ({
  show,
  handleClosePoDetailsModal,
  productId,
  poDetailsModal,
}) => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);
  const [overAllData, setOverAllData] = useState("");
  const loader = useSelector(
    (state) => state?.orderNotAvailable?.isQuantityDetailsData
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await dispatch(QuantityPoDetails(productId));
        const data = response?.data?.orders.map((v, id) => ({
          ...v,
          id,
        }));
        setOverAllData(response?.data);
        setProductData(data);
      } catch (error) {
        console.error(error);
      }
    };

    if (show) {
      fetchData();
    }
  }, [show, dispatch, productId]);

  return (
    <div>
      <Modal show={poDetailsModal} onHide={handleClosePoDetailsModal}>
        <Modal.Header closeButton>
          <Modal.Title>
            Product ID: {overAllData?.item_id || productId}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Table striped bordered hover>
              <thead style={{ textAlign: "center" }}>
                <tr>
                  <th>Order ID</th>
                  <th>Qty</th>
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

export default PoDetailsModal;