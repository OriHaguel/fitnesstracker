import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { getExerciseByName } from "@/services/tracking progress/progress.service"
import { useEffect, useState } from "react"

interface ComboboxDemoProps {
    newExercise: {
        name: string;
        sets?: number;
        reps?: number;
        weight?: number;
        muscleGroup?: string;
    };
    setNewExercise: React.Dispatch<React.SetStateAction<{
        name: string;
        sets: number;
        reps: number;
        weight: number;
        muscleGroup?: string;
    }>>;
}

export function ComboboxDemo({ newExercise, setNewExercise }: ComboboxDemoProps) {
    const [open, setOpen] = useState(false)
    const [exercises, setExercises] = useState<string[]>([])

    async function getExerciseNames(): Promise<string[] | undefined> {
        try {
            if (!newExercise.muscleGroup) return
            return await getExerciseByName(newExercise?.muscleGroup)
        } catch (error) {
            console.log("🚀 ~ getExerciseNames ~ error:", error)
        }
    }

    useEffect(() => {
        async function loadExercises() {
            try {
                if (!newExercise.muscleGroup) return
                const names = await getExerciseNames()
                if (names) {
                    setExercises(names)
                }
            } catch (error) {
                console.error("Error loading exercises:", error)
            }
        }

        loadExercises()
    }, [newExercise.muscleGroup])

    const handleSearchChange = (value: string) => {
        setNewExercise(prev => ({
            ...prev,
            name: value.toLocaleLowerCase()
        }))
    }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    <span className="truncate flex-1 text-left">
                        {newExercise.name || "Select exercise..."}
                    </span>
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <div className="flex w-full items-center border-b">
                        <CommandInput
                            className="flex-1"
                            placeholder="Search exercise..."
                            value={newExercise.name}
                            onValueChange={handleSearchChange}
                        />
                    </div>
                    <CommandList>
                        <CommandEmpty>No exercise found.</CommandEmpty>
                        <CommandGroup>
                            {exercises.map((exercise, index) => (
                                <CommandItem
                                    key={`${exercise}-${index}`}
                                    value={exercise}
                                    className="flex items-center"
                                    onSelect={(currentValue) => {
                                        setNewExercise(prev => ({
                                            ...prev,
                                            name: currentValue === newExercise.name ? "" : currentValue.toLocaleLowerCase()
                                        }))
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4 shrink-0",
                                            newExercise.name === exercise ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    <span>{exercise}</span>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default ComboboxDemo