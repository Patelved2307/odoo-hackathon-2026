import { createFileRoute } from "@tanstack/react-router";
import AI from "@/pages/AICopilotOverview";

export const Route = createFileRoute("/ai")({
  head: () => ({
    meta: [
      { title: "AI Copilot — AssetFlow AI" },
      { name: "description", content: "Natural-language querying, predictive maintenance, Health Score, and intelligent business insights — computed live against your data." },
      { property: "og:title", content: "AI Copilot — AssetFlow AI" },
      { property: "og:description", content: "The AI layer that turns your asset registry into a conversation." },
    ],
  }),
  component: AI,
});
