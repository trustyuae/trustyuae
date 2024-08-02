import React from "react";
import {Outlet, Navigate } from "react-router-dom";
import { getUserData } from "../StorageUtils";

const FactoryCoordinatorRoute = () => {
    const storedUser = getUserData();
  const userType = storedUser ? storedUser.user_role : null;

  return userType === "administrator" || userType === "factory_coordinator" ? (
        <Outlet />
      ) : (
        <Navigate to="/PageNotFound" />
      );
}

export default FactoryCoordinatorRoute