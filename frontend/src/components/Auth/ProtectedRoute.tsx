import { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
    children: ReactNode;
    allowedRoles?: string[];
}

export const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
    const { isAuthenticated, role } = useAuth();

    if (!isAuthenticated) {
        // In a real app, use React Router to redirect to /login
        // For this simple demo without router setup yet, we might return a Login component or null
        return <div className="p-10 text-center text-slate-500">Please Log In</div>;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        return (
            <div className="h-screen flex items-center justify-center bg-slate-50">
                <div className="bg-white p-8 rounded-lg shadow-lg border border-red-200">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
                    <p className="text-slate-600">Your role <strong>{role}</strong> is not authorized to view this page.</p>
                </div>
            </div>
        )
    }

    return <>{children}</>;
};
