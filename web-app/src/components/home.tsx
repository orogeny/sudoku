// import { generatePuzzle } from "../shared/generate_puzzle";
import { generatePuzzle } from "./game/game_reducer";
import { Game } from "./game/game";

function Home() {
  return <Game puzzle={generatePuzzle("Hard")} />;
}

export { Home };
