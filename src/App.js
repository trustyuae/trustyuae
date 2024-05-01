import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboardd";
import OrderSystem from "./components/OrderSystem";
import FactoryForm from "./components/FactoryForm";
import OrderManagementSystem from "./components/OrderManagementSystem";
import PoDetails from "./components/PoDetails";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/ordersystem" element={<OrderSystem />} />
          <Route exact path="/factory_form" element={<FactoryForm />} />
          <Route exact path="/order_management_system" element={<OrderManagementSystem />} />
          <Route exact path="/PO_details" element={<PoDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
