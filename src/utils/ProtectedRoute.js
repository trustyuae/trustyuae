import React, { useEffect, useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router-dom';
import { getToken } from './StorageUtils';
import { getUserData } from './StorageUtils';

const ProtectedRoute = () => {
    const location = useLocation();
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = await getToken();
                const userData = await getUserData();
                setIsAuthenticated(!!token);
                setUserRole(userData?.user_role ?? null);
            } catch (error) {
                setIsAuthenticated(false);
                setUserRole(null);
            } finally {
                setIsLoading(false);
            }
        };
        checkAuth();
    }, []);

    if (isLoading) {
        return null; // or a loading spinner
    }

    if (!isAuthenticated) {
        return <Navigate to="/" replace />;
    }

    const path = location.pathname;
    const query = new URLSearchParams(location.search);

    if (path === "/customer_support_pending_orders" && userRole !== "customer_support") {
        if (userRole === "accountant") {
            return <Navigate to="/customer_support_account" replace />;
        }
        return <Navigate to="/customer_order_support" replace />;
    }

    // Step 1 role-based access:
    // accountant can access only Account page (+ its account order details flow).
    if (userRole === "accountant") {
        const isAccountPage = path === "/customer_support_account";
        const isCompleteOrdersPage = path === "/customer_support_complete_orders";
        const isAccountOrderDetails =
            path.startsWith("/order_details/") &&
            query.get("cs") === "1" &&
            query.get("account") === "1";
        const isCsCompletedOrderDetails =
            path.startsWith("/order_details/") &&
            query.get("cs") === "1" &&
            query.get("complete") === "1";
        if (
            !isAccountPage &&
            !isCompleteOrdersPage &&
            !isAccountOrderDetails &&
            !isCsCompletedOrderDetails
        ) {
            return <Navigate to="/customer_support_account" replace />;
        }
    }

    // customer_support can access only Customer order support (+ its CS order details flow).
    if (userRole === "customer_support") {
        const isCustomerSupportPage = path === "/customer_order_support";
        const isCsPendingOrdersPage = path === "/customer_support_pending_orders";
        const isCompleteOrdersPage = path === "/customer_support_complete_orders";
        const isCustomerSupportOrderDetails =
            path.startsWith("/order_details/") &&
            query.get("cs") === "1" &&
            query.get("account") !== "1";
        const isPendingAccountOrderDetails =
            path.startsWith("/order_details/") &&
            query.get("cs") === "1" &&
            query.get("account") === "1" &&
            query.get("pending") === "1";
        if (
            !isCustomerSupportPage &&
            !isCsPendingOrdersPage &&
            !isCompleteOrdersPage &&
            !isCustomerSupportOrderDetails &&
            !isPendingAccountOrderDetails
        ) {
            return <Navigate to="/customer_order_support" replace />;
        }
    }

    // support_manager can access all Customer Support pages and CS order details.
    if (userRole === "support_manager") {
        const isCustomerSupportModulePage =
            path === "/customer_order_support" ||
            path === "/customer_support_account" ||
            path === "/customer_support_production" ||
            path === "/customer_support_complete_orders";
        const isCustomerSupportOrderDetails =
            path.startsWith("/order_details/") &&
            query.get("cs") === "1";
        if (!isCustomerSupportModulePage && !isCustomerSupportOrderDetails) {
            return <Navigate to="/customer_order_support" replace />;
        }
    }

    return <Outlet />;
}

export default ProtectedRoute;