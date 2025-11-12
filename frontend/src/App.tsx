import { BrowserRouter, Route, Routes } from "react-router-dom";
import MainLayout from "./components/layout/MainLayout";
import HomePage from "./page/home/HomePage";
import Student from "./page/student/Student";
import NotFoundPage from "./page/notfound/NotFoundPage";
import LoginPage from "./components/auth/LoginPage";
import RegisterPage from "./components/auth/RegisterPage";
import PermissionsPage from "./components/permission/PermissionPage";
import RolePage from "./page/roles/RolePage";
import UserPage from "./page/users/UserPage";
import ProtectedRoute from "./components/protectRout/Protected";
import { UserProfilePage } from "./page/userProfile/UserProfilePage";

function App() {
    return (
        <>
            <BrowserRouter>
                <Routes>
                    <Route>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                    </Route>
                    <Route
                        element={
                            <ProtectedRoute>
                                <MainLayout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<HomePage />} />
                        <Route path="student" element={<Student />} />
                        <Route
                            path="permission"
                            element={<PermissionsPage />}
                        />
                        <Route path="profile" element={<UserProfilePage />} />
                        <Route path="role" element={<RolePage />} />
                        <Route path="user" element={<UserPage />} />
                        <Route path="*" element={<NotFoundPage />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
