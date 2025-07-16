"use client"
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import "react-calendar/dist/Calendar.css"
import { useRef, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function CalendarApp() {
    const calendarRef = useRef(null)
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)
    const [currentView, setCurrentView] = useState("Month")

    const formatMonthYear = (date) => {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }
    const goToToday = () => {
        const today = new Date()
        setSelectedDate(today)
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.gotoDate(today)
        }
    }

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

    const handleDateClick = (arg) => {
        alert(`Date clicked: ${arg.dateStr}`)
    }

    return (
        <div className="flex">
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
                            className="w-8 h-8 rounded-full hover:bg-blue-100"
                        >
                            <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <h2 className="text-base font-semibold font-sans text-black-700 ">{formatMonthYear(selectedDate)}</h2>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => navigateMonth("next")}
                            className="w-8 h-8 rounded-full hover:bg-blue-100"
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
                <div className="h-[calc(100vh-70px)]">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        initialDate={selectedDate}
                        weekends={true}
                        dateClick={handleDateClick}
                        headerToolbar={false}
                        height="100%"
                        dayHeaderClassNames="text-sm font-medium text-gray-600 py-3"
                        dayCellClassNames="border-r border-b border-gray-100 hover:bg-gray-50"
                        eventClassNames="cursor-pointer"
                        scrollTime="08:00:00"
                    />
                </div>
            </main>
        </div>
    )
}
