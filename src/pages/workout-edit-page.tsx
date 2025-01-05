import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Edit2, Calculator, ArrowRight, Save, Divide } from 'lucide-react';
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
import { Exercise as BaseExercise, Workout } from '../services/user/user.service.remote';
import { editExercise, createWorkout, deleteExercise } from '@/store/actions/user.actions';
import { ComboboxDemo } from '@/cmps/testData';
import { DialogDescription } from '@radix-ui/react-dialog';
import WorkoutCard from '@/cmps/workout-card';
import { toast } from 'react-toastify';
interface Exercise extends BaseExercise {
  muscleGroup?: string;
}

export interface RootState {
  userModule: {
    user: {
      workouts: Workout[];
    };
  };
}

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

  const muscleGroups = [
    "abdominals",
    "abductors",
    "adductors",
    "biceps",
    "calves",
    "chest",
    "forearms",
    "glutes",
    "hamstrings",
    "lats",
    "lower_back",
    "middle_back",
    "neck",
    "quadriceps",
    "shoulders",
    "traps",
    "triceps"
  ];

  const [workout, setWorkout] = useState<Workout>({
    name: '',
    type: '',
    exercise: []
  });

  console.log("🚀 ~ workout:", workout)

  const [newExercise, setNewExercise] = useState<Exercise>({
    name: '',
    sets: 0,
    reps: 0,
    weight: 0,
    muscleGroup: ''
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [editForm, setEditForm] = useState<Exercise>({
    name: '',
    sets: 0,
    reps: 0,
    weight: 0,
    muscleGroup: ''
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
      if (!workout.name) {
        toast.error('Please add a workout name');
        return;
      } else if (!workout.type) {
        toast.error('Please add a workout type');
        return;
      }

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
      name: exercise.name || '',
      muscleGroup: exercise.muscleGroup || ''
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
        weight: 0,
        muscleGroup: ''
      });
    } else {
      toast.error('Please fill in all exercise fields');
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

      {workout.name && workout.type ? <WorkoutCard name={workout.name} type={workout.type} /> : <WorkoutDetail workout={workout} setWorkout={setWorkout} />}

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
                      {exercise.muscleGroup && `${exercise.muscleGroup} - `}
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
                  <div className="flex gap-2 mb-2">
                    <Select
                      value={newExercise.muscleGroup}
                      onValueChange={(value) => setNewExercise(prev => ({
                        ...prev,
                        muscleGroup: value
                      }))}
                    >
                      <SelectTrigger className="w-[12.5rem]">
                        <SelectValue placeholder="Muscle Group" />
                      </SelectTrigger>
                      <SelectContent>
                        {muscleGroups.map(group => (
                          <SelectItem key={group} value={group}>
                            {group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <ComboboxDemo
                      newExercise={newExercise}
                      setNewExercise={setNewExercise}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Input
                      type="number"
                      placeholder="Sets"
                      value={newExercise.sets || ''}
                      onChange={(e) => setNewExercise({
                        ...newExercise,
                        sets: parseInt(e.target.value) || 0
                      })}
                      max={10}
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

      {/* <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent aria-description='whatssssss'>
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
      </Dialog> */}

      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit {editingExercise?.name}</DialogTitle>
            <DialogDescription>
            </DialogDescription>
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