import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Workout, SavedUser, Exercise } from '../services/user/user.service.remote';
import { isSameDate } from '@/services/util.service';
import { editExercise } from '@/store/actions/user.actions';

interface ExerciseWithSets {
  name: string;
  sets: Array<{
    weight: number;
    reps: number;
  }>;
}

interface RootState {
  userModule: {
    user: SavedUser;
  };
}

export const WorkoutTrackingPage: React.FC = () => {
  const user = useSelector((state: RootState) => state.userModule.user);
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  const [exercises, setExercises] = useState<ExerciseWithSets[]>([]);
  console.log("🚀 ~ exercises:", exercises)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const todaysWorkout = user.workouts.find(workout =>
      workout.date && isSameDate(new Date(workout.date))
    );
    setCurrentWorkout(todaysWorkout || null);
  }, [user.workouts]);

  useEffect(() => {
    if (currentWorkout?.exercise) {
      const initialExercises = currentWorkout.exercise.map(ex => ({
        name: ex.name,
        sets: Array(ex.sets || 1).fill({
          weight: ex.weight || 0,
          reps: ex.reps || 0
        })
      }));
      setExercises(initialExercises);
    }
  }, [currentWorkout]);

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

  const handleSaveWorkout = async (): Promise<void> => {
    if (!currentWorkout) return;

    try {
      setSaveStatus('saving');

      const savedExercises: Exercise[] = exercises.map(ex => ({
        name: ex.name,
        sets: ex.sets.length,
        weight: ex.sets[ex.sets.length - 1].weight,
        reps: ex.sets[ex.sets.length - 1].reps
      }));

      const updatedWorkout: Workout = {
        ...currentWorkout,
        exercise: savedExercises
      };

      // TODO: Replace with API call
      // const response = await userService.updateWorkout(updatedWorkout);

      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (error) {
      setSaveStatus('error');
      setErrorMessage(error instanceof Error ? error.message : 'Failed to save workout');
    }
  };

  if (!currentWorkout) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Alert>
          <AlertDescription>No workout scheduled for today.</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!exercises.length) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 max-w-3xl">
      <div className="flex items-center gap-2 mb-6">
        <Dumbbell className="h-6 w-6" />
        <h1 className="text-2xl font-bold">{currentWorkout.name}</h1>
      </div>

      {saveStatus === 'error' && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      {saveStatus === 'saved' && (
        <Alert className="mb-4">
          <AlertDescription>Workout saved successfully!</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        {exercises.map((exercise, exerciseIndex) => (
          <Card key={exercise.name} className="relative">
            <CardHeader className="flex flex-row items-center justify-between">
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
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', Number(e.target.value))}
                        className="w-full"
                        min="0"
                        step="0.5"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={set.reps || ''}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', Number(e.target.value))}
                        className="w-full"
                        min="0"
                        step="1"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          onClick={handleSaveWorkout}
          className="w-full"
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Finish Workout'}
        </Button>
      </div>
    </div>
  );
};