import React from "react";

/** Turns a Laravel error body ({message, errors}) or any thrown value into a readable string. */
export const errMsg = (e: any): string => {
    if (e?.errors) return Object.values(e.errors).flat().join(" ");
    return e?.message || "Something went wrong";
};

export const PageHeader: React.FC<{
    title: string;
    subtitle?: string;
    action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div>
            <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
            {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
        </div>
        {action}
    </div>
);

export const Alert: React.FC<{
    type?: "error" | "success";
    children: React.ReactNode;
}> = ({ type = "error", children }) => (
    <div
        className={`mb-4 rounded-md border px-4 py-2 text-sm ${
            type === "error"
                ? "border-red-200 bg-red-50 text-red-700"
                : "border-green-200 bg-green-50 text-green-700"
        }`}
    >
        {children}
    </div>
);

export const Btn: React.FC<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
        variant?: "primary" | "danger" | "ghost";
    }
> = ({ variant = "primary", className = "", ...props }) => {
    const styles = {
        primary: "bg-blue-600 text-white hover:bg-blue-700",
        danger: "bg-red-600 text-white hover:bg-red-700",
        ghost: "bg-gray-100 text-gray-700 hover:bg-gray-200",
    }[variant];
    return (
        <button
            {...props}
            className={`rounded-md px-3 py-1.5 text-sm font-medium disabled:opacity-50 ${styles} ${className}`}
        />
    );
};

export const Badge: React.FC<{
    color?: "green" | "red" | "yellow" | "gray" | "blue";
    children: React.ReactNode;
}> = ({ color = "gray", children }) => {
    const map = {
        green: "bg-green-100 text-green-700",
        red: "bg-red-100 text-red-700",
        yellow: "bg-yellow-100 text-yellow-800",
        gray: "bg-gray-100 text-gray-700",
        blue: "bg-blue-100 text-blue-700",
    };
    return (
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${map[color]}`}>
            {children}
        </span>
    );
};

export const Modal: React.FC<{
    title: string;
    onClose: () => void;
    children: React.ReactNode;
}> = ({ title, onClose, children }) => (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-5 shadow-xl max-h-[90vh] overflow-y-auto">
            <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-semibold">{title}</h2>
                <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                    <i className="fas fa-times" />
                </button>
            </div>
            {children}
        </div>
    </div>
);

export const Field: React.FC<
    React.InputHTMLAttributes<HTMLInputElement> & { label: string }
> = ({ label, ...props }) => (
    <label className="mb-3 block text-sm">
        <span className="mb-1 block font-medium text-gray-700">{label}</span>
        <input
            {...props}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        />
    </label>
);

export const Select: React.FC<
    React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }
> = ({ label, children, ...props }) => (
    <label className="block text-sm">
        {label && <span className="mb-1 block font-medium text-gray-700">{label}</span>}
        <select
            {...props}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
        >
            {children}
        </select>
    </label>
);

export const Table: React.FC<{
    head: string[];
    children: React.ReactNode;
    empty?: string;
    isEmpty?: boolean;
}> = ({ head, children, empty = "Nothing here yet.", isEmpty }) => (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
        <table className="min-w-full text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
                <tr>
                    {head.map((h) => (
                        <th key={h} className="px-4 py-3">
                            {h}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {isEmpty ? (
                    <tr>
                        <td colSpan={head.length} className="px-4 py-8 text-center text-gray-400">
                            {empty}
                        </td>
                    </tr>
                ) : (
                    children
                )}
            </tbody>
        </table>
    </div>
);

export const today = () => new Date().toISOString().slice(0, 10);
