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
  Legend
} from 'chart.js';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSelector } from 'react-redux';
import { SavedUser } from '@/services/user/user.service.remote';
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

// Helper function to process weight data
const processWeightData = (weights: Weight[]) => {
  const sortedData = [...weights].sort((a, b) =>
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  return {
    labels: sortedData.map(w => new Date(w.date).toLocaleDateString()),
    values: sortedData.map(w => w.weight)
  };
};

const WeightTracker = ({ weightData }: { weightData: Weight[] }) => {
  const { labels, values } = processWeightData(weightData);

  const data = {
    labels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: values,
        borderColor: '#2563eb',
        backgroundColor: 'rgba(37, 99, 235, 0.1)',
        tension: 0.1,
        pointRadius: 4
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        min: Math.min(...values) - 1,
        max: Math.max(...values) + 1
      }
    }
  };

  return (
    <Card className="w-full mb-6">
      <CardHeader>
        <CardTitle>Weight Progress</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <Line data={data} options={options} />
        </div>
      </CardContent>
    </Card>
  );
};



export const StatsPage = () => {
  const user = useSelector((state: RootState) => state.userModule.user);

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">Fitness Statistics</h1>
      <WeightTracker weightData={user.weight} />
    </div>
  );
};

