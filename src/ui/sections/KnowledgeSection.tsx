import { IngestionPanel } from "../components";
import { useAppState } from "../AppState";

export function KnowledgeSection() {
  const state = useAppState();
  return (
    <section className="section-view active">
      <div className="section-band">
        <div>
          <p className="eyebrow">Knowledge Operations</p>
          <h3>Sources, Freshness, and Access</h3>
        </div>
        <input
          aria-label="Search knowledge base"
          placeholder="Search knowledge base"
          type="search"
          value={state.knowledgeQuery}
          onChange={(event) => state.setKnowledgeQuery(event.target.value)}
        />
      </div>
      <div className="knowledge-layout">
        <div className="knowledge-list">
          {state.filteredKnowledge.map((doc) => (
            <div className="knowledge-card" key={doc.id}>
              <div className="card-row">
                <strong>
                  {doc.id}: {doc.title}
                </strong>
                <span>{doc.freshness}</span>
              </div>
              <p>
                {doc.topic} / {doc.access} / Owner: {doc.owner}
              </p>
              <p>{doc.body}</p>
            </div>
          ))}
        </div>
        <IngestionPanel />
      </div>
    </section>
  );
}
