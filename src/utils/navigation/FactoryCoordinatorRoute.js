import React from "react";
import {Outlet, Navigate } from "react-router-dom";

const FactoryCoordinatorRoute = () => {
    const storedUser = JSON.parse(localStorage.getItem("user_data"));
  const userType = storedUser ? storedUser.user_role : null;

  return userType === "administrator" || userType === "factory_coordinator" ? (
        <Outlet />
      ) : (
        <Navigate to="/PageNotFound" />
      );
}

export default FactoryCoordinatorRoute