// pages/student/attendance/AttendanceReport.tsx
import React, { useState } from "react";
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from "recharts";
import {
    TrendingUp,
    Calendar,
    Award,
    AlertCircle,
    Download,
    Printer,
    Share2,
    Filter,
} from "lucide-react";

const StudentAttendanceReportPage: React.FC = () => {
    const [reportPeriod, setReportPeriod] = useState<
        "week" | "month" | "semester"
    >("month");
    const [selectedSubject, setSelectedSubject] = useState<string>("all");

    // Sample data
    const monthlyData = [
        { month: "Aug", attendance: 92, present: 23, absent: 2 },
        { month: "Sep", attendance: 88, present: 22, absent: 3 },
        { month: "Oct", attendance: 90, present: 22.5, absent: 2.5 },
        { month: "Nov", attendance: 85, present: 21, absent: 4 },
        { month: "Dec", attendance: 94, present: 23.5, absent: 1.5 },
        { month: "Jan", attendance: 91, present: 22.75, absent: 2.25 },
    ];

    const subjectData = [
        { name: "Mathematics", attendance: 93.3, color: "#3B82F6" },
        { name: "Physics", attendance: 95.0, color: "#10B981" },
        { name: "Chemistry", attendance: 83.3, color: "#F59E0B" },
        { name: "English", attendance: 78.9, color: "#EF4444" },
        { name: "Biology", attendance: 94.4, color: "#8B5CF6" },
    ];

    const weeklyData = [
        { day: "Mon", attendance: 100 },
        { day: "Tue", attendance: 75 },
        { day: "Wed", attendance: 100 },
        { day: "Thu", attendance: 87.5 },
        { day: "Fri", attendance: 100 },
        { day: "Sat", attendance: 0 },
    ];

    const summary = {
        overallAttendance: 88.6,
        totalDays: 120,
        presentDays: 106,
        absentDays: 8,
        lateDays: 4,
        leaveDays: 2,
        bestMonth: "December (94%)",
        bestSubject: "Physics (95%)",
        needsAttention: "English (78.9%)",
    };

    const achievements = [
        {
            title: "Perfect Attendance Week",
            date: "Jan 8-12, 2024",
            icon: "🏆",
        },
        { title: "Most Improved", date: "December 2023", icon: "📈" },
        { title: "Early Bird Award", date: "3 times this month", icon: "⏰" },
    ];

    const COLORS = ["#10B981", "#EF4444", "#F59E0B", "#3B82F6"];

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <TrendingUp className="mr-3" size={24} />
                            My Attendance Report
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Comprehensive attendance analytics and insights
                        </p>
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                            <Printer className="mr-2" size={18} />
                            Print
                        </button>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                            <Download className="mr-2" size={18} />
                            Export PDF
                        </button>
                    </div>
                </div>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-blue-700">
                                Overall Attendance
                            </p>
                            <p className="text-3xl font-bold text-blue-900">
                                {summary.overallAttendance}%
                            </p>
                        </div>
                        <TrendingUp className="text-blue-600" size={32} />
                    </div>
                    <p className="text-sm text-blue-600 mt-2">
                        {summary.presentDays} of {summary.totalDays} days
                    </p>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-green-700">
                                Present Days
                            </p>
                            <p className="text-3xl font-bold text-green-900">
                                {summary.presentDays}
                            </p>
                        </div>
                        <Award className="text-green-600" size={32} />
                    </div>
                    <p className="text-sm text-green-600 mt-2">
                        {(
                            (summary.presentDays / summary.totalDays) *
                            100
                        ).toFixed(1)}
                        % of total days
                    </p>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 border border-red-200 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-red-700">Absent Days</p>
                            <p className="text-3xl font-bold text-red-900">
                                {summary.absentDays}
                            </p>
                        </div>
                        <AlertCircle className="text-red-600" size={32} />
                    </div>
                    <p className="text-sm text-red-600 mt-2">
                        {(
                            (summary.absentDays / summary.totalDays) *
                            100
                        ).toFixed(1)}
                        % of total days
                    </p>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-purple-700">
                                Best Month
                            </p>
                            <p className="text-lg font-bold text-purple-900">
                                {summary.bestMonth}
                            </p>
                        </div>
                        <Calendar className="text-purple-600" size={32} />
                    </div>
                    <p className="text-sm text-purple-600 mt-2">
                        Highest attendance rate
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-wrap gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Report Period
                            </label>
                            <select
                                value={reportPeriod}
                                onChange={(e) =>
                                    setReportPeriod(e.target.value as any)
                                }
                                className="w-full md:w-48 rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="week">Last Week</option>
                                <option value="month">Last Month</option>
                                <option value="semester">This Semester</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Subject
                            </label>
                            <select
                                value={selectedSubject}
                                onChange={(e) =>
                                    setSelectedSubject(e.target.value)
                                }
                                className="w-full md:w-48 rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="all">All Subjects</option>
                                <option value="mathematics">Mathematics</option>
                                <option value="physics">Physics</option>
                                <option value="chemistry">Chemistry</option>
                                <option value="english">English</option>
                                <option value="biology">Biology</option>
                            </select>
                        </div>

                        <div className="flex items-end">
                            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                                <Filter className="mr-2" size={18} />
                                Apply Filters
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <button className="px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
                            <Share2 size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Monthly Trend */}
                <div className="bg-white rounded-lg shadow-sm border p-5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Monthly Attendance Trend
                        </h3>
                        <span className="text-sm text-gray-500">
                            Last 6 months
                        </span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={monthlyData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                />
                                <XAxis dataKey="month" />
                                <YAxis
                                    label={{
                                        value: "Attendance %",
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                />
                                <Tooltip />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="attendance"
                                    stroke="#3B82F6"
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                    activeDot={{ r: 6 }}
                                    name="Attendance Rate"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Subject-wise Attendance */}
                <div className="bg-white rounded-lg shadow-sm border p-5">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold text-gray-900">
                            Subject-wise Attendance
                        </h3>
                        <span className="text-sm text-gray-500">
                            Current Semester
                        </span>
                    </div>
                    <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                />
                                <XAxis dataKey="name" />
                                <YAxis
                                    label={{
                                        value: "Attendance %",
                                        angle: -90,
                                        position: "insideLeft",
                                    }}
                                />
                                <Tooltip />
                                <Bar
                                    dataKey="attendance"
                                    name="Attendance Rate"
                                >
                                    {subjectData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={entry.color}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Weekly Breakdown & Achievements */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Weekly Breakdown */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Weekly Attendance Pattern
                    </h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={weeklyData}>
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    stroke="#f0f0f0"
                                />
                                <XAxis dataKey="day" />
                                <YAxis />
                                <Tooltip />
                                <Bar
                                    dataKey="attendance"
                                    fill="#10B981"
                                    name="Attendance %"
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Achievements */}
                <div className="bg-white rounded-lg shadow-sm border p-5">
                    <h3 className="text-lg font-semibold text-gray-900 mb-6">
                        Achievements & Awards
                    </h3>
                    <div className="space-y-4">
                        {achievements.map((achievement, index) => (
                            <div
                                key={index}
                                className="flex items-center p-3 bg-gradient-to-r from-gray-50 to-white border rounded-lg hover:shadow-sm"
                            >
                                <div className="text-2xl mr-3">
                                    {achievement.icon}
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">
                                        {achievement.title}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        {achievement.date}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <div className="flex items-center">
                            <AlertCircle
                                className="text-yellow-600 mr-2"
                                size={20}
                            />
                            <div>
                                <p className="font-medium text-yellow-800">
                                    Attention Needed
                                </p>
                                <p className="text-sm text-yellow-700">
                                    Your attendance in {summary.needsAttention}{" "}
                                    is below 80%. Consider improving.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Detailed Breakdown */}
            <div className="bg-white rounded-lg shadow-sm border p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">
                    Attendance Distribution
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="font-medium text-gray-900 mb-4">
                            Attendance Types
                        </h4>
                        <div className="h-64">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                    <Pie
                                        data={[
                                            {
                                                name: "Present",
                                                value: summary.presentDays,
                                            },
                                            {
                                                name: "Absent",
                                                value: summary.absentDays,
                                            },
                                            {
                                                name: "Late",
                                                value: summary.lateDays,
                                            },
                                            {
                                                name: "Leave",
                                                value: summary.leaveDays,
                                            },
                                        ]}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent }) =>
                                            `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={80}
                                        fill="#8884d8"
                                        dataKey="value"
                                    >
                                        {COLORS.map((color, index) => (
                                            <Cell
                                                key={`cell-${index}`}
                                                fill={color}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-gray-900 mb-4">
                            Attendance Statistics
                        </h4>
                        <div className="space-y-4">
                            {[
                                {
                                    label: "Total School Days",
                                    value: summary.totalDays,
                                    color: "text-gray-900",
                                },
                                {
                                    label: "Present Days",
                                    value: summary.presentDays,
                                    color: "text-green-600",
                                },
                                {
                                    label: "Absent Days",
                                    value: summary.absentDays,
                                    color: "text-red-600",
                                },
                                {
                                    label: "Late Arrivals",
                                    value: summary.lateDays,
                                    color: "text-yellow-600",
                                },
                                {
                                    label: "Leave Days",
                                    value: summary.leaveDays,
                                    color: "text-blue-600",
                                },
                                {
                                    label: "Attendance Percentage",
                                    value: `${summary.overallAttendance}%`,
                                    color: "text-purple-600",
                                },
                            ].map((stat, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                                >
                                    <span className="text-gray-700">
                                        {stat.label}
                                    </span>
                                    <span
                                        className={`font-semibold ${stat.color}`}
                                    >
                                        {stat.value}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentAttendanceReportPage;
