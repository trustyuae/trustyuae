import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/actions/UserActions";
import { Box } from "@mui/material";

const Header = ({ onToggleSidebar }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogOut = async () => {
    try {
      dispatch(logoutUser(navigate));
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const userData = JSON.parse(localStorage.getItem("user_data"));

  return (
    <header id="header" className="header fixed-top d-flex align-items-center">
      <div className="d-flex align-items-center justify-content-between">
        <Link className="logo d-flex align-items-center" to="/ordersystem">
          <Box>
            <img
              src={require("../assets/logo-large-main.webp")}
              alt="Logo"
              style={{ height: "50px" }}
            />
          </Box>
        </Link>
        <i
          className="bi bi-list toggle-sidebar-btn"
          onClick={onToggleSidebar}
        ></i>
      </div>
     
      <nav className="header-nav ms-auto">
        <ul className="d-flex align-items-center">
         
          <li className="nav-item dropdown pe-3">
            <a
              className="nav-link nav-profile d-block text-center pe-0"
              href="/"
              data-bs-toggle="dropdown"
            >
              <div className="d-flex flex-column align-items-center">
                <img
                  src={userData?.user_image_url}
                  alt="Profile"
                  className="rounded-circle"
                  style={{marginTop:'2px'}} 
                />
                <span className="d-none d-md-block">
                  {userData?.first_name} {userData?.last_name}
                </span>
              </div>
            </a>
            <ul className="dropdown-menu dropdown-menu-end dropdown-menu-arrow profile">
              <li className="dropdown-header">
                <h6>
                  {" "}
                  {userData?.first_name} {userData?.last_name}
                </h6>
                <span>Web Designer</span>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="users-profile.html"
                >
                  <i className="bi bi-person"></i>
                  <span>My Profile</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="users-profile.html"
                >
                  <i className="bi bi-gear"></i>
                  <span>Account Settings</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <a
                  className="dropdown-item d-flex align-items-center"
                  href="pages-faq.html"
                >
                  <i className="bi bi-question-circle"></i>
                  <span>Need Help?</span>
                </a>
              </li>
              <li>
                <hr className="dropdown-divider" />
              </li>
              <li>
                <button
                  className="dropdown-item d-flex align-items-center"
                  onClick={() => handleLogOut()}
                >
                  <i className="bi bi-box-arrow-right"></i>
                  <span>Sign Out</span>
                </button>
              </li>
            </ul>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
