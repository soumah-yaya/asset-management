import React from 'react'
import useAuth from '../hooks/useAuth'
import { useLocation, Navigate, Outlet } from 'react-router-dom'

function Protected() {
    const location = useLocation();
    const auth = useAuth()
    let path = location.pathname;

    if (path !== '/login') {
        if (auth.isAuth()) {
            return <Outlet />
        } else {
            return <Navigate to="/login" state={{ from: path }} replace />
        }
    }

    return <Outlet />

}

export default Protected