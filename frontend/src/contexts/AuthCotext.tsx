import {
    createContext,
    useCallback,
    useContext,
    useState,
    type ReactNode,
} from "react";
import { request } from "../components/utils/Request";

export interface UserRole {
    id: number;
    name: string;
    key: string;
}

export interface User {
    id?: string;
    name?: string;
    email?: string;
    password?: string;
    roles?: UserRole[];
    permissions?: string[];
    userprofile?: any;
    token?: string;
}

interface AuthContextType {
    user: User | null;
    login: (userData: User) => void;
    logout: () => void;
    refreshUser: () => Promise<void>;
    hasRole: (...roleKeys: string[]) => boolean;
    hasPermission: (...permissionKeys: string[]) => boolean;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(() => {
        try {
            const saved = localStorage.getItem("user");
            return saved ? JSON.parse(saved) : null;
        } catch {
            return null;
        }
    });

    const persist = (u: User | null) => {
        if (u) localStorage.setItem("user", JSON.stringify(u));
        else localStorage.removeItem("user");
        setUser(u);
    };

    const login = (userData: User) => persist(userData);
    const logout = () => {
        // best effort: revoke the token on the server, then clear locally
        request("logout", "post").catch(() => undefined);
        persist(null);
    };

    // Re-read roles/permissions from the server (they may have changed since login)
    const refreshUser = useCallback(async () => {
        const saved = JSON.parse(localStorage.getItem("user") || "null");
        if (!saved?.token) return;
        try {
            const res = await request("me");
            persist({ ...saved, ...res.data, token: saved.token });
        } catch {
            /* request() already signs out on 401 */
        }
    }, []);

    const isSuper = !!user?.roles?.some((r) => r.key === "super_admin");
    const hasRole = (...keys: string[]) =>
        isSuper || !!user?.roles?.some((r) => keys.includes(r.key));
    // pass several keys = "any of them"
    const hasPermission = (...keys: string[]) =>
        isSuper || keys.some((k) => user?.permissions?.includes(k));

    return (
        <AuthContext.Provider
            value={{
                user,
                login,
                logout,
                refreshUser,
                hasRole,
                hasPermission,
                isAuthenticated: !!user?.token,
            }}
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
