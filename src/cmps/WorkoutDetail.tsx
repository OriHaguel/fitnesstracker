import {
    Card,
    CardContent,
} from "@/components/ui/card";
import { Workout } from '../services/user/user.service.remote';
interface WorkoutDetailProps {
    workout: Workout;
    setWorkout: React.Dispatch<React.SetStateAction<Workout>>;
}
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
                </div>
            </CardContent>
        </Card>
    )
}