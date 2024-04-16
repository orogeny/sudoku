import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/$")({
  component: () => (
    <main className="grow flex flex-col justify-center items-center">
      <p className="text-white text-3xl">404 Not Found</p>
    </main>
  ),
});
