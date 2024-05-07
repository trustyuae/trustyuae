// import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
const Sidebar = () => {
  return (
    <>
      <aside id="sidebar" class="sidebar">
        <ul class="sidebar-nav" id="sidebar-nav">
          <li class="nav-item">
            <Link class="nav-link " to="/ordersystem">
              <i class="bi bi-grid"></i>
              <span>P1 System</span>
            </Link>
          </li>

          <li class="nav-item">
            <a
              class="nav-link collapsed"
              data-bs-target="#components-nav"
              data-bs-toggle="collapse"
              href="/"
            >
              <i class="bi bi-menu-button-wide"></i>
              <span>P2 System</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="components-nav"
              class="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to="/order_management_system">
                  <i class="bi bi-circle"></i>
                  <span>Order Management System</span>
                </Link>
              </li>
              <li>
                <Link to="/PO_ManagementSystem">
                  <i class="bi bi-circle"></i>
                  <span>PO management System</span>
                </Link>
              </li>
              <li>
                <Link to="/PO_details">
                  <i class="bi bi-circle"></i>
                  <span>PO details</span>
                </Link>
              </li>
              <li>
                <Link to="/order_not_available">
                  <i class="bi bi-circle"></i>
                  <span>Order Not Available</span>
                </Link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <a
              class="nav-link collapsed"
              data-bs-target="#forms-nav"
              data-bs-toggle="collapse"
              href="/"
            >
              <i class="bi bi-journal-text"></i>
              <span>P3 System</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="forms-nav"
              class="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to="/On_Hold_Manegement_System">
                  <i class="bi bi-circle"></i>
                  <span>On Hold Management system</span>
                </Link>
              </li>
              <li>
                <Link to="/GRN_Management">
                  <i class="bi bi-circle"></i>
                  <span>GRN Management</span>
                </Link>
              </li>
              <li>
                <Link to="/On_Hold_Management">
                  <i class="bi bi-circle"></i>
                  <span>On Hold Management</span>
                </Link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <a
              class="nav-link collapsed"
              data-bs-target="#charts-nav"
              data-bs-toggle="collapse"
              href="/"
            >
              <i class="bi bi-bar-chart"></i>
              <span>Factory Management</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="charts-nav"
              class="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to="/all_factory">
                  <i class="bi bi-circle"></i>
                  <span>All Factories</span>
                </Link>
              </li>
              <li>
                <Link to="/factory_form">
                  <i class="bi bi-circle"></i>
                  <span>Add Factory</span>
                </Link>
              </li>
            </ul>
          </li>

          <li class="nav-item">
            <a
              class="nav-link collapsed"
              data-bs-target="#charts-navv"
              data-bs-toggle="collapse"
              href="/"
            >
              <i class="bi bi-bar-chart"></i>
              <span>Product management</span>
              <i class="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="charts-navv"
              class="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link to="/all_products_list">
                  <i class="bi bi-circle"></i>
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
