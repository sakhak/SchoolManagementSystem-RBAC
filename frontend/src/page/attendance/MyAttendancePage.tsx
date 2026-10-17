import React, { useEffect, useState } from "react";
import { request } from "../../components/utils/Request";
import { Alert, Badge, errMsg, PageHeader, Table } from "../../components/common/Ui";

interface Summary {
    class_id: number; class_name: string; total: number; present: number;
    absent: number; permission: number; attendance_rate: number; last_attendance: string;
}
interface Rec { session_id: number; class_name: string; session_date: string; status: string; comments: string | null }

const MyAttendancePage: React.FC = () => {
    const [classes, setClasses] = useState<Summary[]>([]);
    const [records, setRecords] = useState<Rec[]>([]);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        request("attendance/me")
            .then((r) => { setClasses(r.data.classes); setRecords(r.data.records); })
            .catch((e) => setError(errMsg(e)))
            .finally(() => setLoading(false));
    }, []);

    const color = (r: number) => (r >= 90 ? "text-green-600" : r >= 75 ? "text-yellow-600" : "text-red-600");

    return (
        <div className="p-4">
            <PageHeader title="My Attendance" subtitle="Your attendance in each class" />
            {error && <Alert>{error}</Alert>}
            {!loading && !error && classes.length === 0 && <p className="text-gray-400">No attendance recorded yet.</p>}

            <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {classes.map((c) => (
                    <div key={c.class_id} className="rounded-lg border border-gray-200 bg-white p-4">
                        <h3 className="font-semibold">{c.class_name}</h3>
                        <p className={`my-1 text-3xl font-bold ${color(c.attendance_rate)}`}>{c.attendance_rate}%</p>
                        <p className="text-xs text-gray-500">
                            {c.present} present · {c.absent} absent · {c.permission} permission · {c.total} total
                        </p>
                        <p className="text-xs text-gray-400">Last: {c.last_attendance}</p>
                    </div>
                ))}
            </div>

            {records.length > 0 && (
                <Table head={["Date", "Class", "Status", "Comment"]}>
                    {[...records].sort((a, b) => b.session_date.localeCompare(a.session_date)).map((r) => (
                        <tr key={`${r.session_id}`}>
                            <td className="px-4 py-3">{r.session_date.slice(0, 10)}</td>
                            <td className="px-4 py-3">{r.class_name}</td>
                            <td className="px-4 py-3">
                                <Badge color={r.status === "present" ? "green" : r.status === "absent" ? "red" : "yellow"}>{r.status}</Badge>
                            </td>
                            <td className="px-4 py-3 text-gray-500">{r.comments ?? "—"}</td>
                        </tr>
                    ))}
                </Table>
            )}
        </div>
    );
};
export default MyAttendancePage;
