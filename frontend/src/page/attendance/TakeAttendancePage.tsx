import React, { useCallback, useEffect, useState } from "react";
import { request } from "../../components/utils/Request";
import { useAuth } from "../../contexts/AuthCotext";
import { Permission } from "../../components/utils/Role";
import { Alert, Badge, Btn, errMsg, Field, PageHeader, Select, Table, today } from "../../components/common/Ui";

type Status = "present" | "absent" | "permission";
interface Cls { id: number; name: string }
interface Term { id: number; name: string }
interface Session { id: number; session_date: string; status: string; term: Term }
interface Row { student_id: number; name: string; status: Status | null; comments: string | null }

const TakeAttendancePage: React.FC = () => {
    const { hasPermission } = useAuth();
    const [classes, setClasses] = useState<Cls[]>([]);
    const [terms, setTerms] = useState<Term[]>([]);
    const [classId, setClassId] = useState("");
    const [termId, setTermId] = useState("");
    const [date, setDate] = useState(today());
    const [sessions, setSessions] = useState<Session[]>([]);
    const [sessionId, setSessionId] = useState("");
    const [rows, setRows] = useState<Row[]>([]);
    const [error, setError] = useState("");
    const [ok, setOk] = useState("");
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        request("classes").then((r) => setClasses(r.data)).catch((e) => setError(errMsg(e)));
        request("terms").then((r) => {
            setTerms(r.data);
            if (r.data[0]) setTermId(String(r.data[0].id));
        }).catch((e) => setError(errMsg(e)));
    }, []);

    const loadSessions = useCallback(async () => {
        setSessionId(""); setRows([]);
        if (!classId) return setSessions([]);
        try {
            const res = await request(`class-sessions?class_id=${classId}&date=${date}`);
            setSessions(res.data);
            if (res.data.length === 1) setSessionId(String(res.data[0].id));
        } catch (e) { setError(errMsg(e)); }
    }, [classId, date]);
    useEffect(() => { loadSessions(); }, [loadSessions]);

    useEffect(() => {
        if (!sessionId) return setRows([]);
        request(`class-sessions/${sessionId}/attendance`)
            .then((r) => setRows(r.data.students))
            .catch((e) => setError(errMsg(e)));
    }, [sessionId]);

    const createSession = async () => {
        try {
            const res = await request("class-sessions", "post", {
                class_id: Number(classId), term_id: Number(termId), session_date: date,
            });
            await loadSessions();
            setSessionId(String(res.data.id));
            setError("");
        } catch (e) { setError(errMsg(e)); }
    };

    const setStatus = (id: number, status: Status) =>
        setRows((rs) => rs.map((r) => (r.student_id === id ? { ...r, status } : r)));

    const save = async () => {
        const records = rows.filter((r) => r.status).map((r) => ({
            student_id: r.student_id, status: r.status, comments: r.comments || null,
        }));
        if (!records.length) return setError("Mark at least one student first.");
        setSaving(true); setOk("");
        try {
            await request(`class-sessions/${sessionId}/attendance`, "post", { records });
            setOk("Attendance saved."); setError("");
        } catch (e) { setError(errMsg(e)); } finally { setSaving(false); }
    };

    const unmarked = rows.filter((r) => !r.status).length;
    const colors: Record<Status, string> = { present: "text-green-600", absent: "text-red-600", permission: "text-yellow-600" };

    return (
        <div className="p-4">
            <PageHeader title="Take Attendance" subtitle="Pick a class and date, then mark each student" />
            {error && <Alert>{error}</Alert>}
            {ok && <Alert type="success">{ok}</Alert>}

            <div className="mb-4 grid gap-3 sm:grid-cols-3">
                <Select label="Class" value={classId} onChange={(e) => setClassId(e.target.value)}>
                    <option value="">Select class…</option>
                    {classes.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </Select>
                <Field label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                {sessions.length > 1 && (
                    <Select label="Session" value={sessionId} onChange={(e) => setSessionId(e.target.value)}>
                        <option value="">Select session…</option>
                        {sessions.map((s) => <option key={s.id} value={s.id}>#{s.id} · {s.status}</option>)}
                    </Select>
                )}
            </div>

            {classId && sessions.length === 0 && hasPermission(Permission.SESSION_MANAGE) && (
                <div className="mb-4 flex flex-wrap items-end gap-3 rounded-md border border-dashed border-gray-300 p-3">
                    <span className="text-sm text-gray-600">No session on {date} for this class.</span>
                    <div className="w-48">
                        <Select label="Term" value={termId} onChange={(e) => setTermId(e.target.value)}>
                            {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                        </Select>
                    </div>
                    <Btn disabled={!termId} onClick={createSession}>Create session</Btn>
                    {terms.length === 0 && <span className="text-xs text-red-600">Create a term first (Academic Calendar).</span>}
                </div>
            )}

            {sessionId && (
                <>
                    <div className="mb-2 flex items-center justify-between">
                        <Badge color={unmarked ? "yellow" : "green"}>{unmarked ? `${unmarked} not marked` : "all marked"}</Badge>
                        <Btn variant="ghost" onClick={() => setRows((rs) => rs.map((r) => ({ ...r, status: "present" })))}>
                            Mark all present
                        </Btn>
                    </div>
                    <Table head={["Student", "Status", "Comment"]} isEmpty={rows.length === 0} empty="No students enrolled in this class.">
                        {rows.map((r) => (
                            <tr key={r.student_id}>
                                <td className="px-4 py-3 font-medium">{r.name}</td>
                                <td className="px-4 py-3">
                                    <div className="flex gap-4">
                                        {(["present", "absent", "permission"] as Status[]).map((s) => (
                                            <label key={s} className={`flex items-center gap-1 capitalize ${colors[s]}`}>
                                                <input type="radio" name={`st-${r.student_id}`} checked={r.status === s}
                                                    onChange={() => setStatus(r.student_id, s)} />
                                                {s}
                                            </label>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                    <input value={r.comments ?? ""} placeholder="optional"
                                        onChange={(e) => setRows((rs) => rs.map((x) => x.student_id === r.student_id ? { ...x, comments: e.target.value } : x))}
                                        className="w-full rounded border border-gray-200 px-2 py-1 text-sm" />
                                </td>
                            </tr>
                        ))}
                    </Table>
                    {rows.length > 0 && hasPermission(Permission.ATTENDANCE_RECORD) && (
                        <div className="mt-4 flex justify-end">
                            <Btn disabled={saving} onClick={save}>{saving ? "Saving…" : "Save attendance"}</Btn>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};
export default TakeAttendancePage;
