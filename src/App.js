import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
// import Dashboard from "./components/Dashboardd";
import { Layout } from "./routes/Layout";
import OrderSystem from "./components/P1 system/OrderSystem";
import FactoryForm from "./components/factory Management/FactoryForm";
import OrderManagementSystem from "./components/P2 system/OrderManagementSystem";
import PoDetails from "./components/P2 system/PoDetails";
import ProtectedRoute from "./utils/ProtectedRoute";
import AllProductList from "./components/Product management/AllProductList";
import OrderNotAvailable from "./components/P2 system/OrderNotAvailable";
import ImageUpload from "./components/ImageUpload";
import OrderDetails from "./components/P1 system/OrderDetails";
import AllFactory from "./components/factory Management/AllFactory";
import POManagementSystem from "./components/P2 system/POManagementSystem";
import GRNManagement from "./components/P3 system/GRNManagement";
import OnHoldManagement from "./components/P3 system/OnHoldManagement";
import OnHoldManegementSystem from "./components/P3 system/OnHoldManegementSystem";
import { ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route exact path="/ordersystem" element={<OrderSystem/>} />

              <Route exact path="/factory_form" element={<FactoryForm />} />
              <Route
                exact
                path="/order_management_system"
                element={<OrderManagementSystem />}
              />
              <Route exact path="/PO_details" element={<PoDetails />} />
              <Route exact path="/all_products_list" element={<AllProductList />} />
              <Route exact path="/order_not_available" element={<OrderNotAvailable/>} />
              <Route exact path="/image_upload" element={<ImageUpload/>} />
              <Route exact path="/order_details/:id" element={<OrderDetails/>} />
              <Route exact path="/all_factory" element={<AllFactory/>} />
              <Route exact path="/PO_ManagementSystem" element={<POManagementSystem/>} />
              <Route exact path="/GRN_Management" element={<GRNManagement/>} />
              <Route exact path="/On_Hold_Management" element={<OnHoldManagement/>} />
              <Route exact path="/On_Hold_Manegement_System" element={<OnHoldManegementSystem/>} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
