import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import FooterPage from "../common/FooterPage";
import HeaderPage from "../common/HeaderPage";
import { useAuth } from "../../contexts/AuthCotext";

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    path?: string;
    /** shown only if the user has ANY of these permissions (omit = everyone) */
    permission?: string[];
    subItems?: MenuItem[];
}

const MainLayout: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [activeMenu, setActiveMenu] = useState<string>("dashboard");
    const [openSubMenus, setOpenSubMenus] = useState<{
        [key: string]: boolean;
    }>({});

    const handleNavigate = (to: string) => {
        navigate(to);
    };

    const { user, hasPermission, refreshUser } = useAuth();
    // pick up role/permission changes made since the last login
    useEffect(() => {
        if (user?.token) refreshUser();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user?.token]);

    const menuItems: MenuItem[] = [
        { id: "dashboard", label: "Dashboard", icon: "fas fa-home", path: "/" },
        {
            id: "users",
            label: "Manage Users",
            icon: "fas fa-users-cog",
            subItems: [
                { id: "all-users", label: "All Users", icon: "fas fa-users", path: "/user", permission: ["user.view"] },
                { id: "roles", label: "Roles", icon: "fas fa-user-shield", path: "/role", permission: ["role.view"] },
                { id: "permissions", label: "Permissions", icon: "fas fa-key", path: "/permission", permission: ["permission.view"] },
            ],
        },
        {
            id: "teachers",
            label: "Teachers",
            icon: "fas fa-chalkboard-teacher",
            permission: ["teacher.view"],
            path: "/teachers",
        },
        {
            id: "students",
            label: "Students",
            icon: "fas fa-user-graduate",
            subItems: [
                { id: "all-students", label: "All Students", icon: "fas fa-users", path: "/students", permission: ["student.view"] },
                { id: "student-blacklist", label: "Blacklist", icon: "fas fa-user-times", path: "/students/blacklist", permission: ["blacklist.view"] },
            ],
        },
        { id: "classes", label: "Classes", icon: "fas fa-school", path: "/classes", permission: ["class.view"] },
        { id: "terms", label: "Academic Calendar", icon: "fas fa-calendar-alt", path: "/terms", permission: ["term.view"] },
        {
            id: "attendance",
            label: "Attendance",
            icon: "fas fa-clipboard-list",
            subItems: [
                { id: "daily-attendance", label: "Take Attendance", icon: "fas fa-calendar-day", path: "/attendance/daily", permission: ["attendance.record"] },
                { id: "attendance-report", label: "Report", icon: "fas fa-chart-bar", path: "/attendance/report", permission: ["attendance.report"] },
                { id: "my-attendance", label: "My Attendance", icon: "fas fa-user-check", path: "/classAttendance", permission: ["attendance.view-own"] },
            ],
        },
    ];

    // Keep an item only if the user may use it; parents with no visible children disappear.
    const canSee = (item: MenuItem) => !item.permission || hasPermission(...item.permission);
    const filteredMenuItems = menuItems
        .map((item) =>
            item.subItems
                ? { ...item, subItems: item.subItems.filter(canSee) }
                : item,
        )
        .filter((item) =>
            item.subItems ? item.subItems.length > 0 : canSee(item),
        );

    const toggleSubMenu = (menuId: string) => {
        setOpenSubMenus((prev) => {
            if (prev[menuId]) return {};
            return { [menuId]: true };
        });
    };

    const handleMenuItemClick = (item: MenuItem) => {
        if (item.path) {
            handleNavigate(item.path);
            setActiveMenu(item.id);
            setOpenSubMenus({});
        } else if (item.subItems) {
            toggleSubMenu(item.id);
        }
    };

    const handleSubMenuItemClick = (subItem: MenuItem) => {
        if (subItem.path) {
            handleNavigate(subItem.path);
            setActiveMenu(subItem.id);
            // setOpenSubMenus({});
        }
    };

    const isMenuItemActive = (item: MenuItem) => {
        if (activeMenu === item.id) return true;
        if (item.path && location.pathname === item.path) return true;
        if (item.subItems) {
            return item.subItems.some(
                (s) =>
                    activeMenu === s.id ||
                    (s.path && location.pathname === s.path),
            );
        }
        return false;
    };

    const isSubMenuItemActive = (subItem: MenuItem) => {
        return (
            activeMenu === subItem.id ||
            (subItem.path && location.pathname === subItem.path)
        );
    };

    const getTextClassForItem = (item: MenuItem) =>
        isMenuItemActive(item) ? "text-yellow-300" : "text-white";

    return (
        <>
            <div className="bg-gray-50 font-sans">
                <div className="flex h-screen">
                    <div className="w-64 bg-blue-800 text-white shadow-lg">
                        <div className="p-6 border-b border-blue-700">
                            <div className="flex items-center space-x-3">
                                <i className="fas fa-graduation-cap text-2xl text-yellow-300"></i>
                                <h1 className="text-xl font-bold">EduManage</h1>
                            </div>
                        </div>

                        <nav className="p-4 space-y-2">
                            {filteredMenuItems.map((item) => (
                                <div key={item.id}>
                                    <button
                                        onClick={() =>
                                            handleMenuItemClick(item)
                                        }
                                        className={`flex items-center justify-between space-x-3 p-3 rounded-lg w-full text-left transition-all ${
                                            isMenuItemActive(item)
                                                ? "bg-blue-700"
                                                : "hover:bg-blue-600"
                                        }`}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <i
                                                className={`${
                                                    item.icon
                                                } w-5 ${getTextClassForItem(item)}`}
                                            ></i>
                                            <span
                                                className={getTextClassForItem(
                                                    item,
                                                )}
                                            >
                                                {item.label}
                                            </span>
                                        </div>
                                        {item.subItems && (
                                            <i
                                                className={`fas fa-chevron-down text-xs transition-transform ${
                                                    openSubMenus[item.id]
                                                        ? "rotate-180"
                                                        : ""
                                                }`}
                                            ></i>
                                        )}
                                    </button>
                                    {item.subItems && openSubMenus[item.id] && (
                                        <div className="ml-4 mt-1 space-y-1 border-l-2 border-blue-600 pl-3">
                                            {item.subItems.map((subItem) => (
                                                <button
                                                    key={subItem.id}
                                                    onClick={() =>
                                                        handleSubMenuItemClick(
                                                            subItem,
                                                        )
                                                    }
                                                    className={`flex items-center space-x-3 p-2 rounded-lg w-full text-left transition-all ${
                                                        isSubMenuItemActive(
                                                            subItem,
                                                        )
                                                            ? "bg-blue-700"
                                                            : "hover:bg-blue-600"
                                                    }`}
                                                >
                                                    <i
                                                        className={`${
                                                            subItem.icon
                                                        } w-4 text-sm ${
                                                            isSubMenuItemActive(
                                                                subItem,
                                                            )
                                                                ? "text-yellow-300"
                                                                : "text-white"
                                                        }`}
                                                    ></i>
                                                    <span
                                                        className={`text-sm ${
                                                            isSubMenuItemActive(
                                                                subItem,
                                                            )
                                                                ? "text-yellow-300"
                                                                : "text-white"
                                                        }`}
                                                    >
                                                        {subItem.label}
                                                    </span>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>
                    </div>
                    <div className="flex-1 flex flex-col overflow-hidden">
                        <HeaderPage />
                        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
                            <Outlet />
                            <FooterPage />
                        </main>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MainLayout;
