"use client"

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

// const frameworks = [
//     {
//         value: "next.js",
//         label: "Next.js",
//     },
//     {
//         value: "sveltekit",
//         label: "SvelteKit",
//     },
//     {
//         value: "nuxt.js",
//         label: "Nuxt.js",
//     },
//     {
//         value: "remix",
//         label: "Remix",
//     },
//     {
//         value: "astro",
//         label: "Astro",
//     },
// ]

// const frameworks = [
//     {
//         name: "3/4 Sit-Up",
//         force: "pull",
//         level: "beginner",
//         mechanic: "compound",
//         equipment: "body only",
//         primaryMuscles: ["abdominals"],
//         secondaryMuscles: [],
//         instructions: [
//             "Lie down on the floor and secure your feet. Your legs should be bent at the knees.",
//             "Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position.",
//             "Flex your hips and spine to raise your torso toward your knees.",
//             "At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only ¾ of the way down.",
//             "Repeat for the recommended amount of repetitions."
//         ],
//         category: "strength",
//         images: [
//             "3_4_Sit-Up/0.jpg",
//             "3_4_Sit-Up/1.jpg"
//         ],
//         id: "3_4_Sit-Up"
//     },
//     {
//         name: "90/90 Hamstring",
//         force: "push",
//         level: "beginner",
//         mechanic: null,
//         equipment: "body only",
//         primaryMuscles: ["hamstrings"],
//         secondaryMuscles: ["calves"],
//         instructions: [
//             "Lie on your back, with one leg extended straight out.",
//             "With the other leg, bend the hip and knee to 90 degrees. You may brace your leg with your hands if necessary. This will be your starting position.",
//             "Extend your leg straight into the air, pausing briefly at the top. Return the leg to the starting position.",
//             "Repeat for 10-20 repetitions, and then switch to the other leg."
//         ],
//         category: "stretching",
//         images: [
//             "90_90_Hamstring/0.jpg",
//             "90_90_Hamstring/1.jpg"
//         ],
//         id: "90_90_Hamstring"
//     },
//     {
//         name: "Ab Crunch Machine",
//         force: "pull",
//         level: "intermediate",
//         mechanic: "isolation",
//         equipment: "machine",
//         primaryMuscles: ["abdominals"],
//         secondaryMuscles: [],
//         instructions: [
//             "Select a light resistance and sit down on the ab machine placing your feet under the pads provided and grabbing the top handles. Your arms should be bent at a 90 degree angle as you rest the triceps on the pads provided. This will be your starting position.",
//             "At the same time, begin to lift the legs up as you crunch your upper torso. Breathe out as you perform this movement. Tip: Be sure to use a slow and controlled motion. Concentrate on using your abs to move the weight while relaxing your legs and feet.",
//             "After a second pause, slowly return to the starting position as you breathe in.",
//             "Repeat the movement for the prescribed amount of repetitions."
//         ],
//         category: "strength",
//         images: [
//             "Ab_Crunch_Machine/0.jpg",
//             "Ab_Crunch_Machine/1.jpg"
//         ],
//         id: "Ab_Crunch_Machine"
//     }
// ];

export function ComboboxDemo() {
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
                        : "Select framework..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." />
                    <CommandList>
                        <CommandEmpty>No framework found.</CommandEmpty>
                        <CommandGroup>
                            {frameworks.map((framework) => (
                                // {frameworks.filter(item => item.primaryMuscles[0] === 'abdominals').map((framework) => (
                                <CommandItem
                                    key={framework.name}
                                    value={framework.name}
                                    onSelect={(currentValue) => {
                                        setValue(currentValue === value ? "" : currentValue)
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
