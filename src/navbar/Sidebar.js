import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
const Sidebar = () => {
  const location = useLocation(); // once ready it returns the 'window.location' object
  const [url, setUrl] = useState(null);
  useEffect(() => {
    setUrl(location.pathname);
  }, [location]);
  return (
    <>
      <aside id="sidebar" className="sidebar" style={{left:'0'}}>
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link to="/ordersystem"  className={"nav-link underline" + (url === "/ordersystem" ?" active" : "")} >
              <i className="bi bi-grid"></i>
              <span>P1 System</span>
            </Link>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#components-nav"
              data-bs-toggle="collapse"
              href="/"
            >
              <i className="bi bi-menu-button-wide"></i>
              <span>P2 System</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="components-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to="/order_management_system" className={"nav-link underline" + (url === "/order_management_system" ?" active" : "")}>
                  <i className="bi bi-circle"></i>
                  <span>Order Management System</span>
                </Link>
              </li>
              <li>
                <Link to="/PO_ManagementSystem" className={"nav-link underline" + (url === "/PO_ManagementSystem" ?" active" : "")}>
                  <i className="bi bi-circle"></i>
                  <span>PO management System</span>
                </Link>
              </li>
              <li>
                <Link to="/order_not_available" className={"nav-link underline" + (url === "/order_not_available" ?" active" : "")}>
                  <i className="bi bi-circle"></i>
                  <span>Order Not Available</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#forms-nav"
              data-bs-toggle="collapse"
              href="/"
            >
              <i className="bi bi-journal-text"></i>
              <span>P3 System</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="forms-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to="/On_Hold_Manegement_System" className={"nav-link underline" + (url === "/On_Hold_Manegement_System" ?" active" : "")}>
                  <i className="bi bi-circle"></i>
                  <span>On Hold Management system</span>
                </Link>
              </li>
              <li>
                <Link to="/GRN_Management" className={"nav-link underline" + (url === "/GRN_Management" ?" active" : "")}>
                  <i className="bi bi-circle"></i>
                  <span>GRN Management</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#charts-nav"
              data-bs-toggle="collapse"
              href="/"
            >
              <i className="bi bi-bar-chart"></i>
              <span>Factory Management</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="charts-nav"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to="/all_factory" className={"nav-link underline" + (url === "/all_factory" ?" active" : "")}>
                  <i className="bi bi-circle"></i>
                  <span>All Factories</span>
                </Link>
              </li>
              <li>
                <Link to="/factory_form" className={"nav-link underline" + (url === "/factory_form" ?" active" : "")}>
                  <i className="bi bi-circle"></i>
                  <span>Add Factory</span>
                </Link>
              </li>
            </ul>
          </li>

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#charts-navv"
              data-bs-toggle="collapse"
              href="/"
            >
              <i className="bi bi-bar-chart"></i>
              <span>Product management</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="charts-navv"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to="/all_products_list" className={"nav-link underline" + (url === "/all_products_list" ?" active" : "")}>
                  <i className="bi bi-circle"></i>
                  <span>All Products</span>
                </Link>
              </li>
            </ul>
          </li>
        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
