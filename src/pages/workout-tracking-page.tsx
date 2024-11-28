import { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dumbbell } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Workout, SavedUser } from '../services/user/user.service.remote';
import { isSameDate } from '@/services/util.service';
import { getLastSetsById, getMaxSet, SetsAndWeights, updateOrCreateSets } from "@/services/tracking progress/progress.service"
import { useQueries, useQueryClient } from "@tanstack/react-query"

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
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({});
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [initialized, setInitialized] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    const todaysWorkout = user.workouts?.find(workout =>
      workout.date && isSameDate(new Date(workout.date))
    );
    setCurrentWorkout(todaysWorkout || null);
  }, [user.workouts]);

  const exerciseQueries = useQueries({
    queries: currentWorkout?.exercise?.map(ex => ({
      queryKey: ['sets', ex.name],
      queryFn: () => getLastSetsById(ex.name),
      enabled: !!ex.name,
    })) || []
  });

  const queriesReady = useMemo(() => ({
    isSuccess: exerciseQueries.every(q => q.isSuccess),
    data: exerciseQueries.map(q => q.data)
  }), [exerciseQueries]);

  useEffect(() => {
    if (currentWorkout?.exercise && queriesReady.isSuccess && !initialized) {
      const initialExercises = currentWorkout.exercise.map((ex, index) => ({
        name: ex.name,
        sets: Array(ex.sets || 1).fill({
          weight: queriesReady.data[index]?.lastSet?.weight ?? ex.weight ?? 0,
          reps: queriesReady.data[index]?.lastSet?.reps ?? ex.reps ?? 0
        })
      }));
      setExercises(initialExercises);

      // Initialize input values
      const initialInputValues: { [key: string]: string } = {};
      initialExercises.forEach((exercise, exerciseIndex) => {
        exercise.sets.forEach((set, setIndex) => {
          initialInputValues[`${exercise.name}-${setIndex}-weight`] = set.weight.toString();
          initialInputValues[`${exercise.name}-${setIndex}-reps`] = set.reps.toString();
        });
      });
      setInputValues(initialInputValues);
      setInitialized(true);
    }
  }, [currentWorkout, queriesReady.isSuccess, initialized]);

  const isLoading = !exercises.length || exerciseQueries.some(query => query.isLoading);
  const isError = exerciseQueries.some(query => query.isError);

  const updateSet = (exerciseIndex: number, setIndex: number, field: 'weight' | 'reps', value: string): void => {
    const exercise = exercises[exerciseIndex];
    const inputKey = `${exercise.name}-${setIndex}-${field}`;

    setInputValues(prev => ({
      ...prev,
      [inputKey]: value
    }));

    const numericValue = value === '' ? 0 : Number(value);

    setExercises(prev => {
      const newExercises = [...prev];
      newExercises[exerciseIndex].sets[setIndex] = {
        ...newExercises[exerciseIndex].sets[setIndex],
        [field]: numericValue
      };
      return newExercises;
    });
  };

  const handleSaveWorkout = async (): Promise<void> => {
    if (!currentWorkout) return;

    try {
      setSaveStatus('saving');
      const promises = exercises.map(async exercise => {
        const result: SetsAndWeights = getMaxSet({ sets: exercise.sets });
        await updateOrCreateSets({ name: exercise.name, sets: [result] });
        await queryClient.invalidateQueries({ queryKey: ['sets', exercise.name] });
      });

      await Promise.all(promises);
      setSaveStatus('saved');
      setInitialized(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-4 max-w-3xl">
        <Alert variant="destructive">
          <AlertDescription>Failed to load previous exercise data.</AlertDescription>
        </Alert>
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
                        value={inputValues[`${exercise.name}-${setIndex}-weight`] || ''}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                        className="w-full"
                        min="0"
                        step="0.5"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        value={inputValues[`${exercise.name}-${setIndex}-reps`] || ''}
                        onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
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