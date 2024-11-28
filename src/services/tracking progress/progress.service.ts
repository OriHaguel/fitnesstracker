import { httpService } from "../http.service"

export interface SetsAndWeights {
    weight: number
    reps: number
}
export interface ExerciseProgress {
    name: string
    ownerId?: string
    sets: SetsAndWeights[]
}

export async function getLastSetsById(exerciseId: string) {
    try {
        const sets = await httpService.get(`progress/${exerciseId}`)
        return sets

    } catch (error) {
        console.log("🚀 ~ getLastSetsById ~ error:", error)

    }
}



export function getMaxSet(data: { sets: SetsAndWeights[] }): SetsAndWeights {
    const { sets } = data;

    // Sort the sets by weight descending and reps descending if weights are the same
    sets.sort((a, b) => b.weight - a.weight || b.reps - a.reps);

    // Return the first set after sorting
    return sets[0];
}

// Example usage
// const result: SetsAndWeights = getMaxSet({
//     sets: [
//         { weight: 80, reps: 1 },
//         { weight: 75, reps: 15 },
//         { weight: 75, reps: 12 }
//     ]
// });


// updateOrCreateSets({
//     name: "bo way",
//     sets: [result]
// })
async function updateSets(exercise: ExerciseProgress) {
    try {
        const sets = await httpService.put(`progress`, exercise)
        return sets
    } catch (error) {
        console.log("🚀 ~ updateSets ~ error:", error)
        // Return null or a specific response indicating failure
        return null
    }
}

async function createSets(exercise: ExerciseProgress) {
    try {
        const sets = await httpService.post(`progress/new`, exercise)
        return sets
    } catch (error) {
        console.log("🚀 ~ createSets ~ error:", error)
        // Handle the failure appropriately (could throw or return null)
        throw error
    }
}

export async function updateOrCreateSets(exercise: ExerciseProgress) {
    const sets = await updateSets(exercise)
    if (!sets) {
        // If update failed, try creating
        return createSets(exercise)
    }
    return sets
}
