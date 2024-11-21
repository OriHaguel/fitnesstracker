export const getStartDayOfMonth = (date: Date): number => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay()
}

export const isSameDay = (date1: Date, date2: Date): boolean => {
    return date1.getDate() === date2.getDate() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
}

export const isSameMonth = (date1: Date, date2: Date): boolean => {
    return date1.getMonth() === date2.getMonth() &&
        date1.getFullYear() === date2.getFullYear()
}

export const addDays = (date: Date, days: number): Date => {
    const result = new Date(date)
    result.setDate(result.getDate() + days)
    return result
}

export const formatDate = (date: Date, format: string): string => {
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

export const WEEKDAYS = [
    { short: "S", full: "Sun", id: "sun" },
    { short: "M", full: "Mon", id: "mon" },
    { short: "T", full: "Tue", id: "tue" },
    { short: "W", full: "Wed", id: "wed" },
    { short: "T", full: "Thu", id: "thu" },
    { short: "F", full: "Fri", id: "fri" },
    { short: "S", full: "Sat", id: "sat" },
]

export function isSameDate(date: Date): boolean {
    const today = new Date();
    return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
    );
}

// Example usage
const inputDate = new Date('2024-11-21T10:00:00.000Z');
console.log(isSameDate(inputDate)); // true if it's the same date as today
