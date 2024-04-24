import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  component: () => (
    <main className="flex grow flex-col items-center justify-center">
      <p className="text-3xl text-white">404 Not Found</p>
    </main>
  ),
});
