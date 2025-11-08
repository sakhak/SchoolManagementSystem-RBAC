// ...existing code...
import React, { useEffect, useRef, useState } from "react";
import sakhakimage from "../../assets/images/loeung Sakhak.png";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthCotext";

const HeaderPage: React.FC = () => {
    // const [logout] = useAuth();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () =>
            document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleLogout = () => {
        // console.log("Logout");
        logout();
        // setOpen(false);
        navigate("/login");
        // setOpen(true);
    };
    const handleSetting = () => {
        console.log("Setting");
    };
    const handleViewProfile = () => {
        navigate("/profile");
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between p-3">
                <div className="flex-1 max-w-2xl">
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search students, teachers, classes..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <i className="fas fa-search absolute left-3 top-3 text-gray-400"></i>
                    </div>
                </div>

                <div className="flex items-center space-x-4">
                    <button className="relative p-2 text-gray-600 hover:text-blue-600">
                        <i className="fas fa-bell text-xl"></i>
                        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            3
                        </span>
                    </button>
                    <button className="relative p-2 text-gray-600 hover:text-blue-600">
                        <i className="fas fa-envelope text-xl"></i>
                        <span className="absolute top-0 right-0 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                            5
                        </span>
                    </button>

                    <div className="relative" ref={menuRef}>
                        <button
                            onClick={() => setOpen((s) => !s)}
                            aria-haspopup="true"
                            aria-expanded={open}
                            className="flex items-center space-x-3 border-l border-gray-200 pl-4 p-2 hover:bg-gray-50 rounded-md"
                        >
                            <img
                                src={sakhakimage}
                                alt="Admin"
                                className="w-12 h-12 rounded-full ml-2 object-cover border-2 border-gray-200 dark:border-gray-600"
                            />
                            <div className="hidden md:block text-left">
                                <p className="font-semibold text-gray-800">
                                    Mr. {user?.name}
                                </p>
                                <p className="text-sm text-gray-500">
                                    {user?.roles?.[0]?.name}
                                </p>
                            </div>
                            <i
                                className={`fas fa-chevron-down text-gray-400 transition-transform ${
                                    open ? "rotate-180" : ""
                                }`}
                            ></i>
                        </button>

                        {open && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                                <button
                                    onClick={handleViewProfile}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    View Profile
                                </button>
                                <button
                                    onClick={handleSetting}
                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                    Settings
                                </button>
                                <div className="border-t border-gray-100" />
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                >
                                    Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default HeaderPage;
// ...existing code...
