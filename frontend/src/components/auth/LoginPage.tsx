import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../utils/Request";
import { useAuth } from "../../contexts/AuthCotext";
import FullScreenLoader from "../common/FullScreenLoader";

const LoginPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const parm = {
            email: formData.email,
            password: formData.password,
        };

        try {
            const res = await request("login", "post", parm);

            console.log(res.userprofile);

            if (res && res.access_token && res.data) {
                login({
                    ...res.data,
                    token: res.access_token,
                });

                const userRoles = res.data.roles.map((role: any) => role?.key);

                if (userRoles.includes("admin")) {
                    navigate("/student");
                } else if (userRoles.includes("student")) {
                    navigate("/student");
                } else if (userRoles.includes("teacher")) {
                    navigate("/teacher");
                } else {
                    navigate("/");
                }
            } else {
                alert("Invalid credentials (missing token or user)");
            }
        } catch (err: any) {
            console.error("Login failed:", err);
            alert(err?.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <FullScreenLoader/>
            )}
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="max-w-md w-full">
                    <div className="text-center mb-8">
                        <div className="flex items-center justify-center space-x-3 mb-4">
                            <i className="fas fa-graduation-cap text-3xl text-blue-500"></i>
                            <h1 className="text-2xl font-bold text-gray-800">
                                EduManage
                            </h1>
                        </div>
                        <h2 className="text-xl font-semibold text-gray-700">
                            Welcome back
                        </h2>
                        <p className="text-gray-500">Sign in to your account</p>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between text-sm">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300"
                                    />
                                    <span className="ml-2 text-gray-600">
                                        Remember me
                                    </span>
                                </label>
                                <a
                                    href="#"
                                    className="text-blue-500 hover:text-blue-600"
                                >
                                    Forgot password?
                                </a>
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                            >
                                Sign In
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Don't have an account?{" "}
                                <Link
                                    to="/register"
                                    className="text-blue-500 hover:text-blue-600 font-medium"
                                >
                                    Sign up
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default LoginPage;
