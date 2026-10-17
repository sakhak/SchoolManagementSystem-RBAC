import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { request } from "../../components/utils/Request";
import { useAuth } from "../../contexts/AuthCotext";

interface DashboardSession {
    id: number;
    session_date: string;
    status: string;
    class?: { name: string };
    teacher?: { user?: { name: string } };
}

interface DashboardStats {
    students: number | null;
    teachers: number | null;
    classes: number | null;
    attendanceRate: number | null;
}

const HomePage: React.FC = () => {
    const navigate = useNavigate();
    const { user, hasPermission, hasRole } = useAuth();
    const canViewStudents = hasPermission("student.view");
    const canViewTeachers = hasPermission("teacher.view");
    const canViewClasses = hasPermission("class.view");
    const canViewSessions = hasPermission("session.view");
    const canViewAttendanceReport = hasPermission("attendance.report");
    const [stats, setStats] = useState<DashboardStats>({
        students: null,
        teachers: null,
        classes: null,
        attendanceRate: null,
    });
    const [sessions, setSessions] = useState<DashboardSession[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!user?.token) return;

        let cancelled = false;
        const now = new Date();
        const today = [
            now.getFullYear(),
            String(now.getMonth() + 1).padStart(2, "0"),
            String(now.getDate()).padStart(2, "0"),
        ].join("-");
        const requests: Promise<unknown>[] = [];

        setLoading(true);
        setError("");

        if (canViewStudents) {
            requests.push(
                request("students?per_page=1").then((result) => {
                    if (!cancelled) {
                        setStats((current) => ({
                            ...current,
                            students: Number(result.total ?? 0),
                        }));
                    }
                }),
            );
        }
        if (canViewTeachers) {
            requests.push(
                request("teachers?per_page=1").then((result) => {
                    if (!cancelled) {
                        setStats((current) => ({
                            ...current,
                            teachers: Number(result.total ?? 0),
                        }));
                    }
                }),
            );
        }
        if (canViewClasses) {
            requests.push(
                request("classes").then((result) => {
                    if (!cancelled) {
                        setStats((current) => ({
                            ...current,
                            classes: Array.isArray(result.data)
                                ? result.data.length
                                : 0,
                        }));
                    }
                }),
            );
        }
        if (canViewAttendanceReport) {
            requests.push(
                request(`attendance/report?from=${today}&to=${today}`).then(
                    (result) => {
                        if (!cancelled) {
                            const rows = Array.isArray(result.data)
                                ? result.data
                                : [];
                            const totals = rows.reduce(
                                (
                                    sum: { present: number; total: number },
                                    row: { present?: number; total?: number },
                                ) => ({
                                    present:
                                        sum.present + Number(row.present || 0),
                                    total: sum.total + Number(row.total || 0),
                                }),
                                { present: 0, total: 0 },
                            );
                            setStats((current) => ({
                                ...current,
                                attendanceRate:
                                    totals.total > 0
                                        ? Math.round(
                                              (totals.present / totals.total) *
                                                  100,
                                          )
                                        : null,
                            }));
                        }
                    },
                ),
            );
        }
        if (canViewSessions) {
            requests.push(
                request(`class-sessions?from=${today}`).then((result) => {
                    if (!cancelled) {
                        setSessions(
                            Array.isArray(result.data) ? result.data : [],
                        );
                    }
                }),
            );
        }

        Promise.allSettled(requests).then((results) => {
            if (cancelled) return;
            if (results.some((result) => result.status === "rejected")) {
                setError("Some dashboard information could not be loaded.");
            }
            setLoading(false);
        });

        return () => {
            cancelled = true;
        };
    }, [
        user?.token,
        canViewStudents,
        canViewTeachers,
        canViewClasses,
        canViewSessions,
        canViewAttendanceReport,
    ]);

    const statCards = [
        {
            label: "Total Students",
            value: canViewStudents
                ? (stats.students?.toLocaleString() ?? (loading ? "..." : "0"))
                : "-",
            icon: "fas fa-users",
            color: "border-blue-500 text-blue-500",
        },
        {
            label: "Teachers",
            value: canViewTeachers
                ? (stats.teachers?.toLocaleString() ?? (loading ? "..." : "0"))
                : "-",
            icon: "fas fa-chalkboard-teacher",
            color: "border-green-500 text-green-500",
        },
        {
            label: "Classes",
            value: canViewClasses
                ? (stats.classes?.toLocaleString() ?? (loading ? "..." : "0"))
                : "-",
            icon: "fas fa-book",
            color: "border-purple-500 text-purple-500",
        },
        {
            label: "Attendance Today",
            value: canViewAttendanceReport
                ? stats.attendanceRate === null
                    ? loading
                        ? "..."
                        : "No records"
                    : `${stats.attendanceRate}%`
                : "-",
            icon: "fas fa-calendar-check",
            color: "border-yellow-500 text-yellow-500",
        },
    ];

    const quickActions = [
        {
            label: "Manage Students",
            icon: "fas fa-user-graduate",
            path: "/students",
            visible: canViewStudents,
        },
        {
            label: "Take Attendance",
            icon: "fas fa-calendar-check",
            path: "/attendance/daily",
            visible: hasPermission("attendance.record"),
        },
        {
            label: "Manage Classes",
            icon: "fas fa-school",
            path: "/classes",
            visible: canViewClasses,
        },
        {
            label: "Attendance Report",
            icon: "fas fa-chart-bar",
            path: "/attendance/report",
            visible: canViewAttendanceReport,
        },
        {
            label: "My Attendance",
            icon: "fas fa-user-check",
            path: "/classAttendance",
            visible: hasRole("student") && hasPermission("attendance.view-own"),
        },
    ].filter((action) => action.visible);

    const upcomingSessions = sessions
        .filter(
            (session) =>
                session.status === "scheduled" || session.status === "ongoing",
        )
        .sort((first, second) =>
            first.session_date.localeCompare(second.session_date),
        )
        .slice(0, 5);

    return (
        <div className="bg-gray-50 font-sans">
            <div className="mb-8">
                <h1 className="mb-2 text-3xl font-bold text-gray-900">
                    Welcome back, {user?.name ?? "there"}!
                </h1>
                <p className="text-gray-600">
                    Here's what's happening at your school today.
                </p>
            </div>

            {error && (
                <p role="alert" className="mb-4 text-sm text-red-700">
                    {error}
                </p>
            )}

            <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {statCards.map((stat) => (
                    <div
                        key={stat.label}
                        className={`flex items-center justify-between rounded-lg border-l-4 bg-white p-6 shadow-sm ${stat.color}`}
                    >
                        <div>
                            <p className="text-sm text-gray-600">
                                {stat.label}
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {stat.value}
                            </p>
                        </div>
                        <i
                            className={`${stat.icon} text-3xl`}
                            aria-hidden="true"
                        />
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                <section className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">
                        Upcoming Sessions
                    </h2>
                    {!canViewSessions ? (
                        <p className="text-sm text-gray-600">
                            Session schedule is not available for this account.
                        </p>
                    ) : upcomingSessions.length === 0 ? (
                        <p className="text-sm text-gray-600">
                            {loading
                                ? "Loading sessions..."
                                : "No upcoming sessions."}
                        </p>
                    ) : (
                        <div className="space-y-4">
                            {upcomingSessions.map((session) => (
                                <div
                                    key={session.id}
                                    className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3 last:border-0"
                                >
                                    <div>
                                        <p className="font-semibold text-gray-800">
                                            {session.class?.name ??
                                                "Class session"}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {session.teacher?.user?.name ??
                                                "Teacher not assigned"}
                                        </p>
                                    </div>
                                    <time
                                        className="shrink-0 text-sm text-gray-500"
                                        dateTime={session.session_date}
                                    >
                                        {new Date(
                                            `${session.session_date}T00:00:00`,
                                        ).toLocaleDateString()}
                                    </time>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <section className="rounded-lg bg-white p-6 shadow-sm">
                    <h2 className="mb-4 text-xl font-bold text-gray-900">
                        Quick Actions
                    </h2>
                    {quickActions.length === 0 ? (
                        <p className="text-sm text-gray-600">
                            No quick actions are available for this account.
                        </p>
                    ) : (
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            {quickActions.map((action) => (
                                <button
                                    key={action.path}
                                    type="button"
                                    onClick={() => navigate(action.path)}
                                    className="rounded-md border border-gray-200 p-4 text-left transition-colors hover:border-blue-500 hover:bg-blue-50"
                                >
                                    <i
                                        className={`${action.icon} mb-2 text-xl text-blue-600`}
                                        aria-hidden="true"
                                    />
                                    <p className="font-semibold text-gray-800">
                                        {action.label}
                                    </p>
                                </button>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
};

export default HomePage;
