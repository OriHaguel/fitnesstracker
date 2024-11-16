import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';
import { Exercise, Workout } from '../services/user/user.service.remote'


interface ExerciseWithSets extends Omit<Exercise, 'sets'> {
  sets: Array<{
    weight: number;
    reps: number;
  }>;
}

// Demo data based on the provided interfaces
const demoWorkout: Workout = {
  name: "Upper Body Strength",
  type: "Strength",
  exercise: [
    {
      name: "Bench Press",
      sets: 2,
      weight: 135,
      reps: 8
    },
    {
      name: "Overhead Press",
      sets: 4,
      weight: 95,
      reps: 10
    },
    {
      name: "Barbell Row",
      sets: 3,
      weight: 115,
      reps: 12
    }
  ]
};

export const WorkoutTrackingPage: React.FC = () => {
  // State to track exercise data
  const [exercises, setExercises] = useState<ExerciseWithSets[]>(
    demoWorkout.exercise.map(ex => ({
      name: ex.name,
      sets: Array(ex.sets).fill({ weight: ex.weight || 0, reps: ex.reps || 0 })
    }))
  );

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: number): void => {
    setExercises(prev => {
      const newExercises = [...prev];
      newExercises[exerciseIndex].sets[setIndex] = {
        ...newExercises[exerciseIndex].sets[setIndex],
        [field]: value
      };
      return newExercises;
    });
  };

  const handleSaveWorkout = (): void => {
    // TODO: Implement save functionality
    console.log('Saving workout:', exercises);
  };

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Dumbbell className="h-6 w-6" />
        <h1 className="text-2xl font-bold">{demoWorkout.name}</h1>
      </div>

      <div className="space-y-6">
        {exercises.map((exercise, exerciseIndex) => (
          <Card key={exercise.name} className="relative">
            <CardHeader>
              <CardTitle>{exercise.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-8 gap-4 font-medium text-sm text-gray-500">
                  <div className="col-span-1">Set</div>
                  <div className="col-span-3">Weight (kg)</div>
                  <div className="col-span-3">Reps</div>
                </div>

                {exercise.sets.map((set, setIndex) => (
                  <div key={setIndex} className="grid grid-cols-8 gap-4 items-center">
                    <div className="col-span-1 text-sm font-medium">
                      {setIndex + 1}
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={set.weight || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateSet(exerciseIndex, setIndex, 'weight', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={set.reps || ''}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                          updateSet(exerciseIndex, setIndex, 'reps', Number(e.target.value))}
                        className="w-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button onClick={handleSaveWorkout} className="w-full">
          Finish Workout
        </Button>
      </div>
    </div>
  );
};

