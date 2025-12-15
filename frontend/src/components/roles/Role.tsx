import React, { useEffect, useState } from "react";
import { request } from "../utils/Request";
import { formatDate } from "../utils/Helper";
import FullScreenLoader from "../common/FullScreenLoader";

interface Role {
    id: string;
    name: string;
    key: string;
    prev: string;
    description: string;
    permissions: string[];
    createdAt: string;
    updatedAt: string;
}

interface Permission {
    id: string;
    name: string;
    description: string;
    key: string;
    createdAt: string;
    updatedAt: string;
}

const RolesPage: React.FC = () => {
    const [roles, setRoles] = useState<Role[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    useEffect(() => {
        const fetchRoles = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await request("roles", "get");
                const list = (res && (res.list.data ?? res.data ?? res)) ?? [];
                const mapped: Role[] = Array.isArray(list)
                    ? list.map((item: any) => ({
                          id: item.id,
                          name: item.name,
                          key: item.key,
                          description: item.description,
                          permissions: Array.isArray(item.permissions)
                              ? item.permissions.map((p: any) =>
                                    String(p?.id ?? ""),
                                )
                              : [],
                          createdAt: formatDate(item),
                          updatedAt: formatDate(item),
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
        const fetchPermissions = async () => {
            setLoading(true);
            setError(null);
            try {
                const res = await request("permissions", "get");
                const list = (res && (res.list?.data ?? res.data ?? res)) ?? [];
                const mapped: Permission[] = Array.isArray(list)
                    ? list.map((item: any) => {
                          const createdRaw = item.created_at;
                          const updatedRaw = item.updated_at;
                          return {
                              id: String(
                                  item.id ??
                                      item._id ??
                                      item.permissionId ??
                                      Date.now(),
                              ),
                              name: item.name ?? item.permission ?? "",
                              description: item.description ?? "",
                              key: item.key,
                              createdAt: formatDate(createdRaw ?? ""),
                              updatedAt: formatDate(updatedRaw ?? ""),
                          } as Permission;
                      })
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
        fetchRoles();
    }, []);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [currentRole, setCurrentRole] = useState<Role | null>(null);
    const [newRole, setNewRole] = useState({
        name: "",
        key: "",
        description: "",
        permissions: [] as string[],
    });
    const [permissions, setPermissions] = useState<Permission[]>([]);
    const availablePermissions = [
        ...permissions.map((p) => ({ id: p.id, name: p.name })),
    ];
    const handleCreateRole = async () => {
        try {
            const res = await request("roles", "post", {
                name: newRole.name,
                key: newRole.key,
                description: newRole.description,
                permission_id: newRole.permissions,
            });
            const role: Role = {
                id: res.id || Date.now().toString(),
                name: newRole.name,
                key: newRole.key,
                prev: "",
                description: newRole.description,
                permissions: newRole.permissions,
                createdAt: new Date().toISOString().split("T")[0],
                updatedAt: new Date().toISOString().split("T")[0],
            };

            setRoles([...roles, role]);
            setNewRole({ name: "", key: "", description: "", permissions: [] });
            setShowCreateModal(false);
        } catch (err: any) {
            console.error("Failed to create role", err);
            setError(err?.message ?? "Failed to create role");
        } finally {
            setLoading(false);
        }
    };
    const handleUpdateRole = async () => {
        if (!currentRole) return console.log("Error");
        try {
            setLoading(true);
            await request(`roles/${currentRole?.id}`, "put", {
                name: currentRole.name,
                key: currentRole.key,
                description: currentRole.description,
                permission_id: currentRole.permissions,
            });
            setRoles((prev) =>
                prev.map((role) =>
                    role.id === currentRole.id
                        ? {
                              ...currentRole,
                              updatedAt: new Date().toISOString().split("T")[0],
                          }
                        : role,
                ),
            );
            setShowEditModal(false);
            setCurrentRole(null);
        } catch (err: any) {
            console.error("Failed to update role", err);
            setError(err?.message ?? "Failed to update role");
        } finally {
            setLoading(false);
        }
    };

    const openEditModal = (role: Role) => {
        setCurrentRole(role);
        setShowEditModal(true);
    };

    const toggleNewRolePermission = (permissionId: string) => {
        setNewRole((prev) => ({
            ...prev,
            permissions: prev.permissions.includes(permissionId)
                ? prev.permissions.filter((p) => p !== permissionId)
                : [...prev.permissions, permissionId],
        }));
    };

    const toggleEditRolePermission = (permissionId: string) => {
        if (currentRole) {
            setCurrentRole((prev) =>
                prev
                    ? {
                          ...prev,
                          permissions: prev.permissions.includes(permissionId)
                              ? prev.permissions.filter(
                                    (p) => p !== permissionId,
                                )
                              : [...prev.permissions, permissionId],
                      }
                    : null,
            );
        }
    };

    return (
        <>
            {loading && <FullScreenLoader />}
            <div className="p-6 mt-[-20px]">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Roles
                        </h1>
                        <p className="text-gray-600">
                            Manage user roles and permissions
                        </p>
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                    >
                        Create Role
                    </button>
                </div>

                <div className="bg-white rounded-lg shadow-sm">
                    <div className="p-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                            All Roles ({roles.length})
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
                                        Key
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                        Description
                                    </th>
                                    <th className="px-4 py-3 text-left text-sm font-medium text-gray-700">
                                        Permissions
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
                                {roles.map((role) => (
                                    <tr
                                        key={role.id}
                                        className="hover:bg-gray-50"
                                    >
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-800">
                                                {role.name}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm font-medium text-gray-800">
                                                {role.key}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-gray-600">
                                                {role.description}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="text-sm text-gray-500">
                                                {role.permissions?.length ?? 0}
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {role.createdAt}
                                        </td>
                                        <td className="px-4 py-3 text-sm text-gray-500">
                                            {role.updatedAt}
                                        </td>
                                        <td className="px-4 py-3">
                                            <button
                                                onClick={() =>
                                                    openEditModal(role)
                                                }
                                                className="text-blue-500 hover:text-blue-700 font-medium text-sm"
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
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Create New Role
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role Name
                                    </label>
                                    <input
                                        type="text"
                                        value={newRole.name}
                                        onChange={(e) =>
                                            setNewRole({
                                                ...newRole,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Coordinator"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Key
                                    </label>
                                    <input
                                        type="text"
                                        value={newRole.key}
                                        onChange={(e) =>
                                            setNewRole({
                                                ...newRole,
                                                key: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Coordinator"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={newRole.description}
                                        onChange={(e) =>
                                            setNewRole({
                                                ...newRole,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Describe the role's purpose and responsibilities"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Permissions
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded">
                                        {availablePermissions.map(
                                            (permission) => (
                                                <label
                                                    key={permission.id}
                                                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={newRole.permissions.includes(
                                                            permission.id,
                                                        )}
                                                        onChange={() =>
                                                            toggleNewRolePermission(
                                                                permission.id,
                                                            )
                                                        }
                                                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {permission.name}
                                                    </span>
                                                </label>
                                            ),
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {newRole.permissions.length} permissions
                                        selected
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleCreateRole}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                                >
                                    Create Role
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

                {showEditModal && currentRole && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                            <h3 className="text-lg font-semibold text-gray-800 mb-4">
                                Edit Role
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role Name
                                    </label>
                                    <input
                                        type="text"
                                        value={currentRole.name}
                                        onChange={(e) =>
                                            setCurrentRole({
                                                ...currentRole,
                                                name: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Role Key
                                    </label>
                                    <input
                                        type="text"
                                        value={currentRole.key}
                                        onChange={(e) =>
                                            setCurrentRole({
                                                ...currentRole,
                                                key: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Description
                                    </label>
                                    <textarea
                                        value={currentRole.description}
                                        onChange={(e) =>
                                            setCurrentRole({
                                                ...currentRole,
                                                description: e.target.value,
                                            })
                                        }
                                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        rows={3}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Permissions
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded">
                                        {availablePermissions.map(
                                            (permission) => (
                                                <label
                                                    key={permission.id}
                                                    className="flex items-center space-x-2 p-2 hover:bg-gray-50 rounded"
                                                >
                                                    <input
                                                        type="checkbox"
                                                        checked={Boolean(
                                                            currentRole?.permissions?.includes(
                                                                String(
                                                                    permission.id,
                                                                ),
                                                            ),
                                                        )}
                                                        onChange={() =>
                                                            toggleEditRolePermission(
                                                                String(
                                                                    permission.id,
                                                                ),
                                                            )
                                                        }
                                                        className="rounded border-gray-300 text-blue-500 focus:ring-blue-500"
                                                    />
                                                    <span className="text-sm text-gray-700">
                                                        {permission.name}
                                                    </span>
                                                </label>
                                            ),
                                        )}
                                    </div>
                                    <div className="text-sm text-gray-500 mt-1">
                                        {currentRole.permissions.length}{" "}
                                        permissions selected
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button
                                    onClick={handleUpdateRole}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded transition-colors"
                                >
                                    Update Role
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
        </>
    );
};

export default RolesPage;
