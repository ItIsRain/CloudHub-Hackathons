"use client"

import { useState, useEffect } from "react"
import type { ButtonHTMLAttributes, DetailedHTMLProps } from "react"
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Filter,
  Video,
  Globe,
  AlertCircle,
  Sparkles
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

type EventType = "meeting" | "deadline" | "mentoring";

interface Event {
  id: number;
  title: string;
  type: EventType;
  startTime: string;
  endTime?: string;
  date: string;
  location?: string;
  platform?: string;
  attendees?: Array<{
    name: string;
    avatar: string;
    initials: string;
  }>;
  hackathon?: string;
  description: string;
  priority?: string;
}

interface EventStyles {
  badge: string;
  background: string;
  icon: React.ReactNode;
  iconClass: string;
}

interface EventDates {
  [key: string]: Event[];
}

interface DayProps extends Omit<DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>, 'ref'> {
  date: Date;
  displayMonth?: Date;
}

// Sample schedule data
const scheduleEvents = [
  {
    id: 1,
    title: "Team Sync Meeting",
    type: "meeting",
    startTime: "09:00 AM",
    endTime: "10:00 AM",
    date: "2025-06-15",
    location: "Online",
    platform: "Google Meet",
    attendees: [
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
      { name: "Sarah Chen", avatar: "/placeholder.svg?height=32&width=32", initials: "SC" },
      { name: "Alex Kim", avatar: "/placeholder.svg?height=32&width=32", initials: "AK" },
    ],
    hackathon: "AI Innovation Challenge",
    description: "Weekly team sync to discuss project progress and challenges",
  },
  {
    id: 2,
    title: "Project Submission Deadline",
    type: "deadline",
    startTime: "11:59 PM",
    date: "2025-06-17",
    hackathon: "AI Innovation Challenge",
    description: "Final submission deadline for the AI Innovation Challenge",
    priority: "high",
  },
  {
    id: 3,
    title: "Mentor Session",
    type: "mentoring",
    startTime: "02:00 PM",
    endTime: "03:00 PM",
    date: "2025-06-16",
    location: "Online",
    platform: "Zoom",
    attendees: [
      { name: "Dr. Emily Zhang", avatar: "/placeholder.svg?height=32&width=32", initials: "EZ" },
      { name: "John Doe", avatar: "/placeholder.svg?height=32&width=32", initials: "JD" },
    ],
    hackathon: "Web3 Global Hackathon",
    description: "One-on-one mentoring session with Dr. Zhang on blockchain architecture",
  },
]

// Event indicators for calendar
const eventDates: EventDates = scheduleEvents.reduce((acc: EventDates, event) => {
  const date = event.date;
  if (!acc[date]) {
    acc[date] = [];
  }
  acc[date].push(event as Event);
  return acc;
}, {} as EventDates);

