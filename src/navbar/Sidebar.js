import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
import { getUserData } from "../utils/StorageUtils";

const Sidebar = () => {
  const location = useLocation();
  const [activeMenuItem, setActiveMenuItem] = useState("");
  const [userType, setUserType] = useState(null);

  const routes = {
    ORDER_SYSTEM: "/ordersystem",
    COMPLETED_ORDER_SYSTEM: "/completed_order_system",
    ON_HOLD_ORDERS_SYSTEM: "/on_hold_orders_system",
    ORDER_MANAGEMENT_SYSTEM: "/order_management_system",
    PO_MANAGEMENT: "/PO_ManagementSystem",
    ORDER_NOT_AVAILABLE: "/order_not_available",
    ON_HOLD_MANAGEMENT: "/On_Hold_Manegement_System",
    GRN_ORDER_PENDING: "/GRN_Products_Pending_System",
    GRN_MANAGEMENT: "/GRN_Management",
    GRN_MANAGEMENT_ON_ORDER_IDS: "/GRN_Management_On_OrderIds",
    EXCHANGE_AND_RETURN: "/Exchange_And_Return",
    ER_MANAGEMENT_SYSTEM: "/ER_Management_System",
    ALL_FACTORIES: "/all_factory",
    ADD_FACTORY: "/factory_form",
    ALL_PRODUCTS: "/all_products_list",
    ORDER_TRACKING_PENDING: "/order_tracking_number_Pending",
    ORDERSYSTEM_IN_CHINA: "/ordersystem_in_china",
    COMPLETED_ORDER_SYSTEM_IN_CHINA: "/completed_order_system_in_china",
    ON_HOLD_ORDERS_SYSTEM_IN_CHINA: "/on_hold_orders_system_in_china",
    MISSING_ORDER_SYSTEM: "/missing_orders_system",
  };

  useEffect(() => {
    setActiveMenuItem(location.pathname);
  }, [location]);

  async function fetchUserData() {
    try {
      const userdata = await getUserData();
      const role = userdata ? userdata.user_role : null;
      setUserType(role);
    } catch (error) {
      console.error("Error fetching user data:", error);
      setUserType(null);
    }
  }

  useEffect(() => {
    fetchUserData();
  }, []);

  const renderMenuItem = (path, label) => (
    <li>
      <Link
        to={path}
        className={`nav-link underline${
          activeMenuItem === path ? " active" : ""
        }`}
      >
        <i className="bi bi-circle"></i>
        <span>{label}</span>
      </Link>
    </li>
  );

  const isUserType = (...types) => types.includes(userType);

  return (
    <aside id="sidebar" className="sidebar" style={{ left: "0" }}>
      <ul className="sidebar-nav" id="sidebar-nav">
        {isUserType(
          "administrator",
          "operation_assistant",
          "packing_assistant"
        ) && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#icons-nav"
              data-bs-toggle="collapse"
              href="/"
              aria-expanded="false"
              aria-controls="icons-nav"
            >
              <i className="bi bi-menu-button-wide"></i>
              <span>P1 System</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="icons-nav"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              {renderMenuItem(routes.ORDER_SYSTEM, "Order Fulfillment System")}
              {renderMenuItem(
                routes.COMPLETED_ORDER_SYSTEM,
                "Completed Orders System"
              )}
              {renderMenuItem(
                routes.ON_HOLD_ORDERS_SYSTEM,
                "On Hold Orders System"
              )}
            </ul>
          </li>
        )}

        {isUserType(
          "administrator",
          "operation_assistant",
          "customer_support"
        ) && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#components-navv"
              data-bs-toggle="collapse"
              href="/"
              aria-expanded="false"
              aria-controls="components-navv"
            >
              <i className="bi bi-menu-button-wide"></i>
              <span>P2 System</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="components-navv"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              {isUserType("administrator", "operation_assistant") && (
                <>
                  {renderMenuItem(
                    routes.ORDER_MANAGEMENT_SYSTEM,
                    "Order Management System"
                  )}
                  {renderMenuItem(routes.PO_MANAGEMENT, "PO Management System")}
                </>
              )}
              {isUserType(
                "administrator",
                "operation_assistant",
                "customer_support"
              ) &&
                renderMenuItem(
                  routes.ORDER_NOT_AVAILABLE,
                  "Order Not Available"
                )}
            </ul>
          </li>
        )}

        {isUserType("administrator", "operation_assistant") && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#forms-nav"
              data-bs-toggle="collapse"
              href="/"
              aria-expanded="false"
              aria-controls="forms-nav"
            >
              <i className="bi bi-journal-text"></i>
              <span>P3 System</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="forms-nav"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              {renderMenuItem(
                routes.ON_HOLD_MANAGEMENT,
                "On Hold Management System"
              )}
              {renderMenuItem(routes.GRN_ORDER_PENDING, "GRN Products Pending System")}
              {renderMenuItem(routes.GRN_MANAGEMENT, "GRN Management")}
              {renderMenuItem(
                routes.GRN_MANAGEMENT_ON_ORDER_IDS,
                "GRN Management On OrderIds"
              )}
            </ul>
          </li>
        )}

        {isUserType("administrator", "operation_assistant") && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#forms-naver"
              data-bs-toggle="collapse"
              href="/"
              aria-expanded="false"
              aria-controls="forms-naver"
            >
              <i className="bi bi-journal-text"></i>
              <span>ER System</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="forms-naver"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              {renderMenuItem(
                routes.EXCHANGE_AND_RETURN,
                "Exchange And Return"
              )}
              {renderMenuItem(
                routes.ER_MANAGEMENT_SYSTEM,
                "ER Management System"
              )}
            </ul>
          </li>
        )}

        {isUserType("administrator", "operation_assistant") && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#charts-nav"
              data-bs-toggle="collapse"
              href="/"
              aria-expanded="false"
              aria-controls="charts-nav"
            >
              <i className="bi bi-bar-chart"></i>
              <span>Factory Management</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="charts-nav"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              {renderMenuItem(routes.ALL_FACTORIES, "All Factories")}
              {renderMenuItem(routes.ADD_FACTORY, "Add Factory")}
            </ul>
          </li>
        )}

        {isUserType("administrator", "operation_assistant") && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#charts-nav2"
              data-bs-toggle="collapse"
              href="/"
              aria-expanded="false"
              aria-controls="charts-nav2"
            >
              <i className="bi bi-bar-chart"></i>
              <span>Product Management</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="charts-nav2"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              {renderMenuItem(routes.ALL_PRODUCTS, "All Products")}
            </ul>
          </li>
        )}

        {isUserType(
          "administrator",
          "operation_assistant",
          "factory_coordinator"
        ) && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#icons-navv"
              data-bs-toggle="collapse"
              href="/"
              aria-expanded="false"
              aria-controls="icons-navv"
            >
              <i className="bi bi-menu-button-wide"></i>
              <span>P1 System China</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="icons-navv"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              {isUserType("administrator", "operation_assistant") &&
                renderMenuItem(
                  routes.ORDER_TRACKING_PENDING,
                  "Order Tracking Pending"
                )}
              {isUserType(
                "administrator",
                "operation_assistant",
                "factory_coordinator"
              ) &&
                renderMenuItem(
                  routes.ORDERSYSTEM_IN_CHINA,
                  "Order Fulfillment System China"
                )}
              {renderMenuItem(
                routes.COMPLETED_ORDER_SYSTEM_IN_CHINA,
                "Completed Orders System China"
              )}
              {renderMenuItem(
                routes.ON_HOLD_ORDERS_SYSTEM_IN_CHINA,
                "On-Hold Orders System China"
              )}
            </ul>
          </li>
        )}

        {isUserType("administrator", "operation_assistant") && (
          <li className="nav-item">
            <a
              className="nav-link collapsed"
              data-bs-target="#charts-nav3"
              data-bs-toggle="collapse"
              href="/"
              aria-expanded="false"
              aria-controls="charts-nav3"
            >
              <i className="bi bi-bar-chart"></i>
              <span>Missing Orders</span>
              <i className="bi bi-chevron-down ms-auto"></i>
            </a>
            <ul
              id="charts-nav3"
              className="nav-content collapse"
              data-bs-parent="#sidebar-nav"
            >
              {renderMenuItem(
                routes.MISSING_ORDER_SYSTEM,
                "Missing Order System"
              )}
            </ul>
          </li>
        )}
      </ul>
    </aside>
  );
};

export default Sidebar;
