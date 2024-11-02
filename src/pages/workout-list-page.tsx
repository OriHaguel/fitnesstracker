import React from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const WorkoutListPage = () => {
  const [workouts, setWorkouts] = React.useState([
    {
      id: 1,
      name: 'Upper Body Strength',
      type: 'Strength',
      duration: '45 min',
      exercises: [
        { id: 1, name: 'Bench Press', sets: 3, reps: 10, weight: '135 lbs' },
        { id: 2, name: 'Shoulder Press', sets: 3, reps: 12, weight: '95 lbs' },
      ]
    },
    {
      id: 2,
      name: 'HIIT Cardio',
      type: 'Cardio',
      duration: '30 min',
      exercises: [
        { id: 1, name: 'Burpees', sets: 3, duration: '45 sec' },
        { id: 2, name: 'Mountain Climbers', sets: 3, duration: '30 sec' },
      ]
    }
  ]);

  // Assuming you're using React Router for navigation
  const navigate = useNavigate();

  const handleDeleteWorkout = (workoutId: number) => {
    setWorkouts(workouts.filter(workout => workout.id !== workoutId));
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Workouts</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => navigate('/workout/new')}
        >
          <Plus size={16} />
          New Workout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {workouts.map((workout) => (
          <Card key={workout.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{workout.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Type: {workout.type}</p>
              <p className="text-gray-600">Duration: {workout.duration}</p>
              <p className="text-gray-600">Exercises: {workout.exercises.length}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate(`/workouts/${workout.id}`)}
              >
                <Edit2 size={16} />
                Edit
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                onClick={() => handleDeleteWorkout(workout.id)}
              >
                <Trash2 size={16} />
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default WorkoutListPage;
