import { createFileRoute } from "@tanstack/react-router";
import AssetPassport from "@/pages/AssetPassport";
export const Route = createFileRoute("/assets/passport/$id")({ component: AssetPassport });
