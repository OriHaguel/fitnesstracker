import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface WorkoutCardProps {
  name: string;
  type: string;
}

const WorkoutCard: React.FC<WorkoutCardProps> = ({ name, type }) => {
  return (
    <Card className="max-w-sm mb-6  rounded-lg overflow-hidden border border-gray-300 hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="bg-white py-5 px-6 border-b border-gray-200">
        <CardTitle className="text-xl font-semibold text-gray-800">{name}</CardTitle>
      </CardHeader>
      <CardContent className="p-6 bg-gray-50">
        <Badge
          variant="secondary"
          className="text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full font-medium"
        >
          {type}
        </Badge>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
