import React, { useState, useEffect } from "react";
import { Alert, Button, Modal, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../utils/Loader";
import { QuantityPoDetails } from "../../Redux2/slices/P2SystemSlice";

const PoDetailsModal = ({
  show,
  handleClosePoDetailsModal,
  productId,
  productName,
  variationId,
  factoryId,
  poDetailsModal,
  startD,
  endD
}) => {
  const dispatch = useDispatch();
  const [productData, setProductData] = useState([]);
  const [overAllData, setOverAllData] = useState("");
  const loader = useSelector(
    (state) => state?.p2System?.isLoading
  );

  useEffect(() => {
    const fetchData = async () => {

      const payload = {
        "factory_id": Number(factoryId),
        "variation_id": Number(variationId),
        "product_name": productName
    };
    
    if (endD) {
        payload["end_date"] = endD;
    }
    
    if (startD) {
        payload["start_date"] = startD;
    }
    
      try {
        dispatch(QuantityPoDetails({productId,payload})).then(({payload})=>{
          console.log(payload,'payload of QuantityPoDetails')
          const data = payload?.orders?.map((v, id) => ({
            ...v,
            id,
          }));
          setOverAllData(payload);
          setProductData(data);
        })
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
            Product ID: {overAllData?.item_id}
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
