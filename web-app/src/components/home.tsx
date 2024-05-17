import { Game } from "./game/game";
import { generatePuzzle } from "@/shared/puzzle";

function Home() {
  return <Game puzzle={generatePuzzle("Medium", 0)} />;
}

export { Home };
