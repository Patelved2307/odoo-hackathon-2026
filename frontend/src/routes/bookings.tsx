import { createFileRoute } from "@tanstack/react-router";
import Bookings from "@/pages/Bookings";
export const Route = createFileRoute("/bookings")({ component: Bookings });