export default function Schedule() {
  const [date, setDate] = useState<Date>(new Date())
  const [view, setView] = useState<"day" | "week" | "month">("week")
  const [selectedEventType, setSelectedEventType] = useState<"all" | EventType>("all")
  const [currentMonth, setCurrentMonth] = useState<string>("")

  useEffect(() => {
    setCurrentMonth(date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }));
  }, [date]);

  // Get event type styles
  const getEventTypeStyles = (type: EventType): EventStyles => {
    switch (type) {
      case "meeting":
        return {
          badge: "bg-blue-100 text-blue-600",
          background: "bg-blue-50 hover:bg-blue-100",
          icon: <Video className="h-4 w-4 text-blue-500" />,
          iconClass: "text-blue-500"
        }
      case "deadline":
        return {
          badge: "bg-rose-100 text-rose-600",
          background: "bg-rose-50 hover:bg-rose-100",
          icon: <AlertCircle className="h-4 w-4 text-rose-500" />,
          iconClass: "text-rose-500"
        }
      case "mentoring":
        return {
          badge: "bg-violet-100 text-violet-600",
          background: "bg-violet-50 hover:bg-violet-100",
          icon: <Sparkles className="h-4 w-4 text-violet-500" />,
          iconClass: "text-violet-500"
        }
      default:
        return {
          badge: "bg-slate-100 text-slate-600",
          background: "bg-slate-50 hover:bg-slate-100",
          icon: <Globe className="h-4 w-4 text-slate-500" />,
          iconClass: "text-slate-500"
        }
    }
  }

  // Filter events based on selected type
  const filteredEvents = scheduleEvents.filter(
    event => selectedEventType === "all" || event.type === selectedEventType
  ) as Event[]

  // Sort events by date and time
  const sortedEvents = [...filteredEvents].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return dateA !== dateB ? dateA - dateB : a.startTime.localeCompare(b.startTime);
  });

  // Navigate to previous/next month
  const navigateMonth = (direction: number) => {
    const newDate = new Date(date);
    newDate.setMonth(newDate.getMonth() + direction);
    setDate(newDate);
  };

  return (
    <div className="space-y-6 px-4 py-4 max-w-[1600px] mx-auto">
      {/* Header section with enhanced gradient background */}
      <div className="relative rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white overflow-hidden shadow-lg">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-white/5 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-white/10 rounded-full blur-2xl -z-10 animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/3 w-1/5 h-1/3 bg-white/5 rounded-full blur-xl -z-10 animate-pulse delay-700"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
          <div>
            <h1 className="text-2xl font-bold tracking-tight mb-1">Hackathon Schedule</h1>
            <p className="text-white/90">Manage your events, deadlines and mentoring sessions</p>
          </div>
          <div className="flex items-center gap-3">
            <Select defaultValue={view} onValueChange={(value) => setView(value as "day" | "week" | "month")}>
              <SelectTrigger className="w-[120px] bg-white/10 border-white/20 text-white hover:bg-white/20 focus:ring-white/30 focus:ring-offset-0">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="day">Day View</SelectItem>
                <SelectItem value="week">Week View</SelectItem>
                <SelectItem value="month">Month View</SelectItem>
              </SelectContent>
            </Select>
            <Button className="bg-white text-blue-600 hover:bg-white/90 shadow-md">
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        {/* Calendar Section with improved styling */}
        <Card className="lg:col-span-8 border-slate-200 shadow-sm overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b border-slate-100">
            <div>
              <CardTitle className="text-xl font-semibold">{currentMonth}</CardTitle>
              <CardDescription className="text-slate-500 mt-1">Your upcoming hackathon schedule</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateMonth(-1)}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => navigateMonth(1)}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="calendar-container w-full">
              <style jsx>{`
                .calendar-container :global(.rdp) {
                  margin: 0;
                  width: 100%;
                }
                .calendar-container :global(.rdp-months) {
                  width: 100%;
                  padding: 1.5rem;
                }
                .calendar-container :global(.rdp-month) {
                  width: 100%;
                }
                .calendar-container :global(.rdp-table) {
                  width: 100%;
                  border-spacing: 0;
                  border-collapse: collapse;
                }
                .calendar-container :global(.rdp-tbody) {
                  width: 100%;
                }
                .calendar-container :global(.rdp-cell) {
                  padding: 0;
                  width: calc(100% / 7);
                  aspect-ratio: 1;
                  position: relative;
                }
                .calendar-container :global(.rdp-head_cell) {
                  font-weight: 600;
                  font-size: 0.875rem;
                  color: #475569;
                  padding-bottom: 1rem;
                  text-transform: none;
                  width: calc(100% / 7);
                }
                .calendar-container :global(.rdp-day) {
                  width: 100%;
                  height: 100%;
                  border-radius: 0;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-size: 0.875rem;
                  position: relative;
                }
                .calendar-container :global(.rdp-day_selected) {
                  background-color: #7c3aed;
                  color: white;
                }
                .calendar-container :global(.rdp-day_today) {
                  background-color: #f8fafc;
                  font-weight: 600;
                }
                .calendar-container :global(.rdp-day_outside) {
                  opacity: 0.5;
                }
                .event-indicator {
                  position: absolute;
                  bottom: 2px;
                  left: 50%;
                  transform: translateX(-50%);
                  display: flex;
                  gap: 2px;
                }
                .event-dot {
                  width: 5px;
                  height: 5px;
                  border-radius: 50%;
                }
              `}</style>
              <Calendar
                mode="single"
                selected={date}
                onSelect={(date) => date && setDate(date)}
                className="w-full"
                classNames={{
                  months: "w-full",
                  month: "w-full",
                  caption: "flex justify-between items-center mb-4 hidden",
                  table: "w-full border-collapse",
                  head_row: "grid grid-cols-7 w-full",
                  head_cell: "text-slate-700 font-semibold text-sm pb-3 text-center",
                  row: "grid grid-cols-7 w-full border-t border-slate-100",
                  cell: "min-h-[100px] p-0 text-center text-sm relative [&:has([aria-selected])]:bg-violet-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 border-r border-slate-100 last:border-r-0",
                  day: cn(
                    "h-10 w-10 p-0 font-normal aria-selected:opacity-100 rounded-full my-1 mx-auto hover:bg-slate-100",
                    "focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2"
                  ),
                  day_selected: "bg-violet-600 text-white hover:bg-violet-700 hover:text-white focus:bg-violet-600 focus:text-white",
                  day_today: "bg-slate-100 font-semibold",
                  day_outside: "text-slate-400 opacity-50",
                  day_disabled: "text-slate-400 opacity-50",
                  day_hidden: "invisible",
                }}
                components={{
                  Day: ({ date: dayDate, displayMonth, className, onClick, ...props }: DayProps) => {
                    const dateStr = dayDate.toISOString().split('T')[0];
                    const hasEvents = eventDates[dateStr] || [];
                    const day = dayDate.getDate();
                    
                    return (
                      <div className="w-full h-full flex flex-col items-center pt-2 relative">
                        <div 
                          onClick={onClick}
                          className={cn(
                            className,
                            "flex items-center justify-center h-8 w-8 rounded-full cursor-pointer relative",
                            hasEvents.length > 0 && "font-medium"
                          )}
                          {...props}
                        >
                          {day}
                        </div>
                        
                        {hasEvents.length > 0 && (
                          <div className="event-indicator flex gap-1 mt-1">
                            {hasEvents.slice(0, 3).map((event, i) => {
                              const styles = getEventTypeStyles(event.type);
                              const color = styles.iconClass.replace('text-', 'bg-');
                              return (
                                <div 
                                  key={i} 
                                  className={`w-1.5 h-1.5 rounded-full ${color.replace('500', '600')}`}
                                  title={event.title}
                                />
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                }}
              />
            </div>
          </CardContent>
        </Card>

        {/* Upcoming Events with improved styling */}
        <Card className="lg:col-span-4 border-slate-200 shadow-sm max-h-[800px] overflow-hidden flex flex-col">
          <CardHeader className="pb-2 border-b border-slate-100">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upcoming Events</CardTitle>
                <CardDescription>Next 7 days</CardDescription>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-slate-100 rounded-full">
                    <Filter className="h-4 w-4" />
                    <span className="sr-only">Filter events</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-[200px]">
                  <DropdownMenuItem onClick={() => setSelectedEventType("all")} className="cursor-pointer">
                    <Globe className="h-4 w-4 mr-2 text-slate-500" />
                    All Events
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSelectedEventType("meeting")} className="cursor-pointer">
                    <Video className="h-4 w-4 mr-2 text-blue-500" />
                    Meetings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedEventType("deadline")} className="cursor-pointer">
                    <AlertCircle className="h-4 w-4 mr-2 text-rose-500" />
                    Deadlines
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedEventType("mentoring")} className="cursor-pointer">
                    <Sparkles className="h-4 w-4 mr-2 text-violet-500" />
                    Mentoring Sessions
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto py-4">
            <div className="space-y-3">
              {sortedEvents.length > 0 ? (
                sortedEvents.map((event) => {
                  const styles = getEventTypeStyles(event.type)
                  const eventDate = new Date(event.date);
                  const isToday = new Date().toDateString() === eventDate.toDateString();
                  const isTomorrow = new Date(new Date().setDate(new Date().getDate() + 1)).toDateString() === eventDate.toDateString();
                  
                  let dateLabel = eventDate.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                  if (isToday) dateLabel = "Today";
                  if (isTomorrow) dateLabel = "Tomorrow";
                  
                  return (
                    <div
                      key={event.id}
                      className={cn(
                        "rounded-lg p-3 cursor-pointer transition-all hover:shadow-md border border-transparent",
                        styles.background,
                        isToday && "ring-2 ring-blue-200"
                      )}
                    >
                      <div className="flex gap-3">
                        <div className={cn(
                          "flex-shrink-0 w-12 h-12 rounded-lg flex flex-col items-center justify-center text-center",
                          isToday ? "bg-blue-600 text-white" : "bg-slate-100"
                        )}>
                          <div className={cn(
                            "text-lg font-semibold",
                            isToday ? "text-white" : "text-slate-900"
                          )}>
                            {eventDate.getDate()}
                          </div>
                          <div className={cn(
                            "text-xs",
                            isToday ? "text-white/80" : "text-slate-500"
                          )}>
                            {eventDate.toLocaleDateString("en-US", { month: "short" })}
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            {styles.icon}
                            <div className="font-medium text-slate-900 truncate">{event.title}</div>
                          </div>
                          <p className="text-sm text-slate-600 line-clamp-2 mb-2">{event.description}</p>
                          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3.5 w-3.5" />
                              <span>{event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}</span>
                            </div>
                            {event.location && (
                              <div className="flex items-center gap-1">
                                <MapPin className="h-3.5 w-3.5" />
                                <span>{event.location}</span>
                              </div>
                            )}
                            {event.hackathon && (
                              <Badge variant="outline" className="bg-white/60">
                                {event.hackathon}
                              </Badge>
                            )}
                          </div>
                          {event.attendees && (
                            <div className="mt-3 flex items-center">
                              <div className="flex -space-x-2 mr-2">
                                {event.attendees.map((attendee, index) => (
                                  <Avatar key={index} className="h-6 w-6 border-2 border-white">
                                    <AvatarImage src={attendee.avatar} alt={attendee.name} />
                                    <AvatarFallback className="bg-slate-200 text-xs">
                                      {attendee.initials}
                                    </AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              <span className="text-xs text-slate-500">
                                {event.attendees.length} {event.attendees.length === 1 ? "person" : "people"}
                              </span>
                            </div>
                          )}
                        </div>
                        <Badge className={cn("h-fit whitespace-nowrap self-start", styles.badge)}>
                          {event.type.charAt(0).toUpperCase() + event.type.slice(1)}
                        </Badge>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="text-center py-8 px-4">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 mb-4">
                    <Calendar className="h-6 w-6 text-slate-500" />
                  </div>
                  <h3 className="text-sm font-medium text-slate-900 mb-1">No events found</h3>
                  <p className="text-sm text-slate-500">
                    Try changing your filter or add a new event
                  </p>
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 border-t border-slate-100 bg-slate-50 mt-auto">
            <Button className="w-full" variant="outline">
              <Plus className="h-4 w-4 mr-2" />
              Add New Event
            </Button>
          </div>
        </Card>
      </div>
    </div>
  )
}