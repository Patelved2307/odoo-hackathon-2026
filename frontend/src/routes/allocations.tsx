import { createFileRoute } from "@tanstack/react-router";
import Allocations from "@/pages/Allocations";
export const Route = createFileRoute("/allocations")({ component: Allocations });
