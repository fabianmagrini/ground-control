import { createFileRoute } from "@tanstack/react-router";
import { Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: HomeRoute,
});

function HomeRoute() {
  return <Navigate to="/support" />;
}
