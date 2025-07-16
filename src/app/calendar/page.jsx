"use client"
import { ChevronDown, ChevronLeft, ChevronRight, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useRef, useState } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import Calendar from "react-calendar"
import Image from "next/image"

function DateDrawer({ isOpen, onOpenChange, selectedRange }) {

    const formatDate = (dateStr) => {
        if (!dateStr) return ""
        const date = new Date(dateStr)
        return date.toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric"
        })
    }

    const formatDateRange = (startDate, endDate) => {
        if (!startDate || !endDate) return ""

        const start = new Date(startDate)
        const end = new Date(endDate)

        // If same date, show single date
        if (startDate === endDate) {
            return formatDate(startDate)
        }

        // Different dates, show range
        return `${formatDate(startDate)} - ${formatDate(endDate)}`
    }

    const getDaysDifference = (startDate, endDate) => {
        if (!startDate || !endDate) return 0
        const start = new Date(startDate)
        const end = new Date(endDate)
        const diffTime = Math.abs(end - start)
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays + 1
    }

    return (
        <Drawer open={isOpen} onOpenChange={onOpenChange}>
            <DrawerContent className="h-[90vh]">
                <div className="mx-auto w-full max-w-2xl h-full flex flex-col">
                    <DrawerHeader>
                        <DrawerTitle>
                            {selectedRange?.start === selectedRange?.end ? "Date Selected" : "Date Range Selected"}
                        </DrawerTitle>
                        <DrawerDescription>
                            View details for the selected {selectedRange?.start === selectedRange?.end ? "date" : "date range"}
                        </DrawerDescription>
                    </DrawerHeader>

                    <div className="flex-1 p-4 overflow-y-auto">
                        <div className="text-center space-y-4">
                            <div className="p-6 bg-blue-50 rounded-lg">
                                <p className="text-2xl font-bold text-blue-600 mb-2">
                                    {formatDateRange(selectedRange?.start, selectedRange?.end)}
                                </p>

                                {selectedRange?.start !== selectedRange?.end && (
                                    <div className="text-sm text-gray-600 space-y-1">
                                        <p>Start: {selectedRange?.start}</p>
                                        <p>End: {selectedRange?.end}</p>
                                        <p className="font-medium">
                                            Duration: {getDaysDifference(selectedRange?.start, selectedRange?.end)} day(s)
                                        </p>
                                    </div>
                                )}

                                {selectedRange?.start === selectedRange?.end && (
                                    <p className="text-sm text-gray-600">
                                        Selected date: {selectedRange?.start}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline" className="w-full">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </div>
            </DrawerContent>
        </Drawer>
    )
}

function CalendarSidebar() {
    return (
        <div className="flex items-start justify-start p-[10px] w-[20%] h-[100vh] bg-blue-50 flex-shrink-0 flex-col gap-[1.5rem]">
            <div className="flex items-center gap-6">
                <div className="flex relative items-center gap-1">
                    <Image overrideSrc="https://ssl.gstatic.com/calendar/images/dynamiclogo_2020q4/calendar_16_2x.png" alt="logo" width={40} height={40} />
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
                    // onChange={handleMiniCalendarChange}
                    // value={selectedDate}
                    locale="en-US"
                    className="custom-calendar"
                    formatShortWeekday={(locale, date) =>
                        date.toLocaleDateString(locale, { weekday: "narrow" })
                    }
                />
            </div>
        </div>
    )
}

function CalendarHeader({ selectedDate, currentView, onGoToToday, onNavigateMonth, onViewChange }) {
    const formatMonthYear = (date) => {
        return date.toLocaleDateString("en-US", { month: "long", year: "numeric" })
    }

    return (
        <div className="flex items-center bg-blue-50 gap-4 w-full justify-between p-[8px]">
            <Button
                variant="outline"
                onClick={onGoToToday}
                className="px-4 py-2 rounded-full font-medium border border-black hover:bg-gray-50 bg-transparent"
            >
                Today
            </Button>
            <div className="flex items-center justify-between gap-3 md:gap-[1.5rem]">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onNavigateMonth("prev")}
                    className="w-8 h-8 rounded-full hover:bg-blue-100"
                >
                    <ChevronLeft className="w-4 h-4" />
                </Button>
                <h2 className="text-base font-semibold font-sans text-black-700">{formatMonthYear(selectedDate)}</h2>
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onNavigateMonth("next")}
                    className="w-8 h-8 rounded-full hover:bg-blue-100"
                >
                    <ChevronRight className="w-4 h-4" />
                </Button>
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        className="px-4 py-2 rounded-full border border-black hover:bg-gray-50 flex items-center gap-2 bg-transparent"
                    >
                        {currentView}
                        <ChevronDown className="w-4 h-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => onViewChange("Day")}>Day</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewChange("Week")}>Week</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewChange("Month")}>Month</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onViewChange("List")}>List</DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
    )
}

export default function CalendarApp() {
    const calendarRef = useRef(null)
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)
    const [currentView, setCurrentView] = useState("Month")
    const [selectedRange, setSelectedRange] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

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

            const currentDate = calendarApi.getDate()
            setSelectedDate(currentDate)
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
        const dateRange = {
            start: arg.dateStr,
            end: arg.dateStr
        }
        setSelectedRange(dateRange)
        setIsDrawerOpen(true)
    }

    const handleSelect = (arg) => {
        const dateRange = {
            start: arg.startStr,
            end: arg.endStr
        }
        setSelectedRange(dateRange)
        setIsDrawerOpen(true)

        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.unselect()
        }
    }

    return (
        <div className="flex">
            <CalendarSidebar />

            <main className="h-[100%] w-[100%] flex flex-col">
                <CalendarHeader
                    selectedDate={selectedDate}
                    currentView={currentView}
                    onGoToToday={goToToday}
                    onNavigateMonth={navigateMonth}
                    onViewChange={handleViewChange}
                />

                <div className="h-[calc(100vh-70px)]">
                    <FullCalendar
                        ref={calendarRef}
                        plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                        initialView="dayGridMonth"
                        initialDate={selectedDate}
                        weekends={true}
                        selectable={true}
                        selectMirror={true}
                        select={handleSelect}
                        dateClick={handleDateClick}
                        headerToolbar={false}
                        height="100%"
                        dayHeaderClassNames="text-sm font-medium text-gray-600 py-3"
                        dayCellClassNames="border-r border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                        eventClassNames="cursor-pointer"
                        scrollTime="08:00:00"
                        selectConstraint={{
                            start: '1900-01-01',
                            end: '2100-12-31'
                        }}
                    />
                </div>
            </main>

            <DateDrawer
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                selectedRange={selectedRange}
            />
        </div>
    )
}
