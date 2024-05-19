import { PropsWithChildren } from "react";

function Header({ children }: PropsWithChildren) {
  return (
    <header className="flex justify-between border-b border-b-iron-300 bg-slate-50 px-0.5 py-2">
      {children}
    </header>
  );
}

export { Header };
