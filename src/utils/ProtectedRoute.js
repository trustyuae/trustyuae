import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { getToken } from './StorageUtils';

const ProtectedRoute = () => {
    let token1 = getToken();
    
    return (
        token1 ? <Outlet /> : <Navigate to="/" />
    );
}

export default ProtectedRoute;