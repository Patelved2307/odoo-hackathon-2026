import { createFileRoute } from "@tanstack/react-router";
import Contact from "@/pages/Contact";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — AssetFlow AI" },
      { name: "description", content: "Request a demo of AssetFlow AI — the enterprise asset & resource management platform with an AI Copilot built in." },
      { property: "og:title", content: "Contact — AssetFlow AI" },
      { property: "og:description", content: "Book a live walkthrough with the AssetFlow AI team." },
    ],
  }),
  component: Contact,
});
