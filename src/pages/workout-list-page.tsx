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
  const navigate = useNavigate();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">My Workouts</h1>
              <p className="text-gray-500 mt-1">Track and manage your fitness journey</p>
            </div>
            <Button
              className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 shadow-sm flex items-center justify-center gap-2 px-6 py-5"
              onClick={() => navigate('/workouts/new')}
            >
              <Plus size={18} />
              <span className="font-medium">New Workout</span>
            </Button>
          </div>
        </div>

        {/* Workout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {user.workouts?.map((workout: Workout) => (
            <Card
              key={workout._id}
              className="shadow-sm bg-white"
            >
              <CardHeader className="pb-4">
                <CardTitle className="text-2xl font-semibold text-gray-900">
                  {workout.name}
                </CardTitle>
              </CardHeader>

              <CardContent className="pb-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Type</span>
                    <span className="text-sm font-semibold text-gray-900">{workout.type}</span>
                  </div>
                  <div className="flex items-center justify-between bg-gray-50 p-3 rounded-lg">
                    <span className="text-sm font-medium text-gray-600">Exercises</span>
                    <span className="text-sm font-semibold text-gray-900">{workout.exercise.length}</span>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex justify-end gap-3 pt-4 border-t">
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
    </div>
  );
};

export default WorkoutListPage;