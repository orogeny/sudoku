import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LEVELS, Level } from "@/shared/level";

type DifficultySelectorProps = {
  value: Level;
  onValueChange: (value: Level) => void;
};

function DifficultySelector({ value, onValueChange }: DifficultySelectorProps) {
  return (
    <label className="flex w-52 items-center justify-between gap-2">
      Difficulty:
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="">
          <SelectValue placeholder="select a difficulty" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Difficulty</SelectLabel>
            {LEVELS.map((level) => (
              <SelectItem key={level} value={level}>
                {level}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </label>
  );
}

export { DifficultySelector };
