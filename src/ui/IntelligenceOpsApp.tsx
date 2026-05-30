import { useAppState } from "./AppState";
import { sectionConfig } from "../domain/navigation";
import type { Section } from "../domain/types";
import { AppShell } from "./components";
import { ApprovalsSection } from "./sections/ApprovalsSection";
import { GovernanceSection } from "./sections/GovernanceSection";
import { KnowledgeSection } from "./sections/KnowledgeSection";
import { ObservabilitySection } from "./sections/ObservabilitySection";
import { SupportSection } from "./sections/SupportSection";

type Props = {
  section: Section;
};

export function IntelligenceOpsApp({ section }: Props) {
  return <RoutedConsole section={section} />;
}

function RoutedConsole({ section }: { section: Section }) {
  const { activeTicket } = useAppState();
  const config = sectionConfig[section];
  const title = section === "support" ? activeTicket.title : config.title;

  return (
    <AppShell eyebrow={config.eyebrow} section={section} title={title}>
      {section === "support" && <SupportSection />}
      {section === "approvals" && <ApprovalsSection />}
      {section === "knowledge" && <KnowledgeSection />}
      {section === "observability" && <ObservabilitySection />}
      {section === "governance" && <GovernanceSection />}
    </AppShell>
  );
}
