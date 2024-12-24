import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, ChevronDown, ChevronRight, Dumbbell, Save } from 'lucide-react';
import { useQueries, useQueryClient } from "@tanstack/react-query";
import { Workout, SavedUser } from '../services/user/user.service.remote';
import { isSameDate } from '@/services/util.service';
import { getLastSetsById, getMaxSet, SetsAndWeights, updateOrCreateSets } from "@/services/tracking progress/progress.service";

interface ExerciseWithSets {
  name: string;
  sets: Array<{
    weight: number;
    reps: number;
    date: Date;
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
  const [expandedExercise, setExpandedExercise] = useState<string | null>(null);
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
          reps: queriesReady.data[index]?.lastSet?.reps ?? ex.reps ?? 0,
          date: new Date()
        })
      }));
      setExercises(initialExercises);

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
        <Card className="bg-gray-50">
          <CardContent className="flex flex-col items-center justify-center p-12">
            <Dumbbell className="w-12 h-12 text-blue-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Workout Today</h2>
            <p className="text-gray-600 text-center">Time for a well-deserved rest day or schedule your next workout.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 font-medium">Loading your workout...</p>
        </div>
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
      <Card className="bg-white shadow-sm mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <Dumbbell className="w-6 h-6 text-blue-500" />
              <h1 className="text-2xl font-bold text-gray-900">{currentWorkout.name}</h1>
            </div>
            {saveStatus === 'saved' && (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="w-5 h-5" />
                <span className="text-sm font-medium">Saved</span>
              </div>
            )}
          </div>
          <div className="text-sm text-gray-500">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>
        </CardContent>
      </Card>

      {saveStatus === 'error' && (
        <Alert variant="destructive" className="mb-4">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        {exercises.map((exercise, exerciseIndex) => (
          <Card
            key={exercise.name}
            className={`transition-all duration-200 hover:shadow-md
              ${expandedExercise === exercise.name ? 'ring-2 ring-blue-500/20' : ''}`}
          >
            <CardHeader
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => setExpandedExercise(
                expandedExercise === exercise.name ? null : exercise.name
              )}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <CardTitle className="text-lg font-semibold">{exercise.name}</CardTitle>
                  <span className="px-2 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
                    {exercise.sets.length} sets
                  </span>
                </div>
                {expandedExercise === exercise.name ?
                  <ChevronDown className="w-5 h-5 text-gray-400" /> :
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                }
              </div>
            </CardHeader>

            {expandedExercise === exercise.name && (
              <CardContent className="pt-2">
                <div className="space-y-4">
                  <div className="grid grid-cols-8 gap-4 text-sm font-medium text-gray-500">
                    <div className="col-span-1">Set</div>
                    <div className="col-span-3">Weight (kg)</div>
                    <div className="col-span-3">Reps</div>
                  </div>

                  {exercise.sets.map((set, setIndex) => (
                    <div key={setIndex} className="grid grid-cols-8 gap-4 items-center">
                      <div className="col-span-1">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-50 text-blue-600 text-sm font-medium">
                          {setIndex + 1}
                        </span>
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          value={inputValues[`${exercise.name}-${setIndex}-weight`] || ''}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'weight', e.target.value)}
                          className="w-full focus:ring-blue-500"
                          min="0"
                          step="0.5"
                        />
                      </div>
                      <div className="col-span-3">
                        <Input
                          type="number"
                          value={inputValues[`${exercise.name}-${setIndex}-reps`] || ''}
                          onChange={(e) => updateSet(exerciseIndex, setIndex, 'reps', e.target.value)}
                          className="w-full focus:ring-blue-500"
                          min="0"
                          step="1"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            )}
          </Card>
        ))}

        <Button
          onClick={handleSaveWorkout}
          className="finish-workout w-full h-12 text-lg font-medium bg-blue-500 hover:bg-blue-600"
          disabled={saveStatus === 'saving'}
        >
          {saveStatus === 'saving' ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Saving workout...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Save className="w-5 h-5" />
              Finish Workout
            </div>
          )}
        </Button>
      </div>
    </div>
  );
};

export default WorkoutTrackingPage;