import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Calculator, ArrowRight, Save } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WorkoutDetail } from '@/cmps/WorkoutDetail';
import { useSelector } from 'react-redux';
import { Exercise, Workout } from '../services/user/user.service.remote';
import { editExercise, createWorkout, deleteExercise } from '@/store/actions/user.actions';
// import ExerciseCombobox from '@/cmps/workout-edit';

import data from '../../data/exersice.json'
import ExerciseCombobox from '@/cmps/workout-edit';
import { ComboboxDemo } from '@/cmps/testData';
// console.log(data.filter(item => item.level.includes('beginner') && item.primaryMuscles.includes('biceps')))

export interface RootState {
  userModule: {
    user: {
      workouts: Workout[];
    };
  };
}

const actualData = [
  {
    name: "3/4 Sit-Up",
    force: "pull",
    level: "beginner",
    mechanic: "compound",
    equipment: "body only",
    primaryMuscles: ["abdominals"],
    secondaryMuscles: [],
    instructions: [
      "Lie down on the floor and secure your feet. Your legs should be bent at the knees.",
      "Place your hands behind or to the side of your head. You will begin with your back on the ground. This will be your starting position.",
      "Flex your hips and spine to raise your torso toward your knees.",
      "At the top of the contraction your torso should be perpendicular to the ground. Reverse the motion, going only ¾ of the way down.",
      "Repeat for the recommended amount of repetitions."
    ],
    category: "strength",
    images: [
      "3_4_Sit-Up/0.jpg",
      "3_4_Sit-Up/1.jpg"
    ],
    id: "3_4_Sit-Up"
  },
  {
    name: "90/90 Hamstring",
    force: "push",
    level: "beginner",
    mechanic: null,
    equipment: "body only",
    primaryMuscles: ["hamstrings"],
    secondaryMuscles: ["calves"],
    instructions: [
      "Lie on your back, with one leg extended straight out.",
      "With the other leg, bend the hip and knee to 90 degrees. You may brace your leg with your hands if necessary. This will be your starting position.",
      "Extend your leg straight into the air, pausing briefly at the top. Return the leg to the starting position.",
      "Repeat for 10-20 repetitions, and then switch to the other leg."
    ],
    category: "stretching",
    images: [
      "90_90_Hamstring/0.jpg",
      "90_90_Hamstring/1.jpg"
    ],
    id: "90_90_Hamstring"
  },
  {
    name: "Ab Crunch Machine",
    force: "pull",
    level: "intermediate",
    mechanic: "isolation",
    equipment: "machine",
    primaryMuscles: ["abdominals"],
    secondaryMuscles: [],
    instructions: [
      "Select a light resistance and sit down on the ab machine placing your feet under the pads provided and grabbing the top handles. Your arms should be bent at a 90 degree angle as you rest the triceps on the pads provided. This will be your starting position.",
      "At the same time, begin to lift the legs up as you crunch your upper torso. Breathe out as you perform this movement. Tip: Be sure to use a slow and controlled motion. Concentrate on using your abs to move the weight while relaxing your legs and feet.",
      "After a second pause, slowly return to the starting position as you breathe in.",
      "Repeat the movement for the prescribed amount of repetitions."
    ],
    category: "strength",
    images: [
      "Ab_Crunch_Machine/0.jpg",
      "Ab_Crunch_Machine/1.jpg"
    ],
    id: "Ab_Crunch_Machine"
  }
];

interface CalcInput {
  currentWeight: string;
  currentReps: string;
  targetReps: string;
  selectedExerciseId: string;
}

const WorkoutEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const user = useSelector((state: RootState) => state.userModule.user);

  const [workout, setWorkout] = useState<Workout>({
    name: '',
    type: '',
    exercise: []
  });

  const [newExercise, setNewExercise] = useState<Exercise>({
    name: '',
    sets: 0,
    reps: 0,
    weight: 0,
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editForm, setEditForm] = useState<Exercise>({
    sets: 0,
    reps: 0,
    weight: 0,
    name: ''
  });

  const [calcInput, setCalcInput] = useState<CalcInput>({
    currentWeight: '',
    currentReps: '',
    targetReps: '',
    selectedExerciseId: ''
  });
  const [calculatedWeight, setCalculatedWeight] = useState<number | null>(null);

  useEffect(() => {
    if (id && id !== 'new' && user) {
      const foundWorkout = user.workouts.find((w) => w._id === id);
      if (foundWorkout) {
        setWorkout(foundWorkout);
      }
    }
  }, [id, user]);

  const handleSave = async () => {
    try {
      if (!id || id === 'new') {
        await createWorkout(workout);
      }
      navigate('/workouts');
    } catch (error) {
      console.error("Error saving workout:", error);
    }
  };

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setEditForm({
      sets: exercise.sets || 0,
      reps: exercise.reps || 0,
      weight: exercise.weight || 0,
      name: exercise.name || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = async () => {
    try {
      if (!editForm) return;
      if (id && id !== 'new') {
        await editExercise(id, editForm, 'put');
      } else {
        setWorkout(prev => ({
          ...prev,
          exercise: prev.exercise.map(ex =>
            ex.name === editingExercise?.name ? { ...ex, ...editForm } : ex
          )
        }));
      }
      setIsEditModalOpen(false);
    } catch (error) {
      console.error("Error editing exercise:", error);
    }
  };

  const addExercise = async () => {
    if (Object.values(newExercise).every(value => value)) {
      if (id && id !== 'new') {
        await editExercise(id, newExercise, 'post');
      } else {
        setWorkout(prev => ({
          ...prev,
          exercise: [...prev.exercise, newExercise]
        }));
      }
      setNewExercise({
        name: '',
        sets: 0,
        reps: 0,
        weight: 0
      });
    }
  };

  const removeExercise = (exerciseName: string) => {
    setWorkout(prev => ({
      ...prev,
      exercise: prev.exercise.filter(e => e.name !== exerciseName)
    }));
  };

  const calculateWeight = () => {
    const weight = parseFloat(calcInput.currentWeight);
    const reps = parseInt(calcInput.currentReps);
    const targetReps = parseInt(calcInput.targetReps);

    if (weight && reps && targetReps) {
      const oneRM = weight * (1 + reps / 30);
      const targetWeight = oneRM / (1 + targetReps / 30);
      setCalculatedWeight(Math.round(targetWeight * 10) / 10);
    }
  };

  const applyWeightToExercise = async () => {
    if (!calculatedWeight || !calcInput.selectedExerciseId) return;

    if (id && id !== 'new') {
      await editExercise(id, {
        name: calcInput.selectedExerciseId,
        weight: calculatedWeight
      }, 'put');
    }

    setWorkout(prev => ({
      ...prev,
      exercise: prev.exercise.map(exercise =>
        exercise.name === calcInput.selectedExerciseId
          ? { ...exercise, weight: calculatedWeight }
          : exercise
      )
    }));

    setCalcInput(prev => ({
      ...prev,
      selectedExerciseId: ''
    }));
  };

  if (!user) return null;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/workouts')}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold">
          {!id || id === 'new' ? 'Create Workout' : 'Edit Workout'}
        </h1>
      </div>

      <WorkoutDetail workout={workout} setWorkout={setWorkout} />

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Exercises</h2>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {workout.exercise.map((exercise) => (
                <div key={exercise.name} className="flex items-center gap-4 p-4 border rounded">
                  <div className="flex-1">
                    <h3 className="font-bold">{exercise.name}</h3>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight}kg
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(exercise)}
                    className="mr-2"
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      id === undefined ? removeExercise(exercise.name) :
                        deleteExercise(workout._id!, { name: exercise.name })
                    }}
                  >
                    <Trash2 size={16} />
                  </Button>

                </div>
              ))}

              <div className="border-t pt-4">
                <h3 className="font-bold mb-2">Add New Exercise</h3>
                <div className="space-y-2">
                  {/* <Input
                    type="text"
                    placeholder="Exercise Name"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({
                      ...newExercise,
                      name: e.target.value
                    })}
                    className="w-full"
                  /> */}
                  {/* <ExerciseCombobox
                    exercises={actualData}  // data should be an array
                    value={newExercise.name}
                    onExerciseSelect={(exerciseName) =>
                      setNewExercise({
                        ...newExercise,
                        name: exerciseName
                      })
                    }
                  /> */}
                  <ComboboxDemo />
                  {/* <ExerciseCombobox value={data.filter(item => item.level.includes('beginner') && item.primaryMuscles.includes('biceps'))} /> */}
                  {/* <ExerciseCombobox
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({
                      ...newExercise,
                      name: e.target.value
                    })}
                  /> */}
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Sets"
                      value={newExercise.sets || ''}
                      onChange={(e) => setNewExercise({
                        ...newExercise,
                        sets: parseInt(e.target.value) || 0
                      })}
                      className="w-1/3"
                    />
                    <Input
                      type="number"
                      placeholder="Reps"
                      value={newExercise.reps || ''}
                      onChange={(e) => setNewExercise({
                        ...newExercise,
                        reps: parseInt(e.target.value) || 0
                      })}
                      className="w-1/3"
                    />
                    <Input
                      type="number"
                      placeholder="Weight (kg)"
                      value={newExercise.weight || ''}
                      onChange={(e) => setNewExercise({
                        ...newExercise,
                        weight: parseFloat(e.target.value) || 0
                      })}
                      className="w-1/3"
                    />
                    <Button
                      className="w-1/3"
                      onClick={addExercise}
                    >
                      Add Exercise
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button
        className="flex items-center gap-2 mb-8 ml-auto"
        onClick={handleSave}
      >
        <Save size={16} />
        Save Workout
      </Button>

      <div className="mb-20">
        <h2 className="text-xl font-bold mb-4">Weight Calculator</h2>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Calculate Weight for Different Reps</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="currentWeight">Current Weight</Label>
                  <Input
                    id="currentWeight"
                    type="number"
                    placeholder="60 (kg)"
                    value={calcInput.currentWeight}
                    onChange={(e) => setCalcInput(prev => ({
                      ...prev,
                      currentWeight: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="currentReps">Current Reps</Label>
                  <Input
                    id="currentReps"
                    type="number"
                    placeholder="10"
                    value={calcInput.currentReps}
                    onChange={(e) => setCalcInput(prev => ({
                      ...prev,
                      currentReps: e.target.value
                    }))}
                  />
                </div>
                <div>
                  <Label htmlFor="targetReps">Target Reps</Label>
                  <Input
                    id="targetReps"
                    type="number"
                    placeholder="5"
                    value={calcInput.targetReps}
                    onChange={(e) => setCalcInput(prev => ({
                      ...prev,
                      targetReps: e.target.value
                    }))}
                  />
                </div>
              </div>

              <div className="flex justify-between items-center">
                <Button
                  onClick={calculateWeight}
                  className="flex items-center gap-2"
                >
                  <Calculator size={16} />
                  Calculate Weight
                </Button>

                {calculatedWeight && (
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Suggested weight for {calcInput.targetReps} reps:</p>
                    <p className="text-2xl font-bold">{calculatedWeight} kg</p>
                  </div>
                )}
              </div>


              {calculatedWeight && workout.exercise.length > 0 && (
                <div className="border-t pt-4 mt-4">
                  <Label>Apply weight to exercise</Label>
                  <div className="flex gap-2 mt-2">
                    <Select
                      value={calcInput.selectedExerciseId}
                      onValueChange={(value) => setCalcInput(prev => ({
                        ...prev,
                        selectedExerciseId: value
                      }))}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select exercise" />
                      </SelectTrigger>
                      <SelectContent>
                        {workout.exercise.map(exercise => (
                          <SelectItem
                            key={exercise.name}
                            value={exercise.name}
                          >
                            {exercise.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={applyWeightToExercise}
                      disabled={!calcInput.selectedExerciseId}
                      className="flex items-center gap-2"
                    >
                      <ArrowRight size={16} />
                      Apply Weight
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingExercise?.name}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="sets" className="text-right">
                Sets
              </Label>
              <Input
                id="sets"
                type="number"
                value={editForm.sets}
                onChange={(e) => setEditForm({ ...editForm, sets: +e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reps" className="text-right">
                Reps
              </Label>
              <Input
                id="reps"
                type="number"
                value={editForm.reps}
                onChange={(e) => setEditForm({ ...editForm, reps: +e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Weight
              </Label>
              <Input
                id="weight"
                type="number"
                value={editForm.weight}
                onChange={(e) => setEditForm({ ...editForm, weight: +e.target.value })}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditSave}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>


    </div>
  );
};

export default WorkoutEditPage;