import { generatePuzzle } from "../shared/generate_puzzle";
import { Game } from "./game";

function Home() {
  return (
    <main className="flex grow flex-col">
      <Game puzzle={generatePuzzle("Hard")} />
    </main>
  );
}

export { Home };
