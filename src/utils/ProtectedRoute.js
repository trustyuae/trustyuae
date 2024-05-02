import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';

const ProtectedRoute = () => {
    let token1 = localStorage.getItem('token');
    
    return (
        token1 ? <Outlet /> : <Navigate to="/" />
    );
}

export default ProtectedRoute;