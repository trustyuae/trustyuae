import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import OrderDetails from "./components/OrderDetails";
import Login from "./components/Login";
import FactoryForm from "./components/FactoryForm";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/order-details" element={<FactoryForm />} />
          <Route exact path="/ordersystem" element={<OrderDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
