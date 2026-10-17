import { useAuth } from "../../contexts/AuthCotext";

/** Wrap a page: shows "no access" unless the user has ANY of the listed permissions. */
const RequirePermission: React.FC<{
    permission: string | string[];
    children: React.ReactElement;
}> = ({ permission, children }) => {
    const { hasPermission } = useAuth();
    const keys = Array.isArray(permission) ? permission : [permission];

    if (!hasPermission(...keys)) {
        return (
            <div className="p-10 text-center">
                <i className="fas fa-lock mb-3 text-3xl text-gray-400" />
                <h2 className="text-xl font-semibold text-gray-700">Access denied</h2>
                <p className="text-gray-500">You do not have permission to view this page.</p>
            </div>
        );
    }
    return children;
};

export default RequirePermission;
