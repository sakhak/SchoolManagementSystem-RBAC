// import { error } from "console";
import { createContext, useContext, useState, type ReactNode } from "react";
export interface User {
    id: string;
    name: string;
    email: string;
    password: string;
    roles: string;
    token?: string;
    // permission: string[];
}
interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    hasRole: (permission: string) => boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        const saved = localStorage.getItem("user");
        return saved ? JSON.parse(saved) : null;
    });
    const login = (userData: User) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };
    const logout = () => {
        setUser(null);
        localStorage.removeItem("user");
    };
    const hasRole = (roles: string) => {
        return user?.roles?.includes(roles) || false;
    };
    const isAuthenticated = !!user?.token;
    return (
        <AuthContext.Provider
            value={{ user, login, logout, hasRole, isAuthenticated }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
