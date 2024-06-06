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
import OperationAssistantRoute from "./utils/navigation/OperationAssistantRoute";
import FactoryCoordinatorRoute from "./utils/navigation/FactoryCoordinatorRoute";
import PageNotFound from "./components/pageNotFound/PageNotFound";
import CustomerSupportRoute from "./utils/navigation/CustomerSupportRoute";
import "./index.css";
import GRNView from './components/P3 system/GRNView'
import ExchangeAndReturn from "./components/ER system/ExchangeAndReturn";
import ERManagement from "./components/ER system/ERManagement";
import ERDetails from "./components/ER system/ERDetails";
import CompletedOrderSystem from "./components/P1 system/CompletedOrderSystem";
import CompletedOrderDetails from "./components/P1 system/CompletedOrderDetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route element={<Layout />}>
            <Route element={<ProtectedRoute />}>
              <Route element={<OperationAssistantRoute />}>
              <Route exact path="/ordersystem" element={<OrderSystem/>} />
              </Route>
              <Route exact path="/factory_form" element={<FactoryForm />} />
              <Route
                exact
                path="/order_management_system"
                element={<OrderManagementSystem />}
              />
              <Route exact path="/PO_details/:id" element={<PoDetails />} />
              <Route exact path="/all_products_list" element={<AllProductList />} />
              <Route element={<CustomerSupportRoute />}>
              <Route exact path="/order_not_available" element={<OrderNotAvailable/>} />
              </Route>
              <Route exact path="/image_upload" element={<ImageUpload/>} />
              <Route exact path="/order_details/:id" element={<OrderDetails/>} />
              <Route exact path="/all_factory" element={<AllFactory/>} />
              <Route element={<FactoryCoordinatorRoute />}>
              <Route exact path="/PO_ManagementSystem" element={<POManagementSystem/>} />
              </Route>
              <Route exact path="/GRN_Management" element={<GRNManagement/>} />
              <Route exact path="/GRN_View/:id" element={<GRNView/>} />
              <Route exact path="/On_Hold_Management/:grn_no/:id/:variation_id" element={<OnHoldManagement/>} />
              <Route exact path="/On_Hold_Manegement_System" element={<OnHoldManegementSystem/>} />
              <Route exact path="/ER_Management_System" element={<ERManagement/>} />
              <Route exact path='/Exchange_And_Return' element={<ExchangeAndReturn />} />
              <Route exact path='/ER_details/:er_no' element={<ERDetails />} />
              <Route exact path='/completed_order_system' element={<CompletedOrderSystem />} />
              <Route exact path='/completed_order_details/:id' element={<CompletedOrderDetails />} />
              <Route exact path='/PageNotFound' element={<PageNotFound />} />
            </Route>
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </>
  );
}

export default App;
