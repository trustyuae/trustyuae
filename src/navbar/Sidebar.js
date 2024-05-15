import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <>
      <aside id="sidebar" className="sidebar">
        <ul className="sidebar-nav" id="sidebar-nav">
          <li className="nav-item">
            <Link className="nav-link " to="/ordersystem">
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
                <Link to="/order_management_system">
                  <i className="bi bi-circle"></i>
                  <span>Order Management System</span>
                </Link>
              </li>
              <li>
                <Link to="/PO_ManagementSystem">
                  <i className="bi bi-circle"></i>
                  <span>PO management System</span>
                </Link>
              </li>
              <li>
                <Link to="/PO_details">
                  <i className="bi bi-circle"></i>
                  <span>PO details</span>
                </Link>
              </li>
              <li>
                <Link to="/order_not_available">
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
                <Link to="/On_Hold_Manegement_System">
                  <i className="bi bi-circle"></i>
                  <span>On Hold Management system</span>
                </Link>
              </li>
              <li>
                <Link to="/GRN_Management">
                  <i className="bi bi-circle"></i>
                  <span>GRN Management</span>
                </Link>
              </li>
              <li>
                <Link to="/On_Hold_Management">
                  <i className="bi bi-circle"></i>
                  <span>On Hold Management</span>
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
                <Link to="/all_factory">
                  <i className="bi bi-circle"></i>
                  <span>All Factories</span>
                </Link>
              </li>
              <li>
                <Link to="/factory_form">
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
                <Link to="/all_products_list">
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
