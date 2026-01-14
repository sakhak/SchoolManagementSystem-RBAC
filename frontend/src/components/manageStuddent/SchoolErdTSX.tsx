import React, { useMemo } from "react";

/**
 * ERD-style renderer for the schema in your screenshot.
 * - Pure TSX (no external libs)
 * - Tailwind classes for styling
 * - Tables are positioned absolutely; relationships are drawn via an SVG overlay
 *
 * Adjust NODE_POS to fine-tune layout.
 */

type Field = {
    name: string;
    kind?: "PK" | "FK" | "ATTR";
    note?: string; // e.g., "active | inactive"
};

type Node = {
    id: string;
    title: string;
    fields: Field[];
};

type Anchor =
    | "top"
    | "right"
    | "bottom"
    | "left"
    | "topLeft"
    | "topRight"
    | "bottomLeft"
    | "bottomRight";

type Edge = {
    id: string;
    from: { nodeId: string; anchor?: Anchor };
    to: { nodeId: string; anchor?: Anchor };
    label?: string;
};

type Pos = { x: number; y: number; w: number; h: number };

const NODE_POS: Record<string, Pos> = {
    class_teacher: { x: 40, y: 60, w: 210, h: 165 },
    class: { x: 300, y: 60, w: 220, h: 195 },
    enrollment: { x: 570, y: 60, w: 220, h: 165 },
    student: { x: 835, y: 60, w: 230, h: 155 },
    teacher: { x: 1100, y: 60, w: 230, h: 155 },

    academic_year: { x: 60, y: 380, w: 230, h: 165 },
    term: { x: 340, y: 380, w: 230, h: 185 },
    class_session: { x: 630, y: 360, w: 240, h: 225 },
    attendance_record: { x: 940, y: 370, w: 275, h: 245 },

    blacklist: { x: 1250, y: 320, w: 230, h: 185 },
};

const NODES: Node[] = [
    {
        id: "class_teacher",
        title: "class_teacher",
        fields: [
            { name: "id", kind: "PK" },
            { name: "class_id", kind: "FK" },
            { name: "teacher_id", kind: "FK" },
            { name: "assigned_at", kind: "ATTR" },
        ],
    },
    {
        id: "class",
        title: "class",
        fields: [
            { name: "id", kind: "PK" },
            { name: "name", kind: "ATTR" },
            { name: "start_date", kind: "ATTR" },
            { name: "end_date", kind: "ATTR" },
            { name: "room_number", kind: "ATTR" },
        ],
    },
    {
        id: "enrollment",
        title: "enrollment",
        fields: [
            { name: "id", kind: "PK" },
            { name: "class_id", kind: "FK" },
            { name: "student_id", kind: "FK" },
            { name: "enrolled_on", kind: "ATTR" },
        ],
    },
    {
        id: "student",
        title: "student",
        fields: [
            { name: "id", kind: "PK" },
            { name: "user_id", kind: "FK" },
            { name: "student_code", kind: "ATTR" },
            { name: "status", kind: "ATTR", note: "active | inactive" },
        ],
    },
    {
        id: "teacher",
        title: "teacher",
        fields: [
            { name: "id", kind: "PK" },
            { name: "user_id", kind: "FK" },
            { name: "teacher_code", kind: "ATTR" },
            { name: "status", kind: "ATTR", note: "active | inactive" },
        ],
    },
    {
        id: "academic_year",
        title: "academic_year",
        fields: [
            { name: "id", kind: "PK" },
            { name: "name", kind: "ATTR" },
            { name: "start_date", kind: "ATTR" },
            { name: "end_date", kind: "ATTR" },
        ],
    },
    {
        id: "term",
        title: "term",
        fields: [
            { name: "id", kind: "PK" },
            { name: "name", kind: "ATTR" },
            { name: "academic_year_id", kind: "FK" },
            { name: "start_date", kind: "ATTR" },
            { name: "end_date", kind: "ATTR" },
        ],
    },
    {
        id: "class_session",
        title: "class_session",
        fields: [
            { name: "id", kind: "PK" },
            { name: "class_id", kind: "FK" },
            { name: "term_id", kind: "FK" },
            { name: "teacher_id", kind: "FK" },
            { name: "session_date", kind: "ATTR" },
            { name: "status", kind: "ATTR" },
            { name: "created_on", kind: "ATTR" },
        ],
    },
    {
        id: "attendance_record",
        title: "attendance_record",
        fields: [
            { name: "id", kind: "PK" },
            { name: "class_session_id", kind: "FK" },
            { name: "student_id", kind: "FK" },
            { name: "recorded_by", kind: "FK" },
            {
                name: "status",
                kind: "ATTR",
                note: "present | absent | permission",
            },
            { name: "comment", kind: "ATTR" },
            { name: "recorded_on", kind: "ATTR" },
        ],
    },
    {
        id: "blacklist",
        title: "blacklist",
        fields: [
            { name: "id", kind: "PK" },
            { name: "student_id", kind: "FK" },
            { name: "term_id", kind: "FK" },
            { name: "absence_count", kind: "ATTR" },
            { name: "flagged_at", kind: "ATTR" },
        ],
    },
];

