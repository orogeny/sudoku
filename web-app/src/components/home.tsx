import { Game } from "./game";

function Home() {
  return (
    <main className="flex grow flex-col items-center justify-center">
      <Game level={"Medium"} />
    </main>
  );
}

export { Home };
