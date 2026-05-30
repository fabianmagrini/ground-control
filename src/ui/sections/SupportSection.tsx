import { AccountCard, AuditList, MetricRow, OutputBlock, ToolList } from "../components";
import { useAppState } from "../AppState";

export function SupportSection() {
  const state = useAppState();
  const activeTicket = state.activeTicket;

  return (
    <section className="section-view active">
      <MetricRow metrics={state.metrics} />
      <div className="support-layout">
        <section className="queue-panel" aria-label="Ticket queue">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Queue</p>
              <h3>Priority Work</h3>
            </div>
            <select
              aria-label="Filter queue"
              value={state.queueFilter}
              onChange={(event) => state.setQueueFilter(event.target.value)}
            >
              <option value="all">All tickets</option>
              <option value="P1">P1 only</option>
              <option value="Enterprise">Enterprise</option>
              <option value="Pending customer">Pending customer</option>
            </select>
          </div>
          <div className="ticket-list">
            {state.filteredTickets.map((ticket) => (
              <button
                className={`ticket-card ${ticket.id === activeTicket.id ? "active" : ""}`}
                key={ticket.id}
                onClick={() => state.selectTicket(ticket.id)}
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
            ))}
          </div>
        </section>

        <article className="ticket-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Ticket</p>
              <h3>{activeTicket.customer}</h3>
            </div>
            <span className="status-pill">{activeTicket.status}</span>
          </div>

          <div className="metadata-grid">
            {[
              ["Priority", activeTicket.priority],
              ["Plan", activeTicket.plan],
              ["SLA", activeTicket.sla],
              ["ARR", activeTicket.arr],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="risk-strip">
            {[
              ["Health", `${activeTicket.health}/100`],
              ["Sentiment", activeTicket.sentiment],
              ["Impact", activeTicket.impact],
              ["Region", activeTicket.region],
              ["Risk", activeTicket.risk],
            ].map(([label, value]) => (
              <div key={label}>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
            ))}
          </div>

          <div className="message-thread">
            {activeTicket.messages.map((message) => (
              <div className={`message ${message.role}`} key={`${message.time}-${message.sender}`}>
                <div className="message-header">
                  <span>{message.sender}</span>
                  <span>{message.time}</span>
                </div>
                <p>{message.text}</p>
              </div>
            ))}
          </div>

          <div className="composer">
            <textarea
              aria-label="Draft reply"
              rows={7}
              value={state.reply}
              onChange={(event) => state.setReply(event.target.value)}
            />
            <div className="composer-actions">
              <button className="secondary-button" onClick={state.insertDraft} type="button">
                Insert Draft
              </button>
              <button className="danger-button" onClick={state.escalateTicket} type="button">
                Escalate
              </button>
              <button className="primary-button" onClick={state.approveReply} type="button">
                Approve Reply
              </button>
            </div>
          </div>
        </article>

        <section className="copilot-panel" aria-label="Copilot output">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">Copilot</p>
              <h3>Assistance</h3>
            </div>
            <span className="confidence">{state.confidence}</span>
          </div>
          <div className="ai-output">
            <OutputBlock title="Summary" action="Refresh" onClick={state.refreshSummary}>
              {state.summary}
            </OutputBlock>
            <OutputBlock title="Suggested Action" action="Check" onClick={state.refreshAction}>
              {state.action}
            </OutputBlock>
            <div className="output-block">
              <div className="block-title">
                <span>Relevant Sources</span>
                <button className="tiny-button" onClick={state.retrieveForActiveTicket} type="button">
                  Retrieve
                </button>
              </div>
              <div className="source-list">
                {state.sources.length === 0 ? (
                  <p className="muted">No sources retrieved yet.</p>
                ) : (
                  state.sources.map((source) => (
                    <div className="source-card" key={source.id}>
                      <strong>
                        {source.id}: {source.title}
                      </strong>
                      <span className="source-score">
                        Match {source.score} / {source.access}
                      </span>
                      <p>{source.body}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
            <OutputBlock
              title="Draft Reply"
              action="Draft"
              onClick={state.draftForActiveTicket}
            >
              {state.draft}
            </OutputBlock>
          </div>
        </section>

        <section className="system-panel" aria-label="Intelligence layer operations">
          <div className="tabs" role="tablist" aria-label="System views">
            {(["trace", "account", "tools", "audit"] as const).map((name) => (
              <button
                className={`tab ${state.tab === name ? "active" : ""}`}
                key={name}
                onClick={() => state.setTab(name)}
                type="button"
              >
                {name[0].toUpperCase() + name.slice(1)}
              </button>
            ))}
          </div>
          <div className={`tab-panel ${state.tab === "trace" ? "active" : ""}`}>
            <div className="layer-stack">
              {state.trace.map((step, index) => (
                <div className="layer-card" data-step={index + 1} key={`${step.title}-${index}`}>
                  <strong>{step.title}</strong>
                  <p>{step.body}</p>
                </div>
              ))}
            </div>
          </div>
          <div className={`tab-panel ${state.tab === "account" ? "active" : ""}`}>
            <AccountCard ticket={activeTicket} />
          </div>
          <div className={`tab-panel ${state.tab === "tools" ? "active" : ""}`}>
            <ToolList />
          </div>
          <div className={`tab-panel ${state.tab === "audit" ? "active" : ""}`}>
            <AuditList auditEvents={state.auditEvents} />
          </div>
        </section>
      </div>
    </section>
  );
}