const EDGES: Edge[] = [
    // class_teacher
    {
        id: "ct_class",
        from: { nodeId: "class_teacher", anchor: "right" },
        to: { nodeId: "class", anchor: "left" },
    },
    {
        id: "ct_teacher",
        from: { nodeId: "class_teacher", anchor: "right" },
        to: { nodeId: "teacher", anchor: "left" },
    },

    // enrollment
    {
        id: "en_class",
        from: { nodeId: "enrollment", anchor: "left" },
        to: { nodeId: "class", anchor: "right" },
    },
    {
        id: "en_student",
        from: { nodeId: "enrollment", anchor: "right" },
        to: { nodeId: "student", anchor: "left" },
    },

    // term -> academic_year
    {
        id: "term_ay",
        from: { nodeId: "term", anchor: "left" },
        to: { nodeId: "academic_year", anchor: "right" },
    },

    // class_session
    {
        id: "cs_class",
        from: { nodeId: "class_session", anchor: "topLeft" },
        to: { nodeId: "class", anchor: "bottom" },
    },
    {
        id: "cs_term",
        from: { nodeId: "class_session", anchor: "left" },
        to: { nodeId: "term", anchor: "right" },
    },
    {
        id: "cs_teacher",
        from: { nodeId: "class_session", anchor: "topRight" },
        to: { nodeId: "teacher", anchor: "bottom" },
    },

    // attendance_record
    {
        id: "ar_cs",
        from: { nodeId: "attendance_record", anchor: "left" },
        to: { nodeId: "class_session", anchor: "right" },
    },
    {
        id: "ar_student",
        from: { nodeId: "attendance_record", anchor: "top" },
        to: { nodeId: "student", anchor: "bottom" },
    },
    {
        id: "ar_recorded_by_teacher",
        from: { nodeId: "attendance_record", anchor: "topRight" },
        to: { nodeId: "teacher", anchor: "bottomRight" },
    },

    // blacklist
    {
        id: "bl_student",
        from: { nodeId: "blacklist", anchor: "left" },
        to: { nodeId: "student", anchor: "right" },
    },
    {
        id: "bl_term",
        from: { nodeId: "blacklist", anchor: "left" },
        to: { nodeId: "term", anchor: "right" },
    },
];

function anchorPoint(pos: Pos, anchor: Anchor = "right") {
    const { x, y, w, h } = pos;
    switch (anchor) {
        case "top":
            return { x: x + w / 2, y: y };
        case "right":
            return { x: x + w, y: y + h / 2 };
        case "bottom":
            return { x: x + w / 2, y: y + h };
        case "left":
            return { x: x, y: y + h / 2 };
        case "topLeft":
            return { x: x + 18, y: y + 18 };
        case "topRight":
            return { x: x + w - 18, y: y + 18 };
        case "bottomLeft":
            return { x: x + 18, y: y + h - 18 };
        case "bottomRight":
            return { x: x + w - 18, y: y + h - 18 };
        default:
            return { x: x + w, y: y + h / 2 };
    }
}

function elbowPath(a: { x: number; y: number }, b: { x: number; y: number }) {
    // Simple orthogonal (elbow) routing: go horizontal to midX then vertical then horizontal.
    const midX = (a.x + b.x) / 2;
    return `M ${a.x} ${a.y} L ${midX} ${a.y} L ${midX} ${b.y} L ${b.x} ${b.y}`;
}

function kindBadge(kind?: Field["kind"]) {
    if (!kind) return null;
    const map: Record<NonNullable<Field["kind"]>, string> = {
        PK: "bg-emerald-500/20 text-emerald-200 border-emerald-400/30",
        FK: "bg-sky-500/20 text-sky-200 border-sky-400/30",
        ATTR: "bg-zinc-500/20 text-zinc-200 border-zinc-400/30",
    };
    return (
        <span
            className={[
                "ml-2 inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-semibold tracking-wide",
                map[kind],
            ].join(" ")}
        >
            {kind}
        </span>
    );
}

