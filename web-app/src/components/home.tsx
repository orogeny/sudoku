import { Game } from "./game";

function Home() {
  return (
    <main className="flex grow flex-col">
      <Game level={"Hard"} />
    </main>
  );
}

export { Home };
