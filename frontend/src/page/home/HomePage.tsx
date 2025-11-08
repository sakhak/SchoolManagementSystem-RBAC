import React from "react";
import { useAuth } from "../../contexts/AuthCotext";

interface QuickAction {
    label: string;
    icon: string;
    color: string;
    onClick?: () => void;
}

interface Activity {
    title: string;
    description: string;
    time: string;
    color: string;
}

interface Stat {
    label: string;
    value: string;
    icon: string;
    color: string;
}

const HomePage: React.FC = () => {
    const colorClasses: Record<
        string,
        {
            border: string;
            text: string;
            bg: string;
            hoverBorder: string;
            hoverBg: string;
        }
    > = {
        blue: {
            border: "border-blue-500",
            text: "text-blue-500",
            bg: "bg-blue-50",
            hoverBorder: "hover:border-blue-500",
            hoverBg: "hover:bg-blue-50",
        },
        green: {
            border: "border-green-500",
            text: "text-green-500",
            bg: "bg-green-50",
            hoverBorder: "hover:border-green-500",
            hoverBg: "hover:bg-green-50",
        },
        purple: {
            border: "border-purple-500",
            text: "text-purple-500",
            bg: "bg-purple-50",
            hoverBorder: "hover:border-purple-500",
            hoverBg: "hover:bg-purple-50",
        },
        yellow: {
            border: "border-yellow-500",
            text: "text-yellow-500",
            bg: "bg-yellow-50",
            hoverBorder: "hover:border-yellow-500",
            hoverBg: "hover:bg-yellow-50",
        },
    };

    const quickActions: QuickAction[] = [
        {
            label: "Add Student",
            icon: "fas fa-user-plus",
            color: "blue",
            onClick: () => console.log("Add Student clicked"),
        },
        {
            label: "Generate Report",
            icon: "fas fa-file-invoice",
            color: "green",
            onClick: () => console.log("Generate Report clicked"),
        },
        {
            label: "Create Event",
            icon: "fas fa-calendar-plus",
            color: "purple",
            onClick: () => console.log("Create Event clicked"),
        },
        {
            label: "Send Notice",
            icon: "fas fa-bullhorn",
            color: "yellow",
            onClick: () => console.log("Send Notice clicked"),
        },
    ];

    const recentActivities: Activity[] = [
        {
            title: "New student registration",
            description: "Emily Chen joined Grade 5",
            time: "2 hours ago",
            color: "blue",
        },
        {
            title: "Assignment submitted",
            description: "Math homework by Grade 8",
            time: "4 hours ago",
            color: "green",
        },
    ];

    const stats: Stat[] = [
        {
            label: "Total Students",
            value: "1,247",
            icon: "fas fa-users",
            color: "blue",
        },
        {
            label: "Teachers",
            value: "68",
            icon: "fas fa-chalkboard-teacher",
            color: "green",
        },
        {
            label: "Classes",
            value: "42",
            icon: "fas fa-book",
            color: "purple",
        },
        {
            label: "Attendance Today",
            value: "94%",
            icon: "fas fa-calendar-check",
            color: "yellow",
        },
    ];

    const handleQuickAction = (action: QuickAction) => {
        if (action.onClick) {
            action.onClick();
        }
        console.log(`Action: ${action.label}`);
    };

    const handleStatClick = (stat: Stat) => {
        console.log(`View details for: ${stat.label}`);
    };

    const handleActivityClick = (activity: Activity) => {
        console.log(`View activity: ${activity.title}`);
    };
    const { user } = useAuth();

    return (
        <div className="bg-gray-50 font-sans">
            <div className="flex h-screen">
                <div className="flex-1 flex flex-col overflow-hidden">
                    <main className="flex-1 overflow-y-auto p-6 bg-gray-50 mt-[-20px]">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                Welcome back, Dr. {user?.name}!
                            </h1>
                            <p className="text-gray-600">
                                Here's what's happening at your school today.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            {stats.map((stat, index) => (
                                <div
                                    key={index}
                                    className={`bg-white rounded-xl shadow-sm p-6 border-l-4 ${
                                        colorClasses[stat.color]?.border
                                    } cursor-pointer transition-all duration-200 hover:shadow-md`}
                                    onClick={() => handleStatClick(stat)}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600">
                                                {stat.label}
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900">
                                                {stat.value}
                                            </p>
                                        </div>
                                        <i
                                            className={`${stat.icon} text-3xl ${
                                                colorClasses[stat.color]?.text
                                            }`}
                                        ></i>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Recent Activity
                                </h2>
                                <div className="space-y-4">
                                    {recentActivities.map((activity, index) => (
                                        <div
                                            key={index}
                                            className="flex items-start space-x-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition-colors"
                                            onClick={() =>
                                                handleActivityClick(activity)
                                            }
                                        >
                                            <div
                                                className={`w-2 h-2 ${
                                                    colorClasses[activity.color]
                                                        ?.bg
                                                } rounded-full mt-2 flex-shrink-0`}
                                            ></div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-gray-800">
                                                    {activity.title}
                                                </p>
                                                <p className="text-sm text-gray-600">
                                                    {activity.description}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {activity.time}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">
                                    Quick Actions
                                </h2>
                                <div className="grid grid-cols-2 gap-4">
                                    {quickActions.map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={() =>
                                                handleQuickAction(action)
                                            }
                                            className={`p-4 border-2 border-dashed border-gray-300 rounded-lg text-center transition-all duration-200 ${
                                                colorClasses[action.color]
                                                    ?.hoverBorder
                                            } ${
                                                colorClasses[action.color]
                                                    ?.hoverBg
                                            } hover:shadow-md`}
                                        >
                                            <i
                                                className={`${
                                                    action.icon
                                                } text-2xl ${
                                                    colorClasses[action.color]
                                                        ?.text
                                                } mb-2`}
                                            ></i>
                                            <p className="font-semibold text-gray-700">
                                                {action.label}
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 bg-white rounded-xl shadow-sm p-6">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">
                                System Overview
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button
                                    className="p-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                                    onClick={() =>
                                        console.log("View All Students")
                                    }
                                >
                                    <i className="fas fa-users text-lg mb-2"></i>
                                    <p className="font-semibold">
                                        View All Students
                                    </p>
                                </button>
                                <button
                                    className="p-4 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    onClick={() =>
                                        console.log("Manage Classes")
                                    }
                                >
                                    <i className="fas fa-book text-lg mb-2"></i>
                                    <p className="font-semibold">
                                        Manage Classes
                                    </p>
                                </button>
                                <button
                                    className="p-4 bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors"
                                    onClick={() => console.log("View Reports")}
                                >
                                    <i className="fas fa-chart-bar text-lg mb-2"></i>
                                    <p className="font-semibold">
                                        View Reports
                                    </p>
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        </div>
    );
};

export default HomePage;
