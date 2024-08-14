import React from "react";
import {Outlet, Navigate } from "react-router-dom";
import { getUserData } from "../StorageUtils";

const CustomerSupportRoute = async() => {
    const storedUser = await getUserData();
  const userType = storedUser ? storedUser.user_role : null;
  return userType === "administrator" || userType === "customer_support" ? (
    <Outlet />
  ) : (
    <Navigate to="/PageNotFound" />
  );
}

export default CustomerSupportRoute

