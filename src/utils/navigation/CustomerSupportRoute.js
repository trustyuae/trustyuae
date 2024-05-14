import React from "react";
import {Outlet, Navigate } from "react-router-dom";

const CustomerSupportRoute = () => {
    const storedUser = JSON.parse(localStorage.getItem("user_data"));
  const userType = storedUser ? storedUser.user_role : null;
  return userType === "administrator" || userType === "customer_support" ? (
    <Outlet />
  ) : (
    <Navigate to="/PageNotFound" />
  );
}

export default CustomerSupportRoute




// const OperationAssistantRoute = () => {
//   const storedUser = JSON.parse(localStorage.getItem("user_data"));
//   const userType = storedUser ? storedUser.user_role : null;

//   return userType === "subscriber" || userType === "operation_assistant" ? (
//     <Outlet />
//   ) : (
//     <Navigate to="/PageNotFound" />
//   );
// };

// export default OperationAssistantRoute;