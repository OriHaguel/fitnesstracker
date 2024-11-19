import { Plus, Edit2, Trash2 } from 'lucide-react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Workout } from "../services/user/user.service.remote";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { deleteWorkout } from '@/store/actions/user.actions';
const WorkoutListPage = () => {

  const user = useSelector((state: any) => state.userModule.user);
  // Assuming you're using React Router for navigation
  const navigate = useNavigate();

  if (!user) return
  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Workouts</h1>
        <Button
          className="flex items-center gap-2"
          onClick={() => navigate('/workouts/new')}
        >
          <Plus size={16} />
          New Workout
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {user.workouts.map((workout: Workout) => (
          <Card key={workout._id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle>{workout.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">Type: {workout.type}</p>
              <p className="text-gray-600">Exercises: {workout.exercise.length}</p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => navigate(`/workouts/${workout._id}`)}
              >
                <Edit2 size={16} />
                Edit
              </Button>
              <Button
                variant="destructive"
                className="flex items-center gap-2"
                // onClick={() => deleteWorkout(workout.?_id)}
                onClick={() => deleteWorkout(workout._id!)}
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
