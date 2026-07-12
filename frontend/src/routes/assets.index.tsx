import { createFileRoute } from "@tanstack/react-router";
import AssetDirectory from "@/pages/AssetDirectory";
export const Route = createFileRoute("/assets/")({ component: AssetDirectory });
