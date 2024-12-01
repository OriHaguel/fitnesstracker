import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Camera } from 'lucide-react';
import { useSelector } from 'react-redux';

const Icon = ({ name }: { name: string }) => {
  return <Camera className={`h-4 w-4 ${name === 'Trophy' ? 'text-yellow-400' :
    name === 'Activity' ? 'text-red-400' :
      name === 'Dumbbell' ? 'text-green-400' : ''
    }`} />;
};

const FitnessDashboard = () => {
  const user = useSelector((state: any) => state.userModule.user);


  const workoutData = [
    { day: 'Mon', workout: 'Upper Body', completed: true },
    { day: 'Tue', workout: 'Lower Body', completed: true },
    { day: 'Wed', workout: 'Cardio', completed: false },
    { day: 'Thu', workout: 'Core', completed: false },
    { day: 'Fri', workout: 'HIIT', completed: false }
  ];

  const progressData = [
    { name: 'Week 1', calories: 2200, workouts: 5 },
    { name: 'Week 2', calories: 2500, workouts: 6 },
    { name: 'Week 3', calories: 2300, workouts: 4 },
    { name: 'Week 4', calories: 2800, workouts: 7 },
  ];

  function getFormattedDate(): string {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: '2-digit', month: 'long' };
    const today = new Date();
    return today.toLocaleDateString('en-US', options);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Improved Sidebar */}


      {/* Main Content - adjusted margin for wider sidebar */}
      <div className="md:ml-20 p-6 ">
        {/* Rest of the component remains the same */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-bold">{`Welcome back, ${user?.username}!`}</h1>
            <p className="text-sm text-gray-600">{getFormattedDate()}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <Camera className="h-4 w-4" />
            </Button>
            <img src="/api/placeholder/32/32" alt="Profile" className="w-8 h-8 rounded-full" />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Daily Goal</span>
                <Icon name="Trophy" />
              </div>
              <div className="text-lg font-bold">75%</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '75%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Calories</span>
                <Icon name="Activity" />
              </div>
              <div className="text-lg font-bold">458 kcal</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-red-400 h-1.5 rounded-full" style={{ width: '90%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Streak</span>
                <Icon name="Dumbbell" />
              </div>
              <div className="text-lg font-bold">12 days</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-green-400 h-1.5 rounded-full" style={{ width: '80%' }}></div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-white">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Steps</span>
                <Icon name="Activity" />
              </div>
              <div className="text-lg font-bold">8,547</div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                <div className="bg-purple-400 h-1.5 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Workout Schedule */}
          <Card className="col-span-12 md:col-span-4">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">Today's Workouts</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-3">
                {workoutData.slice(0, 3).map((day, index) => (
                  <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${day.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                        }`}>
                        {day.day}
                      </div>
                      <span className="ml-3 text-sm font-medium">{day.workout}</span>
                    </div>
                    <Button variant={day.completed ? "secondary" : "outline"} size="sm" className="text-xs">
                      {day.completed ? "Done" : "Start"}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Progress Chart */}
          <Card className="col-span-12 md:col-span-8">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">Monthly Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={progressData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="name" fontSize={12} />
                    <YAxis fontSize={12} />
                    <Bar dataKey="calories" fill="#8884d8" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="workouts" fill="#82ca9d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Weight Tracking */}
          <Card className="col-span-12 md:col-span-6">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">Weight Progress</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={user?.weight}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                    <XAxis dataKey="date" fontSize={12} />
                    <YAxis fontSize={12} domain={user?.weight && [user?.weight[0] + 10, user.weight[user.weight.length - 1] - 10]} />
                    {/* <YAxis fontSize={12} domain={[user.weight[0] + 10, user.weight[user.weight.length - 1] - 10]} /> */}
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Sessions */}
          <Card className="col-span-12 md:col-span-6">
            <CardHeader className="p-4">
              <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">HIIT Training</p>
                    <p className="text-xs text-gray-600">with Coach Mike</p>
                  </div>
                  <Button size="sm" className="text-xs">Join Now</Button>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Yoga Flow</p>
                    <p className="text-xs text-gray-600">with Sarah</p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">In 2h</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alert */}
        <Alert className="mt-6 mb-16  md:mb-0">
          <Camera className="h-4 w-4" />
          <AlertDescription className="text-sm">
            You're on track to reach your weekly goal! Just 2 more workouts to go.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  );
};

export default FitnessDashboard;
