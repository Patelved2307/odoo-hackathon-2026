import { createFileRoute } from "@tanstack/react-router";
import Features from "@/pages/Features";

export const Route = createFileRoute("/features")({
  head: () => ({
    meta: [
      { title: "Features — AssetFlow AI" },
      { name: "description", content: "Explore every module: dashboard, asset directory, allocation, booking, maintenance, audit, AI Copilot, reports and more." },
      { property: "og:title", content: "Features — AssetFlow AI" },
      { property: "og:description", content: "Eleven core modules for enterprise asset & resource management." },
    ],
  }),
  component: Features,
});
