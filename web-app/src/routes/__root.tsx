import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Header } from "../components/header/header";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  );
}
