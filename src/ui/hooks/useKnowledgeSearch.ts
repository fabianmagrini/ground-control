import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { knowledgeRouteDataQueryOptions } from "../../domain/routeData";

export function useKnowledgeSearch() {
  const { data: knowledgeSources } = useQuery(knowledgeRouteDataQueryOptions);
  const [knowledgeQuery, setKnowledgeQuery] = useState("");

  const filteredKnowledge = knowledgeSources.filter((source) =>
    `${source.id} ${source.title} ${source.topic} ${source.body} ${source.owner}`
      .toLowerCase()
      .includes(knowledgeQuery.toLowerCase()),
  );

  return {
    knowledgeQuery,
    setKnowledgeQuery,
    knowledgeSources,
    filteredKnowledge,
  };
}
