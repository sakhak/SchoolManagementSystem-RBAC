import React, { useCallback, useEffect, useState } from "react";
import { request } from "../../components/utils/Request";
import { useAuth } from "../../contexts/AuthCotext";
import { Permission } from "../../components/utils/Role";
import { Alert, Badge, Btn, errMsg, PageHeader, Select, Table } from "../../components/common/Ui";

interface Entry {
    id: number; absences_count: number; flagged_on: string;
    student: { user: { name: string; email: string } }; term: { name: string };
}

const BlacklistPage: React.FC = () => {
    const { hasPermission } = useAuth();
    const [terms, setTerms] = useState<{ id: number; name: string }[]>([]);
    const [termId, setTermId] = useState("");
    const [rows, setRows] = useState<Entry[]>([]);
    const [threshold, setThreshold] = useState<number | null>(null);
    const [error, setError] = useState("");

    useEffect(() => {
        request("terms").then((r) => setTerms(r.data)).catch(() => undefined);
    }, []);

    const load = useCallback(async () => {
        try {
            const res = await request(`blacklist${termId ? `?term_id=${termId}` : ""}`);
            setRows(res.data); setThreshold(res.threshold); setError("");
        } catch (e) { setError(errMsg(e)); }
    }, [termId]);
    useEffect(() => { load(); }, [load]);

    const canManage = hasPermission(Permission.BLACKLIST_MANAGE);

    const recalc = async () => {
        try { await request("blacklist/recalculate", "post", { term_id: Number(termId) }); await load(); }
        catch (e) { setError(errMsg(e)); }
    };
    const remove = async (id: number) => {
        try { await request(`blacklist/${id}`, "delete"); await load(); } catch (e) { setError(errMsg(e)); }
    };

    return (
        <div className="p-4">
            <PageHeader
                title="Student Blacklist"
                subtitle={threshold ? `Students are flagged at ${threshold} or more absences in a term (updated automatically when attendance is saved)` : ""}
                action={canManage && <Btn disabled={!termId} onClick={recalc}>Recalculate term</Btn>}
            />
            {error && <Alert>{error}</Alert>}
            <div className="mb-4 w-64">
                <Select value={termId} onChange={(e) => setTermId(e.target.value)}>
                    <option value="">All terms</option>
                    {terms.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </Select>
            </div>
            <Table head={["Student", "Term", "Absences", "Flagged on", ""]} isEmpty={rows.length === 0} empty="No students are blacklisted.">
                {rows.map((r) => (
                    <tr key={r.id}>
                        <td className="px-4 py-3 font-medium">{r.student.user.name}<div className="text-xs text-gray-400">{r.student.user.email}</div></td>
                        <td className="px-4 py-3">{r.term.name}</td>
                        <td className="px-4 py-3"><Badge color="red">{r.absences_count}</Badge></td>
                        <td className="px-4 py-3">{r.flagged_on.slice(0, 10)}</td>
                        <td className="px-4 py-3 text-right">
                            {canManage && <Btn variant="ghost" onClick={() => remove(r.id)}>Clear</Btn>}
                        </td>
                    </tr>
                ))}
            </Table>
        </div>
    );
};
export default BlacklistPage;
