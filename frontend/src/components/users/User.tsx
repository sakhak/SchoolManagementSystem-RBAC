import React, { useEffect, useState } from "react";
import { request } from "../utils/Request";
import { formatDate } from "../utils/Helper";

interface User {
    id: string;
    name: string;
    // firstName: string;
    // lastName: string;
    email: string;
    user_id: string;
    role_id: string;
    // status: "active" | "inactive";
    // lastLogin: string;
    createdAt: string;
}
interface Role {
    id: string;
    role_id: string;
    name: string;
}

const UsersPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [roles, setRoles] = useState<Role[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await request("roles", "get");
                const list = (res && (res.list.data ?? res.data ?? res)) ?? [];
                const mapped: Role[] = Array.isArray(list)
                    ? list.map((item: any) => ({
                          id: String(item.id),
                          name: item.name,
                      }))
                    : [];
                setRoles(mapped);
            } catch (error: any) {
                console.log(error);
                setError(error?.message ?? "Failed to fetch roles");
            } finally {
                setLoading(false);
            }
        };

        const fetchUser = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await request("users", "get");
                // console.log(res)
                const candidates =
                    // res?.list?.data ??
                    res?.data ??
                    // res?.data?.data ??
                    res ??
                    [];
                const list = Array.isArray(candidates) ? candidates : [];
                // console.log(list)
                const mapped: User[] = Array.isArray(list)
                    ? list.map((item: any) => ({
                          id: String(item.id ?? Date.now()),
                          name: item.name,
                          email: item.email ?? "",
                          user_id: item.user_id,
                          role_id:
                              item.roles?.[0]?.name ??
                              String(item.roles?.[0]?.id ?? "No Role"),
                          createdAt: formatDate(item),
                          updatedAt: formatDate(item),
                      }))
                    : [];
                setUsers(mapped);
            } catch (err: any) {
                console.error("Fialed to load User");
                setError(err?.message ?? "Failed to load User");
            } finally {
                setLoading(false);
            }
        };
        fetchRoles();
        fetchUser();
    }, []);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [newUser, setNewUser] = useState({
        name: "",
        email: "",
        role: "Student",
    });

    // const roles = ["Administrator", "Teacher", "Student"];

    // Create new user
    const handleCreateUser = async () => {
        try {
            const res = await request("register", "post", {
                name: newUser.name,
                email: newUser.email,
                role_id: newUser.role,
            });
            console.log(res);
            if (newUser.name && newUser.email) {
                const user: User = {
                    id: Date.now().toString(),
                    name: newUser.name,
                    email: newUser.email,
                    role_id: newUser.role,
                    createdAt: new Date().toISOString().split("T")[0],
                };

                setUsers([...users, user]);
                setNewUser({
                    name: "",
                    email: "",
                    role: "Student",
                });
                setShowCreateModal(false);
            }
        } catch (err: any) {
            console.error("Failed to create user", err);
            setError(err?.message ?? "Failed to create user");
        } finally {
            setLoading(false);
        }
    };

    // Update existing user
    const handleUpdateUser = async () => {
        try {
            setLoading(true);
            const res = await request(`user-roles`, "post", {
                user_id: currentUser?.id,
                role_id: currentUser?.role_id,
            });
            // const res;
            console.log(res);
            if (currentUser) {
                setUsers(
                    users.map((user) =>
                        user.id === currentUser.id ? currentUser : user
                    )
                );
                setShowEditModal(false);
                setCurrentUser(null);
            }
        } catch (err: any) {
            console.error("Failed to assign role", err);
            setError(err?.message ?? "Failed to assign role to user");
        } finally {
            setLoading(false);
        }
    };

    // Open edit modal
    const openEditModal = (user: User) => {
        setCurrentUser(user);
        setShowEditModal(true);
    };

    // const toggleUserStatus = (userId: string) => {
    //     setUsers(
    //         users.map((user) =>
    //             user.id === userId
    //                 ? {
    //                       ...user,
    //                   }
    //                 : user
    //         )
    //     );
    // };

    const deleteUser = (userId: string) => {
        if (window.confirm("Are you sure you want to delete this user?")) {
            setUsers(users.filter((user) => user.id !== userId));
        }
    };

    // const activeUsersCount = users.filter(
    //     (user) => user.status === "active"
    // ).length;

    return (
        <div className="p-6 mt-[-20px]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Users</h1>
                    <p className="text-gray-600">
                        Manage system users and access
                    </p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                    Create User
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="text-2xl font-bold text-gray-800">
                        {users.length}
                    </div>
                    <div className="text-sm text-gray-600">Total Users</div>
                </div>
                {/* <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="text-2xl font-bold text-green-600">
                        {activeUsersCount}
                    </div>
                    <div className="text-sm text-gray-600">Active Users</div>
                </div> */}
                 <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="text-2xl font-bold text-gray-800">
                        {users.filter((u) => u.role_id === "Admin").length}
                    </div>
                    <div className="text-sm text-gray-600">Admin</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="text-2xl font-bold text-gray-800">
                        {users.filter((u) => u.role_id === "Teacher").length}
                    </div>
                    <div className="text-sm text-gray-600">Teachers</div>
                </div>
                <div className="bg-white rounded-lg shadow-sm p-4">
                    <div className="text-2xl font-bold text-gray-800">
                        {users.filter((u) => u.role_id === "Student").length}
                    </div>
                    <div className="text-sm text-gray-600">Students</div>
                </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        All Users ({users.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    User
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Role
                                </th>
                                {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Status
                                </th> */}
                                {/* <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Last Login
                                </th> */}
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Created
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center space-x-3">
                                            {/* <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center"> */}
                                            {/* <span className="text-white text-sm font-medium">
                                                    {user.firstName[0]}
                                                    {user.lastName[0]}
                                                </span> */}
                                            {/* </div> */}
                                            <div>
                                                {/* <div className="text-sm font-medium text-gray-800">
                                                    {user.firstName}{" "}
                                                    {user.lastName}
                                                </div> */}
                                                <div className="text-sm text-gray-500">
                                                    {user.email}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                String(
                                                    user.role_id ?? ""
                                                ).toLowerCase() === "admin"
                                                    ? "bg-purple-100 text-purple-800"
                                                    : String(
                                                          user.role_id ?? ""
                                                      ).toLowerCase() ===
                                                      "teacher"
                                                    ? "bg-green-100 text-green-800"
                                                    : "bg-blue-100 text-blue-800"
                                            }`}
                                        >
                                            {user.role_id}
                                        </span>
                                    </td>
                                    {/* <td className="px-4 py-3">
                                        <button
                                            onClick={() =>
                                                toggleUserStatus(user.id)
                                            }
                                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                user.status === "active"
                                                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                                                    : "bg-red-100 text-red-800 hover:bg-red-200"
                                            }`}
                                        >
                                            {user.status === "active"
                                                ? "Active"
                                                : "Inactive"}
                                        </button>
                                    </td> */}
                                    {/* <td className="px-4 py-3 text-sm text-gray-500">
                                        {user.lastLogin}
                                    // </td> */}
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {user.createdAt}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() =>
                                                    openEditModal(user)
                                                }
                                                className="text-blue-500 hover:text-blue-700 text-sm font-medium"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() =>
                                                    deleteUser(user.id)
                                                }
                                                className="text-red-500 hover:text-red-700 text-sm font-medium"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Create New User
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        First Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newUser.firstName}
                                        onChange={(e) =>
                                            setNewUser({
                                                ...newUser,
                                                firstName: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="John"
                                    />
                                </div> */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newUser.name}
                                        onChange={(e) =>
                                            setNewUser({
                                                ...newUser,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Doe"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="john.doe@school.edu"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            role: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={newUser.status}
                                    onChange={(e) =>
                                        setNewUser({
                                            ...newUser,
                                            status: e.target.value as
                                                | "active"
                                                | "inactive",
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div> */}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCreateUser}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                            >
                                Create User
                            </button>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit User Modal */}
            {showEditModal && currentUser && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Edit User
                        </h3>

                        <div className="space-y-4">
                            <div className="grid grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Name
                                    </label>
                                    <input
                                        disabled
                                        type="text"
                                        value={currentUser.name}
                                        onChange={(e) =>
                                            setCurrentUser({
                                                ...currentUser,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                {/* <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Last Name
                                    </label>
                                    <input
                                        type="text"
                                        value={currentUser.lastName}
                                        onChange={(e) =>
                                            setCurrentUser({
                                                ...currentUser,
                                                lastName: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div> */}
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={currentUser.email}
                                    onChange={(e) =>
                                        setCurrentUser({
                                            ...currentUser,
                                            email: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    User ID
                                </label>
                                <input
                                    type="text"
                                    value={currentUser.id}
                                    onChange={(e) =>
                                        setCurrentUser({
                                            ...currentUser,
                                            user_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Role
                                </label>
                                <select
                                    value={newUser.role}
                                    onChange={(e) =>
                                        setCurrentUser({
                                            ...newUser,
                                            role: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {roles.map((role) => (
                                        <option key={role} value={role}>
                                            {role}
                                        </option>
                                    ))}
                                </select>
                            </div> */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Select Role
                                </label>
                                <select
                                    value={currentUser.role_id}
                                    onChange={(e) =>
                                        setCurrentUser({
                                            ...currentUser,
                                            role_id: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {roles.map((role) => (
                                        <option key={role.id} value={role.id}>
                                            {role.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Status
                                </label>
                                <select
                                    value={currentUser.status}
                                    onChange={(e) =>
                                        setCurrentUser({
                                            ...currentUser,
                                            status: e.target.value as
                                                | "active"
                                                | "inactive",
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="active">Active</option>
                                    <option value="inactive">Inactive</option>
                                </select>
                            </div> */}
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleUpdateUser}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                            >
                                Update User
                            </button>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="flex-1 border border-gray-300 text-gray-700 font-medium py-2 px-4 rounded transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UsersPage;
