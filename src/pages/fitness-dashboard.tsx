import { useEffect, useState } from 'react';
import { Scale, Dumbbell, PlusCircle, Calendar, TrendingUp, LogOut } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { SavedUser, userService, Workout } from '@/services/user/user.service.remote';
import { addWeight, logout } from '@/store/actions/user.actions';
import { Link, useNavigate } from 'react-router-dom';
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
  const navigate = useNavigate()

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

  const handleLogout = async () => {
    // Add your logout logic here
    try {
      logout()
      navigate('/auth')

    } catch (error) {
      console.log("🚀 ~ handleLogout ~ error:", error)
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-indigo-600 p-2 rounded-lg">
                <Dumbbell className="h-6 w-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">FitTrack</h1>
            </div>
            {/* Logout button - only visible on mobile */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-gray-600 hover:text-gray-900"
                onClick={handleLogout}
              >
                {/* logout */}
                <LogOut className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Rest of the component remains the same */}
      <div className="max-w-6xl mx-auto px-4 py-8">
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
                  <h3 className="text-3xl font-bold">{userService.getWorkoutsThisWeek(user)}</h3>
                </div>
                <TrendingUp className="h-8 w-8 opacity-75" />
              </div>
            </CardContent>
          </Card>
        </div>

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
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">Log Weight</Button>
            </form>
          </CardContent>
        </Card>

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
                <p className="text-sm text-gray-600">{currentWorkout?.exercise && `${currentWorkout?.exercise.length} exercises` || 'No workouts here! Add your first one and crush your fitness goals!'}</p>
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