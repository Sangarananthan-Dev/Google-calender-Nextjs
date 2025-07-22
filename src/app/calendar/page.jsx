"use client"

import { useRef, useState, useCallback } from "react"
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import listPlugin from "@fullcalendar/list"
import interactionPlugin from "@fullcalendar/interaction"
import CalendarSideBar from "./components/CalendarSideBar"
import CreateEvent from "./components/modal/CreateEvent"
import CalendarHeader from "./components/CalendarHeader"

export default function CalendarApp() {
    const calendarRef = useRef(null)
    const today = new Date()
    const [selectedDate, setSelectedDate] = useState(today)
    const [currentView, setCurrentView] = useState("Month")
    const [selectedRange, setSelectedRange] = useState(null)
    const [isDrawerOpen, setIsDrawerOpen] = useState(false)

    const fetchEvents = useCallback(async (fetchInfo, successCallback, failureCallback) => {
        try {
            const timeMin = fetchInfo.start.toISOString()
            const timeMax = fetchInfo.end.toISOString()

            const apiUrl = `/api/calendar/event?action=list-events&timeMin=${timeMin}&timeMax=${timeMax}`

            const response = await fetch(apiUrl)
            if (!response.ok) {
                const errorData = await response.json()
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorData.error || "Unknown error"}`)
            }
            const data = await response.json()

            const transformedEvents = data.items.map((event) => ({
                id: event.id,
                title: event.summary,
                // Use 'date' for all-day events, 'dateTime' for timed events.
                // FullCalendar can handle both formats.
                start: event.start.date || event.start.dateTime,
                end: event.end.date || event.end.dateTime,
                url: event.htmlLink,
                color : event.colorId ? `${event.colorId}` : undefined, // Use colorId if available
                // You can add more properties here if needed, e.g., color, description, allDay
            }))

            successCallback(transformedEvents)
        } catch (error) {
            console.error("Error fetching events:", error)
            // Pass the error to FullCalendar's failure callback
            failureCallback(error)
        }
    }, []) // useCallback with an empty dependency array ensures this function is stable.

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
                    fullCalendarView = "listWeek" // Displays a list of events for the current week
                    break
            }
            calendarApi.changeView(fullCalendarView)
        }
    }

    const handleDateClick = (arg) => {
        // When a date is clicked, open the CreateEvent drawer for that date
        const dateRange = {
            start: arg.dateStr,
            end: arg.dateStr, // For a single day click, start and end are the same
        }
        setSelectedRange(dateRange)
        setIsDrawerOpen(true)
    }

    const handleSelect = (arg) => {
        // When a date range is selected (dragged), open the CreateEvent drawer for the range
        const dateRange = {
            start: arg.startStr,
            end: arg.endStr,
        }
        setSelectedRange(dateRange)
        setIsDrawerOpen(true)
        // Unselect the date range after opening the drawer
        if (calendarRef.current) {
            const calendarApi = calendarRef.current.getApi()
            calendarApi.unselect()
        }
    }

    const handleEventClick = (clickInfo) => {
        // Handle event click, e.g., open event details modal or redirect to Google Calendar
        if (clickInfo.event.url) {
            window.open(clickInfo.event.url, "_blank")
            clickInfo.jsEvent.preventDefault() // Prevent default FullCalendar navigation
        }
        // You could also implement a custom modal here to show event details
        // For example: setSelectedEvent(clickInfo.event.extendedProps); setIsEventDetailsModalOpen(true);
    }

    return (
        <div className="flex">
            <CalendarSideBar />
            <main className="h-[100%] w-[100%] flex flex-col">
                <CalendarHeader
                    selectedDate={selectedDate}
                    currentView={currentView}
                    onGoToToday={goToToday}
                    onNavigateMonth={navigateMonth}
                    onViewChange={handleViewChange}
                />
                <div className="h-[calc(100vh-70px)] flex ">
                    <div className="w-[100%] h-[100%]">
                        <FullCalendar
                            ref={calendarRef}
                            plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            initialDate={selectedDate}
                            weekends={true}
                            selectable={true}
                            selectMirror={true}
                            select={handleSelect} // Callback for date range selection
                            dateClick={handleDateClick} // Callback for single date click
                            eventClick={handleEventClick} // Callback for event click
                            headerToolbar={false} // Hide FullCalendar's default header
                            height="100%" // Make calendar fill the container height
                            dayHeaderClassNames="text-sm font-medium text-gray-600 py-3"
                            dayCellClassNames="border-r border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                            eventClassNames="cursor-pointer"
                            scrollTime="08:00:00" // Start scroll at 8 AM for timeGrid views
                            selectConstraint={{
                                start: "1900-01-01",
                                end: "2100-12-31",
                            }}
                            events={fetchEvents} 
                        />
                    </div>

                </div>
            </main>
            <CreateEvent
                isOpen={isDrawerOpen}
                onOpenChange={setIsDrawerOpen}
                selectedRange={selectedRange}
                selectedDate={selectedDate}
            />
        </div>
    )
}
