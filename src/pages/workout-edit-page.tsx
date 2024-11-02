import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, Trash2, Edit2 } from 'lucide-react';
import { 
  Card,
  CardContent,
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

interface Exercise {
  id: number;
  name: string;
  sets: number;
  reps?: number;
  weight?: string;
  duration?: string;
}

interface Workout {
  id: number;
  name: string;
  type: string;
  duration: string;
  exercises: Exercise[];
}

interface NewExercise {
  name: string;
  sets: string;
  reps: string;
  weight: string;
  duration: string;
}

const WorkoutEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [workout, setWorkout] = React.useState<Workout>({
    id: id === 'new' ? Date.now() : parseInt(id || '0'),
    name: '',
    type: '',
    duration: '',
    exercises: []
  });

  const [newExercise, setNewExercise] = React.useState<NewExercise>({
    name: '',
    sets: '',
    reps: '',
    weight: '',
    duration: ''
  });

  // Modal state
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);
  const [editingExercise, setEditingExercise] = React.useState<Exercise | null>(null);
  const [editForm, setEditForm] = React.useState({
    sets: '',
    reps: '',
    weight: ''
  });

  React.useEffect(() => {
    if (id && id !== 'new') {
      setWorkout({
        id: 1,
        name: 'Upper Body Strength',
        type: 'Strength',
        duration: '45 min',
        exercises: [
          { id: 1, name: 'Bench Press', sets: 3, reps: 10, weight: '135 lbs' },
          { id: 2, name: 'Shoulder Press', sets: 3, reps: 12, weight: '95 lbs' },
        ]
      });
    }
  }, [id]);

  const handleSave = () => {
    navigate('/');
  };

  const openEditModal = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setEditForm({
      sets: exercise.sets.toString(),
      reps: exercise.reps?.toString() || '',
      weight: exercise.weight || ''
    });
    setIsEditModalOpen(true);
  };

  const handleEditSave = () => {
    if (!editingExercise) return;

    const updatedExercises = workout.exercises.map(exercise => {
      if (exercise.id === editingExercise.id) {
        return {
          ...exercise,
          sets: parseInt(editForm.sets),
          reps: editForm.reps ? parseInt(editForm.reps) : undefined,
          weight: editForm.weight || undefined
        };
      }
      return exercise;
    });

    setWorkout({
      ...workout,
      exercises: updatedExercises
    });
    setIsEditModalOpen(false);
  };

  const addExercise = () => {
    if (newExercise.name && newExercise.sets) {
      const exercise: Exercise = {
        id: workout.exercises.length + 1,
        name: newExercise.name,
        sets: parseInt(newExercise.sets),
        reps: newExercise.reps ? parseInt(newExercise.reps) : undefined,
        weight: newExercise.weight || undefined,
        duration: newExercise.duration || undefined
      };

      setWorkout({
        ...workout,
        exercises: [...workout.exercises, exercise]
      });

      setNewExercise({
        name: '',
        sets: '',
        reps: '',
        weight: '',
        duration: ''
      });
    }
  };

  const removeExercise = (exerciseId: number) => {
    setWorkout({
      ...workout,
      exercises: workout.exercises.filter(e => e.id !== exerciseId)
    });
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" onClick={() => navigate('/')}>
          <ArrowLeft size={16} />
        </Button>
        <h1 className="text-2xl font-bold">
          {id === 'new' ? 'Create Workout' : 'Edit Workout'}
        </h1>
      </div>

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

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-4">Exercises</h2>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              {workout.exercises.map((exercise) => (
                <div key={exercise.id} className="flex items-center gap-4 p-4 border rounded">
                  <div className="flex-1">
                    <h3 className="font-bold">{exercise.name}</h3>
                    <p className="text-sm text-gray-600">
                      {exercise.sets} sets × {exercise.reps || exercise.duration}
                      {exercise.weight && ` @ ${exercise.weight}`}
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
                    onClick={() => removeExercise(exercise.id)}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}

              <div className="border-t pt-4">
                <h3 className="font-bold mb-2">Add New Exercise</h3>
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Exercise Name"
                    className="w-full p-2 border rounded"
                    value={newExercise.name}
                    onChange={(e) => setNewExercise({
                      ...newExercise,
                      name: e.target.value
                    })}
                  />
                  <div className="flex gap-2">
                    <input
                      type="number"
                      placeholder="Sets"
                      className="w-1/4 p-2 border rounded"
                      value={newExercise.sets}
                      onChange={(e) => setNewExercise({
                        ...newExercise,
                        sets: e.target.value
                      })}
                    />
                    <input
                      type="text"
                      placeholder="Reps/Duration"
                      className="w-1/4 p-2 border rounded"
                      value={newExercise.reps}
                      onChange={(e) => setNewExercise({
                        ...newExercise,
                        reps: e.target.value
                      })}
                    />
                    <input
                      type="text"
                      placeholder="Weight (optional)"
                      className="w-1/4 p-2 border rounded"
                      value={newExercise.weight}
                      onChange={(e) => setNewExercise({
                        ...newExercise,
                        weight: e.target.value
                      })}
                    />
                    <Button 
                      className="w-1/4"
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

      <div className="flex justify-end">
        <Button 
          className="flex items-center gap-2"
          onClick={handleSave}
        >
          <Save size={16} />
          Save Workout
        </Button>
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
                onChange={(e) => setEditForm({ ...editForm, sets: e.target.value })}
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
                onChange={(e) => setEditForm({ ...editForm, reps: e.target.value })}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="weight" className="text-right">
                Weight
              </Label>
              <Input
                id="weight"
                value={editForm.weight}
                onChange={(e) => setEditForm({ ...editForm, weight: e.target.value })}
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
