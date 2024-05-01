import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import OrderDetails from "./components/OrderDetails";
import Login from "./components/Login";
import PO_Details from "./components/PO-details";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/order-details" element={<PO_Details />} />
          <Route exact path="/ordersystem" element={<OrderDetails />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
