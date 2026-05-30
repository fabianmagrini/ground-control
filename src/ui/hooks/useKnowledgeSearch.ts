import { useState } from "react";
import { knowledgeBase } from "../../domain/fixtures";

export function useKnowledgeSearch() {
  const [knowledgeQuery, setKnowledgeQuery] = useState("");

  const filteredKnowledge = knowledgeBase.filter((source) =>
    `${source.id} ${source.title} ${source.topic} ${source.body} ${source.owner}`
      .toLowerCase()
      .includes(knowledgeQuery.toLowerCase()),
  );

  return {
    knowledgeQuery,
    setKnowledgeQuery,
    filteredKnowledge,
  };
}
