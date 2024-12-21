import { useState } from 'react';
import { Check, ChevronsUpDown, Dumbbell, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Exercise {
  name: string;
  force: string | null;
  level: string;
  mechanic: string | null;
  equipment: string | null;
  primaryMuscles: string[];
  secondaryMuscles: string[];
  instructions: string[];
  category: string;
  images: string[];
  id: string;
}

interface ComboboxProps {
  exercises: Exercise[];  // Remove optional modifier
  onExerciseSelect: (exerciseName: string) => void;
  value: string;
}

function ExerciseCombobox({ exercises, onExerciseSelect, value }: ComboboxProps) {
  const [open, setOpen] = useState(false);

  // Ensure exercises is always an array
  const safeExercises = Array.isArray(exercises) ? exercises : [];

  // Find selected exercise safely
  const selectedExercise = safeExercises.find((exercise) => exercise.name === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedExercise?.name || "Select exercise..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search exercises..." />
          <CommandEmpty>No exercise found.</CommandEmpty>
          <CommandGroup className="max-h-[300px] overflow-y-auto">
            {safeExercises.map((exercise) => (
              <CommandItem
                key={exercise.id || exercise.name}
                value={exercise.name}
                onSelect={(currentValue) => {
                  onExerciseSelect(currentValue);
                  setOpen(false);
                }}
                className="flex flex-col items-start py-3"
              >
                {/* <div className="flex w-full items-center gap-2">
                  <Check
                    className={cn(
                      "h-4 w-4",
                      value === exercise.name ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{exercise.name}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Target className="h-3 w-3" />
                        {exercise.primaryMuscles?.join(', ') || 'No muscles specified'}
                      </div>
                      {exercise.equipment && (
                        <div className="flex items-center gap-1">
                          <Dumbbell className="h-3 w-3" />
                          {exercise.equipment}
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default ExerciseCombobox;