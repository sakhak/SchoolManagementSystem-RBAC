// pages/student/attendance/ClassAttendance.tsx
import React, { useState } from "react";
import {
    Users,
    BookOpen,
    Clock,
    TrendingUp,
    TrendingDown,
    Download,
    Filter,
    Calendar,
} from "lucide-react";

interface ClassAttendance {
    id: number;
    subject: string;
    teacher: string;
    totalClasses: number;
    attended: number;
    attendanceRate: number;
    lastAttendance: string;
    status: "good" | "warning" | "poor";
    upcomingClass: {
        date: string;
        time: string;
        room: string;
    };
}

const StudentClassAttendancePage: React.FC = () => {
    const [selectedSubject, setSelectedSubject] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("attendance");

    const classAttendanceData: ClassAttendance[] = [
        {
            id: 1,
            subject: "Mathematics",
            teacher: "Mr. Johnson",
            totalClasses: 45,
            attended: 42,
            attendanceRate: 93.3,
            lastAttendance: "2024-01-15",
            status: "good",
            upcomingClass: {
                date: "2024-01-18",
                time: "08:00 AM",
                room: "Room 101",
            },
        },
        {
            id: 2,
            subject: "Physics",
            teacher: "Ms. Williams",
            totalClasses: 40,
            attended: 38,
            attendanceRate: 95.0,
            lastAttendance: "2024-01-15",
            status: "good",
            upcomingClass: {
                date: "2024-01-18",
                time: "09:15 AM",
                room: "Lab 201",
            },
        },
        {
            id: 3,
            subject: "Chemistry",
            teacher: "Dr. Brown",
            totalClasses: 42,
            attended: 35,
            attendanceRate: 83.3,
            lastAttendance: "2024-01-15",
            status: "warning",
            upcomingClass: {
                date: "2024-01-19",
                time: "10:30 AM",
                room: "Lab 202",
            },
        },
        {
            id: 4,
            subject: "English",
            teacher: "Mrs. Davis",
            totalClasses: 38,
            attended: 30,
            attendanceRate: 78.9,
            lastAttendance: "2024-01-15",
            status: "poor",
            upcomingClass: {
                date: "2024-01-19",
                time: "11:45 AM",
                room: "Room 102",
            },
        },
        {
            id: 5,
            subject: "Biology",
            teacher: "Dr. Wilson",
            totalClasses: 36,
            attended: 34,
            attendanceRate: 94.4,
            lastAttendance: "2024-01-16",
            status: "good",
            upcomingClass: {
                date: "2024-01-20",
                time: "08:00 AM",
                room: "Lab 203",
            },
        },
    ];

    const subjects = [
        "All Subjects",
        "Mathematics",
        "Physics",
        "Chemistry",
        "English",
        "Biology",
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case "good":
                return "text-green-600 bg-green-50 border-green-200";
            case "warning":
                return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "poor":
                return "text-red-600 bg-red-50 border-red-200";
            default:
                return "text-gray-600 bg-gray-50";
        }
    };

    const getStatusIcon = (rate: number) => {
        if (rate >= 90)
            return <TrendingUp className="text-green-500" size={20} />;
        if (rate >= 75)
            return <TrendingUp className="text-yellow-500" size={20} />;
        return <TrendingDown className="text-red-500" size={20} />;
    };

    const overallStats = {
        totalSubjects: classAttendanceData.length,
        averageAttendance:
            classAttendanceData.reduce(
                (sum, item) => sum + item.attendanceRate,
                0,
            ) / classAttendanceData.length,
        bestSubject: classAttendanceData.reduce((best, current) =>
            current.attendanceRate > best.attendanceRate ? current : best,
        ),
        needsImprovement: classAttendanceData.filter(
            (item) => item.attendanceRate < 80,
        ).length,
    };

    const filteredData = classAttendanceData
        .filter(
            (item) =>
                selectedSubject === "all" || item.subject === selectedSubject,
        )
        .sort((a, b) => {
            if (sortBy === "attendance")
                return b.attendanceRate - a.attendanceRate;
            if (sortBy === "name") return a.subject.localeCompare(b.subject);
            return 0;
        });

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Users className="mr-3" size={24} />
                    My Class Attendance
                </h1>
                <p className="text-gray-600 mt-1">
                    View attendance statistics for each subject
                </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                <div className="bg-white rounded-lg shadow-sm border p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Average Attendance
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {overallStats.averageAttendance.toFixed(1)}%
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-blue-100">
                            <BookOpen className="text-blue-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Total Subjects
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {overallStats.totalSubjects}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-green-100">
                            <Users className="text-green-600" size={24} />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Best Subject
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {overallStats.bestSubject.subject}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-purple-100">
                            <TrendingUp className="text-purple-600" size={24} />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        {overallStats.bestSubject.attendanceRate.toFixed(1)}%
                        attendance
                    </p>
                </div>

                <div className="bg-white rounded-lg shadow-sm border p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-600">
                                Need Improvement
                            </p>
                            <p className="text-2xl font-bold text-gray-900">
                                {overallStats.needsImprovement}
                            </p>
                        </div>
                        <div className="p-3 rounded-full bg-yellow-100">
                            <TrendingDown
                                className="text-yellow-600"
                                size={24}
                            />
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                        Subjects below 80%
                    </p>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex flex-col md:flex-row gap-4">
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
                                {subjects.map((subject) => (
                                    <option
                                        key={subject}
                                        value={
                                            subject === "All Subjects"
                                                ? "all"
                                                : subject
                                        }
                                    >
                                        {subject}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Sort By
                            </label>
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full md:w-48 rounded-md border border-gray-300 px-3 py-2"
                            >
                                <option value="attendance">
                                    Attendance Rate
                                </option>
                                <option value="name">Subject Name</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex items-end">
                        <button className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            <Download className="mr-2" size={18} />
                            Export Report
                        </button>
                    </div>
                </div>
            </div>

            {/* Class Attendance Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {filteredData.map((subject) => (
                    <div
                        key={subject.id}
                        className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow"
                    >
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900">
                                        {subject.subject}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        Teacher: {subject.teacher}
                                    </p>
                                </div>
                                <div
                                    className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(subject.status)}`}
                                >
                                    {subject.attendanceRate.toFixed(1)}%
                                </div>
                            </div>

                            {/* Attendance Progress */}
                            <div className="mb-4">
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-gray-600">
                                        Attendance Progress
                                    </span>
                                    <span className="font-medium">
                                        {subject.attended}/
                                        {subject.totalClasses} classes
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className={`h-2.5 rounded-full ${
                                            subject.attendanceRate >= 90
                                                ? "bg-green-600"
                                                : subject.attendanceRate >= 75
                                                  ? "bg-yellow-500"
                                                  : "bg-red-500"
                                        }`}
                                        style={{
                                            width: `${subject.attendanceRate}%`,
                                        }}
                                    ></div>
                                </div>
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                    <span>0%</span>
                                    <span>50%</span>
                                    <span>100%</span>
                                </div>
                            </div>

                            {/* Statistics */}
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-gray-50 rounded p-3">
                                    <p className="text-sm text-gray-600">
                                        Last Attended
                                    </p>
                                    <p className="font-medium text-gray-900">
                                        {new Date(
                                            subject.lastAttendance,
                                        ).toLocaleDateString()}
                                    </p>
                                </div>
                                <div className="bg-gray-50 rounded p-3">
                                    <p className="text-sm text-gray-600">
                                        Attendance Status
                                    </p>
                                    <div className="flex items-center">
                                        {getStatusIcon(subject.attendanceRate)}
                                        <span className="ml-2 font-medium capitalize">
                                            {subject.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Upcoming Class */}
                            <div className="bg-blue-50 border border-blue-200 rounded p-3">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-blue-900">
                                        Next Class
                                    </span>
                                    <Clock
                                        className="text-blue-500"
                                        size={16}
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-gray-600">
                                            Date:
                                        </span>
                                        <p className="font-medium">
                                            {new Date(
                                                subject.upcomingClass.date,
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Time:
                                        </span>
                                        <p className="font-medium">
                                            {subject.upcomingClass.time}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="text-gray-600">
                                            Room:
                                        </span>
                                        <p className="font-medium">
                                            {subject.upcomingClass.room}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Actions */}
                            <div className="flex space-x-2 mt-4">
                                <button className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 text-sm">
                                    View Detailed Report
                                </button>
                                <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm">
                                    Request Leave
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Attendance Summary */}
            <div className="bg-white rounded-lg shadow-sm border p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Attendance Summary
                </h3>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className="bg-gray-50">
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Subject
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Teacher
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Total Classes
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Attended
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Absent
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Attendance Rate
                                </th>
                                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                    Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {classAttendanceData.map((subject) => (
                                <tr
                                    key={subject.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 font-medium text-gray-900">
                                        {subject.subject}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {subject.teacher}
                                    </td>
                                    <td className="px-4 py-3 text-gray-600">
                                        {subject.totalClasses}
                                    </td>
                                    <td className="px-4 py-3 text-green-600 font-medium">
                                        {subject.attended}
                                    </td>
                                    <td className="px-4 py-3 text-red-600 font-medium">
                                        {subject.totalClasses -
                                            subject.attended}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center">
                                            <span className="font-medium">
                                                {subject.attendanceRate.toFixed(
                                                    1,
                                                )}
                                                %
                                            </span>
                                            {getStatusIcon(
                                                subject.attendanceRate,
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(subject.status)}`}
                                        >
                                            {subject.status.toUpperCase()}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default StudentClassAttendancePage;
