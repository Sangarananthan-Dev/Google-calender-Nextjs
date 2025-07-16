"use client"
import { Plus, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import Calendar from "react-calendar"
import { Button } from "@/components/ui/button"
import "react-calendar/dist/Calendar.css"
import Image from "next/image"
import { useRef, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CalendarApp() {
    const calendarRef = useRef(null)
    const [selectedDate, setSelectedDate] = useState(new Date(2025, 6, 17)) // July 15, 2025
    const [currentView, setCurrentView] = useState("Month")

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

    const handleDateClick = (arg) => {
        alert(`Date clicked: ${arg.dateStr}`)
    }

    const handleMainCalendarDatesSet = (dateInfo) => {
        // Update selected date when main calendar view changes
        const newDate = new Date(dateInfo.start)
        // Adjust to show the middle of the visible range for better UX
        const middleDate = new Date(dateInfo.start.getTime() + (dateInfo.end.getTime() - dateInfo.start.getTime()) / 2)
        setSelectedDate(middleDate)
    }

    // Handle date selection from react-calendar
    const handleMiniCalendarChange = (date) => {
        setSelectedDate(date)

        // Navigate main calendar to selected date
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.gotoDate(date)
        }
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

    // Navigation functions for header buttons
    const navigateMonth = (direction) => {
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            if (direction === "prev") {
                calendarApi.prev()
            } else {
                calendarApi.next()
            }
        }
    }

    // Handle view changes
    const handleViewChange = (view) => {
        setCurrentView(view)
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            let fullCalendarView = "dayGridMonth"

            switch (view) {
                case "Day":
                    fullCalendarView = "timeGridDay"
                    break
                case "Week":
                    fullCalendarView = "timeGridWeek"
                    break
                case "Month":
                    fullCalendarView = "dayGridMonth"
                    break
                case "List":
                    fullCalendarView = "listWeek"
                    break
            }

            calendarApi.changeView(fullCalendarView)
        }
    }

    const formatMonthYear = (date) => {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }

    return (
        <div className="flex">
            <div className="flex items-start  bg-blue-50 justify-start p-[10px] w-[20%] h-[100vh] flex-shrink-0 flex-col gap-[1.5rem]">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1">
                        <Image overrideSrc="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_15_2x.png" alt="logo" width={40} height={40} />
                        <h1 className="text-2xl font-normal">Calendar</h1>
                    </div>
                </div>
                <Button
                    className="flex mr-[10%] font-semibold items-center gap-2 bg-white hover:bg-gray-50 rounded-[15px] border border-gray-300 shadow-sm h-[54px] px-4 py-3 text-gray-700">
                    <Plus className="w-5 h-5" />
                    <span className="text-sm">Create</span>
                    <ChevronDown className="w-4 h-4" />
                </Button>
                <div className="h-auto p-1">
                    <Calendar
                        onChange={handleMiniCalendarChange}
                        value={selectedDate}
                        locale="en-US"
                        className="custom-calendar"
                        formatShortWeekday={(locale, date) =>
                            date.toLocaleDateString(locale, { weekday: "narrow" })
                        }
                    />
                </div>
            </div>
            <main className="h-[100%] w-[100%] flex flex-col ">
                <div className="flex items-center bg-blue-50 gap-4 w-full justify-between  p-[8px]">
                    <Button
                        variant="outline"
                        onClick={goToToday}
                        className="px-4 py-2 rounded-full font-medium border border-black hover:bg-gray-50 bg-transparent"
                    >
                        Today
                    </Button>

                    <div className="flex items-center justify-between gap-3 md:gap-[1.5rem]">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigateMonth("prev")}
                            className="w-8 h-8 rounded-full bg-gray-100"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <h2 className="text-base font-semibold font-sans text-black-700 ">{formatMonthYear(selectedDate)}</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigateMonth("next")}
                            className="w-8 h-8 rounded-full bg-gray-100"
                        >
                            <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="outline"
                                className="px-4 py-2  rounded-full border border-black hover:bg-gray-50 flex items-center gap-2 bg-transparent "
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
                </div>
                <div className="h-[calc(100vh-70px)] ">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        initialDate={selectedDate}
                        weekends={true}
                        // events={dummyEvents}
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

    )
}
