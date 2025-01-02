import { useEffect, useState } from 'react';
import { Scale, Dumbbell, PlusCircle, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { SavedUser, Workout } from '@/services/user/user.service.remote';
import { addWeight } from '@/store/actions/user.actions';
import { Link } from 'react-router-dom';
import { isSameDate } from '@/services/util.service';

interface RootState {
  userModule: {
    user: SavedUser;
  };
}
export const FitnessDashboard = () => {
  const user = useSelector((state: RootState) => state.userModule.user);
  const [weight, setWeight] = useState('');
  const [currentWorkout, setCurrentWorkout] = useState<Workout | null>(null);
  useEffect(() => {
    const todaysWorkout = user?.workouts?.find(workout =>
      workout.date && workout.date.some(workoutDate => workoutDate && isSameDate(new Date(workoutDate)))
    );
    setCurrentWorkout(todaysWorkout || null);
  }, [user?.workouts]);

  const handleWeightSubmit = (ev: any) => {
    ev.preventDefault();
    addWeight({ weight: +weight })
    setWeight('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">FitTrack</h1>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Date and Welcome Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome back, {user?.username}!</h2>
          <div className="flex items-center text-gray-600">
            <Calendar className="h-5 w-5 mr-2" />
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100">Current Weight</p>
                  <h3 className="text-3xl font-bold">{user?.weight[user.weight.length - 1]?.weight || '--'} kg </h3>
                </div>
                <Scale className="h-8 w-8 opacity-75" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-500 to-cyan-600 text-white">
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100">Weekly Workouts</p>
                  <h3 className="text-3xl font-bold">4/5</h3>
                </div>
                <TrendingUp className="h-8 w-8 opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Weight Logging Section */}
        <Card className="mb-8 border-none shadow-lg">
          <CardHeader>
            <CardTitle>Log Today's Weight</CardTitle>
            <CardDescription>Keep track of your progress by logging your weight daily</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleWeightSubmit} className="flex gap-4">
              <Input
                type="number"
                step="0.1"
                placeholder="Enter weight (kg)"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="max-w-[200px]"
              />
              <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">Log Weight</Button>
            </form>
          </CardContent>
        </Card>

        {/* Action Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Dumbbell className="h-5 w-5 text-blue-600" />
                </div>
                Today's Workout
              </CardTitle>
              <CardDescription>Ready to crush your fitness goals?</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">{currentWorkout?.name}</h4>
                <p className="text-sm text-gray-600"> {currentWorkout?.exercise.length} exercises</p>
              </div>
              <Link to={'/today'}>
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Start Workout
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="hover:shadow-xl transition-all duration-300 border-none shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <div className="bg-purple-100 p-2 rounded-lg">
                  <PlusCircle className="h-5 w-5 text-purple-600" />
                </div>
                Create New Workout
              </CardTitle>
              <CardDescription>Design your perfect training routine</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <h4 className="font-semibold mb-2">Quick Start</h4>
                <p className="text-sm text-gray-600">Customize your workout or choose a template!</p>
              </div>
              <Link to={'/workouts/new'}>
                <Button variant="outline" className="w-full border-purple-200 text-purple-700 hover:bg-purple-50">
                  Create Workout
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};