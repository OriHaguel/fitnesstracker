import { ChevronLeft, ChevronRight } from "lucide-react"
// import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useState } from "react"
import { useSelector } from "react-redux"
import { Workout } from "@/services/user/user.service.remote"
import { RootState } from "./workout-edit-page"

interface Event {
  id: string
  title: string
  date: Date
  workout: Workout
  color: string
  borderColor: string
}

const WEEKDAYS = [
  { short: "S", full: "Sun", id: "sun" },
  { short: "M", full: "Mon", id: "mon" },
  { short: "T", full: "Tue", id: "tue" },
  { short: "W", full: "Wed", id: "wed" },
  { short: "T", full: "Thu", id: "thu" },
  { short: "F", full: "Fri", id: "fri" },
  { short: "S", full: "Sat", id: "sat" },
]

export default function Calendar() {
  const user = useSelector((state: RootState) => state.userModule.user);
  const [currentDate, setCurrentDate] = useState<Date>(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [isAddWorkoutModalOpen, setIsAddWorkoutModalOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [workoutEvents, setWorkoutEvents] = useState<Event[]>([])

  console.log("🚀 ~ Calendar ~ selectedEvent:", selectedEvent)
  const getStartDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
  }

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
  }

  const isSameMonth = (date1: Date, date2: Date): boolean => {
    return date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
  }

  const addDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
  }

  const formatDate = (date: Date, format: string): string => {
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ]
    const days = [
      "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
    ]

    return format
      .replace("MMMM", months[date.getMonth()])
      .replace("yyyy", date.getFullYear().toString())
      .replace("EEEE", days[date.getDay()])
      .replace("d", date.getDate().toString())
      .replace("MMM", months[date.getMonth()].substring(0, 3))
  }

  const handleDayClick = (date: Date, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation()
    }

    if (isSameMonth(date, currentDate)) {
      setSelectedDate(date)
      setIsAddWorkoutModalOpen(true)
    }
  }

  const getWorkoutColor = (type: string): { color: string, borderColor: string } => {
    const colorMap: Record<string, { color: string, borderColor: string }> = {
      strength: { color: "bg-purple-500/90", borderColor: "border-purple-600" },
      cardio: { color: "bg-red-500/90", borderColor: "border-red-600" },
      flexibility: { color: "bg-blue-500/90", borderColor: "border-blue-600" },
      default: { color: "bg-gray-500/90", borderColor: "border-gray-600" }
    }
    return colorMap[type.toLowerCase()] || colorMap.default
  }

  const handleWorkoutSelect = (workout: Workout) => {
    if (selectedDate) {
      const colors = getWorkoutColor(workout.type)
      const newEvent: Event = {
        id: `${workout._id}-${selectedDate.getTime()}`,
        title: workout.name,
        date: selectedDate,
        workout: workout,
        ...colors
      }
      setWorkoutEvents([...workoutEvents, newEvent])
      setIsAddWorkoutModalOpen(false)
    }
  }

  const EventCard = ({ event }: { event: Event }) => (
    <div
      onClick={(e) => {
        e.stopPropagation()
        setSelectedEvent(event)
        setIsEventModalOpen(true)
      }}
      className={`
        group/event relative
        ${event.color} ${event.borderColor}
        border-l-4 rounded-r-md
        px-2 py-1 mb-1
        cursor-pointer
        transition-all duration-200
        hover:translate-x-1
        hover:shadow-md
        md:text-sm text-xs
      `}
    >
      <div className="flex items-center gap-1">
        <span className="font-medium text-white truncate">
          {event.title}
        </span>
      </div>
      <div className="absolute inset-0 bg-black opacity-0 group-hover/event:opacity-5 rounded-r-md transition-opacity" />
    </div>
  )

  const EventDetailsModal = ({ event, isOpen, onClose }: {
    event: Event | null
    isOpen: boolean
    onClose: () => void
  }) => {
    if (!event) return null

    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              <div className={`${event.color} text-white p-3 -m-6 mb-6 rounded-t-lg`}>
                <h3 className="font-semibold text-lg">{event.title}</h3>
                <p className="text-sm text-white/90">
                  {formatDate(event.date, "EEEE, MMMM , yyyy")}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Workout Type</h4>
              <p className="text-gray-600">{event.workout.type}</p>
            </div>
            <div>
              <h4 className="font-medium text-gray-700 mb-2">Exercises</h4>
              <div className="space-y-2">
                {event.workout.exercise.map((exercise, index) => (
                  <div key={index} className="text-gray-600">
                    <p className="font-medium">{exercise.name}</p>
                    {exercise.sets && exercise.reps && (
                      <p className="text-sm text-gray-500">
                        {exercise.sets} sets × {exercise.reps} reps
                        {exercise.weight && ` @ ${exercise.weight}lbs`}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const renderDays = () => {
    const days: JSX.Element[] = []
    const totalCells = 42
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
    const startDayOfWeek = getStartDayOfMonth(currentDate)

    for (let i = 0; i < totalCells; i++) {
      const date = addDays(startDate, i - startDayOfWeek)
      const isCurrentMonth = isSameMonth(date, currentDate)
      const isToday = isSameDay(date, new Date())
      const dayEvents = workoutEvents.filter(event => isSameDay(event.date, date))

      days.push(
        <div
          key={i}
          className={`
            relative md:h-28 h-20 p-1
            transition-colors duration-200
            border-t border-l cursor-pointer
            ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}
            ${i >= 35 ? 'border-b' : ''}
            ${(i + 1) % 7 === 0 ? 'border-r' : ''}
            group
          `}
          onClick={(e) => handleDayClick(date, e)}
        >
          <div className="flex justify-between items-start p-1">
            <div
              className={`
                flex items-center justify-center
                md:w-6 md:h-6 w-5 h-5 rounded-full
                ${isToday ? 'bg-blue-600 text-white' : ''}
                ${isCurrentMonth ? '' : 'text-gray-400'}
                md:text-sm text-xs font-medium
              `}
            >
              {date.getDate()}
            </div>
          </div>

          <div className="px-1 overflow-y-auto max-h-14 md:max-h-20">
            {isCurrentMonth && dayEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </div>
      )
    }
    return days
  }

  return (
    <>
      <Card className="w-full max-w-[960px] mx-auto p-2 md:p-6 shadow-lg">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-6">
          <div className="flex items-center justify-between md:justify-start gap-4">
            <h2 className="text-xl md:text-2xl font-bold tracking-tight">
              {formatDate(currentDate, "MMM yyyy")}
            </h2>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const prevDate = new Date(currentDate)
                  prevDate.setMonth(prevDate.getMonth() - 1)
                  setCurrentDate(prevDate)
                }}
                className="hover:bg-gray-100"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  const nextDate = new Date(currentDate)
                  nextDate.setMonth(nextDate.getMonth() + 1)
                  setCurrentDate(nextDate)
                }}
                className="hover:bg-gray-100"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-7 border-collapse rounded-lg overflow-hidden border border-gray-200">
          {WEEKDAYS.map(day => (
            <div
              key={day.id}
              className="font-medium text-center py-2 md:py-3 bg-gray-50 text-gray-600 border-b last:border-r text-xs md:text-sm"
            >
              <span className="md:hidden">{day.short}</span>
              <span className="hidden md:inline">{day.full}</span>
            </div>
          ))}
          {renderDays()}
        </div>
      </Card>

      <Dialog open={isAddWorkoutModalOpen} onOpenChange={setIsAddWorkoutModalOpen} >
        <DialogContent className="sm:max-w-md" aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>
              Select Workout for {selectedDate ? formatDate(selectedDate, "MMMM d, yyyy") : ""}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-2">
            {user.workouts.map((workout) => (
              <Button
                key={workout._id}
                variant="outline"
                className="w-full justify-start text-left h-auto py-3"
                onClick={() => handleWorkoutSelect(workout)}
              >
                <div>
                  <div className="font-medium">{workout.name}</div>
                  <div className="text-sm text-gray-500">
                    {workout.exercise.length} exercises • {workout.type}
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <EventDetailsModal
        event={selectedEvent}
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false)
          setSelectedEvent(null)
        }}
      />
    </>
  )
}