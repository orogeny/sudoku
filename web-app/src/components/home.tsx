import { Game } from "./game/game";
import { generatePuzzle } from "./game/game_reducer";

function Home() {
  return <Game puzzle={generatePuzzle("Hard")} />;
}

export { Home };
