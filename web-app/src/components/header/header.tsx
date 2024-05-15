import { PropsWithChildren } from "react";

function Header({ children }: PropsWithChildren) {
  return (
    <header className="border-b-iron-300 flex border-b bg-slate-50">
      {children}
    </header>
  );
}

export { Header };
