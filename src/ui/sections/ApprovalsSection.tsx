import { ApprovalCard } from "../components";
import { useAppState } from "../AppState";

export function ApprovalsSection() {
  const state = useAppState();
  return (
    <section className="section-view active">
      <div className="section-band">
        <div>
          <p className="eyebrow">Human Review</p>
          <h3>Approval Queue</h3>
        </div>
        <button
          className="primary-button"
          data-testid="bulk-approve-low-risk-button"
          onClick={state.bulkApproveLowRisk}
          type="button"
        >
          Approve Low Risk
        </button>
      </div>
      <div className="approval-grid">
        {state.approvals.map((approval) => (
          <ApprovalCard
            approval={approval}
            key={approval.id}
            onApprove={state.approveItem}
            onReject={state.rejectItem}
          />
        ))}
      </div>
    </section>
  );
}
