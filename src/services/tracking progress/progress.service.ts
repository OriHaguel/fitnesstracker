import { httpService } from "../http.service"

export interface SetsAndWeights {
    weight: number
    reps: number
}
export interface ExerciseProgress {
    name: string
    ownerId: string
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

// updateOrCreateSets({
//     name: "brdsfuh",
//     sets: [
//         {
//             weight: 50,
//             reps: 12
//         },
//         {
//             weight: 75,
//             reps: 10
//         }
//     ]
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
