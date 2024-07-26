import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
const Sidebar = () => {
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("");

  useEffect(() => {
    const currentPath = location.pathname;
    setActiveMenuItem(currentPath);
  }, [location]);

  const userdata = JSON.parse(localStorage.getItem("user_data"));
  console.log(userdata, "akkiss");
  const userType = userdata ? userdata.user_role : null;
  return (
    <>
      <aside id="sidebar" className="sidebar" style={{ left: "0" }}>
        <ul className="sidebar-nav" id="sidebar-nav">
          {(userType === "administrator" ||
            userType === "packing_assistant") && (
            <li className="nav-item">
              <a
                className="nav-link collapsed"
                data-bs-target="#icons-nav"
                data-bs-toggle="collapse"
                href="/"
              >
                <i className="bi bi-menu-button-wide"></i>
                <span>P1 System</span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul
                id="icons-nav"
                className="nav-content collapse "
                data-bs-parent="#sidebar-nav"
              >
                <li>
                  <Link
                    to="/ordersystem"
                    className={
                      "nav-link underline" +
                      (activeMenuItem === "/ordersystem" ? " active" : "")
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>Order Fulfillment System</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/completed_order_system"
                    className={
                      "nav-link underline" +
                      (activeMenuItem === "/completed_order_system"
                        ? " active"
                        : "")
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>Completed Orders System</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/on_hold_orders_system"
                    className={
                      "nav-link underline" +
                      (activeMenuItem === "/on_hold_orders_system"
                        ? "active"
                        : "")
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>On Hold Orders System</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/reserve_orders_system"
                    className={
                      "nav-link underline" +
                      (activeMenuItem === "/reserve_orders_system"
                        ? "active"
                        : "")
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>Reserve Orders System</span>
                  </Link>
                </li>
              </ul>
            </li>
          )}
          {(userType === "administrator" ||
            userType === "factory_coordinator" ||
            userType === "customer_support") && (
            <li className="nav-item">
              <a
                className="nav-link collapsed"
                data-bs-target="#components-navv"
                data-bs-toggle="collapse"
                href="/"
              >
                <i className="bi bi-menu-button-wide"></i>
                <span>P2 System</span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul
                id="components-navv"
                className="nav-content collapse "
                data-bs-parent="#sidebar-nav"
              >
                {userType === "administrator" && (
                  <li>
                    <Link
                      to="/order_management_system"
                      className={
                        "nav-link underline" +
                        (activeMenuItem === "/order_management_system"
                          ? " active"
                          : "")
                      }
                    >
                      <i className="bi bi-circle"></i>
                      <span>Order Management System</span>
                    </Link>
                  </li>
                )}
                {(userType === "administrator" ||
                  userType === "factory_coordinator") && (
                  <li>
                    <Link
                      to="/PO_ManagementSystem"
                      className={
                        "nav-link underline" +
                        (activeMenuItem === "/PO_ManagementSystem"
                          ? " active"
                          : "")
                      }
                    >
                      <i className="bi bi-circle"></i>
                      <span>PO management System</span>
                    </Link>
                  </li>
                )}
                {(userType === "administrator" ||
                  userType === "customer_support") && (
                  <li>
                    <Link
                      to="/order_not_available"
                      className={
                        "nav-link underline" +
                        (activeMenuItem === "/order_not_available"
                          ? " active"
                          : "")
                      }
                    >
                      <i className="bi bi-circle"></i>
                      <span>Order Not Available</span>
                    </Link>
                  </li>
                )}
              </ul>
            </li>
          )}
          {(userType === "administrator" ||
            userType === "operation_assistant") && (
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
                  <Link
                    to="/On_Hold_Manegement_System"
                    className={
                      "nav-link underline" +
                      (activeMenuItem === "/On_Hold_Manegement_System"
                        ? " active"
                        : "")
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>On Hold Management system</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/GRN_Management"
                    className={
                      "nav-link underline" +
                      (activeMenuItem === "/GRN_Management" ? " active" : "")
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>GRN Management</span>
                  </Link>
                </li>
              </ul>
            </li>
          )}
          {userType === "administrator" && (
            <li className="nav-item">
              <a
                className="nav-link collapsed"
                data-bs-target="#forms-naver"
                data-bs-toggle="collapse"
                href="/"
              >
                <i className="bi bi-journal-text"></i>
                <span>ER System</span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul
                id="forms-naver"
                className="nav-content collapse "
                data-bs-parent="#sidebar-nav"
              >
                <li>
                  <Link
                    to="/Exchange_And_Return"
                    className={
                      "nav-link underline" +
                      (activeMenuItem === "/Exchange_And_Return"
                        ? " active"
                        : "")
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>Exchange And Return</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/ER_Management_System"
                    className={
                      "nav-link underline" +
                      (activeMenuItem === "/ER_Management_System"
                        ? " active"
                        : "")
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>ER Management System</span>
                  </Link>
                </li>
              </ul>
            </li>
          )}
          {userType === "administrator" && (
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
                  <Link
                    to="/all_factory"
                    className={
                      "nav-link underline" +
                      (activeMenuItem === "/all_factory" ? " active" : "")
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>All Factories</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/factory_form"
                    className={
                      "nav-link underline" +
                      (activeMenuItem === "/factory_form" ? " active" : "")
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>Add Factory</span>
                  </Link>
                </li>
              </ul>
            </li>
          )}
          {userType === "administrator" && (
            <li className="nav-item">
              <a
                className="nav-link collapsed"
                data-bs-target="#charts-nav"
                data-bs-toggle="collapse"
                href="/"
              >
                <i className="bi bi-bar-chart"></i>
                <span>Product management</span>
                <i className="bi bi-chevron-down ms-auto"></i>
              </a>
              <ul
                id="charts-nav"
                className="nav-content collapse "
                data-bs-parent="#sidebar-nav"
              >
                <li>
                  <Link
                    to="/all_products_list"
                    className={
                      "nav-link underline" +
                      (activeMenuItem === "/all_products_list" ? " active" : "")
                    }
                  >
                    <i className="bi bi-circle"></i>
                    <span>All Products</span>
                  </Link>
                </li>
              </ul>
            </li>
          )}

          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#icons-navv"
              data-bs-toggle="collapse"
              href="/"
            >
              <i className="bi bi-menu-button-wide"></i>
              <span>P1 System</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="icons-navv"
              className="nav-content collapse "
              data-bs-parent="#sidebar-nav"
            >
              <li>
                <Link
                  to="/ordersystem_in_china"
                  className={
                    "nav-link underline" +
                    (activeMenuItem === "/ordersystem_in_china" ? " active" : "")
                  }
                >
                  <i className="bi bi-circle"></i>
                  <span>Order Fulfillment System</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/completed_order_system_in_china"
                  className={
                    "nav-link underline" +
                    (activeMenuItem === "/completed_order_system_in_china"
                      ? " active"
                      : "")
                  }
                >
                  <i className="bi bi-circle"></i>
                  <span>Completed Orders System</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/on_hold_orders_system_in_china"
                  className={
                    "nav-link underline" +
                    (activeMenuItem === "/on_hold_orders_system_china"
                      ? "active"
                      : "")
                  }
                >
                  <i className="bi bi-circle"></i>
                  <span>On Hold Orders System</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/reserve_orders_system_in_china"
                  className={
                    "nav-link underline" +
                    (activeMenuItem === "/reserve_orders_system_in_china"
                      ? "active"
                      : "")
                  }
                >
                  <i className="bi bi-circle"></i>
                  <span>Reserve Orders System</span>
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
