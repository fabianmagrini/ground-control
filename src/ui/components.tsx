import { Link } from "@tanstack/react-router";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  type ColumnDef,
} from "@tanstack/react-table";
import { useMemo } from "react";
import { gateway, ingestionSteps, policies, tools } from "../domain/fixtures";
import { sectionConfig } from "../domain/navigation";
import type { Approval, AuditEvent, EvalCase, Section, Ticket } from "../domain/types";
import { useAppState } from "./AppState";

export function AppShell({
  section,
  eyebrow,
  title,
  children,
}: {
  section: Section;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  const { bootstrap, tickets, approvals, passCount, evals, knowledgeSources, runCopilot, resetDemo } =
    useAppState();

  return (
    <div className="app-shell">
      <aside className="sidebar" aria-label="Application navigation">
        <div className="brand">
          <div className="brand-mark">IO</div>
          <div>
            <h1>{bootstrap.appName}</h1>
            <p>Enterprise support console</p>
          </div>
        </div>

        <nav className="nav-stack" aria-label="Primary">
          <NavLink section={section} target="support" label="Support Desk" value={tickets.length} />
          <NavLink
            section={section}
            target="approvals"
            label="Approvals"
            value={approvals.filter((item) => item.status === "Awaiting review").length}
          />
          <NavLink section={section} target="knowledge" label="Knowledge" value={knowledgeSources.length} />
          <NavLink
            section={section}
            target="observability"
            label="Observability"
            value={`${passCount}/${evals.length}`}
          />
          <NavLink section={section} target="governance" label="Governance" value="On" />
        </nav>

        <div className="agent-card">
          <span className="avatar">FM</span>
          <div>
            <strong>Fabian Magrini</strong>
            <p>Support Lead / Sydney</p>
          </div>
        </div>
      </aside>

      <main className="workspace">
        <header className="topbar">
          <div>
            <p className="eyebrow">{eyebrow}</p>
            <h2>{title}</h2>
          </div>
          <div className="topbar-actions">
            <button
              className="secondary-button"
              data-testid="reset-demo-button"
              onClick={resetDemo}
              type="button"
            >
              Reset
            </button>
            {section === "support" && (
              <button
                className="primary-button"
                data-testid="run-copilot-button"
                onClick={runCopilot}
                type="button"
              >
                Run Copilot
              </button>
            )}
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}

function NavLink({
  section,
  target,
  label,
  value,
}: {
  section: Section;
  target: Section;
  label: string;
  value: string | number;
}) {
  return (
    <Link
      className={`nav-item ${section === target ? "active" : ""}`}
      data-testid={`nav-${target}`}
      to={sectionConfig[target].path}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </Link>
  );
}

export function MetricRow({ metrics }: { metrics: readonly (readonly [string, number | string, string])[] }) {
  return (
    <div className="metric-row">
      {metrics.map(([label, value, sub]) => (
        <div className="metric-card" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
          <p>{sub}</p>
        </div>
      ))}
    </div>
  );
}

export function OutputBlock({
  title,
  action,
  onClick,
  testId,
  children,
}: {
  title: string;
  action: string;
  onClick: () => void;
  testId?: string;
  children: string;
}) {
  return (
    <div className="output-block">
      <div className="block-title">
        <span>{title}</span>
        <button className="tiny-button" data-testid={testId} onClick={onClick} type="button">
          {action}
        </button>
      </div>
      <p>{children}</p>
    </div>
  );
}

export function AccountCard({ ticket }: { ticket: Ticket }) {
  const rows = [
    ["CSM", ticket.account.csm],
    ["Renewal", ticket.account.renewal],
    ["Incidents", ticket.account.incidents],
    ["Contract", ticket.account.contract],
    ["Residency", ticket.account.dataResidency],
  ];
  return (
    <div className="account-card">
      <div className="account-score">
        <strong>{ticket.health}</strong>
        <span>Account health</span>
      </div>
      {rows.map(([label, value]) => (
        <div className="detail-row" key={label}>
          <span>{label}</span>
          <strong>{value}</strong>
        </div>
      ))}
    </div>
  );
}

export function ToolList() {
  return (
    <div className="tool-list">
      {tools.map((tool) => (
        <div className="tool-card" key={tool.name}>
          <div>
            <strong>{tool.name}</strong>
            <span>
              {tool.scope} / {tool.status} / {tool.latency}
            </span>
          </div>
          <p>{tool.description}</p>
        </div>
      ))}
    </div>
  );
}

export function TicketQueueTable({
  activeTicketId,
  onSelect,
  tickets,
}: {
  activeTicketId: string;
  onSelect: (ticketId: string) => void;
  tickets: Ticket[];
}) {
  const columns = useMemo<ColumnDef<Ticket>[]>(
    () => [
      {
        id: "ticket",
        header: "Ticket",
        cell: ({ row }) => {
          const ticket = row.original;
          return (
            <button
              className={`ticket-row-button ${ticket.id === activeTicketId ? "active" : ""}`}
              data-testid={`ticket-card-${ticket.id}`}
              onClick={() => onSelect(ticket.id)}
              type="button"
            >
              <span className="ticket-meta">
                {ticket.id} / {ticket.priority} / {ticket.sla}
              </span>
              <strong>{ticket.title}</strong>
              <span>
                {ticket.customer} / {ticket.plan} / {ticket.status}
              </span>
            </button>
          );
        },
      },
      {
        accessorKey: "risk",
        header: "Risk",
        cell: ({ row }) => (
          <span className={`risk-${row.original.risk.toLowerCase()}`}>{row.original.risk}</span>
        ),
      },
    ],
    [activeTicketId, onSelect],
  );
  const table = useReactTable({
    columns,
    data: tickets,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (ticket) => ticket.id,
  });

  return (
    <div className="table-shell">
      <table className="data-table queue-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr className={row.original.id === activeTicketId ? "active" : ""} key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function AuditList({ auditEvents }: { auditEvents: AuditEvent[] }) {
  const columns = useMemo<ColumnDef<AuditEvent & { rowId: string }>[]>(
    () => [
      {
        accessorKey: "time",
        header: "Time",
      },
      {
        accessorKey: "actor",
        header: "Actor",
      },
      {
        accessorKey: "event",
        header: "Event",
      },
    ],
    [],
  );
  const data = useMemo(
    () => auditEvents.map((event, index) => ({ ...event, rowId: `${event.time}-${index}` })),
    [auditEvents],
  );
  const table = useReactTable({
    columns,
    data,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (event) => event.rowId,
  });

  return (
    <div className="table-shell">
      <table className="data-table audit-table">
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ApprovalCard({
  approval,
  onApprove,
  onReject,
}: {
  approval: Approval;
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}) {
  return (
    <div className="approval-card">
      <div className="card-row">
        <strong>{approval.id}</strong>
        <span className={`risk-${approval.risk.toLowerCase()}`}>{approval.risk}</span>
      </div>
      <h4>{approval.customer}</h4>
      <p>
        {approval.ticketId} / {approval.reason} / {approval.status}
      </p>
      <div className="composer-actions">
        <button
          className="secondary-button"
          data-testid={`approval-reject-${approval.id}`}
          onClick={() => onReject(approval.id)}
          type="button"
        >
          Reject
        </button>
        <button
          className="primary-button"
          data-testid={`approval-approve-${approval.id}`}
          onClick={() => onApprove(approval.id)}
          type="button"
        >
          Approve
        </button>
      </div>
    </div>
  );
}

export function EvalPanel({
  evals,
  onRunEvals,
}: {
  evals: EvalCase[];
  onRunEvals: () => void;
}) {
  return (
    <section className="ops-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Evaluation</p>
          <h3>Regression Suite</h3>
        </div>
        <button className="secondary-button" data-testid="run-evals-button" onClick={onRunEvals} type="button">
          Run Evals
        </button>
      </div>
      <div id="eval-list">
        {evals.map((test) => (
          <div className="eval-row" key={test.name}>
            <div>
              <strong>{test.name}</strong>
              <span>Threshold {test.threshold}%</span>
            </div>
            <meter min="0" max="100" value={test.score} />
            <b>
              {test.score}% {test.status}
            </b>
          </div>
        ))}
      </div>
    </section>
  );
}

export function GatewayPanel() {
  return (
    <section className="ops-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Telemetry</p>
          <h3>Model Gateway</h3>
        </div>
      </div>
      <div id="gateway-list">
        {gateway.map((item) => (
          <div className="gateway-card" key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}</strong>
            <p>{item.sub}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function IngestionPanel() {
  return (
    <div className="ingestion-panel">
      <h3>Ingestion Pipeline</h3>
      <div id="ingestion-steps">
        {ingestionSteps.map(([name, detail], index) => (
          <div className="pipeline-step" data-step={index + 1} key={name}>
            <strong>{name}</strong>
            <p>{detail}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PolicyPanel() {
  return (
    <section className="ops-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Policy Controls</p>
          <h3>Runtime Guardrails</h3>
        </div>
      </div>
      <div id="policy-list">
        {policies.map(([title, detail]) => (
          <label className="policy-row" key={title}>
            <input checked readOnly type="checkbox" />
            <span>
              <strong>{title}</strong>
              <p>{detail}</p>
            </span>
          </label>
        ))}
      </div>
    </section>
  );
}

export function ArchitecturePanel() {
  return (
    <section className="ops-panel">
      <div className="panel-heading">
        <div>
          <p className="eyebrow">Architecture</p>
          <h3>Intelligence Layer Contract</h3>
        </div>
      </div>
      <div className="architecture-map">
        {[
          ["Experience", "Support console, approvals, and AI assistant UX"],
          ["App API", "Tickets, accounts, entitlements, audit, workflow"],
          ["Intelligence Layer", "Context builder, tools, model gateway, guardrails"],
          ["Knowledge Layer", "Documents, vectors, metadata, access filters"],
          ["Operations", "Evals, traces, costs, feedback, regression gates"],
        ].map(([layer, detail]) => (
          <div key={layer}>
            <strong>{layer}</strong>
            <p>{detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
