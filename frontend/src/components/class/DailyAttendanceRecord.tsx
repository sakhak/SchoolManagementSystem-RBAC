// pages/student/attendance/DailyAttendance.tsx
import React, { useState } from "react";
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    Download,
    Search,
    Filter,
} from "lucide-react";

interface DailyAttendance {
    date: string;
    day: string;
    subjects: {
        name: string;
        time: string;
        teacher: string;
        status: "present" | "absent" | "late" | "leave";
        marks?: number;
        room: string;
    }[];
}

const StudentDailyAttendancePage: React.FC = () => {
    const [selectedMonth, setSelectedMonth] = useState<string>("2024-01");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");

    // Sample student data
    const studentInfo = {
        name: "Sophorn Thida",
        studentId: "STU-2024-001",
        grade: "Grade 10A",
        classTeacher: "Mr. David Smith",
        totalSubjects: 8,
    };

    const attendanceData: DailyAttendance[] = [
        {
            date: "2024-01-15",
            day: "Monday",
            subjects: [
                {
                    name: "Mathematics",
                    time: "08:00 - 09:00",
                    teacher: "Mr. Johnson",
                    status: "present",
                    marks: 5,
                    room: "Room 101",
                },
                {
                    name: "Physics",
                    time: "09:15 - 10:15",
                    teacher: "Ms. Williams",
                    status: "present",
                    marks: 5,
                    room: "Lab 201",
                },
                {
                    name: "Chemistry",
                    time: "10:30 - 11:30",
                    teacher: "Dr. Brown",
                    status: "late",
                    marks: 3,
                    room: "Lab 202",
                },
                {
                    name: "English",
                    time: "11:45 - 12:45",
                    teacher: "Mrs. Davis",
                    status: "present",
                    marks: 5,
                    room: "Room 102",
                },
            ],
        },
        {
            date: "2024-01-16",
            day: "Tuesday",
            subjects: [
                {
                    name: "Biology",
                    time: "08:00 - 09:00",
                    teacher: "Dr. Wilson",
                    status: "present",
                    marks: 5,
                    room: "Lab 203",
                },
                {
                    name: "History",
                    time: "09:15 - 10:15",
                    teacher: "Mr. Taylor",
                    status: "absent",
                    marks: 0,
                    room: "Room 103",
                },
                {
                    name: "Geography",
                    time: "10:30 - 11:30",
                    teacher: "Ms. Anderson",
                    status: "leave",
                    marks: 4,
                    room: "Room 104",
                },
                {
                    name: "Computer Science",
                    time: "11:45 - 12:45",
                    teacher: "Mr. Thomas",
                    status: "present",
                    marks: 5,
                    room: "Lab 101",
                },
            ],
        },
        {
            date: "2024-01-17",
            day: "Wednesday",
            subjects: [
                {
                    name: "Mathematics",
                    time: "08:00 - 09:00",
                    teacher: "Mr. Johnson",
                    status: "present",
                    marks: 5,
                    room: "Room 101",
                },
                {
                    name: "Physics",
                    time: "09:15 - 10:15",
                    teacher: "Ms. Williams",
                    status: "present",
                    marks: 5,
                    room: "Lab 201",
                },
                {
                    name: "Art",
                    time: "10:30 - 11:30",
                    teacher: "Mrs. Garcia",
                    status: "present",
                    marks: 5,
                    room: "Art Room",
                },
                {
                    name: "Physical Education",
                    time: "11:45 - 12:45",
                    teacher: "Mr. Lee",
                    status: "present",
                    marks: 5,
                    room: "Gym",
                },
            ],
        },
    ];

    const statusColors = {
        present: "bg-green-100 text-green-800 border-green-200",
        absent: "bg-red-100 text-red-800 border-red-200",
        late: "bg-yellow-100 text-yellow-800 border-yellow-200",
        leave: "bg-blue-100 text-blue-800 border-blue-200",
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case "present":
                return <CheckCircle className="text-green-500" size={16} />;
            case "absent":
                return <XCircle className="text-red-500" size={16} />;
            case "late":
                return <AlertCircle className="text-yellow-500" size={16} />;
            case "leave":
                return <AlertCircle className="text-blue-500" size={16} />;
            default:
                return null;
        }
    };

    // Calculate statistics
    const stats = {
        totalClasses: attendanceData.reduce(
            (sum, day) => sum + day.subjects.length,
            0,
        ),
        present: attendanceData
            .flatMap((day) => day.subjects)
            .filter((s) => s.status === "present").length,
        absent: attendanceData
            .flatMap((day) => day.subjects)
            .filter((s) => s.status === "absent").length,
        late: attendanceData
            .flatMap((day) => day.subjects)
            .filter((s) => s.status === "late").length,
        leave: attendanceData
            .flatMap((day) => day.subjects)
            .filter((s) => s.status === "leave").length,
        attendanceRate: 0,
    };
    stats.attendanceRate = ((stats.present / stats.totalClasses) * 100).toFixed(
        1,
    );

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                    <Calendar className="mr-3" size={24} />
                    My Daily Attendance
                </h1>
                <p className="text-gray-600 mt-1">
                    View your daily attendance records and status
                </p>
            </div>

            {/* Student Info Card */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <p className="text-sm text-gray-600">Student Name</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {studentInfo.name}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Student ID</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {studentInfo.studentId}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Grade/Class</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {studentInfo.grade}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Class Teacher</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {studentInfo.classTeacher}
                        </p>
                    </div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Month
                        </label>
                        <div className="relative">
                            <Calendar
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) =>
                                    setSelectedMonth(e.target.value)
                                }
                                className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Status Filter
                        </label>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                            <option value="all">All Status</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="late">Late</option>
                            <option value="leave">Leave</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Search Subject
                        </label>
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search by subject..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="flex items-end">
                        <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            <Filter className="mr-2" size={18} />
                            Filter
                        </button>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-2xl font-bold text-gray-900">
                        {stats.totalClasses}
                    </div>
                    <div className="text-sm text-gray-600">Total Classes</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-700">
                        {stats.present}
                    </div>
                    <div className="text-sm text-green-600">Present</div>
                </div>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-red-700">
                        {stats.absent}
                    </div>
                    <div className="text-sm text-red-600">Absent</div>
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-yellow-700">
                        {stats.late}
                    </div>
                    <div className="text-sm text-yellow-600">Late</div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-blue-700">
                        {stats.attendanceRate}%
                    </div>
                    <div className="text-sm text-blue-600">Attendance Rate</div>
                </div>
            </div>

            {/* Attendance Calendar View */}
            <div className="bg-white rounded-lg shadow-sm border mb-6">
                <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-900">
                        Daily Attendance Records
                    </h2>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <Download className="mr-1" size={16} />
                        Export Records
                    </button>
                </div>

                <div className="p-4">
                    {attendanceData.map((day) => (
                        <div key={day.date} className="mb-6 last:mb-0">
                            <div className="flex items-center justify-between mb-3">
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {new Date(day.date).toLocaleDateString(
                                            "en-US",
                                            {
                                                weekday: "long",
                                                month: "long",
                                                day: "numeric",
                                            },
                                        )}
                                    </h3>
                                    <p className="text-sm text-gray-600">
                                        {day.day}
                                    </p>
                                </div>
                                <div className="text-sm text-gray-500">
                                    {
                                        day.subjects.filter(
                                            (s) => s.status === "present",
                                        ).length
                                    }{" "}
                                    of {day.subjects.length} classes attended
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {day.subjects.map((subject, index) => (
                                    <div
                                        key={index}
                                        className={`border rounded-lg p-4 ${statusColors[subject.status]} hover:shadow-sm transition-shadow`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <h4 className="font-medium text-gray-900">
                                                    {subject.name}
                                                </h4>
                                                <div className="flex items-center text-sm text-gray-600 mt-1">
                                                    <Clock
                                                        className="mr-1"
                                                        size={14}
                                                    />
                                                    {subject.time}
                                                </div>
                                            </div>
                                            <div className="flex items-center">
                                                {getStatusIcon(subject.status)}
                                                <span className="ml-1 text-sm font-medium capitalize">
                                                    {subject.status}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Teacher:
                                                </span>
                                                <span className="font-medium">
                                                    {subject.teacher}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Room:
                                                </span>
                                                <span className="font-medium">
                                                    {subject.room}
                                                </span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">
                                                    Attendance Marks:
                                                </span>
                                                <span
                                                    className={`font-bold ${subject.marks === 5 ? "text-green-600" : subject.marks === 0 ? "text-red-600" : "text-yellow-600"}`}
                                                >
                                                    {subject.marks}/5
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Legend */}
            <div className="bg-gray-50 rounded-lg border p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Attendance Status Legend
                </h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                        <span className="text-sm">
                            Present - Full attendance marks (5/5)
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                        <span className="text-sm">
                            Absent - No attendance marks (0/5)
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                        <span className="text-sm">
                            Late - Reduced marks (3/5)
                        </span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                        <span className="text-sm">
                            Leave - With permission (4/5)
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDailyAttendancePage;
