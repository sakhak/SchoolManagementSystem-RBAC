import React, { useCallback, useEffect, useState } from "react";
import { request } from "../../components/utils/Request";
import { useAuth } from "../../contexts/AuthCotext";
import { Permission } from "../../components/utils/Role";
import {
    Alert, Badge, Btn, errMsg, Field, Modal, PageHeader, Select, Table,
} from "../../components/common/Ui";

interface TeacherRow {
    id: number;
    status: "active" | "inactive";
    user: { name: string; email: string };
}

const empty = { name: "", email: "", password: "" };

const Teacher: React.FC = () => {
    const { hasPermission } = useAuth();
    const [rows, setRows] = useState<TeacherRow[]>([]);
    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(empty);
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const q = new URLSearchParams();
            if (search) q.set("search", search);
            if (status) q.set("status", status);
            const res = await request(`teachers?${q.toString()}`);
            setRows(res.data);
            setError("");
        } catch (e) {
            setError(errMsg(e));
        } finally {
            setLoading(false);
        }
    }, [search, status]);

    useEffect(() => {
        const t = setTimeout(load, 250); // debounce typing
        return () => clearTimeout(t);
    }, [load]);

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await request("teachers", "post", form);
            setOpen(false);
            setForm(empty);
            await load();
        } catch (err) {
            setError(errMsg(err));
        } finally {
            setSaving(false);
        }
    };

    const toggle = async (s: TeacherRow) => {
        try {
            await request(`teachers/${s.id}`, "put", {
                status: s.status === "active" ? "inactive" : "active",
            });
            await load();
        } catch (err) {
            setError(errMsg(err));
        }
    };

    const remove = async (s: TeacherRow) => {
        if (!confirm(`Remove ${s.user.name} as a teacher?`)) return;
        try {
            await request(`teachers/${s.id}`, "delete");
            await load();
        } catch (err) {
            setError(errMsg(err));
        }
    };

    return (
        <div className="p-4">
            <PageHeader
                title="Teachers"
                subtitle="Manage teacher records"
                action={
                    hasPermission(Permission.TEACHER_CREATE) && (
                        <Btn onClick={() => setOpen(true)}>
                            <i className="fas fa-plus mr-1" /> Add teacher
                        </Btn>
                    )
                }
            />
            {error && <Alert>{error}</Alert>}

            <div className="mb-4 flex flex-wrap gap-3">
                <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search name or email…"
                    className="w-64 rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
                <div className="w-40">
                    <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                        <option value="">All statuses</option>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                    </Select>
                </div>
            </div>

            <Table
                head={["Name", "Email", "Status", ""]}
                isEmpty={!loading && rows.length === 0}
                empty="No teachers found."
            >
                {rows.map((s) => (
                    <tr key={s.id}>
                        <td className="px-4 py-3 font-medium">{s.user.name}</td>
                        <td className="px-4 py-3 text-gray-600">{s.user.email}</td>
                        <td className="px-4 py-3">
                            <Badge color={s.status === "active" ? "green" : "gray"}>{s.status}</Badge>
                        </td>
                        <td className="px-4 py-3 text-right space-x-2">
                            {hasPermission(Permission.TEACHER_UPDATE) && (
                                <Btn variant="ghost" onClick={() => toggle(s)}>
                                    {s.status === "active" ? "Deactivate" : "Activate"}
                                </Btn>
                            )}
                            {hasPermission(Permission.TEACHER_DELETE) && (
                                <Btn variant="danger" onClick={() => remove(s)}>Delete</Btn>
                            )}
                        </td>
                    </tr>
                ))}
            </Table>

            {open && (
                <Modal title="Add teacher" onClose={() => setOpen(false)}>
                    <form onSubmit={create}>
                        <Field label="Full name" required value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <Field label="Email" type="email" required value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })} />
                        <Field label="Temporary password (min 8)" type="password" required minLength={8}
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })} />
                        <div className="flex justify-end gap-2">
                            <Btn type="button" variant="ghost" onClick={() => setOpen(false)}>Cancel</Btn>
                            <Btn disabled={saving}>{saving ? "Saving…" : "Create"}</Btn>
                        </div>
                    </form>
                </Modal>
            )}
        </div>
    );
};
export default Teacher;
