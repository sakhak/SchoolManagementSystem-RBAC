// pages/student/attendance/ClassSessionAttendance.tsx
import React, { useState } from "react";
import {
    Calendar,
    Clock,
    CheckCircle,
    XCircle,
    AlertCircle,
    MapPin,
    User,
    BookOpen,
    Download,
    Filter,
    Search,
    Check,
    RefreshCw,
    BarChart3,
    Zap,
} from "lucide-react";

interface ClassSession {
    id: number;
    date: string;
    day: string;
    time: string;
    duration: string;
    subject: string;
    subjectCode: string;
    teacher: string;
    room: string;
    status: "upcoming" | "ongoing" | "completed" | "cancelled";
    attendanceStatus?: "present" | "absent" | "late" | "excused";
    attendanceMarked: boolean;
    attendanceTime?: string;
    attendanceNotes?: string;
    maxMarks: number;
    earnedMarks?: number;
    topics: string[];
    assignmentDue?: string;
}

const StudentClassSessionAttendancePage: React.FC = () => {
    const [selectedDate, setSelectedDate] = useState<string>(
        new Date().toISOString().split("T")[0],
    );
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedSubject, setSelectedSubject] = useState<string>("all");
    const [searchQuery, setSearchQuery] = useState<string>("");
    const [viewMode, setViewMode] = useState<"list" | "calendar">("list");

    // Sample student data
    const studentInfo = {
        name: "Sophorn Thida",
        studentId: "STU-2024-001",
        grade: "Grade 10A",
        section: "Science",
        rollNumber: "15",
        classTeacher: "Mr. David Smith",
    };

    // Sample class sessions data
    const classSessions: ClassSession[] = [
        {
            id: 1,
            date: "2024-01-15",
            day: "Monday",
            time: "08:00 - 09:00",
            duration: "1 hour",
            subject: "Mathematics",
            subjectCode: "MATH101",
            teacher: "Mr. Johnson",
            room: "Room 101",
            status: "completed",
            attendanceStatus: "present",
            attendanceMarked: true,
            attendanceTime: "07:55 AM",
            maxMarks: 5,
            earnedMarks: 5,
            topics: ["Algebra", "Quadratic Equations"],
        },
        {
            id: 2,
            date: "2024-01-15",
            day: "Monday",
            time: "09:15 - 10:15",
            duration: "1 hour",
            subject: "Physics",
            subjectCode: "PHYS201",
            teacher: "Ms. Williams",
            room: "Lab 201",
            status: "completed",
            attendanceStatus: "late",
            attendanceMarked: true,
            attendanceTime: "09:20 AM",
            attendanceNotes: "Traffic delay",
            maxMarks: 5,
            earnedMarks: 3,
            topics: ["Newton's Laws", "Motion"],
        },
        {
            id: 3,
            date: "2024-01-15",
            day: "Monday",
            time: "10:30 - 11:30",
            duration: "1 hour",
            subject: "Chemistry",
            subjectCode: "CHEM101",
            teacher: "Dr. Brown",
            room: "Lab 202",
            status: "completed",
            attendanceStatus: "present",
            attendanceMarked: true,
            attendanceTime: "10:25 AM",
            maxMarks: 5,
            earnedMarks: 5,
            topics: ["Organic Chemistry", "Reactions"],
        },
        {
            id: 4,
            date: "2024-01-16",
            day: "Tuesday",
            time: "08:00 - 09:00",
            duration: "1 hour",
            subject: "Biology",
            subjectCode: "BIO301",
            teacher: "Dr. Wilson",
            room: "Lab 203",
            status: "completed",
            attendanceStatus: "absent",
            attendanceMarked: true,
            attendanceNotes: "Medical leave",
            maxMarks: 5,
            earnedMarks: 0,
            topics: ["Cell Biology", "Mitosis"],
            assignmentDue: "2024-01-20",
        },
        {
            id: 5,
            date: "2024-01-16",
            day: "Tuesday",
            time: "09:15 - 10:15",
            duration: "1 hour",
            subject: "English",
            subjectCode: "ENG101",
            teacher: "Mrs. Davis",
            room: "Room 102",
            status: "completed",
            attendanceStatus: "excused",
            attendanceMarked: true,
            attendanceTime: "09:10 AM",
            attendanceNotes: "Represented school in competition",
            maxMarks: 5,
            earnedMarks: 4,
            topics: ["Essay Writing", "Grammar"],
        },
        {
            id: 6,
            date: "2024-01-17",
            day: "Wednesday",
            time: "08:00 - 09:00",
            duration: "1 hour",
            subject: "Mathematics",
            subjectCode: "MATH101",
            teacher: "Mr. Johnson",
            room: "Room 101",
            status: "ongoing",
            attendanceStatus: "present",
            attendanceMarked: true,
            attendanceTime: "07:58 AM",
            maxMarks: 5,
            earnedMarks: 5,
            topics: ["Calculus", "Derivatives"],
        },
        {
            id: 7,
            date: "2024-01-17",
            day: "Wednesday",
            time: "09:15 - 10:15",
            duration: "1 hour",
            subject: "Computer Science",
            subjectCode: "CS101",
            teacher: "Mr. Thomas",
            room: "Lab 101",
            status: "upcoming",
            attendanceMarked: false,
            maxMarks: 5,
            topics: ["Python Programming", "Functions"],
            assignmentDue: "2024-01-19",
        },
        {
            id: 8,
            date: "2024-01-18",
            day: "Thursday",
            time: "10:30 - 11:30",
            duration: "1 hour",
            subject: "History",
            subjectCode: "HIST201",
            teacher: "Mr. Taylor",
            room: "Room 103",
            status: "upcoming",
            attendanceMarked: false,
            maxMarks: 5,
            topics: ["World War II", "Major Events"],
        },
    ];

    // Available subjects
    const subjects = [
        "All Subjects",
        "Mathematics",
        "Physics",
        "Chemistry",
        "Biology",
        "English",
        "Computer Science",
        "History",
    ];

    // Get status color
    const getStatusColor = (status: string) => {
        switch (status) {
            case "present":
                return "bg-green-100 text-green-800 border-green-200";
            case "absent":
                return "bg-red-100 text-red-800 border-red-200";
            case "late":
                return "bg-yellow-100 text-yellow-800 border-yellow-200";
            case "excused":
                return "bg-blue-100 text-blue-800 border-blue-200";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Get session status color
    const getSessionStatusColor = (status: string) => {
        switch (status) {
            case "upcoming":
                return "bg-blue-100 text-blue-800";
            case "ongoing":
                return "bg-green-100 text-green-800";
            case "completed":
                return "bg-gray-100 text-gray-800";
            case "cancelled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    // Get status icon
    const getStatusIcon = (status?: string) => {
        switch (status) {
            case "present":
                return <CheckCircle className="text-green-500" size={20} />;
            case "absent":
                return <XCircle className="text-red-500" size={20} />;
            case "late":
                return <AlertCircle className="text-yellow-500" size={20} />;
            case "excused":
                return <AlertCircle className="text-blue-500" size={20} />;
            default:
                return <Clock className="text-gray-400" size={20} />;
        }
    };

    // Calculate statistics
    const stats = {
        totalSessions: classSessions.length,
        attended: classSessions.filter((s) => s.attendanceStatus === "present")
            .length,
        absent: classSessions.filter((s) => s.attendanceStatus === "absent")
            .length,
        late: classSessions.filter((s) => s.attendanceStatus === "late").length,
        excused: classSessions.filter((s) => s.attendanceStatus === "excused")
            .length,
        pending: classSessions.filter(
            (s) => !s.attendanceMarked && s.status !== "upcoming",
        ).length,
        attendanceRate: 0,
        totalMarks: classSessions.reduce(
            (sum, session) => sum + (session.earnedMarks || 0),
            0,
        ),
        maxMarks: classSessions.reduce(
            (sum, session) => sum + session.maxMarks,
            0,
        ),
    };
    stats.attendanceRate = (
        (stats.attended / stats.totalSessions) *
        100
    ).toFixed(1);

    // Filter sessions
    const filteredSessions = classSessions.filter((session) => {
        const matchesDate =
            selectedDate === "" || session.date === selectedDate;
        const matchesStatus =
            selectedStatus === "all" ||
            (selectedStatus === "pending"
                ? !session.attendanceMarked
                : session.attendanceStatus === selectedStatus);
        const matchesSubject =
            selectedSubject === "all" || session.subject === selectedSubject;
        const matchesSearch =
            searchQuery === "" ||
            session.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.teacher.toLowerCase().includes(searchQuery.toLowerCase()) ||
            session.topics.some((topic) =>
                topic.toLowerCase().includes(searchQuery.toLowerCase()),
            );

        return matchesDate && matchesStatus && matchesSubject && matchesSearch;
    });

    // Group sessions by date
    const sessionsByDate = filteredSessions.reduce(
        (groups, session) => {
            const date = session.date;
            if (!groups[date]) {
                groups[date] = [];
            }
            groups[date].push(session);
            return groups;
        },
        {} as Record<string, ClassSession[]>,
    );

    // Handle attendance action
    const handleMarkAttendance = (
        sessionId: number,
        status: "present" | "absent" | "late" | "excused",
    ) => {
        console.log(`Marking attendance for session ${sessionId} as ${status}`);
        // In real app, this would update the state and send to API
        alert(`Attendance marked as ${status} for this session`);
    };

    // Handle refresh
    const handleRefresh = () => {
        console.log("Refreshing attendance data");
        // In real app, this would fetch updated data from API
    };

    return (
        <div className="p-6">
            {/* Header */}
            <div className="mb-6">
                <div className="flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                            <Calendar className="mr-3" size={24} />
                            Class Session Attendance
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Record and track attendance for each class session
                        </p>
                    </div>
                    <button
                        onClick={handleRefresh}
                        className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                    >
                        <RefreshCw className="mr-2" size={18} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Student Info Card */}
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg border border-indigo-100 p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
                        <p className="text-sm text-gray-600">Grade/Section</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {studentInfo.grade} - {studentInfo.section}
                        </p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Roll Number</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {studentInfo.rollNumber}
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

            {/* Statistics Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4 mb-6">
                <div className="bg-white rounded-lg border p-4">
                    <div className="text-2xl font-bold text-gray-900">
                        {stats.totalSessions}
                    </div>
                    <div className="text-sm text-gray-600">Total Sessions</div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-green-700">
                        {stats.attended}
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
                        {stats.excused}
                    </div>
                    <div className="text-sm text-blue-600">Excused</div>
                </div>
                <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-purple-700">
                        {stats.pending}
                    </div>
                    <div className="text-sm text-purple-600">Pending</div>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-indigo-700">
                        {stats.attendanceRate}%
                    </div>
                    <div className="text-sm text-indigo-600">Rate</div>
                </div>
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="text-2xl font-bold text-orange-700">
                        {stats.totalMarks}/{stats.maxMarks}
                    </div>
                    <div className="text-sm text-orange-600">Marks</div>
                </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date
                        </label>
                        <div className="relative">
                            <Calendar
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="date"
                                value={selectedDate}
                                onChange={(e) =>
                                    setSelectedDate(e.target.value)
                                }
                                className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Attendance Status
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
                            <option value="excused">Excused</option>
                            <option value="pending">Pending</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                        </label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => setSelectedSubject(e.target.value)}
                            className="w-full rounded-md border border-gray-300 px-3 py-2"
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
                            Search
                        </label>
                        <div className="relative">
                            <Search
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                                size={18}
                            />
                            <input
                                type="text"
                                placeholder="Search by subject, teacher, topic..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="pl-10 w-full rounded-md border border-gray-300 px-3 py-2"
                            />
                        </div>
                    </div>

                    <div className="flex items-end">
                        <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                            <Filter className="mr-2" size={18} />
                            Filter Sessions
                        </button>
                    </div>
                </div>

                {/* View Toggle */}
                <div className="mt-4 flex justify-between items-center">
                    <div className="flex space-x-2">
                        <button
                            onClick={() => setViewMode("list")}
                            className={`px-3 py-1 rounded-md ${viewMode === "list" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                        >
                            List View
                        </button>
                        <button
                            onClick={() => setViewMode("calendar")}
                            className={`px-3 py-1 rounded-md ${viewMode === "calendar" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700"}`}
                        >
                            Calendar View
                        </button>
                    </div>
                    <button className="flex items-center text-sm text-blue-600 hover:text-blue-800">
                        <Download className="mr-1" size={16} />
                        Export Report
                    </button>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Zap className="mr-2" size={20} />
                    Quick Actions
                </h3>
                <div className="flex flex-wrap gap-3">
                    <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center">
                        <Check className="mr-2" size={18} />
                        Mark Today's Attendance
                    </button>
                    <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                        <Calendar className="mr-2" size={18} />
                        View Weekly Schedule
                    </button>
                    <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center">
                        <BarChart3 className="mr-2" size={18} />
                        Generate Report
                    </button>
                    <button className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 flex items-center">
                        <BookOpen className="mr-2" size={18} />
                        Request Leave
                    </button>
                </div>
            </div>

            {/* Class Sessions List */}
            <div className="space-y-6">
                {Object.entries(sessionsByDate).map(([date, sessions]) => (
                    <div
                        key={date}
                        className="bg-white rounded-lg shadow-sm border"
                    >
                        <div className="p-4 border-b bg-gray-50">
                            <h3 className="text-lg font-semibold text-gray-900">
                                {new Date(date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                    month: "long",
                                    day: "numeric",
                                    year: "numeric",
                                })}
                            </h3>
                            <p className="text-sm text-gray-600">
                                {sessions.length} session
                                {sessions.length !== 1 ? "s" : ""} scheduled
                            </p>
                        </div>

                        <div className="p-4">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {sessions.map((session) => (
                                    <div
                                        key={session.id}
                                        className={`border rounded-lg p-4 ${
                                            session.status === "ongoing"
                                                ? "ring-2 ring-green-500"
                                                : ""
                                        } hover:shadow-sm transition-shadow`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div>
                                                <div className="flex items-center mb-1">
                                                    <span
                                                        className={`px-2 py-1 rounded text-xs font-medium mr-2 ${getSessionStatusColor(session.status)}`}
                                                    >
                                                        {session.status.toUpperCase()}
                                                    </span>
                                                    {session.attendanceMarked && (
                                                        <span
                                                            className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(session.attendanceStatus || "")}`}
                                                        >
                                                            {session.attendanceStatus?.toUpperCase() ||
                                                                "NOT MARKED"}
                                                        </span>
                                                    )}
                                                </div>
                                                <h4 className="text-lg font-semibold text-gray-900">
                                                    {session.subject}
                                                </h4>
                                                <p className="text-sm text-gray-600">
                                                    {session.subjectCode}
                                                </p>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {session.time}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {session.duration}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="space-y-3 mb-4">
                                            <div className="flex items-center text-sm text-gray-600">
                                                <User
                                                    className="mr-2"
                                                    size={16}
                                                />
                                                <span>
                                                    Teacher: {session.teacher}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <MapPin
                                                    className="mr-2"
                                                    size={16}
                                                />
                                                <span>
                                                    Room: {session.room}
                                                </span>
                                            </div>
                                            <div className="flex items-center text-sm text-gray-600">
                                                <BookOpen
                                                    className="mr-2"
                                                    size={16}
                                                />
                                                <span>
                                                    Topics:{" "}
                                                    {session.topics.join(", ")}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Attendance Status & Actions */}
                                        <div className="border-t pt-4">
                                            {session.attendanceMarked ? (
                                                <div className="space-y-3">
                                                    <div className="flex items-center justify-between">
                                                        <div className="flex items-center">
                                                            {getStatusIcon(
                                                                session.attendanceStatus,
                                                            )}
                                                            <span className="ml-2 font-medium capitalize">
                                                                {
                                                                    session.attendanceStatus
                                                                }
                                                            </span>
                                                        </div>
                                                        <div className="text-sm text-gray-500">
                                                            Marked at{" "}
                                                            {
                                                                session.attendanceTime
                                                            }
                                                        </div>
                                                    </div>
                                                    {session.attendanceNotes && (
                                                        <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                                                            <span className="font-medium">
                                                                Notes:
                                                            </span>{" "}
                                                            {
                                                                session.attendanceNotes
                                                            }
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between items-center">
                                                        <div>
                                                            <span className="text-sm text-gray-600">
                                                                Attendance
                                                                Marks:
                                                            </span>
                                                            <span
                                                                className={`ml-2 font-bold ${
                                                                    session.earnedMarks ===
                                                                    session.maxMarks
                                                                        ? "text-green-600"
                                                                        : session.earnedMarks ===
                                                                            0
                                                                          ? "text-red-600"
                                                                          : "text-yellow-600"
                                                                }`}
                                                            >
                                                                {
                                                                    session.earnedMarks
                                                                }
                                                                /
                                                                {
                                                                    session.maxMarks
                                                                }
                                                            </span>
                                                        </div>
                                                        <button className="text-sm text-blue-600 hover:text-blue-800">
                                                            View Details
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : session.status ===
                                              "upcoming" ? (
                                                <div className="text-center py-3">
                                                    <Clock
                                                        className="mx-auto text-gray-400 mb-2"
                                                        size={24}
                                                    />
                                                    <p className="text-sm text-gray-600">
                                                        Attendance will open at
                                                        class time
                                                    </p>
                                                </div>
                                            ) : (
                                                <div>
                                                    <p className="text-sm text-gray-600 mb-3">
                                                        Mark your attendance:
                                                    </p>
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                                        <button
                                                            onClick={() =>
                                                                handleMarkAttendance(
                                                                    session.id,
                                                                    "present",
                                                                )
                                                            }
                                                            className="px-3 py-2 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm"
                                                        >
                                                            <CheckCircle
                                                                className="inline mr-1"
                                                                size={14}
                                                            />
                                                            Present
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleMarkAttendance(
                                                                    session.id,
                                                                    "absent",
                                                                )
                                                            }
                                                            className="px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
                                                        >
                                                            <XCircle
                                                                className="inline mr-1"
                                                                size={14}
                                                            />
                                                            Absent
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleMarkAttendance(
                                                                    session.id,
                                                                    "late",
                                                                )
                                                            }
                                                            className="px-3 py-2 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 text-sm"
                                                        >
                                                            <AlertCircle
                                                                className="inline mr-1"
                                                                size={14}
                                                            />
                                                            Late
                                                        </button>
                                                        <button
                                                            onClick={() =>
                                                                handleMarkAttendance(
                                                                    session.id,
                                                                    "excused",
                                                                )
                                                            }
                                                            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
                                                        >
                                                            <AlertCircle
                                                                className="inline mr-1"
                                                                size={14}
                                                            />
                                                            Excused
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        {/* Assignment Due */}
                                        {session.assignmentDue && (
                                            <div className="mt-3 pt-3 border-t border-dashed">
                                                <div className="flex items-center text-sm text-orange-600">
                                                    <AlertCircle
                                                        className="mr-1"
                                                        size={14}
                                                    />
                                                    Assignment due:{" "}
                                                    {new Date(
                                                        session.assignmentDue,
                                                    ).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Legend */}
            <div className="mt-6 bg-white rounded-lg shadow-sm border p-4">
                <h3 className="text-sm font-medium text-gray-900 mb-3">
                    Attendance Legend
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="flex items-center p-2 bg-green-50 rounded">
                        <CheckCircle
                            className="text-green-500 mr-2"
                            size={16}
                        />
                        <div>
                            <p className="text-sm font-medium">Present</p>
                            <p className="text-xs text-gray-600">
                                Full attendance marks (5/5)
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center p-2 bg-red-50 rounded">
                        <XCircle className="text-red-500 mr-2" size={16} />
                        <div>
                            <p className="text-sm font-medium">Absent</p>
                            <p className="text-xs text-gray-600">
                                No attendance marks (0/5)
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center p-2 bg-yellow-50 rounded">
                        <AlertCircle
                            className="text-yellow-500 mr-2"
                            size={16}
                        />
                        <div>
                            <p className="text-sm font-medium">Late</p>
                            <p className="text-xs text-gray-600">
                                Reduced marks (3/5)
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center p-2 bg-blue-50 rounded">
                        <AlertCircle className="text-blue-500 mr-2" size={16} />
                        <div>
                            <p className="text-sm font-medium">Excused</p>
                            <p className="text-xs text-gray-600">
                                With permission (4/5)
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Upcoming Summary */}
            <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg border border-indigo-100 p-5">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Upcoming Classes This Week
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {["Wednesday", "Thursday", "Friday"].map((day, index) => {
                        const daySessions = classSessions.filter(
                            (s) =>
                                new Date(s.date).toLocaleDateString("en-US", {
                                    weekday: "long",
                                }) === day && s.status === "upcoming",
                        );

                        return (
                            <div
                                key={day}
                                className="bg-white rounded-lg border p-4"
                            >
                                <h4 className="font-semibold text-gray-900 mb-2">
                                    {day}
                                </h4>
                                {daySessions.length > 0 ? (
                                    <ul className="space-y-2">
                                        {daySessions.map((session) => (
                                            <li
                                                key={session.id}
                                                className="text-sm"
                                            >
                                                <span className="font-medium">
                                                    {session.subject}
                                                </span>
                                                <span className="text-gray-600 ml-2">
                                                    {session.time}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-gray-500">
                                        No classes scheduled
                                    </p>
                                )}
                                <div className="mt-3 text-xs text-gray-500">
                                    {daySessions.length} class
                                    {daySessions.length !== 1 ? "es" : ""}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default StudentClassSessionAttendancePage;
