import { Outlet, createRootRoute } from "@tanstack/react-router";
import { Header } from "../components/header/header";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <div className="container mx-auto flex min-w-[576px] flex-col gap-8 sm:max-w-screen-sm xl:max-w-[1048px]">
      <div className="self-stretch">
        <Header></Header>
      </div>
      <Outlet />
    </div>
  );
}
