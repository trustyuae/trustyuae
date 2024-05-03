import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
// import Dashboard from "./components/Dashboardd";
import { Layout } from "./routes/Layout";
import OrderSystem from "./components/OrderSystem";
import FactoryForm from "./components/FactoryForm";
import OrderManagementSystem from "./components/OrderManagementSystem";
import PoDetails from "./components/PoDetails";
import ProtectedRoute from "./utils/ProtectedRoute";
import AllProductList from "./components/AllProductList";
import OrderNotAvailable from "./components/OrderNotAvailable";
import ImageUpload from "./components/ImageUpload";
import OrderDetails from "./components/OrderDetails";
import AllFactory from "./components/AllFactory";
import POManagementSystem from "./components/POManagementSystem";
import GRNManagement from "./components/GRNManagement";
import OnHoldManagement from "./components/OnHoldManagement";
import OnHoldManegementSystem from "./components/OnHoldManegementSystem";
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
              <Route exact path="/ordersystem" element={<OrderSystem />} />

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
