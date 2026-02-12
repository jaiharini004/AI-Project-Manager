import React, { createContext, useContext, useState, ReactNode } from 'react';

// For hackathon/demo purposes, we can mock user roles or decode them from the token
type UserRole = 'Admin' | 'Editor' | 'Viewer' | 'Owner';

interface AuthContextType {
    token: string | null;
    role: UserRole;
    login: (token: string, role: UserRole) => void;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [token, setToken] = useState<string | null>(localStorage.getItem('token'));
    const [role, setRole] = useState<UserRole>((localStorage.getItem('role') as UserRole) || 'Viewer');

    const login = (newToken: string, newRole: UserRole) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('role', newRole);
        setToken(newToken);
        setRole(newRole);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        setToken(null);
        setRole('Viewer');
    };

    return (
        <AuthContext.Provider value={{
            token,
            role,
            login,
            logout,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
