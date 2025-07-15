"use client"

import { useState, useRef } from "react"
import { ChevronLeft, ChevronRight, Plus, ChevronDown } from "lucide-react"
import Calendar from "react-calendar"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import "react-calendar/dist/Calendar.css"

export default function CalendarApp() {
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 15)) // July 15, 2025
    const [currentView, setCurrentView] = useState("Month")

    const calendarRef = useRef(null)

    // Map view names to FullCalendar view types
    const viewMap = {
        Day: "timeGridDay",
        Week: "timeGridWeek",
        Month: "dayGridMonth",
        List: "listWeek",
    }

    const handleDateClick = (arg) => {
        alert(`Date clicked: ${arg.dateStr}`)
    }

    const handleMiniCalendarChange = (value) => {
        setSelectedDate(value)
        // Navigate main calendar to the selected date
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.gotoDate(value)
        }
    }

    const handleMainCalendarDatesSet = (dateInfo) => {
        // Update mini calendar when main calendar view changes
        const newDate = new Date(dateInfo.start)
        // Adjust to show the middle of the visible range for better UX
        const middleDate = new Date(dateInfo.start.getTime() + (dateInfo.end.getTime() - dateInfo.start.getTime()) / 2)
        setSelectedDate(middleDate)
    }

    const handleViewChange = (viewName) => {
        setCurrentView(viewName)

        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            const fullCalendarView = viewMap[viewName]
            calendarApi.changeView(fullCalendarView)
        }
    }

    function renderEventContent(eventInfo) {
        return (
            <div
                style={{
                    backgroundColor: eventInfo.event.extendedProps.bgColor || "#E0F7FA",
                    color: eventInfo.event.extendedProps.textColor || "#006064",
                    padding: "2px 4px",
                    borderRadius: "4px",
                    fontSize: "0.85rem",
                    width: "100%",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                }}
            >
                <i>{eventInfo.event.title}</i>
            </div>
        )
    }

    // Dummy events for July 2025 with colors
    const dummyEvents = [
        {
            title: "Team Standup",
            start: "2025-07-02T09:00:00",
            end: "2025-07-02T09:30:00",
            bgColor: "#FFF3E0",
            textColor: "#E65100",
        },
        {
            title: "Product Launch Planning",
            start: "2025-07-05T11:00:00",
            end: "2025-07-05T12:00:00",
            bgColor: "#FCE4EC",
            textColor: "#880E4F",
        },
        {
            title: "Design Review",
            start: "2025-07-08T15:00:00",
            end: "2025-07-08T16:00:00",
            bgColor: "#E8F5E9",
            textColor: "#1B5E20",
        },
        {
            title: "Client Demo",
            start: "2025-07-10T14:00:00",
            end: "2025-07-10T15:00:00",
            bgColor: "#E3F2FD",
            textColor: "#0D47A1",
        },
        {
            title: "Webinar: AI in Design",
            start: "2025-07-13T17:00:00",
            end: "2025-07-13T18:00:00",
            bgColor: "#F3E5F5",
            textColor: "#4A148C",
        },
        {
            title: "1:1 Check-In",
            start: "2025-07-15T10:00:00",
            end: "2025-07-15T10:30:00",
            bgColor: "#FFFDE7",
            textColor: "#F9A825",
        },
        {
            title: "Sprint Planning",
            start: "2025-07-18T09:30:00",
            end: "2025-07-18T11:00:00",
            bgColor: "#E0F7FA",
            textColor: "#006064",
        },
        {
            title: "Quarterly Review",
            start: "2025-07-20T16:00:00",
            end: "2025-07-20T17:00:00",
            bgColor: "#FFEBEE",
            textColor: "#B71C1C",
        },
        {
            title: "Hackathon",
            start: "2025-07-22T09:00:00",
            end: "2025-07-22T17:00:00",
            bgColor: "#E8EAF6",
            textColor: "#1A237E",
        },
        {
            title: "Content Shoot",
            start: "2025-07-25T13:00:00",
            end: "2025-07-25T15:00:00",
            bgColor: "#F1F8E9",
            textColor: "#33691E",
        },
        {
            title: "Marketing Sync",
            start: "2025-07-27T11:00:00",
            end: "2025-07-27T12:00:00",
            bgColor: "#ECEFF1",
            textColor: "#263238",
        },
        {
            title: "Community AMA",
            start: "2025-07-29T18:00:00",
            end: "2025-07-29T19:00:00",
            bgColor: "#FFF3E0",
            textColor: "#E65100",
        },
        {
            title: "Project Handoff",
            start: "2025-07-30T15:00:00",
            end: "2025-07-30T16:00:00",
            bgColor: "#EDE7F6",
            textColor: "#311B92",
        },
    ]

    const formatMonthYear = (date) => {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }

    const goToToday = () => {
        const today = new Date()
        setSelectedDate(today)

        // Navigate main calendar to today
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.gotoDate(today)
        }
    }

    const navigateMonth = (direction) => {
        const newDate = new Date(selectedDate)
        if (direction === "prev") {
            newDate.setMonth(newDate.getMonth() - 1)
        } else {
            newDate.setMonth(newDate.getMonth() + 1)
        }
        setSelectedDate(newDate)

        // Navigate main calendar as well
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.gotoDate(newDate)
        }
    }

    return (
        <div className="h-screen flex flex-col bg-white">
            {/* Header */}
            <header className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center">
                            <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center">
                                <span className="text-blue-500 text-xs font-bold">15</span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-normal text-gray-700">Calendar</h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="outline"
                            onClick={goToToday}
                            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 bg-transparent"
                        >
                            Today
                        </Button>

                        <div className="flex items-center gap-2">
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigateMonth("prev")}
                                className="w-8 h-8 rounded-full hover:bg-gray-100"
                            >
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => navigateMonth("next")}
                                className="w-8 h-8 rounded-full hover:bg-gray-100"
                            >
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </div>

                        <h2 className="text-xl font-normal text-gray-700 min-w-[140px]">{formatMonthYear(selectedDate)}</h2>
                    </div>
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="px-4 py-2 rounded-full border border-gray-300 hover:bg-gray-50 flex items-center gap-2 bg-transparent"
                        >
                            {currentView}
                            <ChevronDown className="w-4 h-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleViewChange("Day")}>Day</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewChange("Week")}>Week</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewChange("Month")}>Month</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleViewChange("List")}>List</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar */}
                <aside className="w-64 border-r border-gray-200 p-4 flex flex-col gap-4">
                    <Button className="w-full justify-start gap-2 bg-blue-600 hover:bg-blue-700 text-white rounded-full py-3">
                        <Plus className="w-4 h-4" />
                        Create
                    </Button>

                    <div className="mini-calendar">
                        <Calendar
                            onChange={handleMiniCalendarChange}
                            value={selectedDate}
                            className="w-full border-none"
                            tileClassName={({ date, view }) => {
                                if (view === "month") {
                                    const isSelected = date.toDateString() === selectedDate.toDateString()
                                    const isToday = date.toDateString() === new Date().toDateString()

                                    if (isSelected) {
                                        return "bg-blue-600 text-white rounded-full"
                                    }
                                    if (isToday) {
                                        return "bg-blue-100 text-blue-600 rounded-full"
                                    }
                                }
                                return ""
                            }}
                        />
                    </div>
                </aside>

                {/* Main Calendar */}
                <main className="flex-1 p-6">
                    <div className="h-full">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            initialDate={selectedDate}
                            weekends={true}
                            events={dummyEvents}
                            eventContent={renderEventContent}
                            dateClick={handleDateClick}
                            datesSet={handleMainCalendarDatesSet}
                            headerToolbar={false}
                            height="100%"
                            dayHeaderClassNames="text-sm font-medium text-gray-600 py-3"
                            dayCellClassNames="border-r border-b border-gray-100 hover:bg-gray-50"
                            eventClassNames="cursor-pointer"
                            slotMinTime="06:00:00"
                            slotMaxTime="22:00:00"
                            allDaySlot={true}
                            nowIndicator={true}
                            scrollTime="08:00:00"
                        />
                    </div>
                </main>
            </div>
        </div>
    )
}
