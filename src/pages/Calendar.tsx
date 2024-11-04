import { ChevronLeft, ChevronRight, Plus, Clock, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useState } from "react"

interface Event {
  id: number
  title: string
  date: Date
  time: string
  location: string
  color: string
  borderColor: string
  type: 'meeting' | 'deadline' | 'social'
}

const events: Event[] = [
  {
    id: 1,
    title: "Team Meeting",
    date: new Date(2024, 9, 5),
    time: "10:00 AM",
    location: "Conference Room A",
    color: "bg-blue-500/90",
    borderColor: "border-blue-600",
    type: "meeting"
  },
  {
    id: 2,
    title: "Project Deadline",
    date: new Date(2024, 9, 15),
    time: "5:00 PM",
    location: "Main Office",
    color: "bg-red-500/90",
    borderColor: "border-red-600",
    type: "deadline"
  },
  {
    id: 3,
    title: "Birthday Party",
    date: new Date(2024, 9, 20),
    time: "3:00 PM",
    location: "Break Room",
    color: "bg-green-500/90",
    borderColor: "border-green-600",
    type: "social"
  },
]

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
  const [currentDate, setCurrentDate] = useState<Date>(new Date(2024, 9, 1))

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

  const startDayOfWeek = getStartDayOfMonth(currentDate)

  const prevMonth = () => {
    const prevDate = new Date(currentDate)
    prevDate.setMonth(prevDate.getMonth() - 1)
    setCurrentDate(prevDate)
  }

  const nextMonth = () => {
    const nextDate = new Date(currentDate)
    nextDate.setMonth(nextDate.getMonth() + 1)
    setCurrentDate(nextDate)
  }

  const EventCard = ({ event }: { event: Event }) => (
    <Popover>
      <PopoverTrigger asChild>
        <div
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
      </PopoverTrigger>
      <PopoverContent className="w-72 p-0">
        <div className={`${event.color} p-3 rounded-t-lg`}>
          <h3 className="font-semibold text-lg text-white">{event.title}</h3>
          <p className="text-sm text-white/90">
            {formatDate(event.date, "EEEE, MMMM d, yyyy")}
          </p>
        </div>
        <div className="p-3 space-y-2">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span>{event.time}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{event.location}</span>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )

  const renderDays = () => {
    const days: JSX.Element[] = []
    const totalCells = 42
    const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)

    for (let i = 0; i < totalCells; i++) {
      const date = addDays(startDate, i - startDayOfWeek)
      const isCurrentMonth = isSameMonth(date, currentDate)
      const isToday = isSameDay(date, new Date())
      const dayEvents = events.filter(event => isSameDay(event.date, date))

      days.push(
        <div
          key={i}
          className={`
            relative md:h-28 h-20 p-1
            transition-colors duration-200
            border-t border-l
            ${isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'}
            ${i >= 35 ? 'border-b' : ''}
            ${(i + 1) % 7 === 0 ? 'border-r' : ''}
            group
          `}
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

            {isCurrentMonth && (
              <Button
                variant="ghost"
                size="icon"
                className="w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity md:block hidden"
              >
                <Plus className="w-4 h-4 text-gray-500" />
              </Button>
            )}
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
              onClick={prevMonth}
              className="hover:bg-gray-100"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={nextMonth}
              className="hover:bg-gray-100"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 w-full md:w-auto">
          <Plus className="h-4 w-4 mr-2" />
          Add workout        </Button>
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
  )
}
