import { ArchitecturePanel, PolicyPanel } from "../components";

export function GovernanceSection() {
  return (
    <section className="section-view active">
      <div className="governance-grid">
        <PolicyPanel />
        <ArchitecturePanel />
      </div>
    </section>
  );
}
