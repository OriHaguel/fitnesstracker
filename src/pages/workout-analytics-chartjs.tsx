import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartOptions
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSelector } from 'react-redux';
import { SavedUser } from '@/services/user/user.service.remote';
import { useState } from 'react';
import { Scale } from 'lucide-react';
import { addWeight } from '@/store/actions/user.actions';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Weight {
  weight: number;
  date: Date;
}
interface RootState {
  userModule: {
    user: SavedUser;
  };
}

const processWeightData = (weights: Weight[]) => {
  const sortedData = [...weights].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return {
    labels: sortedData.map(w => {
      const date = new Date(w.date);
      return date.toLocaleDateString('il', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    }),
    values: sortedData.map(w => w.weight)
  };
};

const WeightTracker = ({ weightData }: { weightData: Weight[] }) => {
  const [newWeight, setNewWeight] = useState('');
  console.log("🚀 ~ WeightTracker ~ newWeight:", newWeight)
  const { labels, values } = processWeightData(weightData);

  const latestWeight = values[values.length - 1];
  const previousWeight = values[values.length - 2];
  const weightDiff = latestWeight - previousWeight;
  const weightTrend = weightDiff !== 0 ? (weightDiff > 0 ? 'increase' : 'decrease') : 'same';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWeight) return;
    addWeight({ weight: +newWeight })
    setNewWeight('');
  };

  const data = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: values,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        fill: true,
        tension: 0.3,
        pointRadius: 4,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#ffffff',
        pointBorderWidth: 2,
      }
    ]
  };

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        backgroundColor: '#1e293b',
        titleFont: {
          size: 14,
          family: "'Inter', sans-serif",
        },
        bodyFont: {
          size: 13,
          family: "'Inter', sans-serif"
        },
        padding: 12,
        cornerRadius: 8,
        usePointStyle: true
      }
    },
    scales: {
      y: {
        min: Math.min(...values) - 1,
        max: Math.max(...values) + 1,
        grid: {
          color: 'rgba(0, 0, 0, 0.06)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <Scale className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle>Weight Tracker</CardTitle>
            <CardDescription>Track and monitor your weight progress</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Weight Input Section */}
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
          <form onSubmit={handleSubmit} className="flex gap-3 items-end">
            <div className="flex-1 max-w-[240px] space-y-2">
              <div className="text-sm font-medium text-slate-700">New Entry</div>
              <Input
                type="number"
                min="0"
                step={0.1}
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="Enter weight in kg"
                className="h-10"
              />
            </div>
            <Button type="submit" className="h-10">
              Add Weight
            </Button>
          </form>
        </div>

        {/* Stats Section */}
        {latestWeight && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border">
              <div className="text-sm font-medium text-slate-500">Current Weight</div>
              <div className="text-2xl font-semibold text-slate-900">{latestWeight} kg</div>
            </div>
            {previousWeight && (
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm font-medium text-slate-500">Previous</div>
                <div className="text-2xl font-semibold text-slate-900">{previousWeight} kg</div>
              </div>
            )}
            {weightDiff !== 0 && (
              <div className="bg-white p-4 rounded-lg border">
                <div className="text-sm font-medium text-slate-500">Change</div>
                <div className={`text-2xl font-semibold ${weightTrend === 'increase' ? 'text-red-600' :
                  weightTrend === 'decrease' ? 'text-green-600' :
                    'text-slate-900'
                  }`}>
                  {weightDiff > 0 ? '+' : ''}{weightDiff.toFixed(1)} kg
                </div>
              </div>
            )}
          </div>
        )}

        {/* Chart Section */}
        <div className="bg-white rounded-lg">
          <div className="h-[300px] p-4">
            <Line data={data} options={options} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export const StatsPage = () => {
  const user = useSelector((state: RootState) => state.userModule.user);

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Fitness Statistics</h1>
      <WeightTracker weightData={user.weight} />
    </div>
  );
};