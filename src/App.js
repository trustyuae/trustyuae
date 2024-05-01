import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Login from "./components/Login";
import Dashboard from "./components/Dashboardd";
import OrderSystem from "./components/OrderSystem";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<Login />} />
          <Route exact path="/dashboard" element={<Dashboard />} />
          <Route exact path="/ordersystem" element={<OrderSystem />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
