import React, { useCallback, useEffect, useState } from "react";
import { request } from "../../components/utils/Request";
import { Alert, Badge, errMsg, Field, PageHeader, Select, Table } from "../../components/common/Ui";

interface Row {
    student_id: number; name: string | null;
    present: number; absent: number; permission: number; total: number; attendance_rate: number | null;
}

const AttendanceReportPage: React.FC = () => {
    const [classes, setClasses] = useState<{ id: number; name: string }[]>([]);
    const [terms, setTerms] = useState<{ id: number; name: string }[]>([]);
    const [f, setF] = useState({ class_id: "", term_id: "", from: "", to: "" });
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        request("classes").then((r) => setClasses(r.data)).catch(() => undefined);
        request("terms").then((r) => setTerms(r.data)).catch(() => undefined);
    }, []);

    const load = useCallback(async () => {
        setLoading(true);
        try {
            const q = new URLSearchParams();
            Object.entries(f).forEach(([k, v]) => v && q.set(k, v));
            setRows((await request(`attendance/report?${q.toString()}`)).data);
            setError("");
        } catch (e) { setError(errMsg(e)); } finally { setLoading(false); }
    }, [f]);
    useEffect(() => { load(); }, [load]);

    const rate = (r: number | null) =>
        r === null ? <Badge>n/a</Badge> : <Badge color={r >= 90 ? "green" : r >= 75 ? "yellow" : "red"}>{r}%</Badge>;

    return (
        <div className="p-4">
            <PageHeader title="Attendance Report" subtitle="Per-student totals for the selected filters" />
            {error && <Alert>{error}</Alert>}
            <div className="mb-4 grid gap-3 sm:grid-cols-4">
                <Select label="Class" value={f.class_id} onChange={(e) => setF({ ...f, class_id: e.target.value })}>
                    <option value="">All classes</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <Select label="Term" value={f.term_id} onChange={(e) => setF({ ...f, term_id: e.target.value })}>
                    <option value="">All terms</option>
                    {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </Select>
                <Field label="From" type="date" value={f.from} onChange={(e) => setF({ ...f, from: e.target.value })} />
                <Field label="To" type="date" value={f.to} onChange={(e) => setF({ ...f, to: e.target.value })} />
            </div>
            <Table head={["Student", "Present", "Absent", "Permission", "Total", "Rate"]}
                isEmpty={!loading && rows.length === 0} empty="No attendance recorded for these filters.">
                {rows.map((r) => (
                    <tr key={r.student_id}>
                        <td className="px-4 py-3 font-medium">{r.name}</td>
                        <td className="px-4 py-3 text-green-600">{r.present}</td>
                        <td className="px-4 py-3 text-red-600">{r.absent}</td>
                        <td className="px-4 py-3 text-yellow-600">{r.permission}</td>
                        <td className="px-4 py-3">{r.total}</td>
                        <td className="px-4 py-3">{rate(r.attendance_rate)}</td>
                    </tr>
                ))}
            </Table>
        </div>
    );
};
export default AttendanceReportPage;