function TableCard({ node }: { node: Node }) {
    const pos = NODE_POS[node.id];
    return (
        <div
            className="absolute rounded-xl border border-white/15 bg-zinc-950/60 shadow-[0_0_0_1px_rgba(255,255,255,0.06)] backdrop-blur"
            style={{ left: pos.x, top: pos.y, width: pos.w }}
        >
            <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
                <div className="text-xs font-semibold text-white/90">
                    {node.title}
                </div>
                <div className="h-1.5 w-1.5 rounded-full bg-white/30" />
            </div>

            <div className="px-3 py-2">
                <ul className="space-y-1.5">
                    {node.fields.map((f) => (
                        <li
                            key={f.name}
                            className="flex items-start justify-between gap-3"
                        >
                            <div className="min-w-0">
                                <div className="truncate text-[12px] text-white/80">
                                    <span className="font-medium text-white/85">
                                        {f.name}
                                    </span>
                                    {f.note ? (
                                        <span className="ml-2 text-[11px] text-white/45">
                                            ({f.note})
                                        </span>
                                    ) : null}
                                </div>
                            </div>
                            <div className="shrink-0">{kindBadge(f.kind)}</div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function GridBackground() {
    return (
        <div className="pointer-events-none absolute inset-0">
            <div
                className="absolute inset-0 opacity-25"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)",
                    backgroundSize: "42px 42px",
                }}
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-black" />
        </div>
    );
}

export default function SchoolErdTSX() {
    const bounds = useMemo(() => {
        // Compute canvas size based on positioned nodes
        const all = Object.values(NODE_POS);
        const maxX = Math.max(...all.map((p) => p.x + p.w)) + 60;
        const maxY = Math.max(...all.map((p) => p.y + p.h)) + 60;
        return { w: maxX, h: maxY };
    }, []);

    return (
        <div className="h-[85vh] w-full overflow-auto rounded-2xl border border-white/10 bg-black">
            <div
                className="relative"
                style={{ width: bounds.w, height: bounds.h }}
            >
                <GridBackground />

                {/* SVG edges (behind nodes) */}
                <svg className="absolute inset-0 h-full w-full">
                    <defs>
                        <marker
                            id="arrow"
                            markerWidth="10"
                            markerHeight="10"
                            refX="8"
                            refY="5"
                            orient="auto"
                            markerUnits="strokeWidth"
                        >
                            <path
                                d="M 0 0 L 10 5 L 0 10 z"
                                fill="rgba(255,255,255,0.55)"
                            />
                        </marker>
                    </defs>

                    {EDGES.map((e) => {
                        const aPos = NODE_POS[e.from.nodeId];
                        const bPos = NODE_POS[e.to.nodeId];
                        const a = anchorPoint(aPos, e.from.anchor);
                        const b = anchorPoint(bPos, e.to.anchor);
                        const d = elbowPath(a, b);

                        return (
                            <g key={e.id}>
                                <path
                                    d={d}
                                    fill="none"
                                    stroke="rgba(255,255,255,0.35)"
                                    strokeWidth={2}
                                    markerEnd="url(#arrow)"
                                />
                                {e.label ? (
                                    <text
                                        x={(a.x + b.x) / 2}
                                        y={(a.y + b.y) / 2}
                                        fill="rgba(255,255,255,0.55)"
                                        fontSize="10"
                                    >
                                        {e.label}
                                    </text>
                                ) : null}
                            </g>
                        );
                    })}
                </svg>

                {/* Nodes */}
                {NODES.map((n) => (
                    <TableCard key={n.id} node={n} />
                ))}

                {/* Legend */}
                <div className="absolute left-6 top-6 rounded-xl border border-white/10 bg-zinc-950/60 px-3 py-2 text-xs text-white/75 backdrop-blur">
                    <div className="font-semibold text-white/85">Legend</div>
                    <div className="mt-1 flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center">
                            <span className="mr-2 inline-flex items-center rounded-md border border-emerald-400/30 bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-200">
                                PK
                            </span>
                            Primary Key
                        </span>
                        <span className="inline-flex items-center">
                            <span className="mr-2 inline-flex items-center rounded-md border border-sky-400/30 bg-sky-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-sky-200">
                                FK
                            </span>
                            Foreign Key
                        </span>
                        <span className="inline-flex items-center">
                            <span className="mr-2 inline-flex items-center rounded-md border border-zinc-400/30 bg-zinc-500/20 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-200">
                                ATTR
                            </span>
                            Attribute
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
