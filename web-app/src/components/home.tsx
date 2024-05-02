import { generatePuzzle } from "../shared/generate_puzzle";
import { Game } from "./game/game";

function Home() {
  return <Game puzzle={generatePuzzle("Hard")} />;
}

export { Home };
