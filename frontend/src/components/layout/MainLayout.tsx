import React, { useEffect, useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import FooterPage from "../common/FooterPage";
import HeaderPage from "../common/HeaderPage";
import { useAuth } from "../../contexts/AuthCotext";
import { request } from "../utils/Request";

interface MenuItem {
    id: string;
    label: string;
    icon: string;
    path?: string;
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

    const { user } = useAuth();
    // console.log(user?.token);
    useEffect(() => {
        if (!user?.token) {
            navigate("/login");
        }
    });
    // const menuItems: MenuItem[] = [
    //     { id: "dashboard", label: "Dashboard", icon: "fas fa-home", path: "/" },
    //     {
    //         id: "users",
    //         label: "Users",
    //         icon: "fas fa-users",
    //         subItems: [
    //             {
    //                 id: "user",
    //                 label: "Users",
    //                 icon: "fas fa-user",
    //                 path: "/user",
    //             },
    //             {
    //                 id: "role",
    //                 label: "Role",
    //                 icon: "fas fa-user-shield",
    //                 path: "/role",
    //             },
    //             {
    //                 id: "permission",
    //                 label: "Permission",
    //                 icon: "fas fa-key",
    //                 path: "/permission",
    //             },
    //         ],
    //     },
    //     {
    //         id: "students",
    //         label: "Students",
    //         icon: "fas fa-user-graduate",
    //         subItems: [
    //             {
    //                 id: "all-students",
    //                 label: "All Students",
    //                 icon: "fas fa-list",
    //                 path: "/students",
    //             },
    //             {
    //                 id: "student-attendance",
    //                 label: "Attendance",
    //                 icon: "fas fa-clipboard-check",
    //                 path: "/students/attendance",
    //             },
    //         ],
    //     },
    //     {
    //         id: "teachers",
    //         label: "Teachers",
    //         icon: "fas fa-chalkboard-teacher",
    //         subItems: [
    //             {
    //                 id: "all-teachers",
    //                 label: "All Teachers",
    //                 icon: "fas fa-list",
    //                 path: "/teachers",
    //             },
    //             {
    //                 id: "add-teacher",
    //                 label: "Add Teacher",
    //                 icon: "fas fa-user-plus",
    //                 path: "/teachers/add",
    //             },
    //             {
    //                 id: "teacher-attendance",
    //                 label: "Attendance",
    //                 icon: "fas fa-clipboard-check",
    //                 path: "/teachers/attendance",
    //             },
    //         ],
    //     },
    //     {
    //         id: "classes",
    //         label: "Classes",
    //         icon: "fas fa-book",
    //         subItems: [
    //             {
    //                 id: "all-classes",
    //                 label: "All Classes",
    //                 icon: "fas fa-list",
    //                 path: "/classes",
    //             },
    //             {
    //                 id: "class-schedule",
    //                 label: "Class Schedule",
    //                 icon: "fas fa-calendar",
    //                 path: "/classes/schedule",
    //             },
    //             {
    //                 id: "subjects",
    //                 label: "Subjects",
    //                 icon: "fas fa-book-open",
    //                 path: "/subjects",
    //             },
    //         ],
    //     },
    //     {
    //         id: "schedule",
    //         label: "Schedule",
    //         icon: "fas fa-calendar-alt",
    //         path: "/schedule",
    //     },
    //     {
    //         id: "finance",
    //         label: "Finance",
    //         icon: "fas fa-file-invoice-dollar",
    //         subItems: [
    //             {
    //                 id: "fees",
    //                 label: "Fee Management",
    //                 icon: "fas fa-money-bill-wave",
    //                 path: "/finance/fees",
    //             },
    //             {
    //                 id: "payroll",
    //                 label: "Payroll",
    //                 icon: "fas fa-receipt",
    //                 path: "/finance/payroll",
    //             },
    //             {
    //                 id: "expenses",
    //                 label: "Expenses",
    //                 icon: "fas fa-chart-line",
    //                 path: "/finance/expenses",
    //             },
    //             {
    //                 id: "reports",
    //                 label: "Financial Reports",
    //                 icon: "fas fa-file-alt",
    //                 path: "/finance/reports",
    //             },
    //         ],
    //     },
    //     {
    //         id: "reports",
    //         label: "Reports",
    //         icon: "fas fa-chart-bar",
    //         subItems: [
    //             {
    //                 id: "attendance-reports",
    //                 label: "Attendance Reports",
    //                 icon: "fas fa-clipboard-list",
    //                 path: "/reports/attendance",
    //             },
    //             {
    //                 id: "student-reports",
    //                 label: "Student Reports",
    //                 icon: "fas fa-user-graduate",
    //                 path: "/reports/students",
    //             },
    //             {
    //                 id: "teacher-reports",
    //                 label: "Teacher Reports",
    //                 icon: "fas fa-chalkboard-teacher",
    //                 path: "/reports/teachers",
    //             },
    //             {
    //                 id: "financial-reports",
    //                 label: "Financial Reports",
    //                 icon: "fas fa-file-invoice-dollar",
    //                 path: "/reports/finance",
    //             },
    //         ],
    //     },
    //     {
    //         id: "settings",
    //         label: "Settings",
    //         icon: "fas fa-cog",
    //         subItems: [
    //             {
    //                 id: "general",
    //                 label: "General Settings",
    //                 icon: "fas fa-cogs",
    //                 path: "/settings/general",
    //             },
    //             {
    //                 id: "users-settings",
    //                 label: "User Management",
    //                 icon: "fas fa-users-cog",
    //                 path: "/settings/users",
    //             },
    //             {
    //                 id: "backup",
    //                 label: "Backup & Restore",
    //                 icon: "fas fa-database",
    //                 path: "/settings/backup",
    //             },
    //         ],
    //     },
    // ];
    const menuItems: MenuItem[] = [
        {
            id: "dashboard",
            label: "Dashboard",
            icon: "fas fa-home",
            path: "/",
        },
        {
            id: "users",
            label: "Users & Roles",
            icon: "fas fa-users-cog",
            subItems: [
                {
                    id: "all-users",
                    label: "All Users",
                    icon: "fas fa-users",
                    path: "/user",
                },
                {
                    id: "roles",
                    label: "Roles",
                    icon: "fas fa-user-shield",
                    path: "/role",
                },
                {
                    id: "permissions",
                    label: "Permissions",
                    icon: "fas fa-key",
                    path: "/permission",
                },
                {
                    id: "user-activity",
                    label: "User Activity",
                    icon: "fas fa-history",
                    path: "/users/activity",
                },
            ],
        },
        {
            id: "teachers",
            label: "Teachers",
            icon: "fas fa-chalkboard-teacher",
            subItems: [
                {
                    id: "all-teachers",
                    label: "All Teachers",
                    icon: "fas fa-users",
                    path: "/teachers",
                },
                {
                    id: "add-teacher",
                    label: "Add Teacher",
                    icon: "fas fa-user-plus",
                    path: "/teachers/add",
                },
                {
                    id: "teacher-attendance",
                    label: "Attendance",
                    icon: "fas fa-clipboard-check",
                    path: "/teachers/attendance",
                },
                {
                    id: "teacher-assignments",
                    label: "Assignments",
                    icon: "fas fa-tasks",
                    path: "/teachers/assignments",
                },
            ],
        },
        {
            id: "students",
            label: "Students",
            icon: "fas fa-user-graduate",
            subItems: [
                {
                    id: "all-students",
                    label: "All Students",
                    icon: "fas fa-users",
                    path: "/students",
                },
                {
                    id: "student-attendance",
                    label: "Attendance",
                    icon: "fas fa-clipboard-check",
                    path: "/attendance/studentClassSessionAttendance",
                },
                {
                    id: "student-registration",
                    label: "New Registration",
                    icon: "fas fa-user-plus",
                    path: "/students/register",
                },
                {
                    id: "student-promotion",
                    label: "Promotion",
                    icon: "fas fa-arrow-up",
                    path: "/students/promotion",
                },
            ],
        },
        {
            id: "classes",
            label: "Classes & Subjects",
            icon: "fas fa-school",
            subItems: [
                {
                    id: "all-classes",
                    label: "Classes",
                    icon: "fas fa-chalkboard",
                    path: "/classes",
                },
                {
                    id: "subjects",
                    label: "Subjects",
                    icon: "fas fa-book-open",
                    path: "/subjects",
                },
                {
                    id: "class-teacher",
                    label: "Class Teachers",
                    icon: "fas fa-user-tie",
                    path: "/classes/teachers",
                },
                {
                    id: "timetable",
                    label: "Timetable",
                    icon: "fas fa-calendar-alt",
                    path: "/timetable",
                },
            ],
        },
        {
            id: "attendance",
            label: "Attendance",
            icon: "fas fa-clipboard-list",
            subItems: [
                {
                    id: "daily-attendance",
                    label: "Daily Attendance",
                    icon: "fas fa-calendar-day",
                    path: "/attendance/daily",
                },
                {
                    id: "class-attendance",
                    label: "Class Attendance",
                    icon: "fas fa-users",
                    path: "/classAttendance",
                },
                {
                    id: "attendance-report",
                    label: "Attendance Report",
                    icon: "fas fa-chart-bar",
                    path: "/attendance/report",
                },
            ],
        },
        {
            id: "examinations",
            label: "Examinations",
            icon: "fas fa-file-alt",
            subItems: [
                {
                    id: "exam-schedule",
                    label: "Exam Schedule",
                    icon: "fas fa-calendar",
                    path: "/exams/schedule",
                },
                {
                    id: "marks-entry",
                    label: "Marks Entry",
                    icon: "fas fa-edit",
                    path: "/exams/marks",
                },
                {
                    id: "results",
                    label: "Results",
                    icon: "fas fa-chart-line",
                    path: "/exams/results",
                },
            ],
        },

        {
            id: "schedule",
            label: "Schedule",
            icon: "fas fa-calendar-alt",
            subItems: [
                {
                    id: "timetable",
                    label: "Class Timetable",
                    icon: "fas fa-table",
                    path: "/timetable",
                },
                {
                    id: "exam-schedule",
                    label: "Exam Schedule",
                    icon: "fas fa-calendar-check",
                    path: "/schedule/exams",
                },
                {
                    id: "events",
                    label: "Events",
                    icon: "fas fa-calendar-star",
                    path: "/schedule/events",
                },
                {
                    id: "routine",
                    label: "Daily Routine",
                    icon: "fas fa-clock",
                    path: "/schedule/routine",
                },
            ],
        },

        {
            id: "finance",
            label: "Finance",
            icon: "fas fa-file-invoice-dollar",
            subItems: [
                {
                    id: "fees",
                    label: "Fee Management",
                    icon: "fas fa-money-check-alt",
                    subItems: [
                        {
                            id: "fee-collection",
                            label: "Fee Collection",
                            icon: "fas fa-cash-register",
                            path: "/finance/fees/collection",
                        },
                        {
                            id: "fee-structure",
                            label: "Fee Structure",
                            icon: "fas fa-list-alt",
                            path: "/finance/fees/structure",
                        },
                        {
                            id: "fee-due",
                            label: "Due Fees",
                            icon: "fas fa-exclamation-circle",
                            path: "/finance/fees/due",
                        },
                        {
                            id: "fee-discounts",
                            label: "Discounts",
                            icon: "fas fa-percentage",
                            path: "/finance/fees/discounts",
                        },
                    ],
                },
                {
                    id: "payroll",
                    label: "Payroll",
                    icon: "fas fa-receipt",
                    subItems: [
                        {
                            id: "salary-sheet",
                            label: "Salary Sheet",
                            icon: "fas fa-file-invoice",
                            path: "/finance/payroll/salary",
                        },
                        {
                            id: "advances",
                            label: "Salary Advances",
                            icon: "fas fa-hand-holding-usd",
                            path: "/finance/payroll/advances",
                        },
                        {
                            id: "payroll-reports",
                            label: "Reports",
                            icon: "fas fa-chart-pie",
                            path: "/finance/payroll/reports",
                        },
                    ],
                },
                {
                    id: "accounting",
                    label: "Accounting",
                    icon: "fas fa-book",
                    subItems: [
                        {
                            id: "expenses",
                            label: "Expenses",
                            icon: "fas fa-chart-line",
                            path: "/finance/expenses",
                        },
                        {
                            id: "income",
                            label: "Income",
                            icon: "fas fa-money-bill-wave",
                            path: "/finance/income",
                        },
                        {
                            id: "transactions",
                            label: "Transactions",
                            icon: "fas fa-exchange-alt",
                            path: "/finance/transactions",
                        },
                    ],
                },
                {
                    id: "finance-reports",
                    label: "Reports",
                    icon: "fas fa-chart-bar",
                    path: "/finance/reports",
                },
            ],
        },

        {
            id: "reports",
            label: "Reports & Analytics",
            icon: "fas fa-chart-pie",
            subItems: [
                {
                    id: "academic-reports",
                    label: "Academic Reports",
                    icon: "fas fa-graduation-cap",
                    subItems: [
                        {
                            id: "attendance-reports",
                            label: "Attendance Reports",
                            icon: "fas fa-clipboard-list",
                            path: "/reports/attendance",
                        },
                        {
                            id: "exam-reports",
                            label: "Exam Reports",
                            icon: "fas fa-file-alt",
                            path: "/reports/exams",
                        },
                        {
                            id: "student-progress",
                            label: "Student Progress",
                            icon: "fas fa-chart-line",
                            path: "/reports/progress",
                        },
                    ],
                },
                {
                    id: "student-reports",
                    label: "Student Reports",
                    icon: "fas fa-user-graduate",
                    path: "/reports/students",
                },
                {
                    id: "teacher-reports",
                    label: "Teacher Reports",
                    icon: "fas fa-chalkboard-teacher",
                    path: "/reports/teachers",
                },
                {
                    id: "finance-reports",
                    label: "Financial Reports",
                    icon: "fas fa-file-invoice-dollar",
                    path: "/reports/finance",
                },
                {
                    id: "analytics",
                    label: "Analytics Dashboard",
                    icon: "fas fa-chart-network",
                    path: "/reports/analytics",
                },
            ],
        },
    ];
    const filteredMenuItems = menuItems.filter((item) => {
        const isStudent = user?.roles?.some(
            (role: any) => role?.key === "student",
        );
        const isTeacher = user?.roles?.some(
            (role: any) => role?.key === "teacher",
        );
        const isAdmin = user?.roles?.some((role: any) => role?.key === "admin");

        const hiddenForStudents = [
            "dashboard",
            "users",
            "teachers",
            "classes",
            "finance",
            "reports",
            "settings",
        ];
        const hiddenForTeacher = [
            "dashboard",
            "teachers",
            "finance",
            "reports",
            "users",
        ];
        const hiddenForAdmin = ["dashboard", "users"];

        if (isStudent && hiddenForStudents.includes(item.id)) return false;
        if (isTeacher && hiddenForTeacher.includes(item.id)) return false;
        if (isAdmin && hiddenForAdmin.includes(item.id)) return false;

        return true; // keep the item if no conditions match
    });

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
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await request("userprofile");
                // console.log(res);
            } catch (err: any) {
                console.error(err, "Failed to request UserProfile");
            } finally {
                console.log("Request succee");
            }
        };
        fetchUserProfile();
    }, []);

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
