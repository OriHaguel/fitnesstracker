import {
    Card,
    CardContent,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Workout } from '../services/user/user.service.remote';

interface WorkoutDetailProps {
    workout: Workout;
    setWorkout: React.Dispatch<React.SetStateAction<Workout>>;
}

export function WorkoutDetail({ workout, setWorkout }: WorkoutDetailProps) {
    const workoutTypes = [
        "Strength",
        "Cardio",
        "Flexibility",
    ];

    return (
        <Card className="mb-6">
            <CardContent className="p-4 space-y-4">
                <input
                    type="text"
                    placeholder="Workout Name"
                    maxLength={22}
                    className="w-full p-2 border rounded"
                    value={workout.name}
                    onChange={(e) => setWorkout({
                        ...workout,
                        name: e.target.value
                    })}
                />
                <div className="flex gap-4">
                    <Select
                        value={workout.type}
                        onValueChange={(value) => setWorkout({
                            ...workout,
                            type: value
                        })}
                    >
                        <SelectTrigger className="w-1/2">
                            <SelectValue placeholder="Select Type" />
                        </SelectTrigger>
                        <SelectContent>
                            {workoutTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                    {type}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>
    );
}