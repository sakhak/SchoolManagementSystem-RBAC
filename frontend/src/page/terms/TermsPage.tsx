import React, { useCallback, useEffect, useState } from "react";
import { request } from "../../components/utils/Request";
import { useAuth } from "../../contexts/AuthCotext";
import { Permission } from "../../components/utils/Role";
import { Alert, Btn, errMsg, Field, Modal, PageHeader, Select } from "../../components/common/Ui";

interface Term { id: number; name: string; start_date: string; end_date: string | null }
interface Year { id: number; name: string; start_date: string; end_date: string | null; terms: Term[] }

const TermsPage: React.FC = () => {
    const { hasPermission } = useAuth();
    const [years, setYears] = useState<Year[]>([]);
    const [error, setError] = useState("");
    const [modal, setModal] = useState<"year" | "term" | null>(null);
    const [yearForm, setYearForm] = useState({ name: "", start_date: "", end_date: "" });
    const [termForm, setTermForm] = useState({ name: "", academic_year_id: "", start_date: "", end_date: "" });

    const load = useCallback(async () => {
        try {
            setYears((await request("academic-years")).data);
            setError("");
        } catch (e) {
            setError(errMsg(e));
        }
    }, []);
    useEffect(() => { load(); }, [load]);

    const run = async (fn: () => Promise<unknown>) => {
        try { await fn(); setModal(null); await load(); } catch (e) { setError(errMsg(e)); }
    };

    const canYear = hasPermission(Permission.ACADEMIC_YEAR_MANAGE);
    const canTerm = hasPermission(Permission.TERM_MANAGE);

    return (
        <div className="p-4">
            <PageHeader
                title="Academic Calendar"
                subtitle="Academic years and their terms"
                action={
                    <div className="flex gap-2">
                        {canYear && <Btn onClick={() => setModal("year")}>+ Academic year</Btn>}
                        {canTerm && <Btn variant="ghost" onClick={() => setModal("term")}>+ Term</Btn>}
                    </div>
                }
            />
            {error && <Alert>{error}</Alert>}
            {years.length === 0 && <p className="text-gray-400">No academic years yet.</p>}

            <div className="space-y-4">
                {years.map((y) => (
                    <div key={y.id} className="rounded-lg border border-gray-200 bg-white p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="font-semibold">{y.name}</h2>
                                <p className="text-xs text-gray-500">{y.start_date} → {y.end_date ?? "open"}</p>
                            </div>
                            {canYear && (
                                <Btn variant="danger" onClick={() => confirm(`Delete ${y.name} and all its terms?`) &&
                                    run(() => request(`academic-years/${y.id}`, "delete"))}>Delete</Btn>
                            )}
                        </div>
                        <ul className="mt-3 divide-y divide-gray-100 text-sm">
                            {y.terms.map((t) => (
                                <li key={t.id} className="flex items-center justify-between py-2">
                                    <span>{t.name} <span className="text-xs text-gray-500">({t.start_date} → {t.end_date ?? "open"})</span></span>
                                    {canTerm && (
                                        <button className="text-xs text-red-600"
                                            onClick={() => confirm(`Delete ${t.name}?`) && run(() => request(`terms/${t.id}`, "delete"))}>
                                            delete
                                        </button>
                                    )}
                                </li>
                            ))}
                            {y.terms.length === 0 && <li className="py-2 text-gray-400">No terms</li>}
                        </ul>
                    </div>
                ))}
            </div>

            {modal === "year" && (
                <Modal title="New academic year" onClose={() => setModal(null)}>
                    <form onSubmit={(e) => { e.preventDefault(); run(() => request("academic-years", "post", { ...yearForm, end_date: yearForm.end_date || null })); }}>
                        <Field label="Name (e.g. 2026-2027)" required value={yearForm.name} onChange={(e) => setYearForm({ ...yearForm, name: e.target.value })} />
                        <Field label="Start date" type="date" required value={yearForm.start_date} onChange={(e) => setYearForm({ ...yearForm, start_date: e.target.value })} />
                        <Field label="End date" type="date" value={yearForm.end_date} onChange={(e) => setYearForm({ ...yearForm, end_date: e.target.value })} />
                        <div className="flex justify-end"><Btn>Create</Btn></div>
                    </form>
                </Modal>
            )}
            {modal === "term" && (
                <Modal title="New term" onClose={() => setModal(null)}>
                    <form onSubmit={(e) => { e.preventDefault(); run(() => request("terms", "post", { ...termForm, end_date: termForm.end_date || null })); }}>
                        <Field label="Name (unique)" required value={termForm.name} onChange={(e) => setTermForm({ ...termForm, name: e.target.value })} />
                        <div className="mb-3">
                            <Select label="Academic year" required value={termForm.academic_year_id}
                                onChange={(e) => setTermForm({ ...termForm, academic_year_id: e.target.value })}>
                                <option value="">Select…</option>
                                {years.map((y) => <option key={y.id} value={y.id}>{y.name}</option>)}
                            </Select>
                        </div>
                        <Field label="Start date" type="date" required value={termForm.start_date} onChange={(e) => setTermForm({ ...termForm, start_date: e.target.value })} />
                        <Field label="End date" type="date" value={termForm.end_date} onChange={(e) => setTermForm({ ...termForm, end_date: e.target.value })} />
                        <div className="flex justify-end"><Btn>Create</Btn></div>
                    </form>
                </Modal>
            )}
        </div>
    );
};
export default TermsPage;
