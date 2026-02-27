import { Navigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
    children: ReactNode
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {


    const { user } = useAuth();

    //Om person ej är inloggad skickas man till login-sidan
    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <>
            {children}
        </>
    )
}

export default ProtectedRoute