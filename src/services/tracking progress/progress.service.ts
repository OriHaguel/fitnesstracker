import { httpService } from "../http.service"

export interface SetsAndWeights {
    weight: number
    reps: number
}
export interface ExerciseProgress {
    _id: string
    name: string
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
