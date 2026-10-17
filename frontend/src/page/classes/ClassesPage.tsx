import React, { useCallback, useEffect, useState } from "react";
import { request } from "../../components/utils/Request";
import { useAuth } from "../../contexts/AuthCotext";
import { Permission } from "../../components/utils/Role";
import {
    Alert, Badge, Btn, errMsg, Field, Modal, PageHeader, Select, Table,
} from "../../components/common/Ui";

interface Teacher { id: number; user: { name: string } }
interface Enrollment { id: number; student: { id: number; user: { name: string; email: string } } }
interface ClassRow {
    id: number;
    name: string;
    room_number: string | null;
    start_date: string;
    end_date: string | null;
    enrollments_count: number;
    teachers: Teacher[];
}

const empty = { name: "", start_date: "", end_date: "", room_number: "" };

const ClassesPage: React.FC = () => {
    const { hasPermission } = useAuth();
    const [rows, setRows] = useState<ClassRow[]>([]);
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [students, setStudents] = useState<{ id: number; user: { name: string } }[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [createOpen, setCreateOpen] = useState(false);
    const [form, setForm] = useState(empty);
    const [detail, setDetail] = useState<{ cls: ClassRow; enrollments: Enrollment[] } | null>(null);
    const [pickTeacher, setPickTeacher] = useState("");
    const [pickStudent, setPickStudent] = useState("");

    const load = useCallback(async () => {
        try {
            const res = await request("classes");
            setRows(res.data);
            setError("");
        } catch (e) {
            setError(errMsg(e));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        load();
        if (hasPermission(Permission.CLASS_ASSIGN_TEACHER, Permission.TEACHER_VIEW))
            request("teachers?per_page=100").then((r) => setTeachers(r.data)).catch(() => undefined);
        if (hasPermission(Permission.ENROLLMENT_CREATE))
            request("students?per_page=100&status=active").then((r) => setStudents(r.data)).catch(() => undefined);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [load]);

    const openDetail = async (cls: ClassRow) => {
        try {
            const res = await request(`classes/${cls.id}`);
            setDetail({ cls: res.data, enrollments: res.data.enrollments ?? [] });
        } catch (e) {
            setError(errMsg(e));
        }
    };

    const refreshDetail = async () => {
        if (!detail) return;
        await openDetail(detail.cls);
        await load();
    };

    const create = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await request("classes", "post", { ...form, end_date: form.end_date || null });
            setCreateOpen(false);
            setForm(empty);
            await load();
        } catch (err) {
            setError(errMsg(err));
        }
    };

    const remove = async (c: ClassRow) => {
        if (!confirm(`Delete class "${c.name}"? Sessions and attendance in it are deleted too.`)) return;
        try {
            await request(`classes/${c.id}`, "delete");
            await load();
        } catch (err) {
            setError(errMsg(err));
        }
    };

    const act = async (fn: () => Promise<unknown>) => {
        try {
            await fn();
            await refreshDetail();
        } catch (err) {
            setError(errMsg(err));
        }
    };

    return (
        <div className="p-4">
            <PageHeader
                title="Classes"
                subtitle="Classes, their teachers and enrolled students"
                action={
                    hasPermission(Permission.CLASS_CREATE) && (
                        <Btn onClick={() => setCreateOpen(true)}>
                            <i className="fas fa-plus mr-1" /> Add class
                        </Btn>
                    )
                }
            />
            {error && <Alert>{error}</Alert>}

            <Table
                head={["Class", "Room", "Teachers", "Students", "Starts", ""]}
                isEmpty={!loading && rows.length === 0}
                empty="No classes yet."
            >
                {rows.map((c) => (
                    <tr key={c.id}>
                        <td className="px-4 py-3 font-medium">{c.name}</td>
                        <td className="px-4 py-3">{c.room_number ?? "—"}</td>
                        <td className="px-4 py-3">
                            {c.teachers.length
                                ? c.teachers.map((t) => t.user.name).join(", ")
                                : <span className="text-gray-400">unassigned</span>}
                        </td>
                        <td className="px-4 py-3"><Badge color="blue">{c.enrollments_count}</Badge></td>
                        <td className="px-4 py-3">{c.start_date}</td>
                        <td className="px-4 py-3 text-right space-x-2">
                            <Btn variant="ghost" onClick={() => openDetail(c)}>Manage</Btn>
                            {hasPermission(Permission.CLASS_DELETE) && (
                                <Btn variant="danger" onClick={() => remove(c)}>Delete</Btn>
                            )}
                        </td>
                    </tr>
                ))}
            </Table>

            {createOpen && (
                <Modal title="Add class" onClose={() => setCreateOpen(false)}>
                    <form onSubmit={create}>
                        <Field label="Class name" required value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })} />
                        <Field label="Start date" type="date" required value={form.start_date}
                            onChange={(e) => setForm({ ...form, start_date: e.target.value })} />
                        <Field label="End date (optional)" type="date" value={form.end_date}
                            onChange={(e) => setForm({ ...form, end_date: e.target.value })} />
                        <Field label="Room number" value={form.room_number}
                            onChange={(e) => setForm({ ...form, room_number: e.target.value })} />
                        <div className="flex justify-end gap-2">
                            <Btn type="button" variant="ghost" onClick={() => setCreateOpen(false)}>Cancel</Btn>
                            <Btn>Create</Btn>
                        </div>
                    </form>
                </Modal>
            )}

            {detail && (
                <Modal title={detail.cls.name} onClose={() => setDetail(null)}>
                    <h3 className="mb-2 font-semibold text-gray-700">Teachers</h3>
                    <ul className="mb-3 space-y-1 text-sm">
                        {detail.cls.teachers.map((t) => (
                            <li key={t.id} className="flex items-center justify-between">
                                {t.user.name}
                                {hasPermission(Permission.CLASS_ASSIGN_TEACHER) && (
                                    <button className="text-red-600 text-xs"
                                        onClick={() => act(() => request(`classes/${detail.cls.id}/teachers/${t.id}`, "delete"))}>
                                        remove
                                    </button>
                                )}
                            </li>
                        ))}
                        {detail.cls.teachers.length === 0 && <li className="text-gray-400">No teacher assigned</li>}
                    </ul>
                    {hasPermission(Permission.CLASS_ASSIGN_TEACHER) && (
                        <div className="mb-5 flex gap-2">
                            <div className="flex-1">
                                <Select value={pickTeacher} onChange={(e) => setPickTeacher(e.target.value)}>
                                    <option value="">Assign a teacher…</option>
                                    {teachers.map((t) => <option key={t.id} value={t.id}>{t.user.name}</option>)}
                                </Select>
                            </div>
                            <Btn disabled={!pickTeacher}
                                onClick={() => act(async () => {
                                    await request(`classes/${detail.cls.id}/teachers`, "post", { teacher_ids: [Number(pickTeacher)] });
                                    setPickTeacher("");
                                })}>Add</Btn>
                        </div>
                    )}

                    <h3 className="mb-2 font-semibold text-gray-700">Students ({detail.enrollments.length})</h3>
                    <ul className="mb-3 max-h-48 space-y-1 overflow-y-auto text-sm">
                        {detail.enrollments.map((en) => (
                            <li key={en.id} className="flex items-center justify-between">
                                {en.student.user.name}
                                {hasPermission(Permission.ENROLLMENT_DELETE) && (
                                    <button className="text-red-600 text-xs"
                                        onClick={() => act(() => request(`enrollments/${en.id}`, "delete"))}>
                                        remove
                                    </button>
                                )}
                            </li>
                        ))}
                        {detail.enrollments.length === 0 && <li className="text-gray-400">No students enrolled</li>}
                    </ul>
                    {hasPermission(Permission.ENROLLMENT_CREATE) && (
                        <div className="flex gap-2">
                            <div className="flex-1">
                                <Select value={pickStudent} onChange={(e) => setPickStudent(e.target.value)}>
                                    <option value="">Enroll a student…</option>
                                    {students
                                        .filter((s) => !detail.enrollments.some((en) => en.student.id === s.id))
                                        .map((s) => <option key={s.id} value={s.id}>{s.user.name}</option>)}
                                </Select>
                            </div>
                            <Btn disabled={!pickStudent}
                                onClick={() => act(async () => {
                                    await request("enrollments", "post", { class_id: detail.cls.id, student_id: Number(pickStudent) });
                                    setPickStudent("");
                                })}>Enroll</Btn>
                        </div>
                    )}
                </Modal>
            )}
        </div>
    );
};
export default ClassesPage;
