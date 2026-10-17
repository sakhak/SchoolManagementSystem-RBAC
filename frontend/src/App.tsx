import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./page/home/HomePage";
import Student from "./page/student/Student";
import TeachersPage from "./page/teachers/TeachersPage";
import ClassesPage from "./page/classes/ClassesPage";
import TermsPage from "./page/terms/TermsPage";
import BlacklistPage from "./page/blacklist/BlacklistPage";
import TakeAttendancePage from "./page/attendance/TakeAttendancePage";
import AttendanceReportPage from "./page/attendance/AttendanceReportPage";
import MyAttendancePage from "./page/attendance/MyAttendancePage";
import NotFoundPage from "./page/notfound/NotFoundPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import PermissionsPage from "./components/permission/PermissionPage";
import RolePage from "./page/roles/RolePage";
import UserPage from "./page/users/UserPage";
import ProtectedRoute from "./components/protectRout/Protected";
import RequirePermission from "./components/protectRout/RequirePermission";
import { UserProfilePage } from "./page/userProfile/UserProfilePage";
import SchoolErdTSX from "./components/manageStuddent/SchoolErdTSX";
import { Permission } from "./components/utils/Role";

const guard = (permission: string | string[], page: React.ReactElement) => (
    <RequirePermission permission={permission}>{page}</RequirePermission>
);

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route
                    element={
                        <ProtectedRoute>
                            <MainLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route index element={<HomePage />} />
                    <Route path="profile" element={<UserProfilePage />} />

                    <Route path="user" element={guard(Permission.USER_VIEW, <UserPage />)} />
                    <Route path="role" element={guard(Permission.ROLE_VIEW, <RolePage />)} />
                    <Route path="permission" element={guard(Permission.PERMISSION_VIEW, <PermissionsPage />)} />
                    <Route path="users/activity" element={guard(Permission.USER_VIEW, <SchoolErdTSX />)} />

                    <Route path="students" element={guard(Permission.STUDENT_VIEW, <Student />)} />
                    <Route path="student" element={guard(Permission.STUDENT_VIEW, <Student />)} />
                    <Route path="students/blacklist" element={guard(Permission.BLACKLIST_VIEW, <BlacklistPage />)} />
                    <Route path="teachers" element={guard(Permission.TEACHER_VIEW, <TeachersPage />)} />
                    <Route path="classes" element={guard(Permission.CLASS_VIEW, <ClassesPage />)} />
                    <Route path="terms" element={guard(Permission.TERM_VIEW, <TermsPage />)} />

                    <Route path="attendance/daily" element={guard(Permission.ATTENDANCE_RECORD, <TakeAttendancePage />)} />
                    <Route path="attendance/report" element={guard(Permission.ATTENDANCE_REPORT, <AttendanceReportPage />)} />
                    <Route path="classAttendance" element={guard(Permission.ATTENDANCE_VIEW_OWN, <MyAttendancePage />)} />

                    <Route path="*" element={<NotFoundPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

export default App;
