import React, { useEffect, useState } from "react";
import { request } from "../utils/Request";
import { formatDate } from "../utils/Helper";

interface Permission {
    id: string;
    name: string;
    description: string;
    key: string;
    createdAt: string;
    updatedAt: string;
}
// await request("permissions", "get");

const PermissionsPage: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [permissions, setPermissions] = useState<Permission[]>([]);
    useEffect(() => {
        const fetchPermissions = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await request("permissions", "get");
                const list = (res && (res.list?.data ?? res.data ?? res)) ?? [];
                const mapped: Permission[] = Array.isArray(list)
                    ? list.map((item: any) => ({
                          id: String(item.id ?? item._id ?? Date.now()),
                          name: item.name ?? item.permission ?? "",
                          description: item.description ?? item.desc ?? "",
                          key: item.key ?? item.group ?? "",
                          createdAt: formatDate(item),
                          updatedAt: formatDate(item),
                      }))
                    : [];
                setPermissions(mapped);
            } catch (err: any) {
                console.error("Failed to load permissions", err);
                setError(err?.message ?? "Failed to load permissions");
            } finally {
                setLoading(false);
            }
        };

        fetchPermissions();
    }, []);

    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentPermission, setCurrentPermission] =
        useState<Permission | null>(null);
    const [newPermission, setNewPermission] = useState({
        name: "",
        description: "",
        key: "",
    });
    const handleCreatePermission = async () => {
        try {
            await request("permissions", "post", {
                name: newPermission.name,
                description: newPermission.description,
                key: newPermission.key,
            });
            if (
                newPermission.name &&
                newPermission.description &&
                newPermission.key
            ) {
                const permission: Permission = {
                    id: Date.now().toString(),
                    name: newPermission.name,
                    description: newPermission.description,
                    key: newPermission.key,
                    createdAt: new Date().toISOString().split("T")[0],
                    updatedAt: new Date().toISOString().split("T")[0],
                };

                setPermissions([...permissions, permission]);
                setNewPermission({ name: "", description: "", key: "" });
                setShowCreateModal(false);
            }
        } catch (error: any) {
            console.error("Failed to create permission", error);
            setError(error?.message ?? "Failed to create permission");
        } finally {
            setLoading(false);
        }
    };

    const handleUpdatePermission = async () => {
        if (!currentPermission) return;
        try {
            await request(`permissions/${currentPermission?.id}`, "put", {
                name: currentPermission.name,
                description: currentPermission.description,
                key: currentPermission.key,
            });
            setPermissions((prev) =>
                prev.map((perm) =>
                    perm.id === currentPermission.id
                        ? {
                              ...currentPermission,
                              updatedAt: new Date().toISOString().split("T")[0],
                          }
                        : perm
                )
            );
            setShowEditModal(false);
            setCurrentPermission(null);
        } catch (error: any) {
            console.error("Failed to update permission", error);
            setError(error?.message ?? "Failed to update permission");
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (permission: Permission) => {
        setCurrentPermission(permission);
        setShowEditModal(true);
    };

    return (
        <div className="p-6 mt-[-20px]">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">
                        Permissions
                    </h1>
                    <p className="text-gray-600">Manage system permissions</p>
                </div>
                <button
                    onClick={() => setShowCreateModal(true)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                >
                    Create Permission
                </button>
            </div>
            <div className="bg-white rounded-lg shadow-sm">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">
                        All Permissions ({permissions.length})
                    </h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Name
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Description
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Key
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Created
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Updated
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {permissions.map((permission) => (
                                <tr
                                    key={permission.id}
                                    className="hover:bg-gray-50"
                                >
                                    <td className="px-4 py-3 text-sm text-gray-800">
                                        {permission.name}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {permission.description}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-600">
                                        {permission.key}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {permission.createdAt}
                                    </td>
                                    <td className="px-4 py-3 text-sm text-gray-500">
                                        {permission.updatedAt}
                                    </td>
                                    <td className="px-4 py-3">
                                        <button
                                            onClick={() =>
                                                openEditModal(permission)
                                            }
                                            className="text-blue-500 hover:text-blue-700 font-medium"
                                        >
                                            Edit
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Create New Permission
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={newPermission.name}
                                    onChange={(e) =>
                                        setNewPermission({
                                            ...newPermission,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Name of the permission"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={newPermission.description}
                                    onChange={(e) =>
                                        setNewPermission({
                                            ...newPermission,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Description of the permission"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Key
                                </label>
                                <input
                                    type="text"
                                    value={newPermission.key}
                                    onChange={(e) =>
                                        setNewPermission({
                                            ...newPermission,
                                            key: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Key for the permission"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleCreatePermission}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                            >
                                Create
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

            {showEditModal && currentPermission && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Edit Permission
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    value={currentPermission.name}
                                    onChange={(e) =>
                                        setCurrentPermission({
                                            ...currentPermission,
                                            name: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={currentPermission.description}
                                    onChange={(e) =>
                                        setCurrentPermission({
                                            ...currentPermission,
                                            description: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Key
                                </label>
                                <input
                                    type="text"
                                    value={currentPermission.key}
                                    onChange={(e) =>
                                        setCurrentPermission({
                                            ...currentPermission,
                                            key: e.target.value,
                                        })
                                    }
                                    className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                            </div>
                        </div>

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleUpdatePermission}
                                className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                            >
                                Update
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

export default PermissionsPage;
