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
    const [searchValue, setSearchValue] = useState("")

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
        setSearchValue(value)
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
                    className="w-[25.61rem] justify-between"
                >
                    {newExercise.name || "Select exercise..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput
                        placeholder="Search exercise..."
                        value={searchValue}
                        onValueChange={handleSearchChange}
                    />
                    <CommandList>
                        <CommandEmpty>No exercise found.</CommandEmpty>
                        <CommandGroup>
                            {exercises.map((exercise, index) => (
                                <CommandItem
                                    key={`${exercise}-${index}`}
                                    value={exercise}
                                    onSelect={(currentValue) => {
                                        setNewExercise(prev => ({
                                            ...prev,
                                            name: currentValue === newExercise.name ? "" : currentValue.toLocaleLowerCase()
                                        }))
                                        setSearchValue(currentValue === newExercise.name ? "" : currentValue)
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            newExercise.name === exercise ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {exercise}
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