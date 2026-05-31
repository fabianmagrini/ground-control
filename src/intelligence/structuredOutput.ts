import { z } from "zod";

export const supportCopilotStructuredOutputSchema = z.object({
  summary: z.string().min(20),
  action: z.string().min(20),
  draft: z.string().min(20),
  confidence: z.string(),
  citedSourceIds: z.array(z.string()).min(1),
  approvalRequired: z.boolean(),
});

export type SupportCopilotStructuredOutput = z.infer<
  typeof supportCopilotStructuredOutputSchema
>;

export function parseSupportCopilotOutput(output: unknown) {
  return supportCopilotStructuredOutputSchema.parse(output);
}
