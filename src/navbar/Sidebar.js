// import React, { Component } from 'react';
// import 'bootstrap/dist/css/bootstrap.min.css';

import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
const Sidebar = () => {
  return (
    <>
      <aside id="sidebar" class="sidebar">
        <ul class="sidebar-nav" id="sidebar-nav">
          <li class="nav-item">
            <a class="nav-link " href="/ordersystem">
              <i class="bi bi-grid"></i>
              <span>P1 System</span>
            </a>
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
                <a href="/order_management_system">
                  <i class="bi bi-circle"></i>
                  <span>Order Management System</span>
                </a>
              </li>
              <li>
                <a href="/PO_ManagementSystem">
                  <i class="bi bi-circle"></i>
                  <span>PO management System</span>
                </a>
              </li>
              <li>
                <a href="/PO_details">
                  <i class="bi bi-circle"></i>
                  <span>PO details</span>
                </a>
              </li>
              <li>
                <a href="/order_not_available">
                  <i class="bi bi-circle"></i>
                  <span>Order Not Available</span>
                </a>
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
                <a href="forms-elements.html">
                  <i class="bi bi-circle"></i>
                  <span>Form Elements</span>
                </a>
              </li>
              <li>
                <a href="forms-layouts.html">
                  <i class="bi bi-circle"></i>
                  <span>Form Layouts</span>
                </a>
              </li>
              <li>
                <a href="forms-editors.html">
                  <i class="bi bi-circle"></i>
                  <span>Form Editors</span>
                </a>
              </li>
              <li>
                <a href="forms-validation.html">
                  <i class="bi bi-circle"></i>
                  <span>Form Validation</span>
                </a>
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
                <a href="/all_factory">
                  <i class="bi bi-circle"></i>
                  <span>All Factories</span>
                </a>
              </li>
              <li>
                <a href="/factory_form">
                  <i class="bi bi-circle"></i>
                  <span>Add Factory</span>
                </a>
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
                <a href="/all_products_list">
                  <i class="bi bi-circle"></i>
                  <span>All Products</span>
                </a>
              </li>
            </ul>
          </li>

        </ul>
      </aside>
    </>
  );
};

export default Sidebar;
