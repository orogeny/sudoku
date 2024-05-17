import { Outlet } from "@tanstack/react-router";
import { PlaySquare } from "lucide-react";
import { useEffect, useState } from "react";
import { DifficultySelector } from "./components/header/difficulty_selector";
import { Header } from "./components/header/header";
import { LEVELS, Level, isLevel } from "./shared/level";

function App() {
  const [level, setLevel] = useState<Level>(LEVELS[0]);

  useEffect(() => {
    console.log(`User wants to play a ${level} game`);
  }, [level]);

  const handleChange = (value: string) => {
    isLevel(value) && setLevel(value);
  };

  return (
    <div className="mx-auto flex min-w-[576px] max-w-sm flex-col gap-8 sm:min-w-[640px] xl:min-w-[1048px]">
      <div className="self-stretch">
        <Header>
          <div className="flex items-center gap-2">
            <DifficultySelector value={level} onValueChange={handleChange} />
            <PlaySquare className="h-10 w-10 text-sm" strokeWidth={1} />
          </div>
        </Header>
      </div>
      <Outlet />
    </div>
  );
}

export { App };
