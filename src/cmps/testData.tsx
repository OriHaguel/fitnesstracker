import * as React from "react"
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
import frameworks from '../../data/exersice.json'

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
    console.log("🚀 ~ ComboboxDemo ~ newExercise:", newExercise)
    const [open, setOpen] = React.useState(false)
    const [value, setValue] = React.useState("")

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-[200px] justify-between"
                >
                    {value
                        ? frameworks.find((framework) => framework.name === value)?.name
                        : "Select exercise..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search exercise..." />
                    <CommandList>
                        <CommandEmpty>No exercise found.</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((framework) => (
                                <CommandItem
                                    key={framework.name}
                                    value={framework.name}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
                                        setNewExercise(prev => ({
                                            ...prev,
                                            name: currentValue === value ? "" : currentValue
                                        }))
                                        setOpen(false)
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === framework.name ? "opacity-100" : "opacity-0"
                                        )}
                                    />
                                    {framework.name}
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