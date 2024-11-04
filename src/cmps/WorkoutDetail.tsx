import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { WorkoutDetailProps } from '../pages/workout-edit-page'

export function WorkoutDetail({ workout, setWorkout }: WorkoutDetailProps) {
    return (
        <Card className="mb-6">
            <CardContent className="p-4 space-y-4">
                <input
                    type="text"
                    placeholder="Workout Name"
                    className="w-full p-2 border rounded"
                    value={workout.name}
                    onChange={(e) => setWorkout({
                        ...workout,
                        name: e.target.value
                    })}
                />
                <div className="flex gap-4">
                    <input
                        type="text"
                        placeholder="Type"
                        className="w-1/2 p-2 border rounded"
                        value={workout.type}
                        onChange={(e) => setWorkout({
                            ...workout,
                            type: e.target.value
                        })}
                    />
                    <input
                        type="text"
                        placeholder="Duration"
                        className="w-1/2 p-2 border rounded"
                        value={workout.duration}
                        onChange={(e) => setWorkout({
                            ...workout,
                            duration: e.target.value
                        })}
                    />
                </div>
            </CardContent>
        </Card>
    )
}