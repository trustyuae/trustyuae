import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import { Layout } from "./routes/Layout";
import OrderSystem from "./components/P1 system/OrderSystem";
import FactoryForm from "./components/factory Management/FactoryForm";
import OrderManagementSystem from "./components/P2 system/OrderManagementSystem";
import PoDetails from "./components/P2 system/PoDetails";
import AllProductList from "./components/Product management/AllProductList";
import OrderNotAvailable from "./components/P2 system/OrderNotAvailable";
import ImageUpload from "./components/ImageUpload";
import OrderDetails from "./components/P1 system/OrderDetails";
import AllFactory from "./components/factory Management/AllFactory";
import POManagementSystem from "./components/P2 system/POManagementSystem";
import GRNManagement from "./components/P3 system/GRNManagement";
import OnHoldManagement from "./components/P3 system/OnHoldManagement";
import OnHoldManegementSystem from "./components/P3 system/OnHoldManegementSystem";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
import GRNView from "./components/P3 system/GRNView";
import ExchangeAndReturn from "./components/ER system/ExchangeAndReturn";
import ERManagement from "./components/ER system/ERManagement";
import ERDetails from "./components/ER system/ERDetails";
import CompletedOrderSystem from "./components/P1 system/CompletedOrderSystem";
import CompletedOrderDetails from "./components/P1 system/CompletedOrderDetails";
import OnHoldOrdersSystem from "./components/P1 system/OnHoldOrdersSystem";
import OnHoldOrdersDetails from "./components/P1 system/OnHoldOrdersDetails";
import ReserveOrderSystem from "./components/P1 system/ReserveOrderSystem";
import ReserveOrderDetails from "./components/P1 system/ReserveOrderDetails";
import OrderSystemInChina from "./components/P1 system china/OrderSystemInChina";
import OrderDetailsInChina from "./components/P1 system china/OrderDetailsInChina";
import CompletedOrderSystemInChina from "./components/P1 system china/CompletedOrderSystemInChina";
import CompletedOrderDetailsInChina from "./components/P1 system china/CompletedOrderDetailsInChina";
import ReserveOrderSystemInChina from "./components/P1 system china/ReserveOrderSystemInChina";
import OnHoldOrdersSystemInChina from "./components/P1 system china/OnHoldOrdersSystemInChina";
import ReserveOrderdetailsInChina from "./components/P1 system china/ReserveOrderdetailsInChina";
import OnHoldOrdersdetailsInChina from "./components/P1 system china/OnHoldOrdersdetailsInChina";
import MissingOrderSystem from "./components/Missing Orders System/MissingOrderSystem";
import MissingOrderDetails from "./components/Missing Orders System/MissingOrderDetails";
import OrderTrackingNumberPending from "./components/P1 system china/OrderTrackingNumberPending";
import OrderTrackingNumberPendingDetails from "./components/P1 system china/OrderTrackingNumberPendingDetails";
import GRNManagement_OrderIds from "./components/P3 system/GRNManagement_OrderIds";
import OrderView from "./components/P3 system/OrderView";
import GRNOrderPending from "./components/P3 system/GRNOrderPending";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route exact path="/ordersystem" element={<OrderSystem />} />
            <Route exact path="/factory_form" element={<FactoryForm />} />
            <Route
              exact
              path="/order_management_system"
              element={<OrderManagementSystem />}
            />
            <Route exact path="/PO_details/:id" element={<PoDetails />} />
            <Route
              exact
              path="/all_products_list"
              element={<AllProductList />}
            />

            <Route
              exact
              path="/order_not_available"
              element={<OrderNotAvailable />}
            />

            <Route exact path="/image_upload" element={<ImageUpload />} />
            <Route exact path="/order_details/:id" element={<OrderDetails />} />
            <Route exact path="/all_factory" element={<AllFactory />} />

            <Route
              exact
              path="/PO_ManagementSystem"
              element={<POManagementSystem />}
            />
            <Route exact path="/GRN_Management" element={<GRNManagement />} />
            <Route exact path="/GRN_Management_On_OrderIds" element={<GRNManagement_OrderIds />} />
            <Route exact path="/GRN_View/:id" element={<GRNView />} />
            <Route exact path="/Order_View/:id" element={<OrderView />} />
            <Route
              exact
              path="/On_Hold_Management/:grn_no/:id/:variation_id"
              element={<OnHoldManagement />}
            />
            <Route
              exact
              path="/On_Hold_Manegement_System"
              element={<OnHoldManegementSystem />}
            />
            <Route
              exact
              path="/GRN_Products_Pending_System"
              element={<GRNOrderPending />}
            />
            <Route
              exact
              path="/ER_Management_System"
              element={<ERManagement />}
            />
            <Route
              exact
              path="/Exchange_And_Return"
              element={<ExchangeAndReturn />}
            />
            <Route exact path="/ER_details/:er_no" element={<ERDetails />} />

            <Route
              exact
              path="/completed_order_system"
              element={<CompletedOrderSystem />}
            />
            <Route
              exact
              path="/completed_order_details/:id"
              element={<CompletedOrderDetails />}
            />
            <Route
              exact
              path="/reserve_orders_system"
              element={<ReserveOrderSystem />}
            />
            <Route
              exact
              path="/on_hold_orders_system"
              element={<OnHoldOrdersSystem />}
            />
            <Route
              exact
              path="/reserve_order_details/:id"
              element={<ReserveOrderDetails />}
            />
            <Route
              exact
              path="/on_hold_order_details/:id"
              element={<OnHoldOrdersDetails />}
            />

            <Route
              exact
              path="/order_tracking_number_Pending"
              element={<OrderTrackingNumberPending />}
            />

            <Route
              exact
              path="/order_tracking_number_pending_details/:id"
              element={<OrderTrackingNumberPendingDetails />}
            />

            <Route
              exact
              path="/ordersystem_in_china"
              element={<OrderSystemInChina />}
            />
            <Route
              exact
              path="/order_details_in_china/:id"
              element={<OrderDetailsInChina />}
            />
            <Route
              exact
              path="/completed_order_system_in_china"
              element={<CompletedOrderSystemInChina />}
            />
            <Route
              exact
              path="/completed_order_details_in_china/:id"
              element={<CompletedOrderDetailsInChina />}
            />
            <Route
              exact
              path="/reserve_orders_system_in_china"
              element={<ReserveOrderSystemInChina />}
            />
            <Route
              exact
              path="/on_hold_orders_system_in_china"
              element={<OnHoldOrdersSystemInChina />}
            />
            <Route
              exact
              path="/reserve_order_details_in_china/:id"
              element={<ReserveOrderdetailsInChina />}
            />
            <Route
              exact
              path="/on_hold_order_details_in_china/:id"
              element={<OnHoldOrdersdetailsInChina />}
            />

            <Route
              exact
              path="/missing_orders_system"
              element={<MissingOrderSystem />}
            />
            <Route
              exact
              path="/missing_order_details/:id"
              element={<MissingOrderDetails />}
            />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
