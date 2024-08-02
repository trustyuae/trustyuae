import React from "react";
import {Outlet, Navigate } from "react-router-dom";
import { getUserData } from "../StorageUtils";

const OperationAssistantRoute = () => {
  const storedUser = getUserData()
  const userType = storedUser ? storedUser.user_role : null;

  return userType === "administrator" || userType === "operation_assistant" ? (
    <Outlet />
  ) : (
    <Navigate to="/PageNotFound" />
  );
};

export default OperationAssistantRoute;

