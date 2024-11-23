export interface SetsAndWeights {
    weight: number
    reps: number
}
export interface ExerciseProgress {
    _id: string
    name: string
    sets: SetsAndWeights[]
}