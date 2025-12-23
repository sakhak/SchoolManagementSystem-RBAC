import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { request } from "../utils/Request";
import FullScreenLoader from "../common/FullScreenLoader";

const RegisterPage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(false);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
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
        // console.log("Register data:", formData);
        const parm = {
            name: formData.fullName,
            email: formData.email,
            password: formData.password,
            password_confirmation: formData.confirmPassword,
        };
        try {
            await request("register", "post", parm);
            navigate("/login");
        } catch (err: any) {
            console.error("Registration failed:", err);
            alert(err?.message || "Registration failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {loading && (
                <FullScreenLoader />
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
                            Create account
                        </h2>
                        <p className="text-gray-500">
                            Get started with your school management
                        </p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-6">
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={formData.fullName}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>

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
                                    placeholder="Create a password"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Confirm your password"
                                    required
                                />
                            </div>

                            <label className="flex items-center text-sm">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300"
                                    required
                                />
                                <span className="ml-2 text-gray-600">
                                    I agree to the{" "}
                                    <a
                                        href="#"
                                        className="text-blue-500 hover:text-blue-600"
                                    >
                                        Terms and Conditions
                                    </a>
                                </span>
                            </label>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors
                                ${loading ? "opacity-60 cursor-not-allowed" : ""}`}
                            >
                                Create Account
                            </button>
                        </form>

                        <div className="mt-6 text-center">
                            <p className="text-gray-600">
                                Already have an account?{" "}
                                <Link
                                    to="/login"
                                    className="text-blue-500 hover:text-blue-600 font-medium"
                                >
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default RegisterPage;
